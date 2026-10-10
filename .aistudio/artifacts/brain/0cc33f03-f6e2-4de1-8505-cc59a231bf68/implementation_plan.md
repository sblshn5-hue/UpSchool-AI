# Career & Interview Coach Agent (Kariyer & Mülakat Koçu)

Kullanıcının gireceği mülakatlardaki katılımcı unvanına (interviewer title) göre hedef odaklı soru setleri ve mülakatçı perspektif analizi üreten, aynı zamanda tamamlanan eğitim içeriklerini analiz ederek kişiselleştirilmiş beceri açığı ve bir sonraki adım eğitim yol haritası sunan yapay zeka destekli profesyonel kariyer koçluğu platformu.

## User Review & Critical Decisions

> [!IMPORTANT]
> Kullanıcı ile 1. Fazda netleştirilen temel tercihler doğrultusunda sistem mimarisi aşağıdaki şekilde belirlenmiştir:

- **Sektörel Kapsam**: Tüm sektörlere (Teknoloji, Finans, Sağlık, İK, Ürün Yönetimi, Operasyon vb.) uyarlanabilir esnek koçluk motoru ve hazır sektör şablonları.
- **Mülakat Deneyimi**: Kapsamlı soru listesi (Davranışsal, Teknik/Fonksiyonel, Kültür/Liderlik, Beklenmedik Sorular) ve "Mülakatçının Gözünden" perspektif analizi (Bu unvandaki kişi ne arar, hangi cevaplardan etkilenir, nelere dikkat etmeli).
- **Eğitim Önerisi Yaklaşımı**: Katılınan eğitimlerin sentezi ile somut Beceri Açığı (Skill Gap) analizi, seviye atlatacak sonraki adım eğitim konuları, tavsiye edilen sertifikalar ve uygulamalı proje adımları.

---

## 1. Overview & Core Concept

- **What It Does**: İki temel sütundan oluşan akıllı kariyer platformu:
  1. **Mülakat Hazırlık Koçu (Interview Coach)**: Görüşmeyi yapacak kişinin unvanı (ör. "VP of Engineering", "HR Talent Partner", "Senior Product Director", "Chief Financial Officer") ve isteğe bağlı hedef pozisyon/şirket bilgisi girildiğinde; mülakatçının bakış açısı, değerlendirme kriterleri, 15+ kategorize soru, her soru için mülakatçının asıl test ettiği gizli niyet ve STAR yöntemiyle yanıt rehberi üretir.
  2. **Eğitim & Yetkinlik Yol Haritası (Learning Path Navigator)**: Kullanıcının bugüne kadar aldığı eğitimleri (kurs adı, içerik/müfredat, kazanılan beceriler) listeleyip analiz ederek; mevcut yetkinlik haritasını çıkarır, bir üst kariyer basamağı için eksik kalan kritik beceri açıklarını tespit eder ve adım adım sonraki eğitim konuları, global sertifika önerileri ve bitirme projeleri tavsiye eder.
  3. **Kayıt ve Raporlama**: Kullanıcı analizleri favorileyebilir, PDF/Markdown formatında dışa aktarabilir ve profilinde geçmiş hazırlıklarını saklayabilir.
- **Target Audience / Persona**: İş görüşmelerine hazırlanan adaylar, terfi/pozisyon değişimi planlayan profesyoneller ve kendini sürekli geliştirmek isteyen uzmanlar.
- **Key Value**: Mülakat öncesi sürprizleri ortadan kaldıran unvan bazlı psikolojik/teknik hazırlık ve eğitim yatırımlarını stratejik bir kariyer gelişimine dönüştüren net bir eylem planı.

---

## 2. User Experience & Visual Design

### Key User Flows

1. **Dashboard & Hızlı Başlangıç**:
   - Üst seviye navigasyonda iki ana çalışma alanı: `Mülakat Koçu (Interview Coach)` ve `Eğitim Yol Haritası (Learning Path)`.
   - Hazır hızlı senaryolar (ör. "HR Director ile Kültür Mülakatı", "Engineering Manager ile Sistem Tasarımı", "Veri Analitiği Sonrası Yapay Zeka Kariyeri").

