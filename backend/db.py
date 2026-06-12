import sqlite3
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "dershane_sistemi_seeded.db")

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
