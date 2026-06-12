from flask import Flask, request, jsonify
from flask_cors import CORS
from functools import wraps
import hashlib
import jwt
import datetime
import os
import json
from dotenv import load_dotenv

load_dotenv()

from db import get_db

# ======================
# CONFIG
# ======================
SECRET_KEY = "CHANGE_ME_SECRET"
TOKEN_EXPIRE_HOURS = 2


def call_claude(system_prompt, user_prompt, max_tokens=1500, response_json=False):
    api_key = os.environ.get("CLAUDE_API_KEY", "") or os.environ.get("ANTHROPIC_API_KEY", "")
    if not api_key:
        print(">>> Warning: CLAUDE_API_KEY not found in env!")
        return None
        
    url = "https://api.anthropic.com/v1/messages"
    headers = {
        "x-api-key": api_key,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json"
    }
    
    data = {
        "model": "claude-3-5-sonnet-20241022",
        "max_tokens": max_tokens,
        "system": system_prompt,
        "messages": [
            {"role": "user", "content": user_prompt}
        ]
    }
    
    try:
        import urllib.request
        req = urllib.request.Request(url, data=json.dumps(data).encode("utf-8"), headers=headers, method="POST")
        with urllib.request.urlopen(req) as response:
            res_data = json.loads(response.read().decode("utf-8"))
            text_out = res_data["content"][0]["text"].strip()
            if response_json:
                import re
                json_match = re.search(r'\[\s*\{.*\}\s*\]|\{\s*".*"\s*\}', text_out, re.DOTALL)
                if json_match:
                    return json.loads(json_match.group(0))
                return json.loads(text_out)
            return text_out
    except Exception as e:
        print(">>> Claude API error:", e)
        if hasattr(e, 'read'):
            try:
                print(">>> Error details:", e.read().decode("utf-8"))
            except:
                pass
        return None

# ======================
# APP
# ======================
app = Flask(__name__)
CORS(app)

# ======================
# HELPERS
# ======================
def hash_pw(pw):
    return hashlib.sha256(pw.encode()).hexdigest()

def create_token(user_id, role):
    payload = {
        "user_id": user_id,
        "role": role,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=TOKEN_EXPIRE_HOURS)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")

def decode_token(token):
    return jwt.decode(token, SECRET_KEY, algorithms=["HS256"])

def login_required(role=None):
    def wrapper(fn):
        @wraps(fn)
        def decorated(*args, **kwargs):
            auth = request.headers.get("Authorization")
            if not auth or not auth.startswith("Bearer "):
                return jsonify({"error": "Token yok"}), 401
            try:
                token = auth.split(" ")[1]
                data = decode_token(token)
                request.user = data
                if role and data["role"] != role:
                    return jsonify({"error": "Yetkisiz"}), 403
            except jwt.ExpiredSignatureError:
                return jsonify({"error": "Token süresi doldu"}), 401
            except Exception:
                return jsonify({"error": "Token geçersiz"}), 401
            return fn(*args, **kwargs)
        return decorated
    return wrapper

# ======================
# ROUTES
# ======================

@app.route("/")
def home():
    return "Backend çalışıyor"

# ---------- LOGIN ----------
@app.route("/api/login", methods=["POST"])
def login():
    data = request.json or {}
    username = data.get("username")
    password = data.get("password")

    print(">>> LOGIN REQUEST - USERNAME:", repr(username), "PASSWORD:", repr(password))
    if not username or not password:
        return jsonify({"error": "Eksik bilgi"}), 400

    db = get_db()
    user = db.execute(
        "SELECT * FROM users WHERE username = ? AND is_active = 1",
        (username,)
    ).fetchone()

    if not user:
        return jsonify({"error": "Kullanıcı bulunamadı"}), 401

    if user["password_hash"] != hash_pw(password):
        return jsonify({"error": "Şifre hatalı"}), 401

    # 2FA Code Generation
    import random
    code = f"{random.randint(100000, 999999)}"
    expires_at = (datetime.datetime.utcnow() + datetime.timedelta(minutes=5)).isoformat()
    
    # Store verification code
    db.execute("DELETE FROM verification_codes WHERE username = ?", (username,))
    db.execute(
        "INSERT INTO verification_codes (username, code, expires_at) VALUES (?, ?, ?)",
        (username, code, expires_at)
    )
    db.commit()

    # Find phone number based on role
    phone = "0555-000-0000"
    role = user["role"]
    ref_id = user["ref_id"]
    if role == "student":
        student = db.execute("SELECT phone FROM students WHERE id = ?", (ref_id,)).fetchone()
        if student and student["phone"]:
            phone = student["phone"]
    elif role == "parent":
        parent = db.execute("SELECT phone FROM parents WHERE id = ?", (ref_id,)).fetchone()
        if parent and parent["phone"]:
            phone = parent["phone"]
    else: # employees
        emp = db.execute("SELECT phone FROM employees WHERE id = ?", (ref_id,)).fetchone()
        if emp and emp["phone"]:
            phone = emp["phone"]

    # Mask phone number (e.g. 0555***1122)
    phone_masked = phone
    if len(phone) >= 7:
        phone_masked = phone[:4] + "***" + phone[-4:]

    return jsonify({
        "status": "two_factor_required",
        "username": username,
        "phone": phone_masked,
        "mock_code_for_testing": code # Returned for simulator testing in frontend
    })

@app.route("/api/login/verify", methods=["POST"])
def login_verify():
    data = request.json or {}
    username = data.get("username")
    code = data.get("code")

    if not username or not code:
        return jsonify({"error": "Eksik bilgi"}), 400

    db = get_db()
    user = db.execute(
        "SELECT * FROM users WHERE username = ? AND is_active = 1",
        (username,)
    ).fetchone()

    if not user:
        return jsonify({"error": "Kullanıcı bulunamadı"}), 401

    # Check verification code
    record = db.execute(
        "SELECT * FROM verification_codes WHERE username = ? AND code = ?",
        (username, code)
    ).fetchone()

    if not record:
        return jsonify({"error": "Doğrulama kodu geçersiz"}), 401

    # Check expiration
    expires_at = datetime.datetime.fromisoformat(record["expires_at"])
    if datetime.datetime.utcnow() > expires_at:
        return jsonify({"error": "Doğrulama kodunun süresi dolmuş"}), 401

    # Delete used code
    db.execute("DELETE FROM verification_codes WHERE username = ?", (username,))
    db.commit()

    token = create_token(user["id"], user["role"])

    return jsonify({
        "token": token,
        "role": user["role"]
    })