2. **Mülakat Hazırlığı Akışı**:
   - **Girdi**: Mülakatçının Unvanı (interviewer title), Mülakat Türü (Teknik, İK, Vaka, Yönetici Görüşmesi), Hedef Rol ve Deneyim Seviyesi.
   - **Üretim**: Server-side Gemini 3.8 Flash modeli aracılığıyla derinlemesine analiz.
   - **Çıktı**:
     - *Mülakatçı Profili & Psikolojisi*: Bu unvanın organizasyondaki öncelikleri, nelere 'kırmızı bayrak' (red flag) dediği, ne tür adaylardan etkilendiği.
     - *Kategorize Soru Havuzu*: Davranışsal & Durumsal, Teknik & Alan Uzmanlığı, Liderlik & İşbirliği, Zorlayıcı & Beklenmedik sorular.
     - *Cevaplama İpuçları & STAR Modeli Rehberi*: Her soru için "Bu soruda neyi ölçüyor?" ve "Nasıl cevaplamalısınız?" ipuçları.
     - *Adayın Sorması Gereken Sorular*: Bu unvandaki kişiye adayın sorması gereken 3-5 stratejik ters soru (Reverse Interviewing).

3. **Eğitim Analizi ve Yol Haritası Akışı**:
   - **Girdi**: Katılınan eğitimlerin içerikleri (tek tek ekleme veya toplu metin yapıştırma - kurs adı, kurum/platform, ana konular, kazanımlar).
   - **Üretim**: Yetkinlik seviyesi ayrıştırma ve endüstri standartlarıyla kıyaslama.
   - **Çıktı**:
     - *Mevcut Yetkinlik Özeti*: Kazanılan güçlü yönler ve uzmanlık kümesi.
     - *Beceri Açığı Analizi (Skill Gap)*: Kariyerde sıçrama yapmak için eksik kalan teknik ve yönetsel parçalar.
     - *Sonraki Adım Eğitim Müfredatı*: 3 aşamalı (Kısa vadeli çekirdek beceri, Orta vadeli derinleşme, İleri seviye liderlik/uzmanlık) eğitim planı.
     - *Tavsiye Edilen Konular & Platformlar*: Önerilen spesifik konu başlıkları, kitaplar/standartlar ve global sertifikasyonlar.

### Visual Identity & Theme

- **Aesthetic Direction**: Yönetici düzeyinde güven veren, modern enterprise SaaS tasarımı (Financial Times ve Linear estetiği; dengeli, havadar ve yüksek okunurluk).
- **Color Palette**:
  - Zemin / Canvas: Temiz, nötr açık slate zemin (`bg-slate-50/70`) ve koyu mod desteği (`bg-slate-950`).
  - Yüzeyler: Saf beyaz (`bg-white dark:bg-slate-900`), 1px ince sınır çizgileri (`border-slate-200 dark:border-slate-800`).
  - Vurgular (10% Accent): Derin lacivert (`#0F172A`) ve elektrik indigo (`#4F46E5`) odaklı aksiyon butonları.
  - Durum İndikatörleri: Zümrüt yeşili (`#059669` - tamamlanan eğitimler/güçlü yönler), Kehribar sarısı (`#D97706` - odaklanılması gereken beceri açıkları).
- **Typography & Hierarchy**:
  - Başlıklar: `Plus Jakarta Sans` / `Outfit` font ailesiyle net, orantılı ve dengeli başlıklar.
  - Gövde Metni: `Public Sans` / `DM Sans` (14-16px, 1.6 satır yüksekliği).
  - Sayısal ve Kod/Metrik Değerler: `tabular-nums` ve `font-mono`.
- **Zero-Pill Kuralı & Anti-Slop**:
  - Etiket ve metadatalar kutucuk veya garş hap yerine ince tipografik ayrıştırmalarla (`·`, `/`) sunulacak.
  - Kart içinde kart kirliliğinden kaçınılarak ferah kenar boşlukları ve ince ayraçlar kullanılacak.

---

## 3. Key Product Decisions & Trade-Offs

- **Server-Side Güvenli Gemini Mimarisi**:
  - *Karar*: Tüm yapay zeka sorguları sunucu tarafında (`/api/generate-questions` ve `/api/analyze-trainings`) `gemini-3.8-flash` modeli ile yapılandırılmış JSON şeması (`responseMimeType: "application/json"`) kullanılarak gerçekleştirilir.
  - *Gerekçe*: İstemciye API anahtarı sızmasını engeller, tutarlı ve hatasız JSON veri yapısı garanti eder.
- **Tek Dokunuşla Örnek Veri Desteği (Quick Demo Presets)**:
  - *Karar*: Kullanıcının hemen deneyebilmesi için hazır unvanlar ("Engineering Manager", "Head of Growth", "Senior Scrum Master", "Finance VP") ve örnek eğitim geçmişleri ("Modern Full-Stack Web Bootcamp", "Agile Leadership Certification") tek tıkla yüklenebilecek.
  - *Gerekçe*: Kullanıcı boş formla karşılaşmadan uygulamanın gücünü anında test edebilir.
