import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Server-side Google GenAI initialization
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasApiKey: Boolean(apiKey && apiKey !== 'MY_GEMINI_API_KEY'),
  });
});

// 1. Interviewer Title Question & Perspective Generator
app.post('/api/interview/questions', async (req: Request, res: Response) => {
  try {
    const {
      interviewerTitle,
      targetRole = 'Genel Pozisyon',
      industry = 'Genel / Çoklu Sektör',
      experienceLevel = 'Orta Düzey (Mid-Level)',
      additionalNotes = '',
    } = req.body;

    if (!interviewerTitle || typeof interviewerTitle !== 'string' || !interviewerTitle.trim()) {
      return res.status(400).json({ error: 'Mülakatçının unvanı (interviewer title) gereklidir.' });
    }

    if (ai) {
      const prompt = `
Sen 20+ yıllık uluslararası üst düzey yetenek avcısı ve mülakat koçusun.
Aday şu pozisyona hazırlanıyor:
- Mülakatı Gerçekleştirecek Kişinin Unvanı (Interviewer Title): "${interviewerTitle.trim()}"
- Hedef Pozisyon / Rol: "${targetRole}"
- Sektör / Alan: "${industry}"
- Adayın Deneyim Seviyesi: "${experienceLevel}"
- Ek Bağlam / Şirket Notu: "${additionalNotes}"

Lütfen bu unvandaki bir kişinin psikolojisini, sorumluluklarını, organizasyondaki güç dengesini ve işe alım kararındaki ağırlığını derinlemesine analiz et.
Bu mülakatçının adaya yönelteceği en muhtemel, keskin ve derinlemesine 12 ila 16 adet soruyu aşağıdaki 4 kategoride üret:
1. "Behavioral" (Davranışsal ve STAR modeli gerektiren durum soruları)
2. "Functional_Technical" (Bu unvanın ve rolün gerektirdiği fonksiyonel, teknik ve problem çözme soruları)
3. "Leadership_Culture" (Ekip içi uyum, kültür, çatışma yönetimi ve sorumluluk alma)
4. "Curveball" (Beklenmedik, stres testi yapan veya adayın ezberini bozan zihin açıcı sorular)

Her soru için:
- Soru metni
- "whyTheyAsk": Mülakatçının bu unvanla bu soruyu sorarken ölçtüğü asıl arka plan niyeti ve psikolojisi
- "evaluationGoal": Güçlü cevap ile zayıf cevap arasındaki fark
- "recommendedStarApproach": STAR (Situation, Task, Action, Result) yanıt çerçevesi
- "doTips": 2-3 adet mutlaka yapılması gereken taktik
- "dontTips": 2-3 adet kesinlikle kaçınılması gereken hata
- "sampleAnswerSkeleton": Adayın cevabını yapılandırması için net şablon

Ayrıca adayın bu mülakatçıya görüşme sonunda sorması gereken 4-5 adet stratejik "Tersine Mülakat" (Reverse Interview) sorusu ekle.
Yanıtı Türkçe olarak, net ve profesyonel bir dille JSON olarak ver.
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              interviewerPersona: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  mindset: { type: Type.STRING },
                  keyPriorities: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  potentialRedFlags: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  whatImpressesThem: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                },
                required: ['title', 'mindset', 'keyPriorities', 'potentialRedFlags', 'whatImpressesThem'],
              },
              evaluationCriteria: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              questions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    category: { type: Type.STRING },
                    categoryLabel: { type: Type.STRING },
                    questionText: { type: Type.STRING },
                    whyTheyAsk: { type: Type.STRING },
                    evaluationGoal: { type: Type.STRING },
                    recommendedStarApproach: {
                      type: Type.OBJECT,
                      properties: {
                        situation: { type: Type.STRING },
                        task: { type: Type.STRING },
                        action: { type: Type.STRING },
                        result: { type: Type.STRING },
                      },
                      required: ['situation', 'task', 'action', 'result'],
                    },
                    doTips: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                    dontTips: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                    sampleAnswerSkeleton: { type: Type.STRING },
                  },
                  required: [
                    'id',
                    'category',
                    'categoryLabel',
                    'questionText',
                    'whyTheyAsk',
                    'evaluationGoal',
                    'recommendedStarApproach',
                    'doTips',
                    'dontTips',
                    'sampleAnswerSkeleton',
                  ],
                },
              },
              reverseInterviewQuestions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    question: { type: Type.STRING },
                    strategicObjective: { type: Type.STRING },
                  },
                  required: ['question', 'strategicObjective'],
                },
              },
              confidenceBoostTip: { type: Type.STRING },
            },
            required: [
              'interviewerPersona',
              'evaluationCriteria',
              'questions',
              'reverseInterviewQuestions',
              'confidenceBoostTip',
            ],
          },
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json(parsed);
    }

    // Fallback if no API key is provided
    return res.json(getFallbackInterviewData(interviewerTitle, targetRole, industry));
  } catch (err: any) {
    console.error('Error in /api/interview/questions:', err);
    // Return gracefully with fallback rather than fatal crash
    return res.json(getFallbackInterviewData(req.body?.interviewerTitle || 'Interviewer', req.body?.targetRole, req.body?.industry));
  }
});

// 2. Training History Analysis & Next Step Learning Path
app.post('/api/training/recommendations', async (req: Request, res: Response) => {
  try {
    const {
      completedTrainings = [],
      targetCareerGoal = 'Kariyerde Üst Seviyeye Yükselmek',
      currentRole = 'Mevcut Profesyonel',
      industry = 'Teknoloji & İş Dünyası',
    } = req.body;

    if (!Array.isArray(completedTrainings) || completedTrainings.length === 0) {
      return res.status(400).json({ error: 'En az bir tamamlanan eğitim içeriği girmelisiniz.' });
    }

    if (ai) {
      const trainingSummaries = completedTrainings
        .map((t: any, i: number) => {
          return `${i + 1}. Eğitim: "${t.title || 'Başlıksız'}" (${t.providerOrInstitution || 'Belirtilmedi'} - ${t.completedYear || 'Tarih yok'})
   İçerik & Müfredat: ${t.contentDescription || 'Belirtilmedi'}
   Kazanılan Beceriler: ${(t.keySkillsCovered || []).join(', ') || 'Belirtilmedi'}`;
        })
        .join('\n\n');

      const prompt = `
Sen uluslararası düzeyde bir Baş Kariyer Danışmanı ve Kurumsal Eğitim & Gelişim Direktörüsün.
Aşağıda kullanıcının şimdiye kadar tamamladığı eğitimlerin detaylı listesi ve içerikleri verilmiştir:

${trainingSummaries}

Kullanıcının Mevcut Rolü: "${currentRole}"
Hedeflediği Kariyer Amacı: "${targetCareerGoal}"
Sektör / Alan: "${industry}"

Lütfen bu eğitimlerin içeriklerini derinlemesine analiz et:
1. Bu eğitimlerle adayın hangi temel ve teknik yetkinlikleri güvenle kazandığını teşhis et.
2. Hedeflenen kariyer vizyonu için kritik eksik kalan "Beceri Açıkları"nı (Skill Gaps) tespit et (teknik, yönetsel, stratejik veya metodolojik).
3. Bu açıkları kapatmak ve adayı bir üst lige taşımak için 3 aşamalı somut "Bir Sonraki Adım Eğitim Yol Haritası" oluştur:
   - Aşama 1: Kritik Temel Açıkların Kapatılması (0-3 Ay)
   - Aşama 2: Alanda Derinleşme ve Katma Değer Üretme (3-6 Ay)
   - Aşama 3: Üst Düzey Stratejik Liderlik / Mimari / Yönetim (6-12 Ay)
4. Her eğitim önerisi için somut ders/müfredat konuları, tanınmış global sertifika veya platform önerileri (Coursera, edX, AWS, PMI, Scrum.org vb.) ve teoriyi somutlaştıran uygulamalı bitirme projesi (hands-on project) fikri ver.
5. Sektörde en yüksek getirisi olan (High-ROI) prestijli sertifikaları listele.

Yanıtı Türkçe olarak yapılandırılmış JSON formatında dön.
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              profileDiagnosis: {
                type: Type.OBJECT,
                properties: {
                  currentMasteryLevel: { type: Type.STRING },
                  acquiredCoreStrengths: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  domainBreadth: { type: Type.STRING },
                },
                required: ['currentMasteryLevel', 'acquiredCoreStrengths', 'domainBreadth'],
              },
              skillGaps: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    skill: { type: Type.STRING },
                    gapType: { type: Type.STRING },
                    impactOnCareer: { type: Type.STRING },
                    priority: { type: Type.STRING },
                  },
                  required: ['skill', 'gapType', 'impactOnCareer', 'priority'],
                },
              },
              recommendedRoadmap: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    step: { type: Type.INTEGER },
                    phaseTitle: { type: Type.STRING },
                    courseTopic: { type: Type.STRING },
                    whyThisNow: { type: Type.STRING },
                    curriculumOutline: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                    recommendedPlatformsOrCerts: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                    handsOnProject: { type: Type.STRING },
                  },
                  required: [
                    'step',
                    'phaseTitle',
                    'courseTopic',
                    'whyThisNow',
                    'curriculumOutline',
                    'recommendedPlatformsOrCerts',
                    'handsOnProject',
                  ],
                },
              },
              highValueCertifications: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    issuer: { type: Type.STRING },
                    careerImpact: { type: Type.STRING },
                  },
                  required: ['name', 'issuer', 'careerImpact'],
                },
              },
              coachExecutiveSummary: { type: Type.STRING },
            },
            required: [
              'profileDiagnosis',
              'skillGaps',
              'recommendedRoadmap',
              'highValueCertifications',
              'coachExecutiveSummary',
            ],
          },
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json(parsed);
    }

    return res.json(getFallbackTrainingData(completedTrainings, targetCareerGoal));
  } catch (err: any) {
    console.error('Error in /api/training/recommendations:', err);
    return res.json(getFallbackTrainingData(req.body?.completedTrainings, req.body?.targetCareerGoal));
  }
});