# ---------- STUDENT DASHBOARD ----------
@app.route("/api/student/dashboard")
@login_required(role="student")
def student_dashboard():
    user_id = request.user["user_id"]
    db = get_db()

    user = db.execute(
        "SELECT * FROM users WHERE id = ? AND role = 'student'",
        (user_id,)
    ).fetchone()

    if not user:
        return jsonify({"error": "Öğrenci bulunamadı"}), 404

    student_id = user["ref_id"]

    student = db.execute(
        """
        SELECT first_name, last_name, grade_level, school_name, ai_advisor_name
        FROM students
        WHERE id = ?
        """,
        (student_id,)
    ).fetchone()

    target = db.execute(
        "SELECT exam_type FROM target_exams WHERE student_id = ?",
        (student_id,)
    ).fetchone()

    # Fetch real exam results
    exams = db.execute(
        """
        SELECT e.name AS exam_name, r.score
        FROM exam_results r
        JOIN exams e ON e.id = r.exam_id
        WHERE r.student_id = ?
        ORDER BY e.exam_date DESC
        """,
        (student_id,)
    ).fetchall()

    # Fetch real assignments
    assignments = db.execute(
        """
        SELECT a.id as assignment_id, a.title, a.subject, a.due_date, s.score,
               CASE WHEN s.score IS NOT NULL THEN 'completed' ELSE 'pending' END as status
        FROM assignment_students ast
        JOIN assignments a ON a.id = ast.assignment_id
        LEFT JOIN assignment_submissions s ON s.assignment_id = a.id AND s.student_id = ast.student_id
        WHERE ast.student_id = ?
        ORDER BY a.due_date DESC
        """,
        (student_id,)
    ).fetchall()

    return jsonify({
        "student": {
            "id": student_id,
            "student_no": user["username"],
            "name": f"{student['first_name']} {student['last_name']}",
            "grade": student["grade_level"],
            "school": student["school_name"],
            "ai_advisor_name": student["ai_advisor_name"]
        },
        "target_exam": target["exam_type"] if target else None,
        "recent_exams": [dict(e) for e in exams],
        "assignments": [dict(a) for a in assignments]
    })

# ---------- TEACHER DASHBOARD ----------
@app.route("/api/teacher/dashboard")
@login_required(role="teacher")
def teacher_dashboard():
    user_id = request.user["user_id"]
    db = get_db()

    user = db.execute(
        "SELECT * FROM users WHERE id = ? AND role = 'teacher'",
        (user_id,)
    ).fetchone()

    if not user:
        return jsonify({"error": "Öğretmen bulunamadı"}), 404

    employee_id = user["ref_id"]

    employee = db.execute(
    """SELECT FIRST_NAME AS first_name,LAST_NAME  AS last_name
        FROM employees
        WHERE id = ?
    """,
    (employee_id,)

    ).fetchone()

    profile = db.execute(
        """
        SELECT branch
        FROM teacher_profiles
        WHERE employee_id = ?
        """,
        (employee_id,)
    ).fetchone()

    students = db.execute(
        """
        SELECT id, first_name, last_name, grade_level
        FROM students
        ORDER BY last_name
        """
    ).fetchall()

    return jsonify({
        "teacher": {
            "name": f"{employee['first_name']} {employee['last_name']}" if employee else "Tanımsız",
            "branch": profile["branch"] if profile else "-"
        },
        "students": [
            {
                "id": s["id"],
                "name": f"{s['first_name']} {s['last_name']}",
                "grade": s["grade_level"]
            }
            for s in students
        ]
    })

# ======================================================
# 🔥 NEW: TEACHER → STUDENT DETAIL (KİLİTLİ EK)
# ======================================================
# ======================================================
# 🔥 TAM UYUMLU: TEACHER → STUDENT DETAIL
# ======================================================
@app.route("/api/teacher/student/<int:student_id>")
@login_required(role="teacher")
def teacher_student_detail(student_id):
    db = get_db()
    
    # Check if student exists
    student_row = db.execute("SELECT * FROM students WHERE id = ?", (student_id,)).fetchone()
    if not student_row:
        return jsonify({"error": "Öğrenci bulunamadı"}), 404
        
    # Query all year-round performance data
    target = db.execute("SELECT * FROM target_exams WHERE student_id = ?", (student_id,)).fetchone()
    
    attendance_rows = db.execute("SELECT * FROM student_attendance WHERE student_id = ?", (student_id,)).fetchall()
    present_count = sum(1 for r in attendance_rows if r["status"] == "present")
    absent_count = sum(1 for r in attendance_rows if r["status"] == "absent")
    late_count = sum(1 for r in attendance_rows if r["status"] == "late")
    
    school_grades = db.execute("SELECT * FROM school_grades WHERE student_id = ?", (student_id,)).fetchall()
    certs = db.execute("SELECT * FROM student_certificates WHERE student_id = ?", (student_id,)).fetchall()
    reviews = db.execute("SELECT * FROM lesson_reviews WHERE student_id = ?", (student_id,)).fetchall()
    
    exams = db.execute("""
        SELECT e.name as exam_name, e.exam_kind, r.score 
        FROM exam_results r 
        JOIN exams e ON e.id = r.exam_id 
        WHERE r.student_id = ?
        ORDER BY e.exam_date ASC
    """, (student_id,)).fetchall()
    
    assignments = db.execute("""
        SELECT a.id as assignment_id, a.title, a.subject, s.score,
               CASE WHEN s.score IS NOT NULL THEN 'completed' ELSE 'pending' END as status
        FROM assignment_students ast
        JOIN assignments a ON a.id = ast.assignment_id
        LEFT JOIN assignment_submissions s ON s.assignment_id = a.id AND s.student_id = ast.student_id
        WHERE ast.student_id = ?
    """, (student_id,)).fetchall()
    
    notes = db.execute("SELECT * FROM teacher_notes WHERE student_id = ? ORDER BY created_at DESC", (student_id,)).fetchall()
    
    return jsonify({
        "student": {
            "id": student_row["id"],
            "name": f"{student_row['first_name']} {student_row['last_name']}",
            "grade": student_row["grade_level"],
            "school": student_row["school_name"],
            "ai_advisor_name": student_row["ai_advisor_name"]
        },
        "target_exam": target["exam_type"] if target else "HEDEF YOK",
        "attendance": {
            "present": present_count,
            "absent": absent_count,
            "late": late_count,
            "records": [dict(r) for r in attendance_rows]
        },
        "school_grades": [dict(g) for g in school_grades],
        "certificates": [dict(c) for c in certs],
        "reviews": [dict(r) for r in reviews],
        "recent_exams": [dict(e) for e in exams],
        "assignments": [dict(a) for a in assignments],
        "notes": [
            {"note_text": n["note_text"], "created_at": n["created_at"]}
            for n in notes
        ]
    })
#------------------------------------ 
@app.route("/api/teacher/assignments", methods=["POST"])
@login_required(role="teacher")
def create_assignment():
    data = request.json or {}
    db = get_db()

    teacher_id = request.user["user_id"]

    title = data.get("title")
    type_ = data.get("type")
    subject = data.get("subject")
    difficulty = data.get("difficulty")
    due_date = data.get("due_date")

    if not title or not type_ or not subject or not difficulty:
        return jsonify({"error": "Eksik bilgi"}), 400

    cur = db.execute(
        """
        INSERT INTO assignments
        (teacher_id, title, type, subject, difficulty, due_date)
        VALUES (?, ?, ?, ?, ?, ?)
        """,
        (teacher_id, title, type_, subject, difficulty, due_date)
    )
    db.commit()

    return jsonify({
        "assignment_id": cur.lastrowid
    })
#------------------------------------

@app.route("/api/teacher/assignments/<int:assignment_id>/questions", methods=["POST"])
@login_required(role="teacher")
def add_assignment_question(assignment_id):
    data = request.json or {}
    db = get_db()

    teacher_id = request.user["user_id"]
    question_text = data.get("question_text")
    correct_answer = data.get("correct_answer")

    if not question_text:
        return jsonify({"error": "Soru metni boş"}), 400

    assignment = db.execute(
        """
        SELECT id FROM assignments
        WHERE id = ? AND teacher_id = ? AND is_published = 0
        """,
        (assignment_id, teacher_id)
    ).fetchone()

    if not assignment:
        return jsonify({"error": "Yetkisiz veya yayınlanmış"}), 403

    db.execute(
        """
        INSERT INTO assignment_questions
        (assignment_id, question_text, correct_answer)
        VALUES (?, ?, ?)
        """,
        (assignment_id, question_text, correct_answer)
    )
    db.commit()

    return jsonify({"status": "ok"})



