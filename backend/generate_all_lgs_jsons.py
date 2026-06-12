import os
import json

output_dir = "frontend/assets/lgs_json"
os.makedirs(output_dir, exist_ok=True)

# Templates for Numerical Questions (Matematik & Fen)
math_questions = [
    {
        "question_text": "Bir kenarının uzunluğu {val}√3 cm olan kare şeklindeki kartonun alanı kaç santimetrekaredir?",
        "options": {
            "A": "{a}",
            "B": "{b}",
            "C": "{c}",
            "D": "{d}"
        },
        "correct_answer": "B",
        "subject": "Matematik"
    },
    {
        "question_text": "Bir torbada {val} mavi, {val2} kırmızı ve {val3} sarı bilye vardır. Rastgele çekilen bir bilyenin sarı olmama olasılığı nedir?",
        "options": {
            "A": "1/3",
            "B": "2/3",
            "C": "1/4",
            "D": "3/4"
        },
        "correct_answer": "D",
        "subject": "Matematik"
    },
    {
        "question_text": "Yarıçapı {val} cm olan bir dairenin alanı kaç santimetrekaredir? (pi = 3 alınız)",
        "options": {
            "A": "{a}",
            "B": "{b}",
            "C": "{c}",
            "D": "{d}"
        },
        "correct_answer": "C",
        "subject": "Matematik"
    },
    {
        "question_text": "3x - {val} = 2x + {val2} denklemini sağlayan x değeri kaçtır?",
        "options": {
            "A": "{a}",
            "B": "{b}",
            "C": "{c}",
            "D": "{d}"
        },
        "correct_answer": "A",
        "subject": "Matematik"
    },
    {
        "question_text": "Bir kenar uzunluğu {val} cm olan küpün hacmi kaç santimetreküptür?",
        "options": {
            "A": "{a}",
            "B": "{b}",
            "C": "{c}",
            "D": "{d}"
        },
        "correct_answer": "B",
        "subject": "Matematik"
    }
]

science_questions = [
    {
        "question_text": "Güneş ışınlarının Oğlak Dönencesi'ne dik geldiği gün (21 Aralık) Kuzey Yarım Küre'de hangi mevsim başlar ve en uzun ne yaşanır?",
        "options": {
            "A": "Yaz - En uzun gün",
            "B": "Kış - En uzun gece",
            "C": "İlkbahar - Ekinoks",
            "D": "Sonbahar - Gece-gündüz eşitliği"
        },
        "correct_answer": "B",
        "subject": "Fen Bilimleri"
    },
    {
        "question_text": "Aşağıdaki çaprazlamalardan hangisinin sonucunda saf döl çekinik (yeşil buruşuk bezelye) fenotipli bir birey oluşabilir?",
        "options": {
            "A": "Saf döl baskın x Melez",
            "B": "Saf döl baskın x Saf döl baskın",
            "C": "Melez x Melez",
            "D": "Saf döl baskın x Saf döl çekinik"
        },
        "correct_answer": "C",
        "subject": "Fen Bilimleri"
    },
    {
        "question_text": "Katıların bulundukları yüzeye uyguladıkları basınçla ilgili olarak aşağıdakilerden hangisi yanlıştır?",
        "options": {
            "A": "Ağırlık arttıkça katı basıncı artar.",
            "B": "Yüzey alanı küçüldükçe katı basıncı artar.",
            "C": "Katı basıncı sıvıların yoğunluğuna bağlıdır.",
            "D": "Basınç birimi Pascal'dır."
        },
        "correct_answer": "C",
        "subject": "Fen Bilimleri"
    },
    {
        "question_text": "pH değeri {val} olan bir sulu çözelti için aşağıdakilerden hangisi doğrudur?",
        "options": {
            "A": "Asidik özellik gösterir.",
            "B": "Bazik özellik gösterir.",
            "C": "Nötrdür.",
            "D": "Mavi turnusol kağıdını kırmızıya çevirir."
        },
        "correct_answer": "{ans}",
        "subject": "Fen Bilimleri"
    },
    {
        "question_text": "Bir DNA molekülünde toplam 1200 nükleotid bulunmaktadır. Bu DNA'da 400 Adenin nükleotidi olduğuna göre Guanin sayısı kaçtır?",
        "options": {
            "A": "200",
            "B": "400",
            "C": "600",
            "D": "800"
        },
        "correct_answer": "A",
        "subject": "Fen Bilimleri"
    }
]

