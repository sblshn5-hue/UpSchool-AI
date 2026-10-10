import { TrainingItem } from '../types.ts';

export interface InterviewPreset {
  id: string;
  label: string;
  interviewerTitle: string;
  targetRole: string;
  industry: string;
  experienceLevel: string;
  additionalNotes: string;
}

export const INTERVIEW_PRESETS: InterviewPreset[] = [
  {
    id: 'vpe-tech',
    label: 'VP of Engineering → Kıdemli Yazılım Mimarı',
    interviewerTitle: 'VP of Engineering',
    targetRole: 'Senior Full-Stack & System Architect',
    industry: 'Teknoloji & SaaS Platformları',
    experienceLevel: 'Kıdemli (Senior / Lead)',
    additionalNotes: 'Şirket monolitik mimariden dağıtık mikroservis mimarisine geçiş yapıyor ve teknik borç yönetimi kritik.',
  },
  {
    id: 'hr-talent',
    label: 'HR Director → Kıdemli Ürün Yöneticisi',
    interviewerTitle: 'Human Resources Director',
    targetRole: 'Senior Product Manager',
    industry: 'FinTech & Dijital Bankacılık',
    experienceLevel: 'Kıdemli (Senior)',
    additionalNotes: 'Çapraz fonksiyonel ekipler arasında çatışma çözümü, kültür uyumu ve paydaş yönetimi odaklı görüşme.',
  },
  {
    id: 'cmo-growth',
    label: 'Chief Marketing Officer (CMO) → Head of Growth',
    interviewerTitle: 'Chief Marketing Officer',
    targetRole: 'Head of Growth & Digital Strategy',
    industry: 'E-Ticaret & Tüketici Teknolojileri',
    experienceLevel: 'Yönetici / Ekip Lideri (Lead / Manager)',
    additionalNotes: 'Müşteri edinme maliyeti (CAC) düşürme, LTV artışı ve veri odaklı deney döngüleri ön planda.',
  },
  {
    id: 'cfo-finance',
    label: 'CFO / Finans Direktörü → Operasyon Yöneticisi',
    interviewerTitle: 'Chief Financial Officer (CFO)',
    targetRole: 'Operations & Business Planning Manager',
    industry: 'Lojistik & Tedarik Zinciri',
    experienceLevel: 'Kıdemli (Senior)',
    additionalNotes: 'Bütçe disiplini, birim ekonomi analizi ve süreç otomasyonu ile maliyet azaltma hedefleniyor.',
  },
];

export const INITIAL_TRAININGS: TrainingItem[] = [
  {
    id: 'tr-1',
    label: undefined,
    title: 'Modern Full-Stack Web Geliştirme & Bulut Temelleri',
    providerOrInstitution: 'Coursera & IBM Professional Certification',
    completedYear: '2025',
    contentDescription:
      'React 18+, Node.js, Express, REST API tasarımı, PostgreSQL ilişkisel veri modelleme, Docker konteynerizasyonu ve AWS EC2/S3 temel dağıtım süreçleri. Git tabanlı ekip çalışması ve CI/CD pipeline kurulumu.',
    keySkillsCovered: ['React', 'Node.js', 'PostgreSQL', 'Docker', 'AWS Temelleri', 'REST APIs', 'Git'],
  } as any,
  {
    id: 'tr-2',
    title: 'Çevik Proje Yönetimi & Scrum Master Eğitimi',
    providerOrInstitution: 'Scrum.org & PMI Agile Academy',
    completedYear: '2024',
    contentDescription:
      'Scrum metodolojisi, sprint planlama, backlog rafine etme, retrospektif yönetimi, Jira & Confluence kullanımı, paydaş beklenti yönetimi ve takımlarda tıkanıklık (impediment) çözme teknikleri.',
    keySkillsCovered: ['Agile / Scrum', 'Jira', 'Sprint Planning', 'Paydaş İletişimi', 'Takım Koordinasyonu'],
  },
  {
    id: 'tr-3',
    title: 'İş Kararları için Veri Analitiği & SQL Uzmanlığı',
    providerOrInstitution: 'Google Data Analytics Professional Certificate',
    completedYear: '2023',
    contentDescription:
      'İleri düzey SQL sorgulama (Window functions, JOINs, CTE), Tableau ve PowerBI ile iş zekası panelleri oluşturma, veri temizleme ve KPI bazlı performans metrikleri raporlama.',
    keySkillsCovered: ['SQL', 'Tableau', 'Veri Temizleme', 'KPI Gösterge Panelleri', 'İş Zekası (BI)'],
  },
];

export const CAREER_GOAL_PRESETS = [
  'Teknik Lider / Çözüm Mimarı (Solution Architect) Rolüne Yükselmek',
  'Mühendislikten Kıdemli Ürün Yönetimine (Product Management) Geçiş',
  'Veri Odaklı Strateji & Büyüme (Growth & Strategy) Direktörü Olmak',
  'Departman Yöneticisi / Bölüm Lideri (Head of Operations / Engineering) Seviyesine Atlamak',
];
