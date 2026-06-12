import sqlite3
import os

import shutil

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SRC_DB_PATH = os.path.join(BASE_DIR, "dershane_sistemi_seeded.db")

# Detect if running in serverless GCP / Firebase environment
if os.environ.get("K_SERVICE") or os.environ.get("FUNCTION_TARGET"):
    DB_PATH = "/tmp/dershane_sistemi_seeded.db"
    if not os.path.exists(DB_PATH):
        print(">>> Serverless environment detected. Copying database to /tmp...")
        shutil.copy2(SRC_DB_PATH, DB_PATH)
        os.chmod(DB_PATH, 0o666)
else:
    DB_PATH = SRC_DB_PATH

print(">>> BACKEND DB PATH:", DB_PATH)

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    
    # Self-healing Schema Upgrade
    cursor = conn.cursor()
    try:
        cursor.execute("ALTER TABLE students ADD COLUMN ai_advisor_name TEXT DEFAULT 'Yapay Zeka Rehberi';")
    except sqlite3.OperationalError:
        pass
    try:
        cursor.execute("ALTER TABLE students ADD COLUMN last_ai_analysis TEXT;")
    except sqlite3.OperationalError:
        pass
    try:
        cursor.execute("ALTER TABLE students ADD COLUMN last_ai_analysis_date TEXT;")
    except sqlite3.OperationalError:
        pass
        
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS student_attendance (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER,
        date TEXT,
        status TEXT
    );
    """)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS school_grades (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER,
        subject TEXT,
        grade_type TEXT,
        score INTEGER,
        date TEXT
    );
    """)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS student_certificates (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER,
        title TEXT,
        issuer TEXT,
        date TEXT
    );
    """)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS lesson_reviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER,
        subject TEXT,
        topic TEXT,
        review_date TEXT,
        duration_minutes INTEGER
    );
    """)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS ai_study_plans (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER,
        topic TEXT,
        study_guide TEXT,
        quiz_questions TEXT,
        quiz_score INTEGER,
        status TEXT,
        created_at TEXT
    );
    """)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS verification_codes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT,
        code TEXT,
        expires_at TEXT
    );
    """)
    conn.commit()
    
    return conn
