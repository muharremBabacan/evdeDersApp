import sqlite3
import hashlib
import json
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "dershane_sistemi_seeded.db")

def hash_pw(pw):
    return hashlib.sha256(pw.encode()).hexdigest()

def seed_db():
    print(">>> Seeding database:", DB_PATH)
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # 1. Clear existing records in tables to avoid duplicates and ensure clean state
    tables_to_clear = [
        "users", "students", "parents", "student_parents", "target_exams", 
        "exams", "exam_results", "employees", "teacher_profiles", 
        "assignments", "assignment_students", "assignment_submissions", 
        "assignment_questions", "student_attendance", "school_grades", 
        "student_certificates", "lesson_reviews", "ai_study_plans", 
        "teacher_notes", "classes"
    ]
    
    for table in tables_to_clear:
        try:
            cursor.execute(f"DELETE FROM {table};")
            cursor.execute(f"DELETE FROM sqlite_sequence WHERE name='{table}';")
        except sqlite3.OperationalError as e:
            print(f"Table {table} clear skipped or not exists:", e)
            
    conn.commit()
    
    # 2. Seed Classes
    classes_data = [
        (1, "LGS-A", "LGS", "8", "2025-09-01 10:00:00"),
        (2, "LGS-B", "LGS", "8", "2025-09-01 10:00:00")
    ]
    cursor.executemany("INSERT INTO classes (id, class_code, exam_type, grade_level, created_at) VALUES (?, ?, ?, ?, ?)", classes_data)
    
    # 3. Seed Employees
    employees_data = [
        (1, "Müdür_S", "Yılmaz_S", "0555-111-1111", "mudur@mail.com"),
        (2, "Ahmet_S", "Öğretmen_S", "0555-222-2222", "ahmet@mail.com"),
        (3, "Muhasebe_S", "Görevlisi_S", "0555-333-3333", "muhasebe@mail.com"),
        (4, "Memur_S", "Çelik_S", "0555-444-4444", "memur@mail.com")
    ]
    cursor.executemany("INSERT INTO employees (id, first_name, last_name, phone, email) VALUES (?, ?, ?, ?, ?)", employees_data)
    
    # 4. Seed Teacher Profiles
    cursor.execute("INSERT INTO teacher_profiles (employee_id, branch) VALUES (2, 'Matematik')")
    
    # 5. Seed Students
    students_data = [
        (1, "Zeynep_S", "Aydın_S", "2012-04-12", "5551112233", "zeynep@email.com", "Beşiktaş, İstanbul", "Atatürk Ortaokulu", 8, "Aktif", "2025-09-01", 1, "Yapay Zeka Rehberi_S", "Tamamlanan Konu: Fen Bilgisi - Mevsimler ve İklim", "2026-06-10 10:43:23"),
        (2, "Emir_S", "Şahin_S", "2012-09-25", "5554443322", "emir@email.com", "Yenimahalle, Ankara", "Cumhuriyet Ortaokulu", 8, "Aktif", "2025-09-01", 1, "Yapay Zeka Rehberi_S", None, None),
        (3, "Yağmur_S", "Çelik_S", "2012-01-15", "5556667788", "yagmur@email.com", "Karşıyaka, İzmir", "Fevzi Çakmak Ortaokulu", 8, "Aktif", "2025-09-01", 2, "Yapay Zeka Rehberi_S", None, None),
        (4, "Kerem_S", "Bulut_S", "2012-06-08", "5558889900", "kerem@email.com", "Seyhan, Adana", "Namık Kemal Ortaokulu", 8, "Pasif", "2025-09-01", 2, "Yapay Zeka Rehberi_S", None, None),
        (5, "Ece_S", "Güneş_S", "2012-12-30", "5550001122", "ece@email.com", "Osmangazi, Bursa", "Mithatpaşa Ortaokulu", 8, "Aktif", "2025-09-01", 1, "Yapay Zeka Rehberi_S", None, None)
    ]
    cursor.executemany("""
        INSERT INTO students 
        (id, first_name, last_name, birth_date, phone, email, address, school_name, grade_level, status, registration_date, class_id, ai_advisor_name, last_ai_analysis, last_ai_analysis_date) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, students_data)
    
    # 6. Seed Parents
    parents_data = [
        (1, "Ayşe_S", "Yılmaz_S", "05553334455", "ayse@mail.com"),
        (2, "Fatma_S", "Şahin_S", "05552223344", "fatma@mail.com"),
        (3, "Mehmet_S", "Çelik_S", "05553332211", "mehmet@mail.com"),
        (4, "Hasan_S", "Bulut_S", "05554445566", "hasan@mail.com"),
        (5, "Emel_S", "Güneş_S", "05556667788", "emel@mail.com")
    ]
    cursor.executemany("INSERT INTO parents (id, first_name, last_name, phone, email) VALUES (?, ?, ?, ?, ?)", parents_data)
    
    # 7. Seed Student-Parent Links
    sp_data = [
        (1, 1, "anne"),
        (2, 2, "anne"),
        (3, 3, "baba"),
        (4, 4, "baba"),
        (5, 5, "anne")
    ]
    cursor.executemany("INSERT INTO student_parents (student_id, parent_id, relation) VALUES (?, ?, ?)", sp_data)
    
    # 8. Seed Target Exams
    target_data = [
        (1, 1, "LGS", 1.2),
        (2, 2, "LGS", 8.5),
        (3, 3, "LGS", 5.0),
        (4, 4, "LGS", 12.5),
        (5, 5, "LGS", 3.0)
    ]
    cursor.executemany("INSERT INTO target_exams (id, student_id, exam_type, target_percentile) VALUES (?, ?, ?, ?)", target_data)
    
    # 9. Seed Users (passwords are '123' hashed)
    pass_hash = hash_pw("123")
    users_data = [
        (1, "admin_S", pass_hash, "manager", 1, 1, "2026-01-28 10:00:00"),
        (2, "ahmet_S", pass_hash, "teacher", 2, 1, "2026-01-28 10:00:00"),
        (3, "muhasebe_S", pass_hash, "accounting", 3, 1, "2026-01-28 10:00:00"),
        (4, "memur_S", pass_hash, "clerk", 4, 1, "2026-01-28 10:00:00"),
        # Students
        (5, "20260001_S", pass_hash, "student", 1, 1, "2026-01-28 10:05:00"),
        (6, "20260002_S", pass_hash, "student", 2, 1, "2026-01-28 10:05:00"),
        (7, "20260003_S", pass_hash, "student", 3, 1, "2026-01-28 10:05:00"),
        (8, "20260004_S", pass_hash, "student", 4, 1, "2026-01-28 10:05:00"),
        (9, "20260005_S", pass_hash, "student", 5, 1, "2026-01-28 10:05:00"),
        # Parents
        (10, "ayseveli_S", pass_hash, "parent", 1, 1, "2026-01-28 10:10:00"),
        (11, "fatmaveli_S", pass_hash, "parent", 2, 1, "2026-01-28 10:10:00"),
        (12, "mehmetveli_S", pass_hash, "parent", 3, 1, "2026-01-28 10:10:00"),
        (13, "hasanveli_S", pass_hash, "parent", 4, 1, "2026-01-28 10:10:00"),
        (14, "emelveli_S", pass_hash, "parent", 5, 1, "2026-01-28 10:10:00")
    ]
    cursor.executemany("INSERT INTO users (id, username, password_hash, role, ref_id, is_active, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)", users_data)
    
    # 10. Seed Exams (LGS mock exams)
    exams_data = [
        (1, "Ekim Deneme Sınavı", "LGS", "practice", "2025-10-20"),
        (2, "Kasım Genel Denemesi", "LGS", "practice", "2025-11-22"),
        (3, "Aralık Deneme Sınavı", "LGS", "practice", "2025-12-15"),
        (4, "Ocak Genel Denemesi", "LGS", "practice", "2026-01-18"),
        (5, "Şubat Deneme Sınavı", "LGS", "practice", "2026-02-22"),
        (6, "Mart Genel Denemesi", "LGS", "practice", "2026-03-25"),
        (7, "Nisan Deneme Sınavı", "LGS", "practice", "2026-04-28"),
        (8, "Mayıs Genel Denemesi", "LGS", "practice", "2026-05-20")
    ]
    cursor.executemany("INSERT INTO exams (id, name, exam_type, exam_kind, exam_date) VALUES (?, ?, ?, ?, ?)", exams_data)
    
    # 11. Seed Exam Results (showing varying trajectories)
    # Student 1: Zeynep_S (High performing, upward trend)
    # Student 2: Emir_S (Fluctuating, downward trend)
    # Student 3: Yağmur_S (Steady, solid progress)
    # Student 4: Kerem_S (Struggling, but showing advisor-backed improvement)
    # Student 5: Ece_S (Excellent, stable top-tier)
    results_data = [
        # Zeynep_S (1)
        (1, 1, 440), (2, 1, 445), (3, 1, 452), (4, 1, 460), (5, 1, 468), (6, 1, 472), (7, 1, 478), (8, 1, 485),
        # Emir_S (2)
        (1, 2, 360), (2, 2, 355), (3, 2, 362), (4, 2, 350), (5, 2, 345), (6, 2, 352), (7, 2, 340), (8, 2, 330),
        # Yağmur_S (3)
        (1, 3, 410), (2, 3, 412), (3, 3, 415), (4, 3, 418), (5, 3, 420), (6, 3, 422), (7, 3, 425), (8, 3, 428),
        # Kerem_S (4)
        (1, 4, 280), (2, 4, 290), (3, 4, 305), (4, 4, 312), (5, 4, 325), (6, 4, 332), (7, 4, 345), (8, 4, 350),
        # Ece_S (5)
        (1, 5, 460), (2, 5, 465), (3, 5, 470), (4, 5, 475), (5, 5, 480), (6, 5, 485), (7, 5, 488), (8, 5, 492)
    ]
    cursor.executemany("INSERT INTO exam_results (exam_id, student_id, score) VALUES (?, ?, ?)", results_data)
    
    # 12. Seed Attendance
    # 1: Zeynep_S, 2: Emir_S, 3: Yağmur_S, 4: Kerem_S, 5: Ece_S
    attendance_data = []
    # Loop over 10 days of attendance
    dates = [f"2026-06-{i:02d}" for i in range(1, 11)]
    for std_id in range(1, 6):
        for idx, d in enumerate(dates):
            # Give varying attendance records
            if std_id == 2 and idx in [3, 7]: # Emir absent twice
                status = "absent"
            elif std_id == 4 and idx in [2, 5, 8]: # Kerem late three times
                status = "late"
            else:
                status = "present"
            attendance_data.append((std_id, d, status))
    cursor.executemany("INSERT INTO student_attendance (student_id, date, status) VALUES (?, ?, ?)", attendance_data)
    
    # 13. Seed School Grades
    grades_data = [
        # Zeynep_S (1)
        (1, "Matematik", "Yazılı 1", 95, "2026-03-10"),
        (1, "Matematik", "Yazılı 2", 98, "2026-05-12"),
        (1, "Fen Bilgisi", "Yazılı 1", 92, "2026-03-15"),
        (1, "Türkçe", "Yazılı 1", 96, "2026-03-18"),
        # Emir_S (2) - Weak in Math and Science
        (2, "Matematik", "Yazılı 1", 62, "2026-03-10"),
        (2, "Matematik", "Yazılı 2", 58, "2026-05-12"),
        (2, "Fen Bilgisi", "Yazılı 1", 65, "2026-03-15"),
        (2, "Türkçe", "Yazılı 1", 82, "2026-03-18"),
        # Yağmur_S (3)
        (3, "Matematik", "Yazılı 1", 85, "2026-03-10"),
        (3, "Fen Bilgisi", "Yazılı 1", 88, "2026-03-15"),
        (3, "Türkçe", "Yazılı 1", 90, "2026-03-18"),
        # Kerem_S (4) - Weak in Turkish but improving
        (4, "Matematik", "Yazılı 1", 72, "2026-03-10"),
        (4, "Fen Bilgisi", "Yazılı 1", 70, "2026-03-15"),
        (4, "Türkçe", "Yazılı 1", 52, "2026-03-18"),
        (4, "Türkçe", "Yazılı 2", 72, "2026-05-14"),
        # Ece_S (5)
        (5, "Matematik", "Yazılı 1", 98, "2026-03-10"),
        (5, "Fen Bilgisi", "Yazılı 1", 100, "2026-03-15"),
        (5, "Türkçe", "Yazılı 1", 97, "2026-03-18")
    ]
    cursor.executemany("INSERT INTO school_grades (student_id, subject, grade_type, score, date) VALUES (?, ?, ?, ?, ?)", grades_data)
    
    # 14. Seed Assignments
    assignments_data = [
        (1, 2, "LGS Matematik - Üslü İfadeler Hız Testi", "homework", "Matematik", "medium", "2026-06-15", 1, "2026-06-01 10:00:00"),
        (2, 2, "LGS Fen Bilgisi - Mevsimler ve İklim Analizi", "homework", "Fen Bilgisi", "easy", "2026-06-18", 1, "2026-06-02 10:00:00"),
        (3, 2, "LGS Türkçe - Paragrafta Anlam Yorumları", "homework", "Türkçe", "hard", "2026-06-20", 1, "2026-06-03 10:00:00")
    ]
    cursor.executemany("""
        INSERT INTO assignments 
        (id, teacher_id, title, type, subject, difficulty, due_date, is_published, created_at) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, assignments_data)
    
    # Seed Assignment Questions
    questions_data = [
        # Assg 1 - Math
        (1, 1, "2^3 x 2^4 işleminin sonucu hangisidir?", "2^7", 0),
        (2, 1, "5^-2 sayısı aşağıdakilerden hangisine eşittir?", "1/25", 0),
        (3, 1, "(-3)^4 işleminin sonucu kaçtır?", "81", 0),
        # Assg 2 - Science
        (4, 2, "21 Haziran tarihinde Kuzey Yarım Küre'de hangi mevsim başlar?", "Yaz", 0),
        (5, 2, "Dünya'nın eksen eğikliği kaç derecedir?", "23 derece 27 dakika", 0),
        # Assg 3 - Turkish
        (6, 3, "Aşağıdakilerden hangisi öznel bir yargı bildirir?", "Bu kitap çok sürükleyici.", 0)
    ]
    cursor.executemany("INSERT INTO assignment_questions (id, assignment_id, question_text, correct_answer, generated_by_ai) VALUES (?, ?, ?, ?, ?)", questions_data)
    
    # Link assignments to students
    as_relations = []
    for s_id in range(1, 6):
        as_relations.append((1, s_id, "2026-06-01 10:05:00"))
        as_relations.append((2, s_id, "2026-06-02 10:05:00"))
        as_relations.append((3, s_id, "2026-06-03 10:05:00"))
    cursor.executemany("INSERT INTO assignment_students (assignment_id, student_id, assigned_at) VALUES (?, ?, ?)", as_relations)
    
    # Seed Assignment Submissions (some completed, some pending)
    # Zeynep_S (1) & Ece_S (5) solved all
    # Emir_S (2) solved none or only one
    # Yağmur_S (3) solved 2
    # Kerem_S (4) solved 2
    submissions_data = [
        # Zeynep_S (1)
        (1, 1, '{"1": "2^7", "2": "1/25", "3": "81"}', 100, "2026-06-10 14:00:00"),
        (2, 1, '{"4": "Yaz", "5": "23 derece 27 dakika"}', 100, "2026-06-11 15:30:00"),
        (3, 1, '{"6": "Bu kitap çok sürükleyici."}', 100, "2026-06-12 11:20:00"),
        # Emir_S (2) - struggled
        (1, 2, '{"1": "2^12", "2": "-25", "3": "81"}', 33, "2026-06-11 18:00:00"),
        # Yağmur_S (3)
        (1, 3, '{"1": "2^7", "2": "1/25", "3": "-81"}', 66, "2026-06-09 10:00:00"),
        (2, 3, '{"4": "Yaz", "5": "23 derece 27 dakika"}', 100, "2026-06-10 11:00:00"),
        # Kerem_S (4)
        (1, 4, '{"1": "2^7", "2": "1/25", "3": "81"}', 100, "2026-06-10 09:00:00"),
        (3, 4, '{"6": "Bu kitap sürükleyicidir."}', 0, "2026-06-12 10:15:00"),
        # Ece_S (5)
        (1, 5, '{"1": "2^7", "2": "1/25", "3": "81"}', 100, "2026-06-08 16:00:00"),
        (2, 5, '{"4": "Yaz", "5": "23 derece 27 dakika"}', 100, "2026-06-09 14:00:00"),
        (3, 5, '{"6": "Bu kitap çok sürükleyici."}', 100, "2026-06-10 13:00:00")
    ]
    cursor.executemany("INSERT INTO assignment_submissions (assignment_id, student_id, answer_text, score, submitted_at) VALUES (?, ?, ?, ?, ?)", submissions_data)
    
    # 15. Seed Lesson Reviews (study logging)
    reviews_data = [
        (1, "Matematik", "Üslü Sayılar", "2026-06-05", 45),
        (1, "Fen Bilgisi", "Mevsimlerin Oluşumu", "2026-06-06", 60),
        (2, "Türkçe", "Paragrafta Ana Düşünce", "2026-06-07", 30),
        (3, "Matematik", "Köklü Sayılar", "2026-06-08", 50),
        (3, "Fen Bilgisi", "İklim ve Hava Hareketleri", "2026-06-09", 40),
        (4, "Türkçe", "Sözcükte Anlam", "2026-06-08", 45),
        (5, "Matematik", "Çarpanlar ve Katlar", "2026-06-09", 75)
    ]
    cursor.executemany("INSERT INTO lesson_reviews (student_id, subject, topic, review_date, duration_minutes) VALUES (?, ?, ?, ?, ?)", reviews_data)
    
    # 16. Seed Certificates
    certs_data = [
        (1, "Matematik Olimpiyatları Katılım Sertifikası_S", "TÜBİTAK", "2025-12-10"),
        (3, "Geleceğin Yazılımcısı Sertifikası_S", "Bilge Çocuk", "2026-02-15"),
        (5, "LGS Erken Başarı Ödülü_S", "Dershane Yönetimi", "2026-05-01")
    ]
    cursor.executemany("INSERT INTO student_certificates (student_id, title, issuer, date) VALUES (?, ?, ?, ?)", certs_data)
    
    # 17. Seed Teacher Notes
    notes_data = [
        (2, 1, "Matematik denemelerinde gösterdiği artış çok başarılı. Hedefi olan LGS ilk %1'lik dilime oldukça yakın. Çalışmalarını aynı disiplinle sürdürmeli.", "2026-06-08 11:30:00"),
        (2, 2, "Son denemelerde puan düşüşü gözlemleniyor. Özellikle Matematik ve Fen derslerinde konu tekrarı yapmalı ve ödevlerini geciktirmeden tamamlamalı.", "2026-06-09 14:15:00"),
        (2, 3, "İstikrarlı ve düzenli bir öğrencimiz. Deneme sonuçları hedefleriyle paralel seyrediyor. Paragraf çözüm tekniklerine ağırlık vermesini öneririm.", "2026-06-10 10:00:00"),
        (2, 4, "İlk dönemdeki zayıf Türkçe ortalamasını son haftalarda ciddi şekilde toparladı. AI çalışma planına sadık kalması gelişiminde büyük rol oynuyor.", "2026-06-11 09:30:00")
    ]
    cursor.executemany("INSERT INTO teacher_notes (teacher_id, student_id, note_text, created_at) VALUES (?, ?, ?, ?)", notes_data)
    
    # 18. Seed active AI plans
    ai_plans = [
        (1, "Matematik - Üslü İfadeler", "Yıl içi deneme ve okul sınav analizlerine göre, Matematik dersinde taban ve üs kavramları konusuna yoğunlaşmalısın. Günde 30 soru çözerek rehberdeki kritik notları oku.", '[{"question": "2 üzeri -3 (2^-3) kaçtır?", "options": ["-8", "-6", "1/8", "1/6"], "answer": "1/8"}]', None, "active", "2026-06-12 12:00:00"),
        (2, "Matematik - Çarpanlar ve Katlar", "Son deneme sonucunda Matematik netlerinde düşüş gözlendi. Çarpanlar ve katlar, EBOB-EKOK problemlerine bu hafta öncelik vermelisin.", '[{"question": "12 ve 18 sayılarının EBOB\'u kaçtır?", "options": ["2", "3", "6", "12"], "answer": "6"}]', None, "active", "2026-06-12 12:00:00")
    ]
    cursor.executemany("INSERT INTO ai_study_plans (student_id, topic, study_guide, quiz_questions, quiz_score, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)", ai_plans)
    
    conn.commit()
    conn.close()
    print(">>> Seeding completed successfully!")

if __name__ == "__main__":
    seed_db()