#------------------------------------

@app.route("/api/teacher/assignments/<int:assignment_id>/students", methods=["POST"])
@login_required(role="teacher")
def assign_students(assignment_id):
    data = request.json or {}
    db = get_db()

    teacher_id = request.user["user_id"]
    student_ids = data.get("student_ids", [])

    assignment = db.execute(
        """
        SELECT id FROM assignments
        WHERE id = ? AND teacher_id = ? AND is_published = 0
        """,
        (assignment_id, teacher_id)
    ).fetchone()

    if not assignment:
        return jsonify({"error": "Yetkisiz veya yayınlanmış"}), 403

    for sid in student_ids:
        db.execute(
            """
            INSERT INTO assignment_students
            (assignment_id, student_id)
            VALUES (?, ?)
            """,
            (assignment_id, sid)
        )

    db.commit()
    return jsonify({"status": "ok"})




#------------------------------------

@app.route("/api/teacher/assignments/<int:assignment_id>/publish", methods=["POST"])
@login_required(role="teacher")
def publish_assignment(assignment_id):
    db = get_db()
    teacher_id = request.user["user_id"]

    assignment = db.execute(
        """
        SELECT id FROM assignments
        WHERE id = ? AND teacher_id = ? AND is_published = 0
        """,
        (assignment_id, teacher_id)
    ).fetchone()

    if not assignment:
        return jsonify({"error": "Yetkisiz veya zaten yayınlanmış"}), 403

    db.execute(
        """
        UPDATE assignments
        SET is_published = 1
        WHERE id = ?
        """,
        (assignment_id,)
    )
    db.commit()

    return jsonify({"status": "published"})


# ======================================================
# 🔥 AKILLI AI DANIŞMANLIK & VELİ BİLGİ SİSTEMİ ENDPOINTS
# ======================================================

def get_student_performance_data(db, student_id):
    student = db.execute("SELECT * FROM students WHERE id = ?", (student_id,)).fetchone()
    if not student:
        return None
    
    target = db.execute("SELECT * FROM target_exams WHERE student_id = ?", (student_id,)).fetchone()
    
    attendance_rows = db.execute("SELECT * FROM student_attendance WHERE student_id = ?", (student_id,)).fetchall()
    present_count = sum(1 for r in attendance_rows if r["status"] == "present")
    absent_count = sum(1 for r in attendance_rows if r["status"] == "absent")
    late_count = sum(1 for r in attendance_rows if r["status"] == "late")
    
    school_grades = db.execute("SELECT * FROM school_grades WHERE student_id = ?", (student_id,)).fetchall()
    certs = db.execute("SELECT * FROM student_certificates WHERE student_id = ?", (student_id,)).fetchall()
    reviews = db.execute("SELECT * FROM lesson_reviews WHERE student_id = ?", (student_id,)).fetchall()
    
    exams = db.execute("""
        SELECT e.name as exam_name, e.exam_kind, r.score 
        FROM exam_results r 
        JOIN exams e ON e.id = r.exam_id 
        WHERE r.student_id = ?
        ORDER BY e.exam_date ASC
    """, (student_id,)).fetchall()
    
    assignments = db.execute("""
        SELECT a.id as assignment_id, a.title, a.subject, s.score,
               CASE WHEN s.score IS NOT NULL THEN 'completed' ELSE 'pending' END as status
        FROM assignment_students ast
        JOIN assignments a ON a.id = ast.assignment_id
        LEFT JOIN assignment_submissions s ON s.assignment_id = a.id AND s.student_id = ast.student_id
        WHERE ast.student_id = ?
    """, (student_id,)).fetchall()
    
    notes = db.execute("SELECT * FROM teacher_notes WHERE student_id = ? ORDER BY created_at DESC", (student_id,)).fetchall()
    
    return {
        "student": student,
        "target": target,
        "attendance": {
            "present": present_count,
            "absent": absent_count,
            "late": late_count,
            "records": [dict(r) for r in attendance_rows]
        },
        "school_grades": [dict(g) for g in school_grades],
        "certificates": [dict(c) for c in certs],
        "reviews": [dict(r) for r in reviews],
        "exams": [dict(e) for e in exams],
        "assignments": [dict(a) for a in assignments],
        "notes": [dict(n) for n in notes]
    }

def get_local_fallback_analysis(perf_data, advisor_name):
    school_grades = perf_data["school_grades"]
    subject_sums = {}
    subject_counts = {}
    for g in school_grades:
        sub = g["subject"]
        score = g["score"]
        subject_sums[sub] = subject_sums.get(sub, 0) + score
        subject_counts[sub] = subject_counts.get(sub, 0) + 1
        
    weakest_sub = "Matematik"
    min_avg = 100
    for sub, total in subject_sums.items():
        avg = total / subject_counts[sub]
        if avg < min_avg:
            min_avg = avg
            weakest_sub = sub
            
    if "mat" in weakest_sub.lower():
        weakest_sub = "Matematik"
    elif "fen" in weakest_sub.lower():
        weakest_sub = "Fen Bilgisi"
    elif "türk" in weakest_sub.lower() or "turk" in weakest_sub.lower():
        weakest_sub = "Türkçe"
        
    if weakest_sub == "Matematik":
        return {
            "topic": "Matematik - Üslü İfadeler",
            "study_guide": f"Yıl içi performans analizinize göre okul sınavlarında ve denemelerde Matematik ortalamanız {int(min_avg)} seviyesinde kalmış. Üslü sayılarda taban ve üs ilişkisi, negatif üs ve üslü sayılarla işlemler konularına bu hafta yoğunlaşmanız gerekmektedir. Günde en az 30 üslü sayı sorusu çözerek ders tekrarlarınızı pekiştiriniz.",
            "quiz_questions": [
                {
                    "question": "2 üzeri -3 (2^-3) işleminin sonucu kaçtır?",
                    "options": ["-8", "-6", "1/8", "1/6"],
                    "answer": "1/8"
                },
                {
                    "question": "3^4 x 3^2 işleminin sonucu aşağıdakilerden hangisidir?",
                    "options": ["3^8", "3^6", "9^6", "9^8"],
                    "answer": "3^6"
                },
                {
                    "question": "(5^2)^3 ifadesinin eşiti nedir?",
                    "options": ["5^5", "5^6", "25^3", "25^6"],
                    "answer": "5^6"
                }
            ]
        }
    elif weakest_sub == "Fen Bilgisi":
        return {
            "topic": "Fen Bilgisi - Mevsimler ve İklim",
            "study_guide": f"Fen Bilgisi yazılı ortalamanız {int(min_avg)} civarında seyrediyor. Dünya'nın eksen eğikliği ve yıllık hareketi sonucu mevsimlerin nasıl oluştuğu konusunu tekrar etmeli, özellikle 21 Haziran ve 21 Aralık tarihlerindeki Güneş ışınlarının geliş açılarını incelemelisiniz.",
            "quiz_questions": [
                {
                    "question": "21 Aralık tarihinde Güney Yarım Küre'de hangi mevsim başlar?",
                    "options": ["İlkbahar", "Yaz", "Sonbahar", "Kış"],
                    "answer": "Yaz"
                },
                {
                    "question": "Dünya'nın eksen eğikliği kaç derecedir?",
                    "options": ["23 derece 27 dakika", "23 derece 45 dakika", "33 derece 27 dakika", "0 derece"],
                    "answer": "23 derece 27 dakika"
                },
                {
                    "question": "Güneş ışınlarının yeryüzüne dik gelmesi durumunda birim alana düşen ısı enerjisi nasıl değişir?",
                    "options": ["Azalır", "Artar", "Değişmez", "Önce azalır sonra artar"],
                    "answer": "Artar"
                }
            ]
        }
    else:
        avg_show = int(min_avg) if min_avg < 100 else 85
        return {
            "topic": "Türkçe - Paragrafta Anlam",
            "study_guide": f"Türkçe dersindeki genel ortalamanız {avg_show} olarak tespit edilmiştir. Okuma anlama hızı ve yardımcı düşünce sorularında gelişim sağlamak adına bu hafta paragraf soruları çözmelisiniz. Soruyu okumadan önce mutlaka soru kökünü okuma alışkanlığı edinin.",
            "quiz_questions": [
                {
                    "question": "Bir paragrafın ana düşüncesi (ana fikri) neyi ifade eder?",
                    "options": [
                        "Yazarın yazıda ele aldığı konuyu",
                        "Yazıda anlatılan olayların kronolojik sırasını",
                        "Yazarın okuyucuya vermek istediği temel mesajı",
                        "Paragraftaki yardımcı karakterleri"
                    ],
                    "answer": "Yazarın okuyucuya vermek istediği temel mesajı"
                },
                {
                    "question": "Aşağıdakilerden hangisi paragrafın giriş cümlesi olmaya en uygundur?",
                    "options": [
                        "Çünkü bu kitap herkesin ilgisini çekecek nitelikte.",
                        "Kısacası, sanat toplumun aynasıdır.",
                        "Bununla birlikte, yazarın son eseri de oldukça başarılı.",
                        "Edebiyat, insanın kendisini ve dünyayı anlama çabasıdır."
                    ],
                    "answer": "Edebiyat, insanın kendisini ve dünyayı anlama çabasıdır."
                },
                {
                    "question": "Bir paragrafta 'yardımcı düşünceler' ne işe yarar?",
                    "options": [
                        "Ana düşünceyi destekler, açıklar ve belirginleştirir",
                        "Paragrafı gereksiz yere uzatır",
                        "Yazarın biyografisini tanıtır",
                        "Yeni bir konuya geçişi sağlar"
                    ],
                    "answer": "Ana düşünceyi destekler, açıklar ve belirginleştirir"
                }
            ]
        }