- **Yerel Hafıza & Dışa Aktarma (LocalStorage & Export)**:
  - *Karar*: Analiz sonuçları tarayıcıda kaydedilebilir ve Markdown / Yazdırılabilir formatta dışa aktarılabilir.
  - *Gerekçe*: Kullanıcı mülakat gününde çıktı alıp hazırlık notlarına hızlıca göz atabilir.

---

## 4. Technical Architecture & Data Strategy

### System Architecture Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                        CLIENT VIEWPORT (React 19)                      │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Top Navigation: Brand Wordmark | Active Tab Selector | Actions   │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                │                                       │
│       ┌────────────────────────┴────────────────────────┐              │
│       ▼                                                 ▼              │
│  ┌─────────────────────────┐              ┌─────────────────────────┐  │
│  │  Interview Coach View   │              │   Learning Path View    │  │
│  │  - Interviewer Title    │              │   - Training Entry List │  │
│  │  - Role / Industry Scope│              │   - Content Breakdown   │  │
│  │  - Perspective Cards    │              │   - Skill Gap Radar     │  │
│  │  - Question Categorizer │              │   - Recommended Pathway │  │
│  │  - STAR Framework Tips  │              │   - Next-Step Roadmap   │  │
│  └─────────────────────────┘              └─────────────────────────┘  │
│       │                                                 │              │
│       └────────────────────────┬────────────────────────┘              │
│                                ▼                                       │
│                    State & LocalStorage Manager                        │
└────────────────────────────────┼───────────────────────────────────────┘
                                 │ HTTP POST (JSON)
                                 ▼
┌────────────────────────────────────────────────────────────────────────┐
│                       SERVER PROXY LAYER (Node.js)                     │
│                                                                        │
│   POST /api/interview/questions      POST /api/training/recommendations│
│   ├── Validate Inputs                ├── Validate Training History     │
│   └── Build Persona Prompts          └── Build Skill Analysis Prompt   │
│                                │                                       │
│                                ▼                                       │
│                 @google/genai (gemini-3.8-flash)                       │
│                 Structured JSON Schema Output                          │
└────────────────────────────────────────────────────────────────────────┘
```

### Core Data Models

```typescript
// Mülakat Hazırlık Modeli
export interface InterviewAnalysis {
  interviewerTitle: string;
  targetRole: string;
  industry: string;
  interviewerPersona: {
    mindset: string;
    keyPriorities: string[];
    potentialRedFlags: string[];
    whatImpressesThem: string[];
  };
  questions: Array<{
    id: string;
    category: 'Behavioral' | 'Functional_Technical' | 'Leadership_Culture' | 'Curveball';
    questionText: string;
    whyTheyAsk: string; // Mülakatçının ölçtüğü gizli niyet
    recommendedStarApproach: {
      situation: string;
      task: string;
      action: string;
      result: string;
    };
    suggestedKeywords: string[];
  }>;
  reverseInterviewQuestions: string[]; // Adayın sorması gereken sorular
}

// Eğitim & Yol Haritası Modeli
export interface TrainingItem {
  id: string;
  title: string;
  providerOrInstitution: string;
  completedYear?: string;
  contentDescription: string;
  keySkillsCovered: string[];
}

export interface CareerLearningPath {
  acquiredSkillsSummary: string[];
  currentMasteryLevel: string;
  skillGaps: Array<{
    area: string;
    impact: string;
    priority: 'High' | 'Medium' | 'Foundational';
  }>;
  recommendedTrainings: Array<{
    phase: string;
    courseTitleOrTopic: string;
    curriculumSummary: string;
    targetCompetency: string;
    recommendedPlatformsOrCerts: string[];
    handsOnProjectIdea: string;
  }>;
  strategicAdvice: string;
}
```

### Interactive Components & Error Handling

- **Tab Transition**: Mülakat Koçu ve Eğitim Yol Haritası arasında anında geçiş, durum kaybı olmadan çalışma.
- **Hızlı Doldurma (Pre-filled Presets)**: Tek tıkla "Senior Full-Stack Developer", "Operations Manager", "Product Lead" gibi roller için örnek form doldurma.
- **Loading & Skeleton State**: Gemini API çağrısı sırasında gerçekçi iskelet yükleme kartları ve adım göstergesi ("Mülakatçı profili analiz ediliyor...", "Sorular sınıflandırılıyor...").
- **Hata Yönetimi (Error Boundaries)**: API anahtarı veya ağ kesintilerinde kullanıcıya net, panik yaratmayan hata mesajı ve tekrar dene butonu.