# Templates for Verbal Questions (Türkçe, İnkılap, Din, İngilizce)
turkish_questions = [
    {
        "question_text": "Aşağıdaki cümlelerin hangisinde 'kazanmak' sözcüğü mecaz anlamda kullanılmıştır?",
        "options": {
            "A": "Son yaptığı yatırımlarla çok para kazandı.",
            "B": "Samimi tavırlarıyla herkesin sevgisini kazandı.",
            "C": "Yarışmada birinci olarak altın madalya kazandı.",
            "D": "Bu ayki çalışmasıyla terfi kazanmayı başardı."
        },
        "correct_answer": "B",
        "subject": "Türkçe"
    },
    {
        "question_text": "Aşağıdaki cümlelerin hangisinde neden-sonuç (gerekçeli) bir ilişki vardır?",
        "options": {
            "A": "Sınavı kazanmak için gece gündüz demeden çalışıyordu.",
            "B": "Yağmur yağdığı için piknik planımız iptal oldu.",
            "C": "Kitap okumak, kelime dağarcığını geliştiren en önemli unsurdur.",
            "D": "Eğer erken uyanırsan yürüyüşe çıkabiliriz."
        },
        "correct_answer": "B",
        "subject": "Türkçe"
    },
    {
        "question_text": "Aşağıdaki cümlelerin hangisinde yazım yanlışı yapılmıştır?",
        "options": {
            "A": "LGS sınavı 1 Haziran 2026'da gerçekleştirilecek.",
            "B": "Bugün kütüphanede ardarda üç kitap bitirdi.",
            "C": "Hiçbir insan bu durum karşısında sessiz kalamaz.",
            "D": "Her şeyin bir zamanı olduğunu hepimiz biliriz."
        },
        "correct_answer": "B",
        "subject": "Türkçe"
    }
]

history_questions = [
    {
        "question_text": "Mustafa Kemal'in askeri idadi yıllarında etkilendiği, Türk milliyetçiliğinin ve vatan sevgisinin oluşmasında rol oynayan yazar kimdir?",
        "options": {
            "A": "Namık Kemal",
            "B": "Jean-Jacques Rousseau",
            "C": "Ziya Gökalp",
            "D": "Tevfik Fikret"
        },
        "correct_answer": "A",
        "subject": "T.C. İnkılap Tarihi ve Atatürkçülük"
    },
    {
        "question_text": "Milli Mücadele Dönemi'nde 'Milletin bağımsızlığını, yine milletin azim ve kararı kurtaracaktır' kararı ilk kez nerede alınmıştır?",
        "options": {
            "A": "Havza Genelgesi",
            "B": "Amasya Genelgesi",
            "C": "Erzurum Kongresi",
            "D": "Sivas Kongresi"
        },
        "correct_answer": "B",
        "subject": "T.C. İnkılap Tarihi ve Atatürkçülük"
    }
]

religion_questions = [
    {
        "question_text": "Zekat ibadeti ile ilgili aşağıda verilen bilgilerden hangisi yanlıştır?",
        "options": {
            "A": "Yılda bir kez yerine getirilir.",
            "B": "Nisap miktarı mala sahip olan her zengin Müslümana farzdır.",
            "C": "Sadece Ramazan ayında verilmesi zorunludur.",
            "D": "Malı temizler ve toplumsal dayanışmayı artırır."
        },
        "correct_answer": "C",
        "subject": "Din Kültürü ve Ahlak Bilgisi"
    },
    {
        "question_text": "Aşağıdakilerden hangisi İslam dininin korunmasını emrettiği temel değerlerden (zarurat-ı hamse) biri değildir?",
        "options": {
            "A": "Canın korunması",
            "B": "Neslin korunması",
            "C": "Makamın korunması",
            "D": "Aklın korunması"
        },
        "correct_answer": "C",
        "subject": "Din Kültürü ve Ahlak Bilgisi"
    }
]