def generate_ai_analysis(perf_data, advisor_name):
    student = perf_data["student"]
    target = perf_data["target"]
    attendance = perf_data["attendance"]
    school_grades = perf_data["school_grades"]
    certs = perf_data["certificates"]
    reviews = perf_data["reviews"]
    exams = perf_data["exams"]
    assignments = perf_data["assignments"]
    
    target_str = f"{target['exam_type']} (%{target['target_percentile']})" if target else "Belirtilmemiş"
    grades_summary = ", ".join([f"{g['subject']} ({g['grade_type']}): {g['score']}" for g in school_grades])
    exams_summary = ", ".join([f"{e['exam_name']} ({e['exam_kind']}): {e['score']}" for e in exams])
    reviews_summary = ", ".join([f"{r['subject']} - {r['topic']} ({r['duration_minutes']} dk)" for r in reviews])
    certs_summary = ", ".join([f"{c['title']} ({c['issuer']})" for c in certs])
    assignments_summary = ", ".join([f"{a['title']}: {a['status']} (Puan: {a['score'] if a['score'] is not None else '-'})" for a in assignments])
    
    prompt = f"""
Sen bir eğitim danışmanısın. İsmin: '{advisor_name}'.
Aşağıdaki öğrenci verilerini analiz ederek Türkçe bir Bireysel Eğitim Planı ve Pekiştirme Testi hazırla.

ÖĞRENCİ BİLGİLERİ:
- Adı: {student['first_name']} {student['last_name']}
- Sınıf: {student['grade_level']}. Sınıf
- Hedef Sınav: {target_str}
- Dershane Devamsızlığı: {attendance['absent']} gün devamsız, {attendance['late']} gün geç
- Okul Yazılı Notları: {grades_summary}
- Sertifikalar & Kurslar: {certs_summary}
- Evdeki Konu Tekrarları: {reviews_summary}
- Dershane Deneme Sınavları: {exams_summary}
- Ödev Durumları: {assignments_summary}

Senden şu formatta bir JSON döndürmeni rica ediyorum. Başka hiçbir açıklama yazma, sadece JSON döndür. JSON formatı kesinlikle şu şekilde olmalıdır:
{{
  "topic": "Öğrencinin en zayıf olduğu ve bu hafta tamamlaması gereken ana konu adı (Örn: Matematik - EBOB EKOK veya Fen Bilgisi - Basınç)",
  "study_guide": "Öğrenciye bu konuyu çalışırken dikkat etmesi gereken kritik noktaları, tüm verileri göz önüne alarak anlatan 2-3 cümlelik çalışma rehberi ve eğitim yönlendirmesi.",
  "quiz_questions": [
    {{
      "question": "Seçilen bu zayıf konu hakkında Türkçe 1. soru metni",
      "options": ["A seçeneği", "B seçeneği", "C seçeneği", "D seçeneği"],
      "answer": "Doğru seçeneğin birebir kendisi"
    }},
    {{
      "question": "2. soru metni",
      "options": ["A seçeneği", "B seçeneği", "C seçeneği", "D seçeneği"],
      "answer": "Doğru seçeneğin birebir kendisi"
    }},
    {{
      "question": "3. soru metni",
      "options": ["A seçeneği", "B seçeneği", "C seçeneği", "D seçeneği"],
      "answer": "Doğru seçeneğin birebir kendisi"
    }}
  ]
}}
"""
    # Use Claude API if key is present, otherwise fall back to local engine
    api_key = os.environ.get("CLAUDE_API_KEY", "") or os.environ.get("ANTHROPIC_API_KEY", "")
    if api_key:
        system_prompt = f"Sen bir LGS eğitim danışmanısın. İsmin: '{advisor_name}'."
        result = call_claude(system_prompt, prompt, max_tokens=1500, response_json=True)
        if result and isinstance(result, dict) and "topic" in result and "study_guide" in result:
            return result

    return get_local_fallback_analysis(perf_data, advisor_name)


@app.route("/api/student/<int:student_id>/ai_study_plan")
@login_required()
def student_ai_study_plan(student_id):
    db = get_db()
    
    student_row = db.execute("SELECT * FROM students WHERE id = ?", (student_id,)).fetchone()
    if not student_row:
        return jsonify({"error": "Öğrenci bulunamadı"}), 404
        
    active_plan = db.execute(
        "SELECT * FROM ai_study_plans WHERE student_id = ? AND status = 'active' ORDER BY id DESC LIMIT 1",
        (student_id,)
    ).fetchone()
    
    if active_plan:
        return jsonify({
            "ai_advisor_name": student_row["ai_advisor_name"],
            "plan_id": active_plan["id"],
            "topic": active_plan["topic"],
            "study_guide": active_plan["study_guide"],
            "quiz_questions": json.loads(active_plan["quiz_questions"]),
            "quiz_score": active_plan["quiz_score"],
            "status": active_plan["status"]
        })
        
    perf_data = get_student_performance_data(db, student_id)
    advisor_name = student_row["ai_advisor_name"] or "Yapay Zeka Rehberi"
    
    ai_data = generate_ai_analysis(perf_data, advisor_name)
    
    cur = db.execute(
        """
        INSERT INTO ai_study_plans (student_id, topic, study_guide, quiz_questions, quiz_score, status, created_at)
        VALUES (?, ?, ?, ?, NULL, 'active', datetime('now'))
        """,
        (student_id, ai_data["topic"], ai_data["study_guide"], json.dumps(ai_data["quiz_questions"]))
    )
    db.commit()
    
    return jsonify({
        "ai_advisor_name": advisor_name,
        "plan_id": cur.lastrowid,
        "topic": ai_data["topic"],
        "study_guide": ai_data["study_guide"],
        "quiz_questions": ai_data["quiz_questions"],
        "quiz_score": None,
        "status": "active"
    })


