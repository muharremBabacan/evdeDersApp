import { useState, useEffect } from "react";
import { demoOutcomes, demoTopics, demoQuestions } from "../data/demoCurriculum";
import { evaluateAnswers, scorePercentage } from "../lib/mastery";
import { updateMasteryFromAnswers } from "../lib/mastery";
import type { MasteryRecord } from "../types/curriculum";

interface TopicStudyContent {
  summary: string;
  videoUrl: string;
  mebPageRange?: string;
  questions: Array<{
    id: string;
    text: string;
    options: string[];
    correctAnswer: string;
  }>;
}

const studyContentDb: Record<string, TopicStudyContent> = {
  "Kesirler": {
    summary: "Kesirlerle toplama ve çıkarma işlemlerinde paydaların eşit olması gerekir. Paydaları eşit olmayan kesirlerin önce paydaları eşitlenir (genişletme veya sadeleştirme yoluyla), ardından paylar toplanır veya çıkarılır, ortak payda aynen yazılır.\n\nÇarpma işleminde paylar kendi arasında, paydalar kendi arasında çarpılır. Bölme işleminde ise ilk kesir aynen kalır, ikinci kesir ters çevrilerek çarpılır.",
    videoUrl: "https://www.youtube.com/embed/demo1",
    questions: [
      { id: "kq1", text: "1/3 + 1/6 işleminin sonucu hangisidir?", options: ["2/9", "3/6", "1/2", "5/6"], correctAnswer: "1/2" },
      { id: "kq2", text: "2/5 x 3/4 işleminin sonucu sadeleştirildiğinde hangisi olur?", options: ["6/20", "3/10", "5/9", "3/5"], correctAnswer: "3/10" },
      { id: "kq3", text: "1/2 ÷ 1/4 işleminin sonucu kaçtır?", options: ["1/8", "2", "4", "1/2"], correctAnswer: "2" }
    ]
  },
  "Sıvı Basıncı": {
    summary: "Sıvı basıncı, sıvının derinliği (h) ve sıvının yoğunluğu (d) ile doğru orantılıdır. Sıvı basıncı formülü: P = h x d x g şeklindedir (LGS'de yerçekimi ivmesi g genellikle sabit kabul edilir).\n\nÖnemli Kurallar:\n1. Derinlik arttıkça sıvı basıncı artar.\n2. Yoğunluk arttıkça sıvı basıncı artar.\n3. Sıvının miktarı veya kabın şekli sıvı basıncını etkilemez.",
    videoUrl: "https://www.youtube.com/embed/demo2",
    questions: [
      { id: "sq1", text: "Aşağıdakilerden hangisi sıvı basıncını etkilemez?", options: ["Sıvının derinliği", "Sıvının yoğunluğu", "Kabın şekli", "Sıvının cinsi"], correctAnswer: "Kabın şekli" },
      { id: "sq2", text: "Sıvı dolu bir kabın tabanına yapılan basınç, sıvının hangi yüksekliğine bağlıdır?", options: ["En üst yüzeyine olan dik uzaklığa (derinlik)", "Kabın genişliğine", "Sıvının hacmine", "Kabın duruş açısına"], correctAnswer: "En üst yüzeyine olan dik uzaklığa (derinlik)" },
      { id: "sq3", text: "Aynı derinlikteki su (d=1) ve zeytinyağının (d=0.9) kap tabanında oluşturduğu basınçlar hakkında hangisi doğrudur?", options: ["Basınçları eşittir.", "Suyun basıncı zeytinyağından büyüktür.", "Zeytinyağının basıncı daha büyüktür.", "Kapların hacmine bağlıdır."], correctAnswer: "Suyun basıncı zeytinyağından büyüktür." }
    ]
  },
  "Paragrafta Anlam": {
    summary: "Paragrafta anlam, okuduğunu anlama ve yorumlama becerisine dayanır. LGS Türkçe sınavının en büyük kısmını oluşturur.\n\nAna Fikir (Ana Düşünce): Yazarın okuyucuya vermek istediği temel mesajdır. Genellikle paragrafın son cümlelerinde vurgulanır.\n\nYardımcı Fikirler: Ana fikri destekleyen, açıklayan cümlelerdir. Soru köklerinde 'çıkarılamaz', 'değinilmemiştir' şeklinde sorulur.",
    videoUrl: "https://www.youtube.com/embed/demo3",
    questions: [
      { id: "pq1", text: "Bir metnin yazılış amacına ne denir?", options: ["Ana fikir / Ana düşünce", "Konu", "Yardımcı düşünce", "Başlık"], correctAnswer: "Ana fikir / Ana düşünce" },
      { id: "pq2", text: "Okuma yaparken odaklanmayı artırmak için hangisi uygulanmalıdır?", options: ["İç sesle heceleyerek okumak", "Gözle blok halinde okuma yapmak", "Sadece son paragrafa odaklanmak", "Hızlıca sayfaları atlamak"], correctAnswer: "Gözle blok halinde okuma yapmak" },
      { id: "pq3", text: "LGS paragraf sorularını çözerken ilk olarak hangisi okunmalıdır?", options: ["Paragraf metni", "Seçenekler", "Soru kökü", "Yazar adı"], correctAnswer: "Soru kökü" }
    ]
  },
  "Ondalık Gösterim": {
    summary: "Paydası 10, 100, 1000 gibi 10'un kuvvetleri olan kesirlerin virgül kullanılarak gösterilmesine ondalık gösterim denir. Örneğin: 3/10 = 0.3, 7/100 = 0.07, 125/1000 = 0.125.",
    videoUrl: "https://www.youtube.com/embed/demo4",
    questions: [
      { id: "oq1", text: "3/5 kesrinin ondalık gösterimi aşağıdakilerden hangisidir?", options: ["0.3", "0.5", "0.6", "1.5"], correctAnswer: "0.6" },
      { id: "oq2", text: "1.25 ondalık gösteriminin en sade kesir hali nedir?", options: ["125/10", "5/4", "1 25/10", "4/5"], correctAnswer: "5/4" },
      { id: "oq3", text: "0.08 kesir olarak yazıldığında paydası kaç olur?", options: ["8", "10", "100", "1000"], correctAnswer: "100" }
    ]
  },
  "Sütun Grafiği": {
    summary: "Verilerin dikey veya yatay sütunlar (çubuklar) halinde gösterilmesine sütun grafiği denir. Sütunların yükseklikleri (veya uzunlukları) verilerin sıklıklarını/değerlerini gösterir. Karşılaştırma yapmak için idealdir.",
    videoUrl: "https://www.youtube.com/embed/demo5",
    questions: [
      { id: "sg1", text: "Sütun grafikleri en çok hangi amaçla kullanılır?", options: ["Verileri karşılaştırmak ve grupları kıyaslamak", "Zaman içindeki sürekli değişimi göstermek", "Bir bütünün parçalarını oranlamak", "Verilerin coğrafi dağılımını göstermek"], correctAnswer: "Verileri karşılaştırmak ve grupları kıyaslamak" },
      { id: "sg2", text: "Grafikteki sütunların kalınlıkları hakkında hangisi doğrudur?", options: ["Sütun kalınlıkları farklı olmalıdır.", "Sütun kalınlıkları ve aralıkları eşit olmalıdır.", "Kalınlık değer miktarına göre değişir.", "Kalınlık önemsizdir."], correctAnswer: "Sütun kalınlıkları ve aralıkları eşit olmalıdır." },
      { id: "sg3", text: "Grafik yorumlanırken ilk olarak neye dikkat edilmelidir?", options: ["Sütunların renklerine", "Eksenlerin neyi temsil ettiğine ve birimlerine", "En son sütuna", "Sayfanın düzenine"], correctAnswer: "Eksenlerin neyi temsil ettiğine ve birimlerine" }
    ]
  },
  "Katı Basıncı": {
    summary: "Katıların uyguladığı basınç, katının ağırlığı (G) ile doğru orantılı, temas eden yüzey alanı (S) ile ters orantılıdır. Formül: P = G / S.",
    videoUrl: "https://www.youtube.com/embed/demo6",
    questions: [
      { id: "kb1", text: "Raptiyenin ucunun sivri yapılmasının sebebi nedir?", options: ["Ağırlığı azaltmak", "Temas alanını küçülterek basıncı artırmak", "Yüzey alanını büyüterek basıncı azaltmak", "Görünüşü güzelleştirmek"], correctAnswer: "Temas alanını küçülterek basıncı artırmak" },
      { id: "kb2", text: "Aynı ağırlıktaki iki çocuktan biri kumda botla, diğeri ise topuklu ayakkabıyla yürümektedir. Hangisinin kuma batma oranı daha fazladır?", options: ["Botlu olan çocuk", "Topuklu ayakkabılı olan çocuk", "Eşit batarlar", "Hacimlerine bağlıdır"], correctAnswer: "Topuklu ayakkabılı olan çocuk" },
      { id: "kb3", text: "Katı bir bloğun kum havuzuna temas eden yüzey alanı 2 katına çıkarılırsa kumdaki batma derinliği nasıl değişir?", options: ["Yarıya iner", "2 katına çıkar", "Değişmez", "Ağırlığa bağlı olarak artar"], correctAnswer: "Yarıya iner" }
    ]
  },
  "Gaz Basıncı": {
    summary: "Gazlar da sıvılar gibi ağırlıkları ve tanecik hareketleri nedeniyle temas ettikleri yüzeylere basınç uygular. Açık hava basıncı (atmosfer basıncı) Toriçelli deneyi ile ölçülmüştür. Toriçelli, deniz seviyesinde 0°C'ta açık hava basıncının 76 cm cıva basıncına eşit olduğunu bulmuştur.",
    videoUrl: "https://www.youtube.com/embed/demo7",
    questions: [
      { id: "gb1", text: "Açık hava basıncını ilk ölçen bilim insanı kimdir?", options: ["Pascal", "Newton", "Toriçelli", "Galileo"], correctAnswer: "Toriçelli" },
      { id: "gb2", text: "Deniz seviyesinden yukarılara çıkıldıkça açık hava basıncı nasıl değişir?", options: ["Artar", "Azalır", "Değişmez", "Önce artar sonra azalır"], correctAnswer: "Azalır" },
      { id: "gb3", text: "Vantuzların veya pipetlerin çalışmasını sağlayan temel fiziksel ilke nedir?", options: ["Sıvı kaldırma kuvveti", "İç ve dış basınç farkı", "Yerçekimi ivmesi", "Gazların genleşmesi"], correctAnswer: "İç ve dış basınç farkı" }
    ]
  },
  "Friendship": {
    summary: "LGS İngilizce 1. Ünite konusu olan 'Friendship' (Arkadaşlık) kelimeler ve kalıplar üzerine kuruludur. \n\nÖnemli Kalıplar:\n- Would you like to join us? (Bize katılmak ister misin?)\n- Accept (Kabul etmek): Yes, I'd love to.\n- Refuse (Reddetmek): I'm sorry, but I can't.\n- Apologize (Özür dilemek): I have another plan.",
    videoUrl: "https://www.youtube.com/embed/demo8",
    questions: [
      { id: "fq1", text: "Which adjective is positive for a friend?", options: ["Jealous", "Unreliable", "Supportive", "Stubborn"], correctAnswer: "Supportive" },
      { id: "fq2", text: "If you always tell the truth to your friends, you are a/an ______ person.", options: ["honest", "mean", "bad-temped", "sneaky"], correctAnswer: "honest" },
      { id: "fq3", text: "Complete: 'My best friend always back me up.' What does 'back up' mean?", options: ["argue", "support", "lie", "ignore"], correctAnswer: "support" }
    ]
  },
  "Geometrik Şekiller ve Çizimler": {
    summary: "Nokta, doğru, ışın, doğru parçası ve düzlem geometrinin temel elemanlarıdır.\n\n- Nokta: Boyutsuzdur, (.) ile gösterilir.\n- Doğru: İki ucu da sonsuza uzayan çizgidir.\n- Işın: Bir ucu sınırlı (başlangıç noktası), diğer ucu sonsuza uzayandır.\n- Doğru Parçası: İki ucu da sınırlı olan çizgi parçasıdır.\n- Dikme: Bir doğruya 90 derece açıyla çizilen çizgidir.",
    videoUrl: "https://www.youtube.com/embed/geo5_1",
    mebPageRange: "5. Sınıf 1. Kitap, Sayfa 17 - 38",
    questions: [
      { id: "g5q1", text: "Bir ucu kapalı, diğer ucu sonsuza uzayan geometrik çizim hangisidir?", options: ["Doğru", "Işın", "Doğru Parçası", "Açı"], correctAnswer: "Işın" },
      { id: "g5q2", text: "İki ucu da sınırlandırılmış olan düz çizgiye ne denir?", options: ["Işın", "Düzlem", "Doğru Parçası", "Doğru"], correctAnswer: "Doğru Parçası" },
      { id: "g5q3", text: "Bir doğruya çizilen ve 90 derecelik açı oluşturan doğruya ne ad verilir?", options: ["Kesen", "Paralel", "Dikme", "Teğet"], correctAnswer: "Dikme" }
    ]
  },
  "Açılar ve Doğrular": {
    summary: "Açılar ölçülerine göre dar, dik, geniş ve doğru açı olarak sınıflandırılır:\n\n- Dar Açı: Ölçüsü 0° ile 90° arasındadır.\n- Dik Açı: Ölçüsü tam 90°'dir.\n- Geniş Açı: Ölçüsü 90° ile 180° arasındadır.\n- Doğru Açı: Ölçüsü tam 180°'dir.\n- İki Doğru: Düzlemde paralel olabilir (hiç kesişmez), kesişebilir veya çakışık olabilir.",
    videoUrl: "https://www.youtube.com/embed/geo5_2",
    mebPageRange: "5. Sınıf 1. Kitap, Sayfa 39 - 56",
    questions: [
      { id: "a5q1", text: "Ölçüsü 115 derece olan bir açı hangi açı çeşidine girer?", options: ["Dik Açı", "Dar Açı", "Geniş Açı", "Doğru Açı"], correctAnswer: "Geniş Açı" },
      { id: "a5q2", text: "Düzlemde hiç kesişmeyen doğrulara ne ad verilir?", options: ["Dik Doğrular", "Paralel Doğrular", "Çakışık Doğrular", "Kesişen Doğrular"], correctAnswer: "Paralel Doğrular" },
      { id: "a5q3", text: "Ölçüsü tam olarak 180 derece olan açılara ne denir?", options: ["Geniş Açı", "Dar Açı", "Doğru Açı", "Tam Açı"], correctAnswer: "Doğru Açı" }
    ]
  },
  "Doğal Sayılar ve İşlemler": {
    summary: "Çok basamaklı doğal sayılar okunurken sağdan sola doğru üçerli gruplara ayrılır. Bu grupların her birine bölük denir (Birler, Binler, Milyonlar bölüğü vb.).\n\nÖrnek: 84 002 105 sayısı 'Seksen dört milyon iki bin yüz beş' şeklinde okunur. Sayıdaki her bir rakamın bulunduğu basamağa göre aldığı değere basamak değeri denir.",
    videoUrl: "https://www.youtube.com/embed/ds5_1",
    mebPageRange: "5. Sınıf 1. Kitap, Sayfa 94 - 137",
    questions: [
      { id: "d5q1", text: "12 005 080 sayısının doğru okunuşu hangisidir?", options: ["On iki milyon beş yüz seksen", "On iki milyon beş bin seksen", "On iki milyon elli bin seksen", "Yüz yirmi milyon beş bin seksen"], correctAnswer: "On iki milyon beş bin seksen" },
      { id: "d5q2", text: "34 509 120 sayısındaki '5' rakamının basamak değeri kaçtır?", options: ["500 000", "50 000", "5 000", "50"], correctAnswer: "500 000" },
      { id: "d5q3", text: "Birler bölüğü 405, binler bölüğü 12, milyonlar bölüğü 85 olan sayı hangisidir?", options: ["405 012 085", "85 405 012", "85 012 405", "12 085 405"], correctAnswer: "85 012 405" }
    ]
  },
  "Çevre ve Alan Ölçümü": {
    summary: "Dikdörtgenin çevre uzunluğu ve alan hesaplaması:\n\n- Çevre: Bütün kenarların uzunlukları toplamıdır. Formül: Ç = 2 x (a + b) [a: kısa kenar, b: uzun kenar]\n- Alan: Kısa ve uzun kenar uzunluklarının çarpımıdır. Formül: A = a x b\n\nÖnemli kural: Aynı alana sahip farklı dikdörtgenlerin kenar uzunlukları birbirine yaklaştıkça çevre uzunluğu küçülür.",
    videoUrl: "https://www.youtube.com/embed/alan5_1",
    mebPageRange: "5. Sınıf 1. Kitap, Sayfa 140 - 165",
    questions: [
      { id: "al5q1", text: "Uzun kenarı 10 cm, kısa kenarı 6 cm olan bir dikdörtgenin çevresi kaç cm'dir?", options: ["16", "32", "60", "40"], correctAnswer: "32" },
      { id: "al5q2", text: "Alanı 48 santimetrekare olan bir dikdörtgenin kenarları tam sayı ise çevresi en az kaç cm olabilir?", options: ["28", "32", "26", "22"], correctAnswer: "28" },
      { id: "al5q3", text: "Kenar uzunlukları 7 cm and 9 cm olan dikdörtgenin alanı kaç santimetrekaredir?", options: ["32", "63", "81", "49"], correctAnswer: "63" }
    ]
  },
  "Güneş, Dünya ve Ay": {
    summary: "Güneş, Dünya ve Ay'ın şekilleri küreye benzer. \n\n- Güneş: Orta büyüklükte bir yıldızdır, kendi ekseni etrafında döner.\n- Dünya: Güneş'in etrafında dolanır, kendi ekseni etrafında döner.\n- Ay: Dünya'nın tek doğal uydusudur. Kendi ekseninde döner, Dünya etrafında dolanır ve Dünya ile birlikte Güneş etrafında dolanır. Ay'ın hareketleri sonucu evreleri (Yeni Ay, İlk Dördün, Dolunay, Son Dördün) oluşur.",
    videoUrl: "https://www.youtube.com/embed/fen5_1",
    questions: [
      { id: "f5q1", text: "Güneş, Dünya ve Ay'ın ortak şekilsel özelliği hangisidir?", options: ["Düz olmaları", "Küre şeklinde olmaları", "Aynı boyutta olmaları", "Işık kaynağı olmaları"], correctAnswer: "Küre şeklinde olmaları" },
      { id: "f5q2", text: "Ay'ın gökyüzünde farklı şekillerde görünmesinin (evrelerinin) temel sebebi nedir?", options: ["Kendi etrafında çok hızlı dönmesi", "Dünya etrafındaki dolanma hareketi", "Güneş'in soğuması", "Dünya'nın gölgesinin her gün değişmesi"], correctAnswer: "Dünya etrafındaki dolanma hareketi" },
      { id: "f5q3", text: "Aşağıdakilerden hangisi Ay'ın ana evrelerinden biri değildir?", options: ["Yeni Ay", "Dolunay", "Hilal", "İlk Dördün"], correctAnswer: "Hilal" }
    ]
  },
  "Çarpanlar ve Katlar": {
    summary: "Bir doğal sayıyı kalansız bölebilen sayılara o sayının çarpanları (bölenleri) denir. 1'den büyük, sadece 1'e ve kendisine bölünebilen sayılara asal sayılar denir.\n\n- Bölünebilme Kuralları: 2 (son basamak çift), 3 (rakam toplamı 3'ün katı), 5 (sonu 0 veya 5), 9 (rakam toplamı 9'nun katı) vb.\n- Ortak Kat ve Bölen: İki veya daha fazla sayının ortak olan katları ile bölenleri problem çözümlerinde kullanılır.",
    videoUrl: "https://www.youtube.com/embed/mat6_1",
    mebPageRange: "6. Sınıf 1. Kitap, Sayfa 14 - 61",
    questions: [
      { id: "m6q1", text: "36 sayısının kaç tane pozitif tam sayı çarpanı vardır?", options: ["6", "8", "9", "10"], correctAnswer: "9" },
      { id: "m6q2", text: "Aşağıdakilerden hangisi bir asal sayıdır?", options: ["15", "21", "29", "33"], correctAnswer: "29" },
      { id: "m6q3", text: "Hem 3'e hem de 5'e kalansız bölünebilen en küçük iki basamaklı doğal sayı hangisidir?", options: ["15", "30", "45", "60"], correctAnswer: "15" }
    ]
  },
  "Araştırma Soruları ve Veri": {
    summary: "İstatistiksel araştırma süreci veri toplamayı gerektiren araştırma soruları ile başlar. Veriler sıklık tablosu, sütun grafiği veya daire grafiği ile gösterilir.\n\n- Aritmetik Ortalama: Verilerin toplamının veri sayısına bölünmesidir.\n- Açıklık: Veri grubundaki en büyük değer ile en küçük değer arasındaki farktır, verilerin ne kadar yayıldığını gösterir.",
    videoUrl: "https://www.youtube.com/embed/mat6_2",
    mebPageRange: "6. Sınıf 1. Kitap, Sayfa 62 - 120",
    questions: [
      { id: "m6q4", text: "Bir gruptaki verilerin toplamının veri sayısına bölünmesiyle hangisi elde edilir?", options: ["Açıklık", "Medyan", "Aritmetik Ortalama", "Mod"], correctAnswer: "Aritmetik Ortalama" },
      { id: "m6q5", text: "7, 12, 5, 23, 18 sayı grubunun açıklığı kaçtır?", options: ["18", "23", "5", "6"], correctAnswer: "18" },
      { id: "m6q6", text: "Aşağıdakilerden hangisi istatistiksel bir araştırma sorusudur?", options: ["Sınıf arkadaşlarınızın en sevdiği renk nedir?", "Türkiye'nin başkenti neresidir?", "En büyük asal sayı hangisidir?", "2 + 2 kaç eder?"], correctAnswer: "Sınıf arkadaşlarınızın en sevdiği renk nedir?" }
    ]
  },
  "Ondalık Gösterim ve Yuvarlama": {
    summary: "Paydası 10, 100, 1000 olan kesirlerin virgülle ifadesidir. Ondalık kısımda basamaklar: onda birler, yüzde birler ve binde birlerdir.\n\n- Yuvarlama: Yuvarlanacak basamağın sağındaki ilk rakam 5 veya 5'ten büyükse yuvarlanacak rakam 1 artırılır, küçükse aynen kalır ve sağındaki rakamlar sıfırlanır.",
    videoUrl: "https://www.youtube.com/embed/mat6_3",
    mebPageRange: "6. Sınıf 1. Kitap, Sayfa 121 - 192",
    questions: [
      { id: "m6q7", text: "3,485 ondalık gösteriminin yüzde birler basamağına göre yuvarlanmış hali nedir?", options: ["3,48", "3,49", "3,50", "3,40"], correctAnswer: "3,49" },
      { id: "m6q8", text: "12,704 sayısındaki '0' rakamının bulunduğu basamağın adı nedir?", options: ["Onda birler basamağı", "Yüzde birler basamağı", "Binde birler basamağı", "Birler basamağı"], correctAnswer: "Yüzde birler basamağı" },
      { id: "m6q9", text: "8 / 5 kesrinin ondalık gösterimi aşağıdakilerden hangisidir?", options: ["1,6", "1,8", "0,8", "1,5"], correctAnswer: "1,6" }
    ]
  },
  "Olasılık Tahmin Etme": {
    summary: "Bir deneyde elde edilebilecek her bir sonuca çıktı denir. Bir olayın gerçekleşme olasılığı tahmin edilirken gözlemlerden yararlanılır.\n\n- Olasılık Değeri: Her zaman 0 (İmkânsız) ile 1 (Kesin) arasındadır.\n- Eş Olasılıklı: Madeni paranın yazı veya tura gelmesi gibi eşit şansa sahip olaylardır.",
    videoUrl: "https://www.youtube.com/embed/mat6_4",
    mebPageRange: "6. Sınıf 1. Kitap, Sayfa 198 - 217",
    questions: [
      { id: "m6q10", text: "Bir zar atıldığında üst yüze gelen sayının 7 olması olayının olasılığı türü nedir?", options: ["Kesin Olay", "İmkânsız Olay", "Eş Olasılıklı Olay", "Daha Fazla Olasılıklı Olay"], correctAnswer: "İmkânsız Olay" },
      { id: "m6q11", text: "Havaya atılan hilesiz bir madeni paranın tura gelme olasılığı kaçtır?", options: ["1", "0", "1/2", "1/4"], correctAnswer: "1/2" }
    ]
  },
  "Açılar ve Dörtgenler": {
    summary: "İki paralel doğrunun bir kesenle oluşturduğu açılarda: yöndeş, iç ters ve dış ters açılar eştir. Üçgenin iç açılarının toplamı 180°'dir.\n\n- Yamuk, paralelkenar, eşkenar dörtgen, dikdörtgen ve karenin kenar, açı ve köşegen özellikleri bulunur. Örneğin, eşkenar dörtgende köşegenler dik kesişir ve birbirini ortalar.",
    videoUrl: "https://www.youtube.com/embed/mat6_5",
    mebPageRange: "6. Sınıf 2. Kitap, Sayfa 14 - 55",
    questions: [
      { id: "m6q12", text: "İki iç açısı 50° ve 70° olan bir üçgenin üçüncü iç açısı kaç derecedir?", options: ["50°", "60°", "70°", "80°"], correctAnswer: "60°" },
      { id: "m6q13", text: "Karşılıklı kenarları paralel ve tüm kenar uzunlukları eşit olan fakat açıları dik olmayan dörtgen hangisidir?", options: ["Kare", "Yamuk", "Eşkenar Dörtgen", "Dikdörtgen"], correctAnswer: "Eşkenar Dörtgen" }
    ]
  },
  "Cebirsel Düşünme ve Algoritma": {
    summary: "İçinde en az bir değişken (harf) ve bir işlem bulunan ifadelere cebirsel ifadeler denir (Örn: 3x + 5). Sayı örüntüleri cebirsel kurallarla ifade edilebilir (Örn: 4n - 1).\n\n- Algoritma: Bir problemin çözüm adımlarının mantıksal ve sıralı olarak tasarlanmasıdır.",
    videoUrl: "https://www.youtube.com/embed/mat6_6",
    mebPageRange: "6. Sınıf 2. Kitap, Sayfa 56 - 99",
    questions: [
      { id: "m6q14", text: "'Bir sayının 3 katının 5 fazlası' ifadesinin cebirsel gösterimi hangisidir?", options: ["3x - 5", "3(x + 5)", "3x + 5", "x/3 + 5"], correctAnswer: "3x + 5" },
      { id: "m6q15", text: "Kuralı 4n - 1 olan sayı örüntüsünün 5. terimi kaçtır?", options: ["19", "20", "21", "24"], correctAnswer: "19" }
    ]
  },
  "Paralelkenar, Üçgen ve Çember": {
    summary: "Geometrik alan ve uzunluk ölçüleri:\n\n- Paralelkenar Alanı: Taban uzunluğu x Yükseklik\n- Üçgen Alanı: (Taban uzunluğu x Yükseklik) / 2\n- Çember Çevresi: 2 x pi x r (r: yarıçap, pi: yaklaşık 3 veya 3.14). Çevre uzunluğunun çapa oranı pi sayısını verir.",
    videoUrl: "https://www.youtube.com/embed/mat6_7",
    mebPageRange: "6. Sınıf 2. Kitap, Sayfa 100 - 160",
    questions: [
      { id: "m6q16", text: "Tabanı 8 cm, yüksekliği 5 cm olan bir üçgenin alanı kaç santimetrekaredir?", options: ["40", "20", "15", "10"], correctAnswer: "20" },
      { id: "m6q17", text: "Yarıçapı 5 cm olan bir çemberin çevre uzunluğu kaç cm'dir? (pi = 3 alınız)", options: ["15", "30", "45", "60"], correctAnswer: "30" }
    ]
  },
  "Kesirler, Ondalık ve Yüzdeler": {
    summary: "Birim kesirler, tam sayılı ve bileşik kesirler. Kesirlerin sadeleştirilmesi, genişletilmesi ve sayı doğrusunda gösterimi.\n\n- Ondalık Gösterim: Paydası 10, 100, 1000 olan kesirlerin virgülle gösterilmesidir.\n- Yüzdeler: Paydası 100 olan kesirlerin '%' sembolü ile ifade edilmesidir. Karşılaştırmalar bu temsiller arasında dönüştürülerek yapılır.",
    videoUrl: "https://www.youtube.com/embed/demo_kesir5",
    mebPageRange: "5. Sınıf 2. Kitap, Sayfa 17 - 55",
    questions: [
      { id: "k5q1", text: "Payı 1 olan kesirlere ne ad verilir?", options: ["Birim Kesir", "Bileşik Kesir", "Tam Sayılı Kesir", "Denk Kesir"], correctAnswer: "Birim Kesir" },
      { id: "k5q2", text: "0,75 ondalık gösteriminin yüzde sembolü ile yazılışı hangisidir?", options: ["%7,5", "%0,75", "%75", "%750"], correctAnswer: "%75" }
    ]
  },
  "Araştırma Soruları ve Tablo/Grafik": {
    summary: "Veri analizinin ilk aşaması araştırma sorusu oluşturmaktır. Veriler anket veya gözlem yoluyla toplanır, sıklık tablosu ve sütun grafiği ile gösterilir.\n\n- Sütun Grafiği: Verilerin karşılaştırılmasını kolaylaştıran dikey/yatay sütunlardır.\n- Daire Grafiği: Verilerin bir bütün içindeki oranlarını dilimler halinde sunar.",
    videoUrl: "https://www.youtube.com/embed/demo_ist5",
    mebPageRange: "5. Sınıf 2. Kitap, Sayfa 58 - 110",
    questions: [
      { id: "k5q3", text: "Bir okuldaki öğrencilerin en sevdiği spor dalını araştırmak için en uygun yöntem hangisidir?", options: ["Tahmin etme", "Rastgele sayı seçme", "Anket uygulama ve veri toplama", "Rapor okuma"], correctAnswer: "Anket uygulama ve veri toplama" },
      { id: "k5q4", text: "Elde edilen verilerin dikey veya yatay sütunlar halinde gösterildiği grafiğe ne denir?", options: ["Daire Grafiği", "Sütun Grafiği", "Çizgi Grafiği", "Sıklık Tablosu"], correctAnswer: "Sütun Grafiği" }
    ]
  },
  "İşlem Önceliği ve Örüntüler": {
    summary: "İşlemlerde öncelik sırası: 1. Üslü İfadeler, 2. Parantez İçi, 3. Çarpma/Bölme, 4. Toplama/Çıkarma.\n\n- Sayı ve Şekil Örüntüleri: Belirli bir düzen veya kurala göre artan ya da azalan sayılar/şekillerdir. Kurallar adımlar arasındaki farklar bulunarak tespit edilir.",
    videoUrl: "https://www.youtube.com/embed/demo_alg5",
    mebPageRange: "5. Sınıf 2. Kitap, Sayfa 116 - 160",
    questions: [
      { id: "k5q5", text: "3 x (5 + 4) işleminin sonucu kaçtır?", options: ["27", "19", "12", "32"], correctAnswer: "27" },
      { id: "k5q6", text: "2, 5, 8, 11... şeklinde devam eden örüntünün kuralı nedir?", options: ["Rakamlar 2'şer artıyor", "Rakamlar 3'er artıyor", "Rakamlar 5'er artıyor", "Rakamlar 3'er azalıyor"], correctAnswer: "Rakamlar 3'er artıyor" }
    ]
  },
  "Olayların Olasılığı": {
    summary: "Bir olayın gerçekleşme şansının sayısal ifadesidir. Olasılık olasılık spektrumunda 0 (İmkânsız) ile 1 (Kesin) arasında yer alır.\n\n- Eş Olasılıklı: Yazı-tura gelmesi veya aynı sayıda renkli toplardan birinin çekilmesi gibi eşit şanslı olaylardır.",
    videoUrl: "https://www.youtube.com/embed/demo_olas5",
    mebPageRange: "5. Sınıf 2. Kitap, Sayfa 166 - 180",
    questions: [
      { id: "k5q7", text: "Hilesiz bir madeni para havaya atıldığında üst yüze yazı gelmesi olasılığı nedir?", options: ["Kesin Olay", "Eş Olasılıklı (1/2)", "İmkânsız Olay", "Daha Fazla Olasılıklı"], correctAnswer: "Eş Olasılıklı (1/2)" },
      { id: "k5q8", text: "Bir torbada 3 kırmızı ve 3 mavi top vardır. Rastgele çekilen bir topun kırmızı olma olasılığı ile mavi olma olasılığı için hangisi doğrudur?", options: ["Kırmızı olma olasılığı daha fazladır", "Mavi olma olasılığı daha fazladır", "Olasılıkları eşittir", "Kırmızı çekmek imkansızdır"], correctAnswer: "Olasılıkları eşittir" }
    ]
  }
};