// Contextual Fallbacks if API Key is not set or network fails
function getFallbackInterviewData(title: string, role = 'Pozisyon', industry = 'Sektör') {
  return {
    interviewerPersona: {
      title,
      mindset: `${title} pozisyonundaki liderler, adayın yalnızca teorik bilgisine değil; baskı altındaki karar alma mekanizmasına, işin bütününe kattığı somut değere ve departmanlar arası iletişime odaklanır.`,
      keyPriorities: [
        'Hata anında şeffaflık ve hızlı çözüm refleksi',
        'Zaman ve kaynak yönetiminde ölçülebilir verimlilik',
        'Departman hedeflerine stratejik uyum ve bağımsız inisiyatif',
      ],
      potentialRedFlags: [
        'Başarısızlıklarda sorumluluğu başkalarına veya araçlara yüklemek',
        'Yalnızca talimat bekleyen, proaktif olmayan yaklaşım',
        'Şirketin ve ekibin mevcut iş modellerini hiç araştırmamış olmak',
      ],
      whatImpressesThem: [
        'Geçmiş deneyimlerden net sayılarla (KPI, metrik) bahsedebilmek',
        'Ters giden durumları nasıl öğrendiği ve dönüştürdüğü hikayesi',
        'Sektördeki güncel dönüşümleri ve teknolojik araçları yakından takip etmesi',
      ],
    },
    evaluationCriteria: [
      'Stratejik Düşünme & Problem Çözme',
      'İletişim & Etki Yaratma Yeteneği',
      'STAR Metodu ile Yapılandırılmış Anlatım',
      'Teknik ve Fonksiyonel Yetkinlik',
    ],
    questions: [
      {
        id: 'q1',
        category: 'Behavioral',
        categoryLabel: 'Davranışsal Durum',
        questionText: `Daha önce ekibinizle ya da bir paydaşla öncelikler konusunda ciddi bir anlaşmazlık yaşadığınız bir anı ve bunu nasıl çözdüğünüzü anlatır mısınız?`,
        whyTheyAsk: `${title} olarak ekip içi sürtünmeleri nasıl yönettiğinizi ve egonuzu değil ortak hedefi önceliklendirip önceliklendirmediğinizi test ediyor.`,
        evaluationGoal: 'Çatışmayı tırmandırmak yerine veri odaklı, empatik ve yapıcı uzlaşma üretebilme becerisi.',
        recommendedStarApproach: {
          situation: 'Anlaşmazlığın çıktığı proje ve paydaşların zıt taleplerini kısaca tanımlayın.',
          task: 'Sizin rolünüzü ve uzlaşma sağlama görevinizi netleştirin.',
          action: 'Veri toplayarak ortak toplantı düzenlediğiniz ve dinlediğiniz adımları aktarın.',
          result: 'Projenin zamanında teslim edildiğini ve ilişki sermayesinin korunduğunu vurgulayın.',
        },
        doTips: ['Karşı tarafın motivasyonunu anladığınızı gösterin', 'Sonucu sayısal başarıyla bağlayın'],
        dontTips: ['Eski yöneticinizi veya çalışma arkadaşınızı suçlamayın', 'Pasif kaldığınız izlenimi vermeyin'],
        sampleAnswerSkeleton: 'Önceki rolümde X projesinde Y departmanı ile teslimat önceliğinde ayrıştık. Durumu çözmek için...',
      },
      {
        id: 'q2',
        category: 'Functional_Technical',
        categoryLabel: 'Fonksiyonel & Karar Alma',
        questionText: `Elinizde eksik veri varken ve sıkışık bir takvimdeyken kritik bir karar almanız gerektiğinde nasıl bir yol haritası izlersiniz?`,
        whyTheyAsk: 'Belirsizlik toleransınızı, risk yönetimi refleksinizi ve analitik süzgecinizi görmek istiyor.',
        evaluationGoal: 'Felç olmadan (analysis paralysis) hesaplanabilir risk alarak ilerleyebilme.',
        recommendedStarApproach: {
          situation: 'Eksik verili kritik bir acil durum anını örnek verin.',
          task: 'Alınması gereken kararın maliyet ve fırsat dengesini kurun.',
          action: 'Mevcut sinyalleri nasıl önceliklendirdiğinizi ve B planı kurduğunuzu belirtin.',
          result: 'Kararın getirdiği pozitif etkiyi ve aldığınız dersi paylaşın.',
        },
        doTips: ['Geri dönülebilir kararlar ile geri dönülemez kararlar arasındaki farkı bildiğinizi hissettirin'],
        dontTips: ['"Ben sadece hislerime güvenirim" gibi dayanaksız cevaplardan kaçının'],
        sampleAnswerSkeleton: 'Belirsizlik altında önce en kötü senaryoyu sınırlarım, ardından mevcut verinin en kritik %20’lik çekirdeğine bakarak...',
      },
      {
        id: 'q3',
        category: 'Leadership_Culture',
        categoryLabel: 'Liderlik & Kültür',
        questionText: `Ekibinizde motivasyonu düşmüş ya da performans hedeflerinin gerisinde kalan bir çalışma arkadaşınız olduğunda nasıl yaklaşırsınız?`,
        whyTheyAsk: 'Kolektif başarı bilincinizi, mentorluk kapasitenizi ve şirket kültürünü sahiplenme derecenizi ölçüyor.',
        evaluationGoal: 'İnsan odaklı hesap verebilirlik (accountability with empathy) kurabilme.',
        recommendedStarApproach: {
          situation: 'Gecikme yaşayan bir takım arkadaşı örneği.',
          task: 'Hedefi kurtarırken arkadaşınızı kazanma amacı.',
          action: 'Birebir görüşme yapıp kök nedeni keşfetme ve mikro hedefler belirleme.',
          result: 'Performansın eski seviyesine yükselmesi ve ekip moralinin artışı.',
        },
        doTips: ['Dinleme kabiliyetinizi ve yapıcı geri bildirim tekniklerinizi gösterin'],
        dontTips: ['Hemen üst yönetime şikayet etme gibi kolaya kaçan yaklaşımlardan uzak durun'],
        sampleAnswerSkeleton: 'İlk adımım varsayımda bulunmak yerine baş başa bir kahve içip tıkanıklığın kaynağını (araç, süreç, kişisel) dinlemektir...',
      },
      {
        id: 'q4',
        category: 'Curveball',
        categoryLabel: 'Ezber Bozan / Stres Testi',
        questionText: `Bu pozisyondaki ilk 90 gününüzde her şeyin ters gittiğini ve hedeflere ulaşamadığınızı varsayalım. O gün masama geldiğinizde bana ne söylersiniz?`,
        whyTheyAsk: 'Aşırı özgüven yerine öz farkındalığınızı, baskı anındaki dürüstlüğünüzü ve sorun sahiplenme cesaretinizi sınıyor.',
        evaluationGoal: 'Şeffaf kriz yönetimi ve kök neden analizine dayalı düzeltici eylem planı sunabilme.',
        recommendedStarApproach: {
          situation: 'Hipotetik 90 günlük hedef sapması senaryosu.',
          task: 'Panik yapmadan liderle açık diyalog kurma.',
          action: 'Rakamlarla gerçeği masaya koyma, sapmanın 3 ana sebebini ve 30 günlük toparlanma planını sunma.',
          result: 'Güven tazeleme ve süreci geri döndürme garantisi.',
        },
        doTips: ['Gecikmeden erken uyarı vermenin değerini vurgulayın', 'Çözüm önerisi olmadan sorun getirmeyeceğinizi belirtin'],
        dontTips: ['"Ben asla başarısız olmam" gibi gerçek dışı böbürlenmeler yapmayın'],
        sampleAnswerSkeleton: 'Masaya mazeretlerle değil; sapmanın kök neden analizi, korunan kazanımlar ve sonraki 30 günün düzeltici adımlarıyla gelirim...',
      },
    ],
    reverseInterviewQuestions: [
      {
        question: `Sizce önümüzdeki 6-12 ayda bu rolün başarısını en çok tehdit eden en büyük dahili veya harici engel nedir?`,
        strategicObjective: 'Pozisyonun gerçek risklerini ve mülakatçının ajandasındaki gizli endişeyi erkenden öğrenmenizi sağlar.',
      },
      {
        question: `Bu pozisyonda işe başlayacak kişinin ilk çeyrekte başardığında "Harika bir karar vermişiz" dedirtecek en kritik tek gösterge nedir?`,
        strategicObjective: 'Başarı kriterini somutlaştırır ve mülakatçının kafasındaki ideal profil çıktısını netleştirir.',
      },
      {
        question: `Ekibinizin mevcut çalışma kültüründe korumak istediğiniz en güçlü değer ve geliştirmeye açık gördüğünüz alan hangisi?`,
        strategicObjective: 'Liderin özeleştiri kapasitesini ve ekibin gerçek iç dinamiğini anlamanızı sağlar.',
      },
    ],
    confidenceBoostTip: `${title} unvanına sahip kişiler cevabın uzunluğundan ziyade netliğine, yapılandırılmış mantığına ve ne kadar sakin kaldığınıza değer verir. Nefes alın, soruya teşekkür edip 2 saniye düşünün ve STAR adımlarıyla cevabınızı verin.`,
  };
}