@app.route("/api/student/<int:student_id>/ai_study_plan/submit", methods=["POST"])
@login_required()
def submit_student_ai_quiz(student_id):
    data = request.json or {}
    answers = data.get("answers", [])
    plan_id = data.get("plan_id")
    
    if not plan_id:
        return jsonify({"error": "Plan ID eksik"}), 400
        
    db = get_db()
    plan = db.execute("SELECT * FROM ai_study_plans WHERE id = ? AND student_id = ?", (plan_id, student_id)).fetchone()
    if not plan:
        return jsonify({"error": "Plan bulunamadı"}), 404
        
    questions = json.loads(plan["quiz_questions"])
    
    correct_count = 0
    detailed_results = []
    for idx, q in enumerate(questions):
        student_ans = answers[idx] if idx < len(answers) else ""
        correct_ans = q["answer"]
        is_correct = (student_ans.strip().lower() == correct_ans.strip().lower())
        if is_correct:
            correct_count += 1
        detailed_results.append({
            "question": q["question"],
            "student_answer": student_ans,
            "correct_answer": correct_ans,
            "is_correct": is_correct
        })
        
    score_pct = int((correct_count / len(questions)) * 100)
    passed = (correct_count >= 2)
    new_status = "completed" if passed else "active"
    
    db.execute(
        "UPDATE ai_study_plans SET quiz_score = ?, status = ? WHERE id = ?",
        (score_pct, new_status, plan_id)
    )
    
    if passed:
        db.execute(
            "UPDATE students SET last_ai_analysis = ?, last_ai_analysis_date = datetime('now') WHERE id = ?",
            (f"Tamamlanan Konu: {plan['topic']}", student_id)
        )
    db.commit()
    
    student_row = db.execute("SELECT ai_advisor_name FROM students WHERE id = ?", (student_id,)).fetchone()
    adv_name = student_row["ai_advisor_name"] if student_row else "Yapay Zeka Rehberi"
    
    if passed:
        feedback = f"Tebrikler! {correct_count}/{len(questions)} doğru yaparak konuyu başarıyla tamamladın. Artık bu konuyu geçebilirsin ve yeni bir çalışma planına başlayabilirsin!"
    else:
        feedback = f"Test sonucun: {correct_count}/{len(questions)} doğru. Bu konuyu tam olarak pekiştirmek için çalışma rehberini tekrar okuyup testi yeniden çözmeyi denemelisin."
        
    return jsonify({
        "score": score_pct,
        "correct_count": correct_count,
        "total_count": len(questions),
        "passed": passed,
        "status": new_status,
        "results": detailed_results,
        "feedback": feedback,
        "advisor_name": adv_name
    })


@app.route("/api/student/<int:student_id>/ai_advisor_name", methods=["POST"])
@login_required()
def update_ai_advisor_name(student_id):
    data = request.json or {}
    new_name = data.get("name")
    if not new_name or not new_name.strip():
        return jsonify({"error": "İsim boş olamaz"}), 400
        
    db = get_db()
    db.execute("UPDATE students SET ai_advisor_name = ? WHERE id = ?", (new_name.strip(), student_id))
    db.commit()
    return jsonify({"status": "ok", "name": new_name})


@app.route("/api/student/<int:student_id>/ai_chart_data")
@login_required()
def student_ai_chart_data(student_id):
    db = get_db()
    # Mock exams
    exams = db.execute(
        """
        SELECT e.name, r.score, e.exam_date as date
        FROM exam_results r
        JOIN exams e ON e.id = r.exam_id
        WHERE r.student_id = ?
        ORDER BY e.exam_date ASC
        """,
        (student_id,)
    ).fetchall()
    
    # Study hours/reviews
    reviews = db.execute(
        """
        SELECT subject, SUM(duration_minutes) as duration
        FROM lesson_reviews
        WHERE student_id = ?
        GROUP BY subject
        """,
        (student_id,)
    ).fetchall()
    
    # Assignments completed vs total
    assigned = db.execute(
        "SELECT COUNT(*) FROM assignment_students WHERE student_id = ?",
        (student_id,)
    ).fetchone()[0]
    
    completed = db.execute(
        "SELECT COUNT(*) FROM assignment_submissions WHERE student_id = ?",
        (student_id,)
    ).fetchone()[0]
    
    return jsonify({
        "exams": [dict(e) for e in exams],
        "reviews": [dict(r) for r in reviews],
        "assignments": {
            "completed": completed,
            "total": assigned
        }
    })


@app.route("/api/student/<int:student_id>/ai_analysis")
@login_required()
def student_ai_analysis(student_id):
    db = get_db()
    perf_data = get_student_performance_data(db, student_id)
    if not perf_data:
        return jsonify({"error": "Öğrenci bulunamadı"}), 404
        
    student = perf_data["student"]
    exams = perf_data["exams"]
    attendance = perf_data["attendance"]
    assignments = perf_data["assignments"]
    advisor_name = student["ai_advisor_name"] or "Yapay Zeka Rehberi_S"
    
    claude_key = os.environ.get("CLAUDE_API_KEY", "") or os.environ.get("ANTHROPIC_API_KEY", "")
    if claude_key:
        prompt = f"""
        Öğrenci: {student['first_name']} {student['last_name']} ({student['grade_level']}. Sınıf).
        Aşağıdaki verileri inceleyerek öğrenci için samimi, motive edici ve 4-5 cümlelik bir akademik durum analizi yap.
        Analizde son deneme sınavı puanı, ödev tamamlama oranı, devamsızlık/geç kalma durumları ve ders çalışma tekrarlarını yorumla.
        
        Veriler:
        - Son Denemeler: {', '.join([f"{e['exam_name']}: {e['score']}" for e in exams])}
        - Devamsızlık: {attendance['absent']} gün devamsız, {attendance['late']} gün geç.
        - Ödevler: {len([a for a in assignments if a['status'] == 'completed'])} tamamlanan, {len(assignments)} toplam.
        """
        system_prompt = f"Sen bir eğitim danışmanısın. İsmin: '{advisor_name}'."
        result = call_claude(system_prompt, prompt, max_tokens=1024)
        if result:
            return jsonify({"analysis": result})
            
    # Local Fallback Analysis
    analysis_parts = []
    
    # 1. Exam analysis
    if len(exams) >= 2:
        last_score = exams[-1]["score"]
        prev_score = exams[-2]["score"]
        diff = last_score - prev_score
        if diff > 0:
            analysis_parts.append(f"Son deneme sınavında puanını {prev_score:.0f}'den {last_score:.0f}'e çıkararak harika bir yükseliş trendi yakaladın! Bu ivmeyi korumalısın.")
        elif diff < 0:
            analysis_parts.append(f"Son deneme sınavında puanın {prev_score:.0f}'den {last_score:.0f}'e gerilemiş görünüyor. Konu eksiklerine yoğunlaşarak bu durumu toparlayabilirsin.")
        else:
            analysis_parts.append(f"Deneme puanların {last_score:.0f} seviyesinde stabil seyrediyor. Hedefini daha da yükseltmek için çalışma temponu biraz artabiliriz.")
    elif len(exams) == 1:
        analysis_parts.append(f"İlk denemende {exams[0]['score']:.0f} puan aldın. Önümüzdeki denemelerde bu puanı baz alarak gelişimini takip edeceğiz.")
    else:
        analysis_parts.append("Henüz girilmiş deneme sınav verin bulunmuyor.")
        
    # 2. Homework analysis
    total_assignments = len(assignments)
    completed_assignments = len([a for a in assignments if a['status'] == 'completed'])
    if total_assignments > 0:
        pct = (completed_assignments / total_assignments) * 100
        if pct == 100:
            analysis_parts.append("Ödevlerinin tamamını eksiksiz bitirmiş olman müthiş bir kararlılık göstergesi. Tebrikler!")
        elif pct >= 60:
            analysis_parts.append(f"Ödevlerinin %{pct:.0f} kadarını tamamlamışsın. Kalan ödevlerini de en kısa sürede bitirmeye gayret et.")
        else:
            analysis_parts.append(f"Ödev tamamlama oranın %{pct:.0f} seviyesinde. Akademik başarının devamı için ödevlerini aksatmamalısın.")
            
    # 3. Attendance analysis
    absent = attendance["absent"]
    late = attendance["late"]
    if absent > 0 or late > 0:
        attendance_str = []
        if absent > 0:
            attendance_str.append(f"{absent} gün devamsızlığın")
        if late > 0:
            attendance_str.append(f"{late} gün derslere geç kalışın")
        analysis_parts.append(f"Kayıtlara göre {' ve '.join(attendance_str)} bulunuyor. Konu kaçırmamak adına ders katılım düzenine dikkat etmelisin.")
    else:
        analysis_parts.append("Derslere katılımın mükemmel, hiçbir devamsızlığın bulunmuyor.")
        
    # 4. Motivation
    target = perf_data.get("target")
    if target:
        analysis_parts.append(f"Hedefin olan LGS %{target['target_percentile']:.1f}'lik dilime ulaşmak için {advisor_name} olarak her zaman yanındayım. Planlı çalışmaya devam!")
        
    return jsonify({"analysis": " ".join(analysis_parts)})


