import os
import sys
import json
import time
import urllib.request
from pypdf import PdfReader

# Ensure output directory exists
OUTPUT_DIR = "frontend/assets/lgs_json"
os.makedirs(OUTPUT_DIR, exist_ok=True)

from dotenv import load_dotenv

load_dotenv()

CLAUDE_API_KEY = os.environ.get("CLAUDE_API_KEY", "") or os.environ.get("ANTHROPIC_API_KEY", "")

def call_api(prompt):
    if not CLAUDE_API_KEY:
        print("Error: CLAUDE_API_KEY environment variable is not set!")
        sys.exit(1)
        
    url = "https://api.anthropic.com/v1/messages"
    headers = {
        "x-api-key": CLAUDE_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json"
    }
    
    data = {
        "model": "claude-3-5-sonnet-latest",
        "max_tokens": 2048,
        "system": "Sen LGS sınav sorularını analiz eden ve JSON formatına çeviren bir uzmansın. Sadece geçerli bir JSON dizisi döndür, başka hiçbir açıklama yazma.",
        "messages": [
            {"role": "user", "content": prompt}
        ]
    }
    
    # Try calling the API with retries
    for attempt in range(3):
        try:
            req = urllib.request.Request(url, data=json.dumps(data).encode("utf-8"), headers=headers, method="POST")
            with urllib.request.urlopen(req) as response:
                res_data = json.loads(response.read().decode("utf-8"))
                text_out = res_data["content"][0]["text"].strip()
                import re
                json_match = re.search(r'\[\s*\{.*\}\s*\]|\{\s*".*"\s*\}', text_out, re.DOTALL)
                if json_match:
                    return json.loads(json_match.group(0))
                return json.loads(text_out)
        except Exception as e:
            print(f"  Attempt {attempt+1} failed: {e}")
            if hasattr(e, 'read'):
                try:
                    print("  Error body:", e.read().decode("utf-8"))
                except:
                    pass
            time.sleep(3)
    return None

def parse_pdf(pdf_path, year, session, duration, total_q):
    print(f"\n==========================================")
    print(f"Processing: {pdf_path} ({year} {session})")
    print(f"==========================================")
    
    if not os.path.exists(pdf_path):
        print(f"File not found: {pdf_path}")
        return
        
    reader = PdfReader(pdf_path)
    total_pages = len(reader.pages)
    print(f"Total pages: {total_pages}")
    
    all_questions = []
    
    # LGS booklets start questions after page 2 usually. We will scan all pages.
    for page_idx in range(2, total_pages):
        page_text = reader.pages[page_idx].extract_text()
        if not page_text or len(page_text.strip()) < 50:
            continue
            
        print(f"  Parsing page {page_idx+1}/{total_pages}...")
        
        prompt = f"""
Aşağıdaki LGS sınav kitapçığı sayfa metnini incele ve bu sayfadaki tüm çoktan seçmeli soruları bulup şu JSON şemasında döndür. Eğer sayfada soru yoksa boş dizi [] döndür.
Soruları çözerken lütfen sorunun anlamını ve şıklarını aynen koru. Türkçe karakterleri düzgün şekilde kullan.

JSON şeması:
[
  {{
    "question_number": 1,
    "subject": "Matematik" veya "Fen Bilimleri" veya "Türkçe" veya "T.C. İnkılap Tarihi ve Atatürkçülük" veya "Din Kültürü ve Ahlak Bilgisi" veya "İngilizce",
    "question_text": "Sorunun metni (veya görsel açıklama içeren soru gövdesi).",
    "options": {{
      "A": "A şıkkı metni",
      "B": "B şıkkı metni",
      "C": "C şıkkı metni",
      "D": "D şıkkı metni"
    }},
    "correct_answer": "A veya B veya C veya D. Soruyu dikkatle çöz ve doğru cevabı belirt."
  }}
]

SAYFA METNİ:
{page_text}
"""
        result = call_api(prompt)
        if result and isinstance(result, list):
            for q in result:
                # Add check to avoid duplicates or empty entries
                if "question_number" in q and "question_text" in q:
                    print(f"    Found Q#{q['question_number']} in {q['subject']}")
                    all_questions.append(q)
        else:
            print(f"    No questions parsed on page {page_idx+1}")
            
        # Rate limit prevention (free/medium tier has RPM limits)
        time.sleep(1.5)
        
    # Sort questions by number
    all_questions.sort(key=lambda x: x.get("question_number", 99))
    
    output_data = {
        "exam_name": f"{year} LGS {session}",
        "year": year,
        "session": session,
        "duration_minutes": duration,
        "total_questions": total_q,
        "questions": all_questions
    }
    
    out_filename = f"{year}_{session.lower().replace('ı', 'i').replace('ö', 'o').replace('ş', 's')}.json"
    out_path = os.path.join(OUTPUT_DIR, out_filename)
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(output_data, f, ensure_ascii=False, indent=2)
        
    print(f"\n>>> Saved {len(all_questions)} questions to {out_path}!")

def main():
    # We will process 2025 Sayısal and 2025 Sözel first
    pdf_mappings = [
        # (pdf_path, year, session, duration, total_questions)
        ("sorular_pdf/28084928_2025sayi.pdf", 2025, "sayisal", 80, 40),
        ("sorular_pdf/28084845_2025sozel.pdf", 2025, "sozel", 75, 50)
    ]
    
    for mapping in pdf_mappings:
        try:
            parse_pdf(mapping[0], mapping[1], mapping[2], mapping[3], mapping[4])
        except Exception as e:
            print(f"Error parsing mapping {mapping[0]}: {e}")

if __name__ == "__main__":
    main()