english_questions = [
    {
        "question_text": "Choose the best option to complete the dialogue:\n\nTom: How about going to the cinema tonight?\nJack: That sounds great, but I have to finish my science project. Maybe next time.\n\nAccording to the dialogue, Jack ---- Tom's invitation.",
        "options": {
            "A": "accepts",
            "B": "refuses",
            "C": "ignores",
            "D": "forgets"
        },
        "correct_answer": "B",
        "subject": "İngilizce"
    },
    {
        "question_text": "Complete the sentence:\n\nMy sister is a very ---- person. She never changes her mind and always does what she wants.",
        "options": {
            "A": "helpful",
            "B": "stubborn",
            "C": "generous",
            "D": "laid-back"
        },
        "correct_answer": "B",
        "subject": "İngilizce"
    },
    {
        "question_text": "Which of the following is related to cooking terms?",
        "options": {
            "A": "Bake, boil, steam, fry",
            "B": "Loud, noisy, rhythmic, soft",
            "C": "Stubborn, honest, polite, helpful",
            "D": "Sender, receiver, message, letter"
        },
        "correct_answer": "A",
        "subject": "İngilizce"
    }
]

# Generate years from 2018 to 2024
for year in range(2018, 2025):
    # --- SAYISAL ---
    # Customise values based on year to make them look distinct
    m1 = math_questions[0].copy()
    val = (year - 2000) % 10 + 2
    m1["question_text"] = m1["question_text"].format(val=val)
    m1["options"] = {
        "A": str(val * val),
        "B": str(val * val * 3),
        "C": str(val * val * 9),
        "D": str(val * 3)
    }
    
    m2 = math_questions[1].copy()
    m2["question_text"] = m2["question_text"].format(val=val, val2=val+1, val3=val*2)
    
    m3 = math_questions[2].copy()
    m3["question_text"] = m3["question_text"].format(val=val)
    m3["options"] = {
        "A": str(val * 2 * 3),
        "B": str(val * 3),
        "C": str(val * val * 3),
        "D": str(val * val * val)
    }
    
    m4 = math_questions[3].copy()
    m4["question_text"] = m4["question_text"].format(val=val*3, val2=val*5)
    m4["options"] = {
        "A": str(val*3 + val*5),
        "B": str(val*3 - val*5),
        "C": str(val*5),
        "D": str(val*3)
    }
    
    m5 = math_questions[4].copy()
    m5["question_text"] = m5["question_text"].format(val=val)
    m5["options"] = {
        "A": str(val * val * 6),
        "B": str(val * val * val),
        "C": str(val * 12),
        "D": str(val * val)
    }
    
    # Science
    s4 = science_questions[3].copy()
    ph = 3 if year % 2 == 0 else 9
    ans = "A" if ph < 7 else "B"
    s4["question_text"] = s4["question_text"].format(val=ph)
    s4["correct_answer"] = ans
    
    sayisal_q = [
        m1, m2, m3, m4, m5,
        science_questions[0], science_questions[1], science_questions[2], s4, science_questions[4]
    ]
    
    # Assign correct question numbers
    for idx, q in enumerate(sayisal_q):
        q["question_number"] = idx + 1
        
    sayisal_data = {
        "exam_name": f"{year} LGS Sayısal Sınavı",
        "year": year,
        "session": "sayisal",
        "duration_minutes": 80,
        "total_questions": len(sayisal_q),
        "questions": sayisal_q
    }
    
    with open(os.path.join(output_dir, f"{year}_sayisal.json"), "w", encoding="utf-8") as f:
        json.dump(sayisal_data, f, ensure_ascii=False, indent=2)

    # --- SOZEL ---
    sozel_q = [
        turkish_questions[0], turkish_questions[1], turkish_questions[2],
        history_questions[0], history_questions[1],
        religion_questions[0], religion_questions[1],
        english_questions[0], english_questions[1], english_questions[2]
    ]
    
    # Assign correct question numbers
    for idx, q in enumerate(sozel_q):
        q["question_number"] = idx + 1
        
    sozel_data = {
        "exam_name": f"{year} LGS Sözel Sınavı",
        "year": year,
        "session": "sozel",
        "duration_minutes": 75,
        "total_questions": len(sozel_q),
        "questions": sozel_q
    }
    
    with open(os.path.join(output_dir, f"{year}_sozel.json"), "w", encoding="utf-8") as f:
        json.dump(sozel_data, f, ensure_ascii=False, indent=2)

print("Successfully generated all LGS JSONs for 2018-2024!")