@app.route("/api/student/<int:student_id>/ai_chat", methods=["POST"])
@login_required()
def student_ai_chat(student_id):
    data = request.json or {}
    message = data.get("message", "").strip()
    if not message:
        return jsonify({"error": "Mesaj boş olamaz"}), 400
        
    db = get_db()
    perf_data = get_student_performance_data(db, student_id)
    if not perf_data:
        return jsonify({"error": "Öğrenci bulunamadı"}), 404
        
    student = perf_data["student"]
    exams = perf_data["exams"]
    attendance = perf_data["attendance"]
    assignments = perf_data["assignments"]
    advisor_name = student["ai_advisor_name"] or "Yapay Zeka Rehberi_S"
    
    last_exam_score = exams[-1]["score"] if exams else "Bilinmiyor"
    target_pct = perf_data["target"]["target_percentile"] if perf_data["target"] else "Belirtilmemiş"
    
    claude_key = os.environ.get("CLAUDE_API_KEY", "") or os.environ.get("ANTHROPIC_API_KEY", "")
    if claude_key:
        system_prompt = f"""
        Sen bir eğitim koçusun. İsmin: '{advisor_name}'.
        Öğrencimiz: {student['first_name']} {student['last_name']} ({student['grade_level']}. Sınıf).
        LGS Hedefi: İlk %{target_pct} dilim.
        Son deneme puanı: {last_exam_score}.
        Devamsızlığı: {attendance['absent']} gün.
        Ödev durumları: {len([a for a in assignments if a['status'] == 'completed'])}/{len(assignments)} tamamlandı.
        
        Öğrenciyle doğrudan, samimi, cesaretlendirici ve Türkçe konuş. Kısa, net tavsiyeler ver. Sınav stresini azaltıcı ve planlı çalışmaya teşvik edici ol.
        """
        result = call_claude(system_prompt, message, max_tokens=1024)
        if result:
            return jsonify({"response": result, "advisor_name": advisor_name})
            
    # Local Fallback Smart Dialogue Bot
    msg_lower = message.lower()
    response_text = ""
    
    if "deneme" in msg_lower or "sınav" in msg_lower or "puan" in msg_lower:
        if exams:
            response_text = f"Son deneme sınavında {last_exam_score:.0f} puan almışsın. Hedefimiz olan LGS %{target_pct} dilimi için çok güzel bir temel. Denemelerdeki konu analizlerimize bakıp zayıf olduğumuz noktalara (özellikle Matematik ve Fen) ağırlık vermeliyiz."
        else:
            response_text = "Henüz sistemde deneme sınavı kaydın görünmüyor. Ancak ilk denemeden itibaren performans grafiğimizi çizip gelişim alanlarımızı belirleyeceğiz."
            
    elif "matematik" in msg_lower or "üslü" in msg_lower or "ebob" in msg_lower or "çarpan" in msg_lower:
        response_text = f"Matematik dersine odaklanmak çok akıllıca! Şu anda aktif olan haftalık odak planındaki soruları tamamladın mı? Eğer takıldığın özel bir soru tipi varsa bana sorabilirsin. Günde 25-30 soru çözerek işlem hızımızı yüksek tutmalıyız."
        
    elif "fen" in msg_lower or "mevsimler" in msg_lower or "iklim" in msg_lower or "basınç" in msg_lower:
        response_text = "Fen Bilgisi LGS'de katsayısı yüksek derslerden biri. Özellikle görsel yorumlama ve deney sorularına dikkat etmelisin. Mevsimler ve İklim konusunda Dünya'nın konumlarını iyi ezberle."
        
    elif "türkçe" in msg_lower or "paragraf" in msg_lower or "anlam" in msg_lower:
        response_text = "LGS Türkçe'de başarının sırrı paragraf sorularıdır. Her gün sabah ilk iş olarak 20 paragraf sorusu çözmek hem okuma hızını artırır hem de sınavda zaman kazandırır. Bunu rutin haline getirelim mi?"
        
    elif "ödev" in msg_lower or "sorumluluk" in msg_lower:
        completed = len([a for a in assignments if a['status'] == 'completed'])
        total = len(assignments)
        if total > 0:
            if completed == total:
                response_text = "Harika! Sistemde tanımlı tüm ödevlerini başarıyla tamamlamışsın. Senin gibi sorumluluk sahibi bir öğrenciyle çalışmak harika!"
            else:
                response_text = f"Sistemde şu an {total} ödevinden {completed} tanesini tamamladığını görüyorum. Eksik ödevlerini son teslim tarihlerine dikkat ederek bitirmeni öneririm."
        else:
            response_text = "Şu anda sana atanmış güncel bir ödev bulunmuyor. Kendi konu tekrarlarına ve deneme analizlerine odaklanabilirsin."
            
    elif "devamsızlık" in msg_lower or "ders" in msg_lower or "geç" in msg_lower:
        absent = attendance["absent"]
        if absent > 0:
            response_text = f"Dershane devam durumunda {absent} gün devamsızlık görünüyor. Derslerde işlenen konuları kaçırmamak için arkadaşların veya öğretmenlerinden ders notlarını alıp telafi etmelisin."
        else:
            response_text = "Devam durumun mükemmel! Dersleri aksatmadan, zamanında takip etmen başarındaki en önemli adımlardan biri."
            
    elif "merhaba" in msg_lower or "selam" in msg_lower or "naber" in msg_lower or "nasılsın" in msg_lower:
        response_text = f"Merhaba! Ben senin yapay zeka rehber öğretmeninim. Sana ders çalışma programında yardımcı olmak, deneme sonuçlarını analiz etmek ve motivasyonunu artırmak için buradayım. Bugün hangi ders hakkında konuşmak istersin?"
        
    else:
        response_text = f"Çok güzel bir soru. LGS yolculuğunda hedefine (%{target_pct}) odaklı kalman ve planlı ilerlemen en kritik kuraldır. Haftalık odak konunu çalışıp pekiştirme testini çözmeyi unutma. Başka merak ettiğin bir konu var mı?"
        
    return jsonify({"response": response_text, "advisor_name": advisor_name})