interface StudentDashboardProps {
  username: string;
  onLogout: () => void;
}

export function StudentDashboard({ username, onLogout }: StudentDashboardProps) {
  const [activeTab, setActiveTab] = useState("home");
  const [masteryRecords, setMasteryRecords] = useState<Record<string, MasteryRecord>>(() => {
    const saved = localStorage.getItem("masteryRecords");
    return saved ? JSON.parse(saved) : {};
  });

  // Diagnostics state
  const [testMode, setTestMode] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [testAnswers, setTestAnswers] = useState<Record<string, string>>({});
  const [testQuestions, setTestQuestions] = useState<typeof demoQuestions>([]);

  // Study Plan Task Interface
  interface StudyTask {
    id: string;
    subject: string;
    topic: string;
    type: "lesson" | "activity" | "test";
    duration: number; // minutes
    completed: boolean;
    action: string;
    icon: string;
    externalLink?: string;
  }

  // Active study tasks state (shared with parent via localStorage)
  const [studyTasks, setStudyTasks] = useState<StudyTask[]>(() => {
    const saved = localStorage.getItem("student_study_plan_v1");
    if (saved) return JSON.parse(saved);
    return [
      { id: "task-1", subject: "Matematik (6. Sınıf)", topic: "Çarpanlar ve Katlar", type: "test", duration: 40, completed: false, action: "Çarpanlar ve Katlar Soru Çözümü", icon: "📐" },
      { id: "task-2", subject: "Fen Bilimleri", topic: "Sıvı Basıncı", type: "lesson", duration: 30, completed: false, action: "Sıvı Basıncı Deney Videosu ve Konu Anlatımı", icon: "🧪" },
      { id: "task-3", subject: "Türkçe", topic: "Paragrafta Anlam", type: "activity", duration: 20, completed: false, action: "LGS Metin Okuma Egzersizi", icon: "📖" },
      { id: "task-4", subject: "İngilizce", topic: "Friendship", type: "activity", duration: 15, completed: false, action: "LGS Kelime Kartları Tekrarı", icon: "🇬🇧" }
    ];
  });

  // Points tracking
  const [extraPoints, setExtraPoints] = useState<number>(() => {
    const saved = localStorage.getItem("student_extra_points");
    return saved ? parseInt(saved) : 0;
  });

  // Drag and Drop Index State
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // AI Planner / Checker States
  const [aiFeedback, setAiFeedback] = useState<{ text: string; type: "success" | "warning" | "info"; suggestions?: any } | null>(null);

  // Focused Study Workspace States
  const [activeStudyTask, setActiveStudyTask] = useState<StudyTask | null>(null);
  const [studySubTab, setStudySubTab] = useState<"summary" | "quiz" | "timer">("summary");
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [quizChecked, setQuizChecked] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  // Interactive Checklist State - Backwards compatibility fallback
  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    math: true,
    science: false,
    turkish: true,
    english: false,
  });

  // AI Routine Planner State
  const [availableHours, setAvailableHours] = useState("2");
  
  // Simple helper to detect student grade level based on username
  const getGradeLevel = (user: string): number => {
    const saved = localStorage.getItem("grade_level_" + user);
    if (saved) return parseInt(saved);
    const u = user.toLowerCase();
    if (u.includes("5") || u.includes("ezgi")) return 5;
    if (u.includes("6") || u.includes("can")) return 6;
    if (u.includes("7")) return 7;
    return 8; // Default to 8 (LGS)
  };

  const studentGrade = getGradeLevel(username);

  const subjectTopics: Record<string, string[]> = {
    "Matematik (6. Sınıf)": ["Çarpanlar ve Katlar", "Araştırma Soruları ve Veri", "Ondalık Gösterim ve Yuvarlama", "Olasılık Tahmin Etme", "Açılar ve Dörtgenler", "Cebirsel Düşünme ve Algoritma", "Paralelkenar, Üçgen ve Çember"],
    "Matematik (5. Sınıf)": ["Geometrik Şekiller ve Çizimler", "Açılar ve Doğrular", "Doğal Sayılar ve İşlemler", "Çevre ve Alan Ölçümü", "Kesirler, Ondalık ve Yüzdeler", "Araştırma Soruları ve Tablo/Grafik", "İşlem Önceliği ve Örüntüler", "Olayların Olasılığı"],
    "Fen Bilimleri": ["Katı Basıncı", "Sıvı Basıncı", "Gaz Basıncı"],
    "Fen Bilimleri (5. Sınıf)": ["Güneş, Dünya ve Ay", "Canlıların Çeşitliliği", "Kuvvetin Ölçülmesi"],
    Türkçe: ["Paragrafta Anlam", "Sözcükte Anlam", "Yazım Kuralları"],
    İngilizce: ["Friendship", "Teen Life"],
    "T.C. İnkılap Tarihi": ["Uyanan Avrupa", "Mustafa Kemal'in Çocukluğu"],
    "Din Kültürü": ["Kader ve Kaza", "İnsanın İradesi"],
    "Mola & Dinlenme": ["Zihin Dinlendirme"]
  };

  const filteredSubjectTopics = Object.keys(subjectTopics).reduce((acc, sub) => {
    const isRestricted = 
      (studentGrade === 5 && (sub.includes("6. Sınıf") || (sub !== "Matematik (5. Sınıf)" && sub !== "Fen Bilimleri (5. Sınıf)" && sub !== "Mola & Dinlenme"))) ||
      (studentGrade === 6 && (sub.includes("5. Sınıf") || (sub !== "Matematik (6. Sınıf)" && sub !== "Mola & Dinlenme"))) ||
      ((studentGrade === 7 || studentGrade === 8) && (sub.includes("5. Sınıf") || sub.includes("6. Sınıf")));

    if (!isRestricted) {
      acc[sub] = subjectTopics[sub];
    }
    return acc;
  }, {} as Record<string, string[]>);

  const [newSubject, setNewSubject] = useState(() => {
    return Object.keys(filteredSubjectTopics)[0] || "Matematik";
  });
  const [newTopic, setNewTopic] = useState(() => {
    const firstSub = Object.keys(filteredSubjectTopics)[0];
    return firstSub ? filteredSubjectTopics[firstSub][0] : "";
  });
  const [newDuration, setNewDuration] = useState("30");
  const [newAction, setNewAction] = useState("");
  const [newType, setNewType] = useState<"lesson" | "activity" | "test">("lesson");
  const [newExternalLink, setNewExternalLink] = useState("");
  const [newLinkPreset, setNewLinkPreset] = useState("");

  const [routineResult, setRoutineResult] = useState<Array<{ subject: string; topic: string; duration: number; action: string }>>([
    { subject: "Matematik", topic: "Çarpanlar ve Katlar", duration: 50, action: "Konu Pekiştirme Soruları" },
    { subject: "Fen Bilimleri", topic: "Sıvı Basıncı", duration: 40, action: "Deney Temelli Video Anlatım" },
    { subject: "Türkçe", topic: "Paragrafta Anlam", duration: 30, action: "Okuma Hızı Egzersizi" }
  ]);

  // Flashcards state
  const [flashcardOpen, setFlashcardOpen] = useState(false);
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [flashcardFlipped, setFlashcardFlipped] = useState(false);

  // Video state
  const [videoOpen, setVideoOpen] = useState(false);
  const [videoTitle, setVideoTitle] = useState("");

  // Chat state
  const [chatMessages, setChatMessages] = useState<Array<{ sender: "ai" | "student"; text: string }>>([
    { sender: "ai", text: "Merhaba! Bugün ders çalışmak için ne kadar vaktin var? Süreni girerek sana özel LGS hazırlık rutini oluşturabilirsin! 👇" }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Theme state
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  // Sync tasks to localstorage
  useEffect(() => {
    localStorage.setItem("student_study_plan_v1", JSON.stringify(studyTasks));
  }, [studyTasks]);

  useEffect(() => {
    localStorage.setItem("masteryRecords", JSON.stringify(masteryRecords));
  }, [masteryRecords]);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // Pomodoro countdown timer logic
  useEffect(() => {
    let interval: any = null;
    if (timerActive && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && timerActive) {
      setTimerActive(false);
      if (activeStudyTask) {
        handleCompleteTask(activeStudyTask.id);
        alert(`Tebrikler! ${activeStudyTask.subject} - ${activeStudyTask.topic} çalışmasını başarıyla tamamladın! Planına check işareti eklendi ve +100 XP kazandın.`);
      }
    }
    return () => clearInterval(interval);
  }, [timerActive, timerSeconds]);

  // Flashcards deck
  const flashcardsDeck = [
    { q: "Katıların basıncı yüzey alanı ile ters orantılı mıdır?", a: "Evet! Yüzey alanı küçüldükçe, katının uyguladığı basınç artar (Örn: Çivinin ucu)." },
    { q: "Sıvıların basıncı nelere bağlıdır?", a: "Sıvının derinliğine (h) ve yoğunluğuna (d) bağlıdır. Derinlik arttıkça sıvı basıncı artar." },
    { q: "Pascal Prensibi nedir?", a: "Kapalı kaplardaki sıvıların, üzerlerine uygulanan basıncı her yöne aynen iletmesi prensibidir (Örn: Hidrolik frenler)." },
    { q: "Açık hava basıncı hangi deney ile ispatlanmıştır?", a: "Toriçelli Deneyi ile. Cıva dolu boru kullanılarak açık hava basıncı 76 cmHg olarak ölçülmüştür." }
  ];

  // Dynamic calculations
  const totalCompletedTasks = studyTasks.filter(t => t.completed).length;
  const totalTasks = studyTasks.length;
  const progressPercent = totalTasks > 0 ? Math.round((totalCompletedTasks / totalTasks) * 100) : 0;

  const completedOutcomesCount = Object.values(masteryRecords).filter(r => r.status === "iyi" || r.status === "tam").length;
  const totalOutcomesCount = demoOutcomes.length;
  const targetPercent = totalOutcomesCount > 0 ? Math.round((completedOutcomesCount / totalOutcomesCount) * 100) : 0;

  const totalPoints = 800 + Object.keys(masteryRecords).length * 150 + extraPoints;
  const studentLevel = Math.floor(totalPoints / 250) + 1;

  // Complete a task and award points
  const handleCompleteTask = (taskId: string) => {
    setStudyTasks(prev => prev.map(t => {
      if (t.id === taskId && !t.completed) {
        const newExtra = extraPoints + 100;
        setExtraPoints(newExtra);
        localStorage.setItem("student_extra_points", newExtra.toString());
        return { ...t, completed: true };
      }
      return t;
    }));
  };

  // Toggle checklist check
  const handleToggleTask = (taskId: string) => {
    setStudyTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const nextState = !t.completed;
        if (nextState) {
          const newExtra = extraPoints + 100;
          setExtraPoints(newExtra);
          localStorage.setItem("student_extra_points", newExtra.toString());
        } else {
          const newExtra = Math.max(0, extraPoints - 100);
          setExtraPoints(newExtra);
          localStorage.setItem("student_extra_points", newExtra.toString());
        }
        return { ...t, completed: nextState };
      }
      return t;
    }));
  };

  // HTML5 Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) return;

    const list = [...studyTasks];
    const draggedItem = list[draggedIndex];
    list.splice(draggedIndex, 1);
    list.splice(targetIndex, 0, draggedItem);

    setStudyTasks(list);
    setDraggedIndex(null);
  };

  // Generate study routine based on available duration
  function generateStudyRoutine() {
    const minutes = parseFloat(availableHours) * 60;
    if (isNaN(minutes) || minutes <= 0) {
      alert("Lütfen geçerli bir çalışma süresi girin.");
      return;
    }

    // Sort outcomes by lowest mastery level (weakest topics first)
    const outcomesWithRecords = demoOutcomes.map(outcome => {
      const record = masteryRecords[outcome.id];
      return { outcome, level: record ? record.level : 50 }; // default 50
    }).sort((a, b) => a.level - b.level);

    // Pick top 3 weakest outcomes and allocate time
    const generated = [];
    const subjects = ["Matematik", "Fen Bilimleri", "Türkçe"];
    const actions = ["Kazanım Tarama Soru Çözümü", "Video Dersi & Analoji Tekrarı", "Özet Okuma ve Flashcard"];

    const segments = 3;
    const segmentDuration = Math.round(minutes / segments);

    for (let i = 0; i < segments; i++) {
      const item = outcomesWithRecords[i % outcomesWithRecords.length];
      const topic = demoTopics.find(t => t.id === item.outcome.topicId);
      
      generated.push({
        subject: subjects[i],
        topic: topic ? topic.name : "Genel LGS",
        duration: segmentDuration,
        action: actions[i]
      });
    }

    setRoutineResult(generated);
    alert("Yapay Zeka zayıf olduğunuz kazanımları tarayarak yeni ders çalışma rutininizi oluşturdu!");
  }

  // Generate complete AI Plan and save
  const generateAiPlan = () => {
    const aiPlan: StudyTask[] = [
      {
        id: "ai-task-1",
        subject: "Matematik",
        topic: "Kesirler",
        type: "test",
        duration: 35,
        completed: false,
        action: "Kesirlerle Bölme ve Çarpma Kazanım Testi",
        icon: "📐"
      },
      {
        id: "ai-task-2",
        subject: "Fen Bilimleri",
        topic: "Sıvı Basıncı",
        type: "lesson",
        duration: 30,
        completed: false,
        action: "Sıvı Basıncı Formül Mantığı ve Video Dersi",
        icon: "🧪"
      },
      {
        id: "ai-task-3",
        subject: "Türkçe",
        topic: "Paragrafta Anlam",
        type: "activity",
        duration: 20,
        completed: false,
        action: "Hızlı Paragraf Okuma ve Odaklanma Egzersizi",
        icon: "📖"
      },
      {
        id: "ai-task-4",
        subject: "İngilizce",
        topic: "Friendship",
        type: "activity",
        duration: 20,
        completed: false,
        action: "Friendship Ünitesi Kelime Eşleştirme Kartları",
        icon: "🇬🇧"
      }
    ];

    setStudyTasks(aiPlan);
    setAiFeedback({
      text: "AI Koçunuz, gelişim karnenizdeki zayıf noktaları (Sıvı Basıncı ve Kesir İşlemleri) analiz ederek sizin için en verimli dengeli LGS programını oluşturdu ve kaydetti.",
      type: "success"
    });
  };

  // AI Plan Checker
  const checkPlanWithAi = () => {
    const totalDuration = studyTasks.reduce((sum, t) => sum + t.duration, 0);
    const hasMath = studyTasks.some(t => t.subject === "Matematik");
    const hasScience = studyTasks.some(t => t.subject === "Fen Bilimleri");
    
    let responseText = "";
    let feedbackType: "success" | "warning" | "info" = "success";
    let suggestions = null;

    if (studyTasks.length === 0) {
      responseText = "Gözlem: Bugün için henüz bir çalışma planı oluşturmadınız.\nAnlamlandırma: Plansızlık çalışma motivasyonunu düşürebilir ve odaklanmayı zorlaştırabilir.\nYapıcı Öneri: 'AI Benim Adıma Plan Oluştursun' seçeneğini deneyebilir ya da listeden ders ekleyebilirsiniz.\nGüçlü Yön: Kendi planınızı yapmak için kontrol mekanizmasını çalıştırmanız harika bir adım.";
      feedbackType = "info";
    } else if (totalDuration > 180) {
      responseText = `Gözlem: Bugün için planlanan toplam süre ${totalDuration} dakika (3 saatten fazla).\nAnlamlandırma: Çok uzun süre kesintisiz çalışmak aşırı yorgunluğa ve odaklanma kaybına sebep olabilir.\nYapıcı Öneri: Planı 120-150 dakikaya indirip derslerin arasına 10-15 dakikalık dinlenme etkinlikleri eklemeniz daha verimli olacaktır.\nGüçlü Yön: Yüksek çalışma motivasyonunuz ve azminiz harika bir gelişim göstergesi.`;
      feedbackType = "warning";
      suggestions = { action: "reduce_time", text: "Çalışma sürelerini kısalt ve aralara mola ekle." };
    } else if (!hasScience) {
      responseText = "Gözlem: Bugünkü planda Fen Bilimleri dersine yer verilmemiş.\nAnlamlandırma: Kazanım karnenizde Fen Bilimleri 'Sıvı Basıncı' konusunun desteklenmesi gerektiği görülüyor. Bu konunun ertelenmesi sınav başarısını etkileyebilir.\nYapıcı Öneri: Planda İngilizce süresini biraz azaltıp Fen Bilimleri için 25 dakikalık bir 'Video Anlatım İzleme' eklemenizi öneririm.\nGüçlü Yön: Planı kendinizin tasarlamış olması bağımsız çalışma becerinizin güçlü olduğunu gösteriyor.";
      feedbackType = "warning";
      suggestions = {
        action: "add_science",
        text: "Fen Bilimleri - Sıvı Basıncı (25 dk) Ekle",
        task: {
          id: "task-science-added",
          subject: "Fen Bilimleri",
          topic: "Sıvı Basıncı",
          type: "lesson",
          duration: 25,
          completed: false,
          action: "Sıvı Basıncı Konu Anlatımı Video Takibi",
          icon: "🧪"
        }
      };
    } else {
      responseText = "Gözlem: Bugünkü planınız ders dağılımı ve toplam çalışma süresi açısından son derece dengeli.\nAnlamlandırma: Hem pratik soru çözümü hem de konu tekrarı içeriyor, bu da uzun vadeli hafızayı destekler.\nYapıcı Öneri: Bu sırayı takip ederek her konudan sonra 5 dakika gözlerinizi dinlendirin.\nGüçlü Yön: Planlama disiplininiz LGS başarınızı doğrudan destekleyecek seviyede.";
      feedbackType = "success";
    }

    setAiFeedback({ text: responseText, type: feedbackType, suggestions });
  };

  const applyAiSuggestion = () => {
    if (!aiFeedback || !aiFeedback.suggestions) return;
    const { action, task } = aiFeedback.suggestions;

    if (action === "add_science" && task) {
      setStudyTasks(prev => [...prev, task]);
      setAiFeedback({
        text: "Fen Bilimleri görevi planınıza başarıyla eklendi! Planınız şimdi pedagojik olarak optimize edildi.",
        type: "success"
      });
    } else if (action === "reduce_time") {
      const reduced = studyTasks.map(t => ({
        ...t,
        duration: Math.round(t.duration * 0.8)
      }));
      reduced.push({
        id: "task-break",
        subject: "Mola & Dinlenme",
        topic: "Zihin Dinlendirme",
        type: "activity",
        duration: 15,
        completed: false,
        action: "Gözleri dinlendirme ve esneme hareketleri",
        icon: "☕"
      });
      setStudyTasks(reduced);
      setAiFeedback({
        text: "Süreler dengelendi ve zihin dinlendirme molası eklendi! Planınız optimize edildi.",
        type: "success"
      });
    }
  };

  // Launch test
  function startDiagnosticTest() {
    const selected = demoOutcomes.map((outcome) => {
      const pool = demoQuestions.filter((q) => q.outcomeId === outcome.id);
      return pool[0];
    });
    setTestQuestions(selected);
    setTestAnswers({});
    setCurrentQuestionIndex(0);
    setTestMode(true);
  }

  function handleSelectAnswer(option: string) {
    const currentQ = testQuestions[currentQuestionIndex];
    setTestAnswers(prev => ({ ...prev, [currentQ.id]: option }));
  }

  function handleNextQuestion() {
    if (currentQuestionIndex < testQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      const evaluated = evaluateAnswers(testQuestions, testAnswers);
      const updated = updateMasteryFromAnswers(
        masteryRecords,
        evaluated,
        demoQuestions,
        username
      );
      setMasteryRecords(updated);
      setTestMode(false);
      setActiveTab("home");
      alert(`Tebrikler! Test başarıyla tamamlandı. Kazanım skorunuz: %${scorePercentage(evaluated)}`);
    }
  }

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAction.trim()) {
      alert("Lütfen yapılacak çalışmayı yazın.");
      return;
    }
    const icons: Record<string, string> = {
      Matematik: "📐",
      "Matematik (5. Sınıf)": "📐",
      "Matematik (6. Sınıf)": "📐",
      "Fen Bilimleri": "🧪",
      "Fen Bilimleri (5. Sınıf)": "🧪",
      Türkçe: "📖",
      İngilizce: "🇬🇧",
      "T.C. İnkılap Tarihi": "🕌",
      "Din Kültürü": "🌙",
      "Mola & Dinlenme": "☕"
    };
    const newTask: StudyTask = {
      id: "task-" + Date.now(),
      subject: newSubject,
      topic: newTopic,
      type: newType,
      duration: parseInt(newDuration) || 30,
      completed: false,
      action: newAction,
      icon: icons[newSubject] || "📚",
      externalLink: newExternalLink.trim() || undefined
    };

    setStudyTasks(prev => [...prev, newTask]);
    setNewAction("");
    setNewExternalLink("");
    setNewLinkPreset("");
    setAiFeedback(null); // Reset feedback
  };

  const handleDeleteTask = (taskId: string) => {
    setStudyTasks(prev => prev.filter(t => t.id !== taskId));
    setAiFeedback(null); // Reset feedback
  };

  const handleStartStudy = (task: any) => {
    setActiveStudyTask(task);
    setStudySubTab("summary");
    setTimerSeconds(task.duration * 60);
    setTimerActive(false);
    setQuizAnswers({});
    setQuizChecked(false);
    setQuizScore(null);
  };

  const handleQuizAnswerSelect = (questionId: string, option: string) => {
    if (quizChecked) return; // locked after checking
    setQuizAnswers(prev => ({ ...prev, [questionId]: option }));
  };

  const handleQuizSubmit = () => {
    if (!activeStudyTask) return;
    const content = studyContentDb[activeStudyTask.topic];
    if (!content) return;

    let correctCount = 0;
    content.questions.forEach(q => {
      if (quizAnswers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });

    setQuizScore(correctCount);
    setQuizChecked(true);

    if (correctCount === content.questions.length) {
      handleCompleteTask(activeStudyTask.id);
      const newExtra = extraPoints + 150;
      setExtraPoints(newExtra);
      localStorage.setItem("student_extra_points", newExtra.toString());
    }
  };

  function handleChecklistToggle(subject: string) {
    setChecklist(prev => ({ ...prev, [subject]: !prev[subject] }));
  }

  function handleSendChatMessage() {
    if (!chatInput.trim()) return;
    const studentText = chatInput;
    setChatMessages(prev => [...prev, { sender: "student", text: studentText }]);
    setChatInput("");
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      
      const textLower = studentText.toLowerCase();
      const studentName = username === "lgs_arda" ? "Arda" : username;
      
      // Filter outcomes corresponding to the student's grade level
      const relatedOutcomes = demoOutcomes.filter(lo => {
        if (studentGrade === 5) return lo.subjectId === "sub_mat5";
        if (studentGrade === 6) return lo.subjectId === "sub_mat6";
        return lo.subjectId === "sub_mat6"; // Default fallback
      });
      
      let weakOutcome = null;
      let unattemptedOutcome = null;
      
      for (const lo of relatedOutcomes) {
        const record = masteryRecords[lo.id];
        if (record) {
          if (record.level < 75) {
            weakOutcome = lo;
            break;
          }
        } else {
          if (!unattemptedOutcome) {
            unattemptedOutcome = lo;
          }
        }
      }
      
      const targetOutcome = weakOutcome || unattemptedOutcome || relatedOutcomes[0];
      const targetTopic = demoTopics.find(t => t.id === targetOutcome?.topicId);
      const topicName = targetTopic ? targetTopic.name : "Geometrik Şekiller";
      const pageRange = studyContentDb[topicName]?.mebPageRange || "ilgili sayfalardan";

      let response = `Sevgili ${studentName}, LGS ve okul dersleri planlaman için harika bir soru! Kendini geliştirmek istediğin konuları her zaman benimle paylaşabilirsin. Eksiklerini kapatmak için konu özetlerini okuyup mini pratik testleri çözmeye devam etmelisin.`;
      
      if (textLower.includes("eksik") || textLower.includes("zayıf") || textLower.includes("ne çalış") || textLower.includes("konu") || textLower.includes("bugün") || textLower.includes("hata") || textLower.includes("tamamla")) {
        if (weakOutcome) {
          response = `Merhaba ${studentName}! Gelişim verilerini incelediğimde, Matematik dersinde "${topicName}" konusunda çözdüğümüz mini testlerde başarı oranımızın henüz %${masteryRecords[weakOutcome.id].level} seviyesinde olduğunu gözlemledim. Bu konunun formülleri ve mantığı başlangıçta biraz karmaşık gelebilir, bu çok doğaldır. Bugün ders çalışma planına bu konudan 25 dakikalık bir 'Konu Anlatımı' görevi ekleyebiliriz. Ayrıca ders kitabının "${pageRange}" sayfaları arasındaki etkinlikleri incelemek sana çok iyi gelecektir. Düzenli çalışma disiplinin sayesinde bu konudaki eksikleri hızla kapatacağından hiç şüphem yok!`;
        } else if (unattemptedOutcome) {
          response = `Merhaba ${studentName}! Güncel müfredat ilerlemeni incelediğimde, Matematik dersinde "${topicName}" konusuna ait kazanım tarama testlerini henüz tamamlamadığını gözlemledim. Yeni müfredat Maarif Modeli çerçevesinde bu konu sıradaki hedeflerimiz arasında kritik bir yer tutuyor. Bugün ders çalışma planına bu konudan 20 dakikalık bir 'Konu Çalışması' ekleyerek ilk adımı atabiliriz. Dilersen kitabının "${pageRange}" sayfaları arasındaki konu özetine de göz atabilirsin. Öğrenme heyecanının ve gayretinin bu konuyu da başarıyla tamamlamanı sağlayacağından eminim!`;
        } else {
          response = `Tebrikler ${studentName}! Kayıtlı olduğun Matematik (${studentGrade}. Sınıf) müfredatındaki tüm kazanımları başarıyla tamamlamış ve yüksek seviyede pekiştirmiş görünüyorsun. Gözlemlerim, çalışma disiplininin mükemmel seviyede olduğunu gösteriyor. Bugün genel tekrar yapmak adına en çok keyif aldığın bir konudan soru çözümü yapabilir veya zihnini dinlendirmek için planına mola ekleyebilirsin. Başarın daim olsun!`;
        }
      } else if (textLower.includes("puan") || textLower.includes("seviye") || textLower.includes("xp")) {
        response = `Sevgili ${studentName}, şu anda sistemde toplam **${totalPoints} XP** puana sahipsin ve **Seviye ${studentLevel}** düzeyindesin. Bu puanlar senin gayretinin ve düzenli ders çalışma çabalarının somut bir göstergesidir. Tamamladığın her görev ve test sana yeni puanlar kazandırmaya devam edecek!`;
      } else if (textLower.includes("merhaba") || textLower.includes("selam") || textLower.includes("hey")) {
        response = `Merhaba ${studentName}! ${studentGrade}. Sınıf eğitim yolculuğunda sana rehberlik etmek için buradayım. Bugün çalışma planımızı düzenlemek, ders eksiklerini belirlemek veya dersler hakkında soru sormak için bana yazabilirsin. Bugün ne üzerinde çalışalım?`;
      } else if (textLower.includes("matematik") || textLower.includes("soru")) {
        response = `${studentGrade}. Sınıf Matematik dersinde "${topicName}" konusu üzerinde durmanı öneririm. Bu konuya ders kitabının "${pageRange}" sayfalarından çalışıp mini pratik testleri çözerek eksiklerini kolayca kapatabilirsin.`;
      } else if (textLower.includes("fen") || textLower.includes("basınç")) {
        response = `Fen Bilimleri dersinde Basınç konusu (özellikle Katı ve Sıvı basıncı) LGS hazırlığında çok önemlidir. Sıvı basıncında derinlik ve yoğunluk arttıkça basıncın arttığını unutmamalısın.`;
      } else if (textLower.includes("zor") || textLower.includes("stres") || textLower.includes("yorgun")) {
        response = `Eğitim yolculuğunda zaman zaman yorgun hissetmen veya kaygılanman son derece normaldir. Bu durumlarda çalışma planına mutlaka 'Zihin Dinlendirme' molaları eklemeni ve günde en az 8 saat uyumanı tavsiye ederim. Sen elinden gelenin en iyisini yapıyorsun ve ben seninle gurur duyuyorum!`;
      }
      
      setChatMessages(prev => [...prev, { sender: "ai", text: response }]);
    }, 1000);
  }

  return (
    <div className="app-container">
      {/* LEFT SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon">✨</div>
          <div className="logo-text">
            <h1>EduMentor AI</h1>
            <span>Akıllı Öğrenme Koçun</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <a onClick={() => { setTestMode(false); setActiveTab("home"); }} className={`nav-item ${activeTab === "home" && !testMode ? "active" : ""}`}>
            <span className="icon">🏠</span> Ana Sayfa
          </a>
          <a onClick={() => { setTestMode(false); setActiveTab("study-plan"); }} className={`nav-item ${activeTab === "study-plan" ? "active" : ""}`}>
            <span className="icon">📅</span> Çalışma Planım
          </a>
          <a onClick={() => { setTestMode(false); setActiveTab("study-room"); }} className={`nav-item ${activeTab === "study-room" ? "active" : ""}`}>
            <span className="icon">📖</span> Ders Çalış (Oda)
          </a>
          <a onClick={() => { setTestMode(false); setActiveTab("ai-routine"); }} className={`nav-item ${activeTab === "ai-routine" ? "active" : ""}`}>
            <span className="icon">⏱️</span> AI Rutinim
          </a>
          <a onClick={() => { startDiagnosticTest(); }} className={`nav-item ${testMode ? "active" : ""}`}>
            <span className="icon">✏️</span> Diagnostik Test
          </a>
          <a onClick={() => { setTestMode(false); setActiveTab("exams"); }} className={`nav-item ${activeTab === "exams" ? "active" : ""}`}>
            <span className="icon">📈</span> Denemelerim
          </a>
          <a onClick={() => { setTestMode(false); setActiveTab("ai-coach"); }} className={`nav-item ${activeTab === "ai-coach" ? "active" : ""}`}>
            <span className="icon">🤖</span> AI Koçum <span className="badge">Yeni</span>
          </a>
          <a onClick={() => { setTestMode(false); setActiveTab("reports"); }} className={`nav-item ${activeTab === "reports" ? "active" : ""}`}>
            <span className="icon">📊</span> Raporlarım
          </a>
        </nav>

        <div className="profile-sidebar-card">
          <div className="profile-user">
            <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80" alt="Student Profile" />
            <div className="profile-user-info">
              <h3>{username === "lgs_arda" ? "Arda Yılmaz" : username}</h3>
              <span>{studentGrade}. Sınıf Öğrencisi</span>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
            <div className="profile-points-badge">{totalPoints} Puan</div>
            <span style={{ fontSize: "0.72rem", fontWeight: 800, color: "rgba(255,255,255,0.95)" }}>Seviye {studentLevel}</span>
          </div>
          <div className="profile-level">
            <span>{studentGrade === 8 ? "Hedef: LGS 2026" : `Hedef: ${studentGrade}. Sınıf Başarısı`}</span>
            <a href="#" onClick={(e) => { e.preventDefault(); onLogout(); }}>Çıkış Yap</a>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">
        {/* HEADER */}
        <div className="top-header">
          <div className="top-header-welcome">
            <h2>Merhaba {username === "lgs_arda" ? "Arda" : username}! 👋</h2>
            <p>Bugün harika bir gün, hedeflerine bir adım daha yaklaş!</p>
          </div>
          <div className="top-header-stats">
            <div className="top-stat-item streak">🔥 7 Günlük Seri</div>
            <div className="top-stat-item target">🎯 {targetPercent}% Hedefe Ulaşma</div>
            <button className="notification-bell-btn" onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? "☀️" : "🌙"}
            </button>
          </div>
        </div>

        {/* DIAGNOSTIC TEST MODE PANEL */}
        {testMode ? (
          <div className="card">
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <span className="progress-label">Soru {currentQuestionIndex + 1} / {testQuestions.length}</span>
              <button className="btn-solve" onClick={() => setTestMode(false)} style={{ background: "var(--danger)" }}>Testten Çık</button>
            </div>
            {testQuestions[currentQuestionIndex] ? (
              <div>
                <h2 style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: 20 }}>
                  {testQuestions[currentQuestionIndex].text}
                </h2>
                <div className="options">
                  {testQuestions[currentQuestionIndex].options.map((opt) => (
                    <button
                      key={opt}
                      className={testAnswers[testQuestions[currentQuestionIndex].id] === opt ? "option selected" : "option"}
                      onClick={() => handleSelectAnswer(opt)}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                <button
                  className="primary"
                  disabled={!testAnswers[testQuestions[currentQuestionIndex].id]}
                  onClick={handleNextQuestion}
                  style={{ padding: "12px", borderRadius: "8px" }}
                >
                  {currentQuestionIndex < testQuestions.length - 1 ? "Sonraki Soru" : "Testi Tamamla"}
                </button>
              </div>
            ) : (
              <p>Soru bulunamadı.</p>
            )}
          </div>
        ) : (
          /* TAB PANELS */
          <>
            {/* PANEL: HOME */}
            {activeTab === "home" && (
              <div className="dashboard-home-grid">
                <div>
                  {/* AI COACH WIDGET */}
                  <div className="dashboard-card ai-coach-card-layout">
                    <div className="ai-avatar-wrap">🤖</div>
                    <div className="ai-speech-bubble-wrap">
                      <h4 style={{ margin: "0 0 8px 0", fontSize: "0.8rem", color: "var(--primary)", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 800 }}>Akıllı Yapay Zeka Koçun</h4>
                      <div className="ai-speech-bubble">
                        Matematikte üslü sayılar ve çarpanlar konularında kendini oldukça geliştirmişsin! Fen bilimlerinde basınç konusuna çalışarak hedeflerini tamamlayabilirsin.
                      </div>
                      <div className="ai-coach-actions">
                        <button className="btn-card-primary" onClick={() => setActiveTab("study-plan")}>Bugünkü Planın</button>
                        <button className="btn-card-secondary" onClick={() => setActiveTab("ai-coach")}>Koçumla Sohbet Et</button>
                      </div>
                    </div>
                  </div>

                  {/* INTERACTIVE CHECKLIST */}
                  <div className="dashboard-card">
                    <h3>Bugünkü Çalışma Planım</h3>
                    <div className="today-plan-list">
                      <div className={`today-plan-item ${checklist.math ? "completed" : ""}`} onClick={() => handleChecklistToggle("math")}>
                        <div className="plan-item-left">
                          <div className="plan-item-icon-box">📐</div>
                          <div className="plan-item-info">
                            <h4>Matematik</h4>
                            <p>Çarpanlar ve Katlar - 20 Soru Çözümü</p>
                          </div>
                        </div>
                        <div className="plan-item-status"></div>
                      </div>

                      <div className={`today-plan-item ${checklist.science ? "completed" : ""}`} onClick={() => handleChecklistToggle("science")}>
                        <div className="plan-item-left">
                          <div className="plan-item-icon-box">🧪</div>
                          <div className="plan-item-info">
                            <h4>Fen Bilimleri</h4>
                            <p>Basınç - Konu Anlatımı Video Takibi</p>
                          </div>
                        </div>
                        <div className="plan-item-status"></div>
                      </div>

                      <div className={`today-plan-item ${checklist.turkish ? "completed" : ""}`} onClick={() => handleChecklistToggle("turkish")}>
                        <div className="plan-item-left">
                          <div className="plan-item-icon-box">📖</div>
                          <div className="plan-item-info">
                            <h4>Türkçe</h4>
                            <p>Paragrafta Anlam - 10 Paragraf Sorusu</p>
                          </div>
                        </div>
                        <div className="plan-item-status"></div>
                      </div>

                      <div className={`today-plan-item ${checklist.english ? "completed" : ""}`} onClick={() => handleChecklistToggle("english")}>
                        <div className="plan-item-left">
                          <div className="plan-item-icon-box">🅰️</div>
                          <div className="plan-item-info">
                            <h4>İngilizce</h4>
                            <p>LGS Kelime Kartları Ezber Çalışması</p>
                          </div>
                        </div>
                        <div className="plan-item-status"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  {/* CIRCULAR PROGRESS */}
                  <div className="dashboard-card">
                    <h3>Günlük İlerleme</h3>
                    <div className="daily-progress-row">
                      <div className="progress-circle-wrap">
                        <svg width="100" height="100" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="40" fill="transparent" stroke="var(--border-light)" strokeWidth="8" />
                          <circle cx="50" cy="50" r="40" fill="transparent" stroke="var(--primary)" strokeWidth="8"
                            strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * progressPercent) / 100}
                            strokeLinecap="round" transform="rotate(-90 50 50)" />
                        </svg>
                        <div className="progress-circle-label">
                          <h4>{progressPercent}%</h4>
                          <span>Bitti</span>
                        </div>
                      </div>
                      <div className="progress-tasks-list">
                        <div className={`progress-task-item ${checklist.math ? "completed" : ""}`}>Matematik</div>
                        <div className={`progress-task-item ${checklist.science ? "completed" : ""}`}>Fen Bilimleri</div>
                        <div className={`progress-task-item ${checklist.turkish ? "completed" : ""}`}>Türkçe</div>
                        <div className={`progress-task-item ${checklist.english ? "completed" : ""}`}>İngilizce</div>
                      </div>
                    </div>
                  </div>

                  {/* RADAR PERFORMANCE GRAPH */}
                  <div className="dashboard-card">
                    <h3>Performans Analizim</h3>
                    <div style={{ height: 180, display: "flex", justifyContent: "center", alignItems: "center" }}>
                      <svg width="180" height="180" viewBox="0 0 200 200">
                        <polygon points="100,20 180,80 150,170 50,170 20,80" fill="transparent" stroke="#333" strokeWidth="1" />
                        <polygon points="100,50 160,95 137,150 63,150 40,95" fill="transparent" stroke="#444" strokeWidth="1" />
                        <polygon points="100,80 140,110 125,140 75,140 60,110" fill="transparent" stroke="#555" strokeWidth="1" />
                        <text x="100" y="15" fill="var(--text-muted)" fontSize="10" textAnchor="middle">Matematik</text>
                        <text x="195" y="80" fill="var(--text-muted)" fontSize="10" textAnchor="start">Fen</text>
                        <text x="160" y="185" fill="var(--text-muted)" fontSize="10" textAnchor="middle">İngilizce</text>
                        <text x="40" y="185" fill="var(--text-muted)" fontSize="10" textAnchor="middle">Türkçe</text>
                        <text x="5" y="80" fill="var(--text-muted)" fontSize="10" textAnchor="end">Sosyal</text>
                        <polygon points="100,45 165,90 120,150 70,140 45,95" fill="rgba(99, 102, 241, 0.25)" stroke="var(--primary)" strokeWidth="2" />
                      </svg>
                    </div>
                  </div>

                  {/* RECOMMENDED STUDIES */}
                  <div className="dashboard-card">
                    <h3>Önerilen Çalışmalar</h3>
                    <div className="recommendation-list">
                      <div className="recommendation-item">
                        <div className="rec-left">
                          <div className="rec-icon">📺</div>
                          <div className="rec-info">
                            <h4>Basınç Konu Anlatımı</h4>
                            <p>6 dk video ders özeti</p>
                          </div>
                        </div>
                        <button className="rec-action-btn" onClick={() => { setVideoTitle("Sıvı ve Katı Basıncı"); setVideoOpen(true); }}>▶</button>
                      </div>

                      <div className="recommendation-item">
                        <div className="rec-left">
                          <div className="rec-icon">🎴</div>
                          <div className="rec-info">
                            <h4>Ezber Kartları</h4>
                            <p>Basınç formülleri tekrarı</p>
                          </div>
                        </div>
                        <button className="rec-action-btn" onClick={() => { setFlashcardIndex(0); setFlashcardOpen(true); }}>🗂️</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* PANEL: STUDY PLAN */}
            {activeTab === "study-plan" && (
              <div className="study-plan-container" style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "20px" }}>
                {/* LEFT COLUMN: DYNAMIC PROGRAM EDITOR */}
                <div>
                  <div className="dashboard-card" style={{ padding: "20px", marginBottom: "20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px", borderBottom: "1.5px solid var(--border-light)", paddingBottom: "10px" }}>
                      <h3 style={{ margin: 0 }}>📅 Bugünün Çalışma Programı (Sürükle-Sırala)</h3>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button className="btn-card-secondary" onClick={checkPlanWithAi} style={{ fontSize: "0.78rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px" }}>
                          🤖 AI Kontrol Et
                        </button>
                        <button className="btn-card-primary" onClick={generateAiPlan} style={{ fontSize: "0.78rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px" }}>
                          ✨ AI Plan Oluştur
                        </button>
                      </div>
                    </div>

                    {/* AI FEEDBACK AREA */}
                    {aiFeedback && (
                      <div style={{ 
                        background: aiFeedback.type === "success" ? "rgba(16, 185, 129, 0.08)" : aiFeedback.type === "warning" ? "rgba(245, 158, 11, 0.08)" : "rgba(99, 102, 241, 0.08)",
                        borderLeft: `4px solid ${aiFeedback.type === "success" ? "var(--success)" : aiFeedback.type === "warning" ? "var(--warning)" : "var(--primary)"}`,
                        padding: "15px",
                        borderRadius: "8px",
                        marginBottom: "15px",
                        fontSize: "0.85rem",
                        lineHeight: 1.5
                      }}>
                        <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                          <span style={{ fontSize: "1.2rem" }}>{aiFeedback.type === "success" ? "💡" : "⚠️"}</span>
                          <div style={{ flex: 1 }}>
                            <strong style={{ display: "block", marginBottom: "4px", color: "var(--text-main)" }}>AI Gelişim Koçu Geri Bildirimi:</strong>
                            <p style={{ margin: 0, whiteSpace: "pre-line", color: "var(--text-muted)" }}>{aiFeedback.text}</p>
                            {aiFeedback.suggestions && (
                              <button 
                                onClick={applyAiSuggestion}
                                className="primary"
                                style={{ marginTop: "10px", padding: "6px 12px", fontSize: "0.75rem", borderRadius: "4px", width: "auto" }}
                              >
                                ✓ {aiFeedback.suggestions.text}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "-5px", marginBottom: "15px" }}>
                      * Sıralamayı değiştirmek için satırları sürükleyip bırakabilirsiniz. Planınız velinizle gerçek zamanlı senkronize olur.
                    </p>

                    {/* TASKS LIST */}
                    {studyTasks.length === 0 ? (
                      <div style={{ textAlign: "center", padding: "30px", border: "2px dashed var(--border-light)", borderRadius: "8px", color: "var(--text-muted)" }}>
                        <p style={{ margin: "0 0 10px 0", fontSize: "0.9rem" }}>Henüz çalışma planınıza ders eklemediniz.</p>
                        <button className="btn-card-primary" onClick={generateAiPlan} style={{ width: "auto" }}>AI ile Otomatik Planla</button>
                      </div>
                    ) : (
                      <div className="study-tasks-drag-list" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        {studyTasks.map((task, idx) => (
                          <div 
                            key={task.id}
                            draggable="true"
                            onDragStart={(e) => handleDragStart(e, idx)}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, idx)}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              padding: "12px 15px",
                              background: "var(--white)",
                              borderRadius: "8px",
                              border: "1.5px solid var(--border-light)",
                              borderLeft: `4px solid ${task.completed ? "var(--success)" : "var(--primary)"}`,
                              cursor: "grab",
                              transition: "all 0.2s",
                              opacity: task.completed ? 0.7 : 1
                            }}
                            className="drag-task-item"
                          >
                            {/* Drag handle */}
                            <span style={{ fontSize: "1.2rem", color: "var(--text-muted)", marginRight: "10px", cursor: "grab" }}>☰</span>
                            
                            {/* Checkbox */}
                            <input 
                              type="checkbox" 
                              checked={task.completed}
                              onChange={() => handleToggleTask(task.id)}
                              style={{ width: "18px", height: "18px", marginRight: "12px", cursor: "pointer" }}
                            />

                            {/* Task Icon & Text */}
                            <span style={{ fontSize: "1.4rem", marginRight: "10px" }}>{task.icon}</span>
                            <div style={{ flex: 1 }}>
                              <span style={{ fontSize: "0.72rem", fontWeight: 800, textTransform: "uppercase", color: "var(--text-muted)" }}>
                                {task.subject} • {task.topic} ({task.type === "lesson" ? "Konu Anlatımı" : task.type === "test" ? "Mini Test" : "Etkinlik"})
                              </span>
                              <p style={{ margin: "2px 0 0 0", fontSize: "0.88rem", fontWeight: 600, color: "var(--text-main)" }}>
                                {task.action}
                              </p>
                            </div>

                            {/* Duration & Delete */}
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                              <span style={{ fontSize: "0.78rem", fontWeight: 800, color: "var(--primary)", background: "rgba(99, 102, 241, 0.08)", padding: "4px 8px", borderRadius: "4px" }}>
                                ⏱️ {task.duration} dk
                              </span>
                              <button 
                                onClick={() => handleDeleteTask(task.id)}
                                style={{ background: "none", border: "none", color: "var(--danger)", cursor: "pointer", fontSize: "1.1rem", padding: "0 4px" }}
                                title="Görevi Sil"
                              >
                                &times;
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* MANUAL ADD FORM */}
                  <div className="dashboard-card" style={{ padding: "20px" }}>
                    <h3 style={{ margin: "0 0 15px 0", borderBottom: "1.5px solid var(--border-light)", paddingBottom: "10px" }}>➕ Programa Yeni Görev Ekle</h3>
                    <form onSubmit={handleAddTask} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                      <div className="form-group">
                        <label style={{ fontSize: "0.8rem", fontWeight: 700 }}>Ders / Alan</label>
                        <select 
                          value={newSubject}
                          onChange={(e) => {
                            const val = e.target.value;
                            setNewSubject(val);
                            setNewTopic(filteredSubjectTopics[val][0]);
                          }}
                          style={{ padding: "8px", borderRadius: "6px", border: "1.5px solid var(--border-light)", width: "100%" }}
                        >
                          {Object.keys(filteredSubjectTopics).map(sub => (
                            <option key={sub} value={sub}>{sub}</option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group">
                        <label style={{ fontSize: "0.8rem", fontWeight: 700 }}>Konu Başlığı</label>
                        <select 
                          value={newTopic}
                          onChange={(e) => setNewTopic(e.target.value)}
                          style={{ padding: "8px", borderRadius: "6px", border: "1.5px solid var(--border-light)", width: "100%" }}
                        >
                          {filteredSubjectTopics[newSubject]?.map(top => (
                            <option key={top} value={top}>{top}</option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group">
                        <label style={{ fontSize: "0.8rem", fontWeight: 700 }}>Çalışma Türü</label>
                        <select 
                          value={newType}
                          onChange={(e) => setNewType(e.target.value as any)}
                          style={{ padding: "8px", borderRadius: "6px", border: "1.5px solid var(--border-light)", width: "100%" }}
                        >
                          <option value="lesson">📖 Konu Anlatımı & Video</option>
                          <option value="activity">🎴 Tekrar Etkinliği</option>
                          <option value="test">✏️ Kazanım Tarama Testi</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label style={{ fontSize: "0.8rem", fontWeight: 700 }}>Planlanan Süre (Dakika)</label>
                        <input 
                          type="number" 
                          value={newDuration}
                          onChange={(e) => setNewDuration(e.target.value)}
                          placeholder="Örn: 30"
                          min="5"
                          max="180"
                          style={{ padding: "8px", borderRadius: "6px", border: "1.5px solid var(--border-light)", width: "100%" }}
                        />
                      </div>

                      <div className="form-group" style={{ gridColumn: "span 2" }}>
                        <label style={{ fontSize: "0.8rem", fontWeight: 700 }}>Yapılacak Çalışma / Görev Detayı</label>
                        <input 
                          type="text" 
                          value={newAction}
                          onChange={(e) => setNewAction(e.target.value)}
                          placeholder="Örn: 20 Soru Çöz ve Hata Analizi Yap"
                          style={{ padding: "8px", borderRadius: "6px", border: "1.5px solid var(--border-light)", width: "100%" }}
                        />
                      </div>

                      <div className="form-group" style={{ gridColumn: "span 2" }}>
                        <label style={{ fontSize: "0.8rem", fontWeight: 700 }}>EBA / Harici Kaynak Yönlendirmesi</label>
                        <div style={{ display: "flex", gap: "10px", flexDirection: "column" }}>
                          <select
                            value={newLinkPreset}
                            onChange={(e) => {
                              const val = e.target.value;
                              setNewLinkPreset(val);
                              if (val === "custom") {
                                setNewExternalLink("");
                              } else {
                                setNewExternalLink(val);
                              }
                            }}
                            style={{ padding: "8px", borderRadius: "6px", border: "1.5px solid var(--border-light)", width: "100%", background: "var(--white)", color: "var(--text-main)", fontWeight: 600 }}
                          >
                            <option value="">🚫 Kaynak Yönlendirmesi Ekleme (Boş)</option>
                            <option value="https://ders.eba.gov.tr">🌐 EBA Ders Portalı</option>
                            <option value="https://www.eba.gov.tr/ebatv">📺 EBA TV Ortaokul Kanalları</option>
                            <option value="https://www.eba.gov.tr/ders-kitaplari">📚 EBA Ders Kitapları Kitaplığı</option>
                            <option value="custom">🔗 Kendim Özel EBA/Web Linki Ekleyeceğim</option>
                          </select>
                          
                          {newLinkPreset === "custom" && (
                            <input 
                              type="url" 
                              value={newExternalLink}
                              onChange={(e) => setNewExternalLink(e.target.value)}
                              placeholder="Örn: https://ders.eba.gov.tr/ders/..."
                              style={{ padding: "8px", borderRadius: "6px", border: "1.5px solid var(--border-light)", width: "100%" }}
                            />
                          )}
                        </div>
                      </div>

                      <button 
                        type="submit" 
                        className="primary" 
                        style={{ gridColumn: "span 2", marginTop: "5px", padding: "10px", borderRadius: "6px" }}
                      >
                        ✓ Görevi Programa Ekle
                      </button>
                    </form>
                  </div>
                </div>

                {/* RIGHT COLUMN: MASTERY & ADAPTIVE GUIDE */}
                <div>
                  {/* PROGRESS OVERVIEW */}
                  <div className="dashboard-card" style={{ padding: "20px", marginBottom: "20px", textAlign: "center" }}>
                    <h3 style={{ margin: "0 0 15px 0" }}>📊 Bugünkü İlerleme</h3>
                    <div style={{ width: "120px", height: "120px", margin: "0 auto 15px auto", position: "relative" }}>
                      <svg width="120" height="120" viewBox="0 0 120 120">
                        <circle cx="60" cy="60" r="50" fill="transparent" stroke="var(--border-light)" strokeWidth="8" />
                        <circle cx="60" cy="60" r="50" fill="transparent" stroke="var(--success)" strokeWidth="8"
                          strokeDasharray="314.16" strokeDashoffset={314.16 - (314.16 * progressPercent) / 100}
                          strokeLinecap="round" transform="rotate(-90 60 60)" style={{ transition: "stroke-dashoffset 0.3s" }} />
                      </svg>
                      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
                        <h2 style={{ margin: 0, fontSize: "1.8rem", fontWeight: 800 }}>{progressPercent}%</h2>
                        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Tamamlandı</span>
                      </div>
                    </div>
                    <div style={{ fontSize: "0.85rem", color: "var(--text-main)" }}>
                      <strong>{totalCompletedTasks}</strong> / {totalTasks} Görev Bitti
                    </div>
                  </div>

                  {/* WEAK TOPICS GUIDE */}
                  <div className="dashboard-card" style={{ padding: "20px" }}>
                    <h3 style={{ margin: "0 0 10px 0" }}>🎯 Hedef Kazanım Karnen</h3>
                    <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: "15px" }}>
                      Aşağıdaki kazanım seviyelerinize göre eksik olduğunuz dersleri çalışma programınıza ekleyebilirsiniz.
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "350px", overflowY: "auto" }}>
                      {demoOutcomes.map((outcome) => {
                        const topic = demoTopics.find((t) => t.id === outcome.topicId);
                        const record = masteryRecords[outcome.id];
                        
                        const statusColors: Record<string, string> = {
                          zayif: "var(--danger)",
                          orta: "var(--warning)",
                          iyi: "var(--primary)",
                          tam: "var(--success)",
                        };

                        return (
                          <div 
                            key={outcome.id} 
                            style={{ 
                              padding: "10px", 
                              borderRadius: "6px", 
                              background: "var(--bg-body)", 
                              border: "1px solid var(--border-light)",
                              display: "flex", 
                              justifyContent: "space-between", 
                              alignItems: "center"
                            }}
                          >
                            <div style={{ flex: 1, paddingRight: "10px" }}>
                              <strong style={{ fontSize: "0.8rem", color: "var(--text-main)" }}>{topic?.name}</strong>
                              <p style={{ margin: "2px 0 0 0", fontSize: "0.72rem", color: "var(--text-muted)", lineHeight: 1.3 }}>{outcome.description}</p>
                            </div>
                            <span 
                              style={{ 
                                padding: "4px 8px", 
                                borderRadius: "4px", 
                                fontSize: "0.68rem", 
                                fontWeight: 800, 
                                background: record ? statusColors[record.status] : "#777",
                                color: "white" 
                              }}
                            >
                              {record ? `${record.status.toUpperCase()}` : "Ölçülmedi"}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                    <button className="primary" onClick={startDiagnosticTest} style={{ marginTop: "15px", padding: "8px", fontSize: "0.8rem" }}>
                      ✏️ Kazanım Tespit Testi Başlat
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* PANEL: STUDY ROOM */}
            {activeTab === "study-room" && (
              <div className="study-room-layout" style={{ display: "grid", gridTemplateColumns: "0.8fr 1.2fr", gap: "20px" }}>
                {/* LEFT SIDEBAR: STUDY PLAN & FULL CURRICULUM */}
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  {/* ACTIVE TASKS */}
                  <div className="dashboard-card" style={{ padding: "18px" }}>
                    <h3 style={{ margin: "0 0 12px 0", borderBottom: "1.5px solid var(--border-light)", paddingBottom: "8px" }}>📋 Plandaki Dersler</h3>
                    {studyTasks.filter(t => !t.completed).length === 0 ? (
                      <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", margin: 0, fontStyle: "italic" }}>
                        Bugünkü planındaki tüm dersleri tamamladın! 🎉
                      </p>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        {studyTasks.filter(t => !t.completed).map(task => (
                          <div 
                            key={task.id}
                            onClick={() => handleStartStudy(task)}
                            style={{
                              padding: "10px 12px",
                              background: activeStudyTask?.id === task.id ? "rgba(99, 102, 241, 0.08)" : "var(--bg-body)",
                              border: activeStudyTask?.id === task.id ? "1.5px solid var(--primary)" : "1.5px solid var(--border-light)",
                              borderRadius: "6px",
                              cursor: "pointer",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              transition: "all 0.2s"
                            }}
                          >
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                              <span>{task.icon}</span>
                              <div>
                                <h4 style={{ margin: 0, fontSize: "0.82rem", fontWeight: 700 }}>{task.subject}</h4>
                                <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{task.topic}</span>
                              </div>
                            </div>
                            <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "var(--primary)" }}>▶ Başla</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* FULL CURRICULUM ACCORDION */}
                  <div className="dashboard-card" style={{ padding: "18px" }}>
                    <h3 style={{ margin: "0 0 8px 0" }}>📖 Müfredat Kütüphanesi</h3>
                    <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginBottom: "12px", marginTop: 0 }}>
                      Müfredattaki tüm konu ve derslere buradan ulaşarak çalışabilirsin.
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "350px", overflowY: "auto" }}>
                      {Object.keys(filteredSubjectTopics).filter(sub => sub !== "Mola & Dinlenme").map(sub => (
                        <details key={sub} style={{ border: "1.5px solid var(--border-light)", borderRadius: "6px", overflow: "hidden" }}>
                          <summary style={{ padding: "10px", fontWeight: 700, fontSize: "0.82rem", background: "var(--bg-body)", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span>{sub.includes("Matematik") ? "📐 " + sub : sub.includes("Fen") ? "🧪 " + sub : sub.includes("Türkçe") ? "📖 " + sub : sub.includes("İngilizce") ? "🇬🇧 " + sub : sub.includes("İnkılap") ? "🕌 " + sub : "🌙 " + sub}</span>
                          </summary>
                          <div style={{ padding: "8px", display: "flex", flexDirection: "column", gap: "6px", background: "var(--white)" }}>
                            {filteredSubjectTopics[sub].map(topic => (
                              <div 
                                key={topic}
                                onClick={() => handleStartStudy({
                                  id: "temp-" + topic,
                                  subject: sub,
                                  topic: topic,
                                  type: "lesson",
                                  duration: 30,
                                  completed: false,
                                  action: "Müfredat Konu Çalışması",
                                  icon: sub.includes("Matematik") ? "📐" : sub.includes("Fen") ? "🧪" : sub.includes("Türkçe") ? "📖" : sub.includes("İngilizce") ? "🇬🇧" : sub.includes("İnkılap") ? "🕌" : "🌙"
                                })}
                                style={{
                                  padding: "6px 8px",
                                  fontSize: "0.78rem",
                                  borderRadius: "4px",
                                  cursor: "pointer",
                                  background: activeStudyTask?.topic === topic ? "rgba(99, 102, 241, 0.05)" : "transparent",
                                  color: activeStudyTask?.topic === topic ? "var(--primary)" : "var(--text-main)",
                                  fontWeight: activeStudyTask?.topic === topic ? 800 : 500,
                                  borderLeft: activeStudyTask?.topic === topic ? "3px solid var(--primary)" : "3px solid transparent"
                                }}
                                className="curriculum-item-hover"
                              >
                                • {topic}
                              </div>
                            ))}
                          </div>
                        </details>
                      ))}
                    </div>
                  </div>
                </div>

                {/* RIGHT AREA: WORKSPACE VIEW */}
                <div className="dashboard-card" style={{ padding: "20px", display: "flex", flexDirection: "column", minHeight: "500px" }}>
                  {!activeStudyTask ? (
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", padding: "40px" }}>
                      <span style={{ fontSize: "4rem", marginBottom: "15px", display: "block" }}>📚</span>
                      <h3 style={{ margin: "0 0 10px 0", fontSize: "1.4rem", fontWeight: 800 }}>EduMentor Çalışma Odası</h3>
                      <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--text-muted)", maxWidth: "400px", lineHeight: 1.5 }}>
                        Çalışmak istediğin konuyu sol taraftaki plandan seçerek veya kütüphaneden bir ders açarak hemen konu anlatımı, mini test ve zamanlayıcıyı kullanmaya başla.
                      </p>
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                      {/* Task Header */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1.5px solid var(--border-light)", paddingBottom: "12px", marginBottom: "15px" }}>
                        <div>
                          <span style={{ fontSize: "0.72rem", color: "var(--primary)", fontWeight: 800, textTransform: "uppercase" }}>{activeStudyTask.subject}</span>
                          <h3 style={{ margin: "2px 0 0 0", fontSize: "1.2rem", fontWeight: 800 }}>{activeStudyTask.topic}</h3>
                        </div>
                        <button className="btn-card-secondary" onClick={() => setActiveStudyTask(null)} style={{ fontSize: "0.75rem", padding: "6px 12px" }}>
                          Kapat
                        </button>
                      </div>

                      {/* Sub-Tabs Selector */}
                      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
                        {(["summary", "quiz", "timer"] as const).map(tab => (
                          <button
                            key={tab}
                            onClick={() => setStudySubTab(tab)}
                            style={{
                              padding: "8px 16px",
                              fontSize: "0.82rem",
                              fontWeight: 800,
                              borderRadius: "6px",
                              border: "1.5px solid var(--border-light)",
                              cursor: "pointer",
                              background: studySubTab === tab ? "var(--primary)" : "var(--white)",
                              color: studySubTab === tab ? "white" : "var(--text-main)"
                            }}
                          >
                            {tab === "summary" ? "📖 Konu Anlatımı & Video" : tab === "quiz" ? "✏️ Mini Pratik Test" : "⏱️ Pomodoro Zamanlayıcı"}
                          </button>
                        ))}
                      </div>

                      {/* Tab Content 1: Summary */}
                      {studySubTab === "summary" && (
                        <div style={{ display: "flex", flexDirection: "column", gap: "20px", flex: 1 }}>
                          <div style={{ background: "var(--bg-body)", padding: "20px", borderRadius: "8px", borderLeft: "4px solid var(--primary)", lineHeight: 1.6 }}>
                            <strong style={{ display: "block", marginBottom: "8px", fontSize: "0.95rem" }}>Konu Özeti ve Kritik Detaylar</strong>
                            <p style={{ margin: 0, fontSize: "0.88rem", color: "var(--text-muted)", whiteSpace: "pre-line" }}>
                              {studyContentDb[activeStudyTask.topic]?.summary || 
                                `${activeStudyTask.topic} konusu hakkında LGS sınavında çıkabilecek temel kavramlar ve formüller bu alanda listelenmiştir. LGS hazırlığı için konu özetlerini dikkatlice okuyup önemli kısımları not almanız hafızada kalıcılığı artırır.`
                              }
                            </p>
                          </div>

                          {/* MEB Textbook Reference Card (Copyright Friendly) */}
                          {studyContentDb[activeStudyTask.topic]?.mebPageRange && (
                            <div style={{
                              background: "linear-gradient(135deg, rgba(245, 158, 11, 0.07), rgba(239, 68, 68, 0.05))",
                              padding: "20px",
                              borderRadius: "8px",
                              border: "1.5px solid rgba(245, 158, 11, 0.2)",
                              display: "flex",
                              flexDirection: "column",
                              gap: "12px",
                              boxShadow: "0 4px 12px rgba(245, 158, 11, 0.05)"
                            }}>
                              <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                                <span style={{ fontSize: "1.6rem" }}>📖</span>
                                <div style={{ flex: 1 }}>
                                  <strong style={{ display: "block", marginBottom: "4px", fontSize: "0.95rem", color: "#d97706" }}>
                                    MEB Ders Kitabı Referansı ({studyContentDb[activeStudyTask.topic]?.mebPageRange})
                                  </strong>
                                  <p style={{ margin: 0, fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: 1.45 }}>
                                    Bu ünitenin resmi MEB ders kitabı sayfa aralığı yukarıda verilmiştir. Telif hakları kuralları gereği MEB ders kitapları sunucularımızda barındırılmaz. Çalışmak için EBA portalını ziyaret edebilir veya kendi yerel cihazınızdaki kitap dosyasını açabilirsiniz.
                                  </p>
                                </div>
                              </div>
                              <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>
                                <button
                                  onClick={() => window.open("https://www.eba.gov.tr/ders-kitaplari", "_blank")}
                                  className="primary"
                                  style={{
                                    width: "auto",
                                    padding: "8px 16px",
                                    fontSize: "0.8rem",
                                    background: "linear-gradient(135deg, #f59e0b, #d97706)",
                                    boxShadow: "0 4px 12px rgba(245, 158, 11, 0.2)",
                                    border: "none",
                                    color: "white",
                                    fontWeight: 700
                                  }}
                                >
                                  🌐 EBA Ders Kitaplığına Git
                                </button>
                              </div>
                            </div>
                          )}

                          {/* EBA / External Link integration */}
                          {activeStudyTask.externalLink && (
                            <div style={{ 
                              background: "linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(6, 182, 212, 0.08))",
                              padding: "20px", 
                              borderRadius: "8px", 
                              border: "1.5px solid rgba(99, 102, 241, 0.15)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              gap: "15px"
                            }}>
                              <div style={{ flex: 1 }}>
                                <strong style={{ display: "block", marginBottom: "4px", fontSize: "0.95rem", color: "var(--primary)" }}>🌐 MEB EBA / Dış Kaynak Dersi Hazır!</strong>
                                <p style={{ margin: 0, fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: 1.4 }}>
                                  Bu konunun resmi MEB EBA / harici eğitim materyali eklenmiştir. EBA yönlendirmeleri giriş yapmanızı isteyebilir; EBA şifrenizle giriş yaptıktan sonra doğrudan kaynağa yönlendirileceksiniz.
                                </p>
                              </div>
                              <button 
                                onClick={() => {
                                  window.open(activeStudyTask.externalLink, "_blank");
                                }}
                                className="primary" 
                                style={{ width: "auto", padding: "10px 18px", fontSize: "0.85rem", whiteSpace: "nowrap" }}
                              >
                                🚀 EBA'da Çalışmaya Başla
                              </button>
                            </div>
                          )}

                          {/* Video player simulation */}
                          <div style={{ 
                            background: "#000", 
                            aspectRatio: "16/9", 
                            borderRadius: "8px", 
                            display: "flex", 
                            flexDirection: "column", 
                            alignItems: "center", 
                            justifyContent: "center",
                            color: "white",
                            padding: "20px",
                            textAlign: "center"
                          }}>
                            <span style={{ fontSize: "3rem", marginBottom: "10px" }}>🎬</span>
                            <strong style={{ fontSize: "1rem" }}>{activeStudyTask.topic} Konu Anlatım Videosu</strong>
                            <p style={{ fontSize: "0.75rem", color: "#888", margin: "4px 0 15px 0" }}>LGS Soru Çözüm Taktikleri & Pratik Anlatım</p>
                            <button 
                              onClick={() => {
                                handleCompleteTask(activeStudyTask.id);
                                alert("Harika! Konu anlatım dersini başarıyla tamamladın! Çalışma planın güncellendi ve +100 XP kazandın.");
                              }}
                              className="primary" 
                              style={{ width: "auto", padding: "10px 20px" }}
                            >
                              Videoyu Bitirdim (✓ Görevi Tamamla)
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Tab Content 2: Quiz */}
                      {studySubTab === "quiz" && (
                        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "15px" }}>
                          {studyContentDb[activeStudyTask.topic] ? (
                            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                              {studyContentDb[activeStudyTask.topic].questions.map((q, qidx) => (
                                <div key={q.id} style={{ border: "1.5px solid var(--border-light)", padding: "15px", borderRadius: "8px", background: "var(--white)" }}>
                                  <strong style={{ display: "block", marginBottom: "10px", fontSize: "0.9rem" }}>Soru {qidx + 1}: {q.text}</strong>
                                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                                    {q.options.map(opt => {
                                      const isSelected = quizAnswers[q.id] === opt;
                                      const isCorrect = q.correctAnswer === opt;
                                      let btnBg = "var(--white)";
                                      let btnColor = "var(--text-main)";
                                      let btnBorder = "1.5px solid var(--border-light)";

                                      if (isSelected) {
                                        btnBg = "var(--primary)";
                                        btnColor = "white";
                                        btnBorder = "1.5px solid var(--primary)";
                                      }

                                      if (quizChecked) {
                                        if (isCorrect) {
                                          btnBg = "var(--success)";
                                          btnColor = "white";
                                          btnBorder = "1.5px solid var(--success)";
                                        } else if (isSelected) {
                                          btnBg = "var(--danger)";
                                          btnColor = "white";
                                          btnBorder = "1.5px solid var(--danger)";
                                        }
                                      }

                                      return (
                                        <button
                                          key={opt}
                                          type="button"
                                          onClick={() => handleQuizAnswerSelect(q.id, opt)}
                                          disabled={quizChecked}
                                          style={{
                                            padding: "10px",
                                            borderRadius: "6px",
                                            border: btnBorder,
                                            background: btnBg,
                                            color: btnColor,
                                            fontSize: "0.8rem",
                                            fontWeight: 600,
                                            cursor: quizChecked ? "default" : "pointer",
                                            textAlign: "left"
                                          }}
                                        >
                                          {opt}
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              ))}

                              {/* Action button */}
                              {!quizChecked ? (
                                <button 
                                  onClick={handleQuizSubmit}
                                  disabled={Object.keys(quizAnswers).length < studyContentDb[activeStudyTask.topic].questions.length}
                                  className="primary"
                                  style={{ padding: "12px", borderRadius: "6px", marginTop: "10px" }}
                                >
                                  Cevapları Kontrol Et
                                </button>
                              ) : (
                                <div style={{ 
                                  background: quizScore === studyContentDb[activeStudyTask.topic].questions.length ? "rgba(16, 185, 129, 0.08)" : "rgba(239, 68, 68, 0.08)",
                                  borderLeft: `4px solid ${quizScore === studyContentDb[activeStudyTask.topic].questions.length ? "var(--success)" : "var(--danger)"}`,
                                  padding: "15px",
                                  borderRadius: "8px",
                                  marginTop: "10px",
                                  textAlign: "center"
                                }}>
                                  <strong>Doğru Sayısı: {quizScore} / {studyContentDb[activeStudyTask.topic].questions.length}</strong>
                                  <p style={{ margin: "4px 0 10px 0", fontSize: "0.82rem", color: "var(--text-muted)" }}>
                                    {quizScore === studyContentDb[activeStudyTask.topic].questions.length ? 
                                      "Tebrikler! Konuyu pekiştirdin. +150 XP profil puanına eklendi ve görev tamamlandı!" : 
                                      "Bazı hataların var. Yukarıda yeşil renkli doğru şıkları inceleyerek tekrar deneyebilirsin!"
                                    }
                                  </p>
                                  {quizScore !== studyContentDb[activeStudyTask.topic].questions.length && (
                                    <button 
                                      onClick={() => {
                                        setQuizAnswers({});
                                        setQuizChecked(false);
                                        setQuizScore(null);
                                      }}
                                      className="primary"
                                      style={{ width: "auto", padding: "8px 16px" }}
                                    >
                                      Yeniden Dene
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          ) : (
                            <div style={{ textAlign: "center", padding: "40px" }}>
                              <p>Bu konu için pratik testi henüz hazırlanmadı. Konu özetine çalışabilirsiniz.</p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Tab Content 3: Timer */}
                      {studySubTab === "timer" && (
                        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px" }}>
                          {/* Circular Timer Visual */}
                          <div style={{ width: "200px", height: "200px", position: "relative", marginBottom: "30px" }}>
                            <svg width="200" height="200" viewBox="0 0 200 200">
                              <circle cx="100" cy="100" r="85" fill="transparent" stroke="var(--border-light)" strokeWidth="10" />
                              <circle cx="100" cy="100" r="85" fill="transparent" stroke="var(--primary)" strokeWidth="10"
                                strokeDasharray="534.07" 
                                strokeDashoffset={534.07 - (534.07 * timerSeconds) / (activeStudyTask.duration * 60 || 1800)}
                                strokeLinecap="round" transform="rotate(-90 100 100)" style={{ transition: "stroke-dashoffset 1s linear" }} />
                            </svg>
                            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center" }}>
                              <h1 style={{ margin: 0, fontSize: "2.4rem", fontWeight: 800 }}>
                                {Math.floor(timerSeconds / 60)}:{(timerSeconds % 60).toString().padStart(2, "0")}
                              </h1>
                              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Odaklanma Süresi</span>
                            </div>
                          </div>

                          {/* Control Buttons */}
                          <div style={{ display: "flex", gap: "15px" }}>
                            <button
                              onClick={() => setTimerActive(!timerActive)}
                              style={{
                                padding: "10px 24px",
                                fontSize: "0.9rem",
                                fontWeight: 800,
                                borderRadius: "6px",
                                border: "none",
                                background: timerActive ? "var(--warning)" : "var(--success)",
                                color: "white",
                                cursor: "pointer"
                              }}
                            >
                              {timerActive ? "⏸ Duraklat" : "▶ Başlat"}
                            </button>
                            <button
                              onClick={() => {
                                setTimerActive(false);
                                setTimerSeconds(activeStudyTask.duration * 60);
                              }}
                              style={{
                                padding: "10px 24px",
                                fontSize: "0.9rem",
                                fontWeight: 800,
                                borderRadius: "6px",
                                border: "1.5px solid var(--border-light)",
                                background: "var(--white)",
                                color: "var(--text-main)",
                                cursor: "pointer"
                              }}
                            >
                              ⏱️ Sıfırla
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* PANEL: AI ROUTINE PLANNER */}
            {activeTab === "ai-routine" && (
              <div>
                <div className="dashboard-card">
                  <h3>⏱️ AI Çalışma Rutini Planlayıcısı</h3>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: 15 }}>
                    Bugün ne kadar çalışabileceğinizi girin. AI, en zayıf olduğunuz kazanımları tarayarak size özel ders çalışma süresi ve görevleri dağıtacaktır.
                  </p>
                  
                  <div style={{ display: "flex", gap: 12, alignItems: "flex-end" }} className="form-group">
                    <div style={{ flex: 1 }}>
                      <label>Bugün Kaç Saat Çalışabilirsin?</label>
                      <input 
                        type="number" 
                        value={availableHours} 
                        onChange={(e) => setAvailableHours(e.target.value)} 
                        placeholder="Örn: 2"
                        style={{ padding: 10, borderRadius: 8, border: "1.5px solid var(--border-light)" }}
                      />
                    </div>
                    <button onClick={generateStudyRoutine} className="primary-btn" style={{ width: "auto", padding: "11px 20px" }}>
                      AI Rutinimi Hazırla
                    </button>
                  </div>
                </div>

                <div className="section-card">
                  <h3>Günlük Çalışma Yol Haritam</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 10 }}>
                    {routineResult.map((item, idx) => (
                      <div key={idx} style={{ background: "var(--bg-body)", padding: 15, borderRadius: 8, borderLeft: "4px solid var(--primary)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <span style={{ fontSize: "0.75rem", color: "var(--primary)", fontWeight: 700, textTransform: "uppercase" }}>{item.subject}</span>
                          <h4 style={{ margin: "2px 0 4px 0", fontSize: "0.95rem" }}>{item.topic}</h4>
                          <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--text-muted)" }}>{item.action}</p>
                        </div>
                        <div style={{ background: "rgba(99, 102, 241, 0.08)", padding: "8px 12px", borderRadius: 6, fontWeight: 800, color: "var(--primary)", fontSize: "0.9rem" }}>
                          ⏱️ {item.duration} Dakika
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="dashboard-card">
                  <h3>🧠 Öğrenme Tarzı Analizi</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 15, marginTop: 10 }}>
                    <div style={{ padding: 12, background: "var(--bg-body)", borderRadius: 8 }}>
                      <strong style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Öğrenme Stili</strong>
                      <p style={{ margin: "4px 0 0 0", fontWeight: 800, color: "var(--primary)" }}>Görsel & Uygulamalı Soru Çözümü</p>
                    </div>
                    <div style={{ padding: 12, background: "var(--bg-body)", borderRadius: 8 }}>
                      <strong style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>En Verimli Saatlerin</strong>
                      <p style={{ margin: "4px 0 0 0", fontWeight: 800, color: "var(--success)" }}>16:00 - 18:30 (Okul Sonrası)</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* PANEL: EXAMS */}
            {activeTab === "exams" && (
              <div className="card">
                <h3>LGS Deneme Sınavı Sonuçlarım</h3>
                <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 15 }}>
                  <thead>
                    <tr>
                      <th style={{ borderBottom: "2px solid var(--border-light)", padding: 8 }}>Sınav Adı</th>
                      <th style={{ borderBottom: "2px solid var(--border-light)", padding: 8 }}>Puan</th>
                      <th style={{ borderBottom: "2px solid var(--border-light)", padding: 8 }}>Başarı Durumu</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ padding: 10, borderBottom: "1px solid var(--border-light)" }}>LGS Genel Deneme 1</td>
                      <td style={{ padding: 10, borderBottom: "1px solid var(--border-light)" }}>442 Puan</td>
                      <td style={{ padding: 10, borderBottom: "1px solid var(--border-light)", color: "var(--success)", fontWeight: 700 }}>✓ Hedef Üstü</td>
                    </tr>
                    <tr>
                      <td style={{ padding: 10, borderBottom: "1px solid var(--border-light)" }}>LGS Kurumsal Deneme 2</td>
                      <td style={{ padding: 10, borderBottom: "1px solid var(--border-light)" }}>425 Puan</td>
                      <td style={{ padding: 10, borderBottom: "1px solid var(--border-light)", color: "var(--primary)", fontWeight: 700 }}>✓ Hedefe Yakın</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* PANEL: AI COACH */}
            {activeTab === "ai-coach" && (
              <div className="card" style={{ padding: 15 }}>
                <h3>🤖 AI Rehber Öğretmen Sohbeti</h3>
                <div className="chat-container" style={{ height: 350, display: "flex", flexDirection: "column", background: "var(--white)", borderRadius: 12, border: "1px solid var(--border-light)", overflow: "hidden", marginTop: 15 }}>
                  <div className="chat-messages" style={{ flex: 1, padding: 15, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10 }}>
                    {chatMessages.map((m, idx) => (
                      <div key={idx} className={`chat-bubble ${m.sender === "ai" ? "advisor" : "student"}`}>
                        {m.text}
                      </div>
                    ))}
                    {isTyping && (
                      <div className="chat-typing">
                        <span></span><span></span><span></span>
                      </div>
                    )}
                  </div>
                  <div className="chat-input-bar">
                    <input
                      type="text"
                      placeholder="AI Koçuna LGS hakkında bir soru sor..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") handleSendChatMessage(); }}
                    />
                    <button onClick={handleSendChatMessage}>Gönder</button>
                  </div>
                </div>
              </div>
            )}

            {/* PANEL: REPORTS */}
            {activeTab === "reports" && (
              <div className="card">
                <h3>🕒 Ders Çalışma Dağılım Grafiğim</h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Haftalık çözülen soru ve konu anlatım sürelerinin ders dağılımları.</p>
                <div style={{ display: "flex", gap: 20, marginTop: 15, justifyContent: "center" }}>
                  <div style={{ textAlign: "center", padding: 12, background: "var(--bg-body)", borderRadius: 8, flex: 1 }}>
                    <span style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--primary)" }}>5.2 Saat</span>
                    <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--text-muted)" }}>Matematik</p>
                  </div>
                  <div style={{ textAlign: "center", padding: 12, background: "var(--bg-body)", borderRadius: 8, flex: 1 }}>
                    <span style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--success)" }}>3.8 Saat</span>
                    <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--text-muted)" }}>Fen Bilimleri</p>
                  </div>
                  <div style={{ textAlign: "center", padding: 12, background: "var(--bg-body)", borderRadius: 8, flex: 1 }}>
                    <span style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--warning)" }}>2.5 Saat</span>
                    <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--text-muted)" }}>Türkçe</p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* VIDEO LESSON MODAL OVERLAY */}
      {videoOpen && (
        <div className="modal-overlay" style={{ display: "flex" }}>
          <div className="modal-content-card" style={{ maxWidth: 500 }}>
            <div className="modal-header">
              <h3>{videoTitle} Video Dersi</h3>
              <button className="modal-close-btn" onClick={() => setVideoOpen(false)}>&times;</button>
            </div>
            <div className="modal-body" style={{ background: "black", aspectRatio: "16/9", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ color: "white", textAlign: "center" }}>
                <span style={{ fontSize: "3rem", display: "block" }}>🎬</span>
                <strong>Basınç Video Konu Anlatımı Oynatılıyor...</strong>
                <p style={{ fontSize: "0.75rem", color: "#999" }}>Süre: 06:12 / AI Koçun Tarafından Önerildi</p>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-solve" onClick={() => setVideoOpen(false)}>Kapat</button>
            </div>
          </div>
        </div>
      )}

      {/* FLASHCARDS MODAL OVERLAY */}
      {flashcardOpen && (
        <div className="modal-overlay" style={{ display: "flex" }}>
          <div className="modal-content-card" style={{ maxWidth: 450 }}>
            <div className="modal-header">
              <h3>Basınç Flashcard Kartları ({flashcardIndex + 1} / {flashcardsDeck.length})</h3>
              <button className="modal-close-btn" onClick={() => setFlashcardOpen(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="flashcard-game-container">
                <div className={`flashcard-perspective ${flashcardFlipped ? "flipped" : ""}`} onClick={() => setFlashcardFlipped(!flashcardFlipped)}>
                  <div className="flashcard-inner">
                    <div className="flashcard-front">
                      <span style={{ fontSize: "2rem", marginBottom: 8 }}>❓</span>
                      <strong style={{ fontSize: "1.05rem" }}>{flashcardsDeck[flashcardIndex].q}</strong>
                      <span className="flashcard-tip-text">Cevabı görmek için karta tıklayın</span>
                    </div>
                    <div className="flashcard-back">
                      <span style={{ fontSize: "2rem", marginBottom: 8 }}>💡</span>
                      <strong style={{ fontSize: "1.05rem" }}>{flashcardsDeck[flashcardIndex].a}</strong>
                      <span className="flashcard-tip-text">Tıklayarak geri çevirin</span>
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 10, width: "100%", justifyContent: "center", marginTop: 10 }}>
                  <button className="btn-card-secondary" onClick={() => { setFlashcardFlipped(false); setFlashcardIndex(prev => (prev - 1 + flashcardsDeck.length) % flashcardsDeck.length); }}>Geri</button>
                  <button className="btn-card-primary" onClick={() => { setFlashcardFlipped(false); setFlashcardIndex(prev => (prev + 1) % flashcardsDeck.length); }}>İleri</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