function getFallbackTrainingData(completedTrainings: any[], targetGoal: string) {
  const trainingTitles = completedTrainings.map((t) => t.title || 'Eğitim').join(', ');
  return {
    profileDiagnosis: {
      currentMasteryLevel: 'Yetkin Uygulayıcı (Practitioner Level)',
      acquiredCoreStrengths: [
        'Yapılandırılmış metodoloji ve temel disiplin bilgisi',
        'Operasyonel yürütme ve proje tamamlama motivasyonu',
        'Süreç analizi ve problem çözme araçlarına hakimiyet',
      ],
      domainBreadth: `Mevcut eğitimleriniz (${trainingTitles}) güçlü bir fonksiyonel temel oluşturmuş; bir sonraki basamak bu becerileri stratejik ve mimari düzeye taşımaktır.`,
    },
    skillGaps: [
      {
        skill: 'Uçtan Uca Sistem & Mimari Stratejisi',
        gapType: 'Stratejik',
        impactOnCareer: 'Uygulayıcı seviyesinden karar verici ve mimari yönetici seviyesine geçiş için elzemdir.',
        priority: 'High',
      },
      {
        skill: 'Veri Odaklı Metrik & ROI Optimizasyonu',
        gapType: 'Yönetsel',
        impactOnCareer: 'Yaptığınız işin iş dünyasındaki finansal ve operasyonel getirisini kanıtlamanızı sağlar.',
        priority: 'High',
      },
      {
        skill: 'Çapraz Fonksiyonel Liderlik & Paydaş Yönetimi',
        gapType: 'Liderlik',
        impactOnCareer: 'Kıdemli pozisyonlarda teknik başarıdan daha çok aranan temel değerlendirme faktörüdür.',
        priority: 'Medium',
      },
    ],
    recommendedRoadmap: [
      {
        step: 1,
        phaseTitle: 'Aşama 1: Çekirdek Açıkların Kapatılması (0-3 Ay)',
        courseTopic: 'İleri Düzey Sistem Tasarımı, Veri Mimarisi ve Ölçeklenebilirlik',
        whyThisNow: 'Katıldığınız temel eğitimlerin üzerine mühendislik/yönetim vizyonu eklemek için ilk kritik sıçramadır.',
        curriculumOutline: [
          'Büyük ölçekli sistem bileşenleri ve asenkron mimariler',
          'Darboğaz analizi ve performans optimizasyonu teknikleri',
          'Hata toleransı ve yüksek erişilebilirlik prensipleri',
        ],
        recommendedPlatformsOrCerts: ['Coursera Specializations', 'edX MicroMasters', 'O’Reilly Learning'],
        handsOnProject: 'Gerçek zamanlı yük altında çalışan ölçeklenebilir bir mikro mimari prototipi geliştirip dokümante etmek.',
      },
      {
        step: 2,
        phaseTitle: 'Aşama 2: Değer Üretimi ve İş Çıktısı (3-6 Ay)',
        courseTopic: 'Ürün ve İş Metrikleri: ROI, KPI ve Veri Odaklı Karar Alma',
        whyThisNow: 'Yaptığınız fonksiyonel işi doğrudan gelir, tasarruf veya kullanıcı bağlılığı gibi iş hedeflerine bağlamanızı sağlar.',
        curriculumOutline: [
          'A/B testleri ve nedensellik çıkarımı',
          'Maliyet optimizasyonu ve kaynak tahsisi modelleri',
          'Üst yönetim sunumu için gösterge paneli (Executive Dashboard) tasarımı',
        ],
        recommendedPlatformsOrCerts: ['Reforge Cohort Programs', 'Product School Certifications'],
        handsOnProject: 'Şirketiniz veya hayali bir vaka için 6 aylık yatırım getirisi (ROI) ve risk analizi iş planı hazırlamak.',
      },
      {
        step: 3,
        phaseTitle: 'Aşama 3: Üst Düzey Stratejik Liderlik (6-12 Ay)',
        courseTopic: 'Stratejik İletişim, Müzakere ve Teknik/Operasyonel Liderlik',
        whyThisNow: 'Yönetici veya direktör basamağına terfide teknik beceriden öte etki alanı kurma becerisi belirleyicidir.',
        curriculumOutline: [
          'Zorlu paydaş yönetimi ve müzakere taktikleri',
          'Yetenek geliştirme ve yüksek performanslı kültür inşası',
          'Stratejik yol haritası (Roadmap) ve vizyon oluşturma',
        ],
        recommendedPlatformsOrCerts: ['INSEAD Executive Education', 'PMI PMP / Agile Leadership', 'Harvard Business Online'],
        handsOnProject: '10+ kişilik bir departmanın yıllık büyüme, bütçe ve teknoloji/operasyon dönüşüm yol haritasını kurgulamak.',
      },
    ],
    highValueCertifications: [
      {
        name: 'AWS Certified Solutions Architect / Cloud Professional',
        issuer: 'Amazon Web Services',
        careerImpact: 'Modern bulut ve ölçeklenebilir mimari yetkinliğini global olarak tesciller.',
      },
      {
        name: 'Professional Scrum Master II (PSM II) veya PMI-ACP',
        issuer: 'Scrum.org / PMI',
        careerImpact: 'Yalnızca kuralları bilmediğinizi, karmaşık ekipleri ve değer akışını yönetebildiğinizi kanıtlar.',
      },
      {
        name: 'Data-Driven Decision Making & Strategy Specialization',
        issuer: 'Wharton / Coursera',
        careerImpact: 'Karar alma süreçlerinde veriyi stratejik bir avantaja dönüştürme prestiji kazandırır.',
      },
    ],
    coachExecutiveSummary: `Şimdiye kadar tamamladığınız eğitimler sağlam bir zemin inşa etti. Artık bir "ders alıcı" olmaktan çıkıp, aldığınız bilgileri mimari ve liderlik seviyesine transfer eden bir "etki yaratıcı" konumuna geçme zamanınız geldi. Önerilen 3 aşamalı yol haritasını sırayla takip ettiğinizde hedeflediğiniz "${targetGoal}" vizyonuna çok daha sağlam adımlarla ulaşacaksınız.`,
  };
}

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Career Coach Agent server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