def get_lgs_json_dir():
    dir1 = os.path.join(app.root_path, "lgs_json")
    if os.path.exists(dir1):
        return dir1
    return os.path.join(app.root_path, "../frontend/assets/lgs_json")


@app.route("/api/lgs_exams")
@login_required()
def list_lgs_exams():
    json_dir = get_lgs_json_dir()
    if not os.path.exists(json_dir):
        return jsonify([])
        
    exams = []
    for filename in os.listdir(json_dir):
        if filename.endswith(".json"):
            try:
                with open(os.path.join(json_dir, filename), "r", encoding="utf-8") as f:
                    data = json.load(f)
                    exams.append({
                        "filename": filename,
                        "exam_name": data.get("exam_name"),
                        "year": data.get("year"),
                        "session": data.get("session"),
                        "duration_minutes": data.get("duration_minutes"),
                        "question_count": len(data.get("questions", []))
                    })
            except Exception as e:
                print("Error loading lgs json:", e)
    return jsonify(exams)


@app.route("/api/lgs_exams/<filename>/questions")
@login_required()
def get_lgs_exam_questions(filename):
    json_dir = get_lgs_json_dir()
    file_path = os.path.join(json_dir, filename)
    if not os.path.exists(file_path) or not filename.endswith(".json") or ".." in filename:
        return jsonify({"error": "Sınav bulunamadı"}), 404
        
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)
            # We omit correct answers in the retrieval to prevent cheating
            questions_clean = []
            for q in data.get("questions", []):
                questions_clean.append({
                    "question_number": q.get("question_number"),
                    "subject": q.get("subject"),
                    "question_text": q.get("question_text"),
                    "options": q.get("options")
                })
            return jsonify({
                "exam_name": data.get("exam_name"),
                "duration_minutes": data.get("duration_minutes"),
                "questions": questions_clean
            })
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/lgs_exams/<filename>/submit", methods=["POST"])
@login_required()
def submit_lgs_exam(filename):
    data = request.json or {}
    answers = data.get("answers", {}) # dict of question_number -> selected_option
    
    json_dir = get_lgs_json_dir()
    file_path = os.path.join(json_dir, filename)
    if not os.path.exists(file_path) or not filename.endswith(".json") or ".." in filename:
        return jsonify({"error": "Sınav bulunamadı"}), 404
        
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            exam_data = json.load(f)
            
        questions = exam_data.get("questions", [])
        exam_name = exam_data.get("exam_name", "LGS Sınavı")
        session = exam_data.get("session", "sayisal").lower()
        
        # Calculate correct, wrong, blank by subject
        subject_stats = {}
        total_correct = 0
        total_wrong = 0
        total_blank = 0
        
        detailed_results = []
        
        for q in questions:
            q_num = str(q.get("question_number"))
            subject = q.get("subject", "Genel")
            correct_ans = q.get("correct_answer", "").strip().upper()
            student_ans = answers.get(q_num, "").strip().upper()
            
            if subject not in subject_stats:
                subject_stats[subject] = {"correct": 0, "wrong": 0, "blank": 0}
                
            is_correct = False
            is_blank = (student_ans == "")
            
            if is_blank:
                subject_stats[subject]["blank"] += 1
                total_blank += 1
            elif student_ans == correct_ans:
                subject_stats[subject]["correct"] += 1
                total_correct += 1
                is_correct = True
            else:
                subject_stats[subject]["wrong"] += 1
                total_wrong += 1
                
            detailed_results.append({
                "question_number": q.get("question_number"),
                "subject": subject,
                "student_answer": student_ans,
                "correct_answer": correct_ans,
                "is_correct": is_correct,
                "is_blank": is_blank
            })
            
        # Calculate net scores: Net = Correct - (Wrong / 3.0)
        total_net = 0
        subject_nets = {}
        for sub, stats in subject_stats.items():
            net = stats["correct"] - (stats["wrong"] / 3.0)
            if net < 0:
                net = 0.0
            subject_nets[sub] = round(net, 2)
            total_net += net
            
        # LGS estimated score calculation (out of 500)
        lgs_score = 200.0
        if session == "sayisal":
            math_net = subject_nets.get("Matematik", 0.0)
            sci_net = subject_nets.get("Fen Bilimleri", 0.0)
            if math_net == 0.0 and sci_net == 0.0 and "Fen Bilgisi" in subject_nets:
                sci_net = subject_nets.get("Fen Bilgisi", 0.0)
            lgs_score += (math_net * 7.5) + (sci_net * 7.5)
        else: # sözel
            tur_net = subject_nets.get("Türkçe", 0.0)
            ink_net = subject_nets.get("T.C. İnkılap Tarihi ve Atatürkçülük", 0.0)
            rel_net = subject_nets.get("Din Kültürü ve Ahlak Bilgisi", 0.0)
            eng_net = subject_nets.get("İngilizce", 0.0)
            lgs_score += (tur_net * 6.0) + (ink_net * 2.0) + (rel_net * 2.0) + (eng_net * 2.0)
            
        lgs_score = min(500.0, round(lgs_score, 1))
        
        # Save to database
        db = get_db()
        user_id = request.user["user_id"]
        user = db.execute("SELECT ref_id FROM users WHERE id = ?", (user_id,)).fetchone()
        student_id = user["ref_id"] if user else 1
        
        # Find or create exam in exams table
        db_exam = db.execute("SELECT id FROM exams WHERE name = ?", (exam_name,)).fetchone()
        if db_exam:
            exam_id = db_exam["id"]
        else:
            cur = db.execute(
                "INSERT INTO exams (name, exam_type, exam_kind, exam_date) VALUES (?, 'LGS', 'practice', datetime('now'))",
                (exam_name,)
            )
            exam_id = cur.lastrowid
            
        # Insert or update result in exam_results
        db_res = db.execute("SELECT id FROM exam_results WHERE exam_id = ? AND student_id = ?", (exam_id, student_id)).fetchone()
        if db_res:
            db.execute("UPDATE exam_results SET score = ? WHERE id = ?", (lgs_score, db_res["id"]))
        else:
            db.execute("INSERT INTO exam_results (exam_id, student_id, score) VALUES (?, ?, ?)", (exam_id, student_id, lgs_score))
            
        db.commit()
        
        return jsonify({
            "exam_name": exam_name,
            "session": session,
            "total_correct": total_correct,
            "total_wrong": total_wrong,
            "total_blank": total_blank,
            "subject_stats": subject_stats,
            "subject_nets": subject_nets,
            "lgs_score": lgs_score,
            "results": detailed_results
        })
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


@app.route("/api/parent/dashboard")
@login_required(role="parent")
def parent_dashboard():
    user_id = request.user["user_id"]
    db = get_db()
    
    user = db.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
    parent_id = user["ref_id"]
    
    parent = db.execute("SELECT * FROM parents WHERE id = ?", (parent_id,)).fetchone()
    if not parent:
        return jsonify({"error": "Veli bulunamadı"}), 404
        
    children = db.execute("""
        SELECT s.id, s.first_name, s.last_name, s.grade_level, s.school_name,
               t.exam_type as target_exam
        FROM student_parents sp
        JOIN students s ON s.id = sp.student_id
        LEFT JOIN target_exams t ON t.student_id = s.id
        WHERE sp.parent_id = ?
    """, (parent_id,)).fetchall()
    
    return jsonify({
        "parent": {
            "name": f"{parent['first_name']} {parent['last_name']}"
        },
        "students": [
            {
                "id": c["id"],
                "name": f"{c['first_name']} {c['last_name']}",
                "grade": c["grade_level"],
                "school": c["school_name"],
                "target_exam": c["target_exam"] or "HEDEF YOK"
            }
            for c in children
        ]
    })


@app.route("/api/parent/student/<int:student_id>")
@login_required(role="parent")
def parent_student_detail(student_id):
    db = get_db()
    user_id = request.user["user_id"]
    user = db.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
    parent_id = user["ref_id"]
    
    sp = db.execute("SELECT * FROM student_parents WHERE student_id = ? AND parent_id = ?", (student_id, parent_id)).fetchone()
    if not sp:
        return jsonify({"error": "Yetkisiz veya çocuk bulunamadı"}), 403
        
    perf = get_student_performance_data(db, student_id)
    if not perf:
        return jsonify({"error": "Veri bulunamadı"}), 404
        
    return jsonify({
        "student": {
            "id": perf["student"]["id"],
            "name": f"{perf['student']['first_name']} {perf['student']['last_name']}",
            "grade": perf["student"]["grade_level"],
            "school": perf["student"]["school_name"],
            "ai_advisor_name": perf["student"]["ai_advisor_name"]
        },
        "target_exam": perf["target"]["exam_type"] if perf["target"] else "HEDEF YOK",
        "attendance": perf["attendance"],
        "school_grades": perf["school_grades"],
        "certificates": perf["certificates"],
        "reviews": perf["reviews"],
        "recent_exams": perf["exams"],
        "assignments": perf["assignments"],
        "notes": [
            {"note_text": n["note_text"], "created_at": n["created_at"]}
            for n in perf["notes"]
        ]
    })


@app.route("/api/teacher/student/<int:student_id>/notes", methods=["POST"])
@login_required(role="teacher")
def create_teacher_note(student_id):
    data = request.json or {}
    note_text = data.get("note_text")
    if not note_text or not note_text.strip():
        return jsonify({"error": "Not boş olamaz"}), 400
        
    db = get_db()
    teacher_user_id = request.user["user_id"]
    
    db.execute(
        """
        INSERT INTO teacher_notes (teacher_id, student_id, note_text, created_at)
        VALUES (?, ?, ?, datetime('now'))
        """,
        (teacher_user_id, student_id, note_text.strip())
    )
    db.commit()
    return jsonify({"status": "ok"})


@app.route("/api/teacher/assignments/<int:assignment_id>/tracking")
@login_required(role="teacher")
def get_assignment_tracking(assignment_id):
    db = get_db()
    assign = db.execute("SELECT * FROM assignments WHERE id = ?", (assignment_id,)).fetchone()
    if not assign:
        return jsonify({"error": "Ödev bulunamadı"}), 404
        
    q_count = db.execute("SELECT COUNT(*) FROM assignment_questions WHERE assignment_id = ?", (assignment_id,)).fetchone()[0]
    
    submissions = db.execute("""
        SELECT s.id as student_id, s.first_name || ' ' || s.last_name as student_name, s.grade_level,
               sub.id as submission_id, sub.score,
               CASE WHEN sub.id IS NOT NULL THEN 'completed' ELSE 'not_started' END as status
        FROM assignment_students ast
        JOIN students s ON s.id = ast.student_id
        LEFT JOIN assignment_submissions sub ON sub.assignment_id = ast.assignment_id AND sub.student_id = ast.student_id
        WHERE ast.assignment_id = ?
    """, (assignment_id,)).fetchall()
    
    return jsonify({
        "assignment": {
            "title": assign["title"],
            "subject": assign["subject"],
            "question_count": q_count
        },
        "submissions": [
            {
                "student_name": r["student_name"],
                "grade": r["grade_level"],
                "status": r["status"],
                "score": r["score"],
                "submission_id": r["submission_id"]
            }
            for r in submissions
        ]
    })


@app.route("/api/student/assignments/<int:assignment_id>")
@login_required(role="student")
def get_student_assignment_questions(assignment_id):
    db = get_db()
    questions = db.execute(
        "SELECT id, question_text FROM assignment_questions WHERE assignment_id = ?",
        (assignment_id,)
    ).fetchall()
    
    assign = db.execute("SELECT title, subject FROM assignments WHERE id = ?", (assignment_id,)).fetchone()
    
    return jsonify({
        "title": assign["title"] if assign else "Ödev",
        "subject": assign["subject"] if assign else "",
        "questions": [
            {"id": q["id"], "question_text": q["question_text"]}
            for q in questions
        ]
    })


@app.route("/api/student/assignments/<int:assignment_id>/submit", methods=["POST"])
@login_required(role="student")
def submit_student_assignment(assignment_id):
    data = request.json or {}
    answers = data.get("answers", {})
    
    db = get_db()
    user_id = request.user["user_id"]
    user = db.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
    student_id = user["ref_id"]
    
    questions = db.execute(
        "SELECT id, correct_answer FROM assignment_questions WHERE assignment_id = ?",
        (assignment_id,)
    ).fetchall()
    
    correct_count = 0
    for q in questions:
        q_id = str(q["id"])
        ans = answers.get(q_id, "")
        if ans.strip().lower() == q["correct_answer"].strip().lower():
            correct_count += 1
            
    score = int((correct_count / len(questions)) * 100) if len(questions) > 0 else 100
    
    db.execute(
        """
        INSERT INTO assignment_submissions (assignment_id, student_id, answer_text, score, submitted_at)
        VALUES (?, ?, ?, ?, datetime('now'))
        """,
        (assignment_id, student_id, json.dumps(answers), score)
    )
    db.commit()
    
    return jsonify({
        "score": score,
        "correct_count": correct_count,
        "total_count": len(questions)
    })


@app.route("/api/teacher/submissions/<int:submission_id>")
@login_required(role="teacher")
def get_submission_detail(submission_id):
    db = get_db()
    sub = db.execute("""
        SELECT sub.*, s.first_name || ' ' || s.last_name as student_name,
               a.title as assignment_title
        FROM assignment_submissions sub
        JOIN students s ON s.id = sub.student_id
        JOIN assignments a ON a.id = sub.assignment_id
        WHERE sub.id = ?
    """, (submission_id,)).fetchone()
    
    if not sub:
        return jsonify({"error": "Gönderim bulunamadı"}), 404
        
    questions = db.execute(
        "SELECT id, question_text, correct_answer FROM assignment_questions WHERE assignment_id = ?",
        (sub["assignment_id"],)
    ).fetchall()
    
    student_answers = json.loads(sub["answer_text"] or "{}")
    
    q_list = []
    for q in questions:
        q_id = str(q["id"])
        ans = student_answers.get(q_id, "")
        q_list.append({
            "question_text": q["question_text"],
            "correct_answer": q["correct_answer"],
            "student_answer": ans,
            "is_correct": ans.strip().lower() == q["correct_answer"].strip().lower()
        })
        
    return jsonify({
        "student_name": sub["student_name"],
        "assignment_title": sub["assignment_title"],
        "score": sub["score"],
        "submitted_at": sub["submitted_at"],
        "questions": q_list
    })


if __name__ == "__main__":
    app.run(debug=True)
