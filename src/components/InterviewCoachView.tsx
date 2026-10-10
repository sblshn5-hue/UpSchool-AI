import React, { useState } from 'react';
import {
  Sparkles,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  CheckCircle2,
  Copy,
  Printer,
  BookmarkPlus,
  Send,
  HelpCircle,
  Lightbulb,
  ArrowRight,
  ShieldAlert,
  ThumbsUp,
  Award,
} from 'lucide-react';
import { InterviewAnalysis, QuestionCategory, QuestionItem } from '../types.ts';
import { INTERVIEW_PRESETS } from '../data/presets.ts';

interface InterviewCoachViewProps {
  analysis: InterviewAnalysis | null;
  loading: boolean;
  onGenerate: (data: {
    interviewerTitle: string;
    targetRole: string;
    industry: string;
    experienceLevel: string;
    additionalNotes: string;
  }) => Promise<void>;
  onSaveReport: (analysis: InterviewAnalysis) => void;
  isSaved?: boolean;
}

export const InterviewCoachView: React.FC<InterviewCoachViewProps> = ({
  analysis,
  loading,
  onGenerate,
  onSaveReport,
  isSaved = false,
}) => {
  const [interviewerTitle, setInterviewerTitle] = useState('VP of Engineering');
  const [targetRole, setTargetRole] = useState('Senior Full-Stack & System Architect');
  const [industry, setIndustry] = useState('Teknoloji & SaaS Platformları');
  const [experienceLevel, setExperienceLevel] = useState('Kıdemli (Senior / Lead)');
  const [additionalNotes, setAdditionalNotes] = useState(
    'Şirket monolitik mimariden dağıtık mikroservis mimarisine geçiş yapıyor ve teknik borç yönetimi kritik.'
  );

  const [activeCategory, setActiveCategory] = useState<QuestionCategory>('All');
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);
  const [userPracticeAnswers, setUserPracticeAnswers] = useState<Record<string, string>>({});
  const [practiceOpenId, setPracticeOpenId] = useState<string | null>(null);
  const [copiedNotification, setCopiedNotification] = useState(false);

  const handleApplyPreset = (presetId: string) => {
    const found = INTERVIEW_PRESETS.find((p) => p.id === presetId);
    if (found) {
      setInterviewerTitle(found.interviewerTitle);
      setTargetRole(found.targetRole);
      setIndustry(found.industry);
      setExperienceLevel(found.experienceLevel);
      setAdditionalNotes(found.additionalNotes);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!interviewerTitle.trim()) return;
    onGenerate({
      interviewerTitle,
      targetRole,
      industry,
      experienceLevel,
      additionalNotes,
    });
  };

  const filteredQuestions = analysis
    ? analysis.questions.filter((q) => {
        if (activeCategory === 'All') return true;
        return q.category === activeCategory;
      })
    : [];

  const handleCopyMarkdown = () => {
    if (!analysis) return;
    const lines: string[] = [];
    lines.push(`# Mülakat Hazırlık Raporu: ${analysis.interviewerPersona.title}`);
    lines.push(`Hedef Rol: ${analysis.metadata?.targetRole || targetRole}`);
    lines.push(`Sektör: ${analysis.metadata?.industry || industry}`);
    lines.push('');
    lines.push(`## Mülakatçı Profili & Zihniyeti`);
    lines.push(analysis.interviewerPersona.mindset);
    lines.push('');
    lines.push(`### Temel Öncelikleri:`);
    analysis.interviewerPersona.keyPriorities.forEach((p) => lines.push(`- ${p}`));
    lines.push('');
    lines.push(`### Kırmızı Bayraklar:`);
    analysis.interviewerPersona.potentialRedFlags.forEach((rf) => lines.push(`- ${rf}`));
    lines.push('');
    lines.push(`### Etkilendikleri Nitelikler:`);
    analysis.interviewerPersona.whatImpressesThem.forEach((it) => lines.push(`- ${it}`));
    lines.push('');
    lines.push(`## Potansiyel Sorular (${analysis.questions.length})`);
    analysis.questions.forEach((q, idx) => {
      lines.push(`### ${idx + 1}. [${q.categoryLabel}] ${q.questionText}`);
      lines.push(`- Neden Soruyor?: ${q.whyTheyAsk}`);
      lines.push(`- Değerlendirme Hedefi: ${q.evaluationGoal}`);
      lines.push(`- STAR Yaklaşımı:`);
      lines.push(`  * Durum (S): ${q.recommendedStarApproach.situation}`);
      lines.push(`  * Görev (T): ${q.recommendedStarApproach.task}`);
      lines.push(`  * Eylem (A): ${q.recommendedStarApproach.action}`);
      lines.push(`  * Sonuç (R): ${q.recommendedStarApproach.result}`);
      lines.push('');
    });
    lines.push(`## Adayın Sorması Gereken Tersine Mülakat Soruları`);
    analysis.reverseInterviewQuestions.forEach((rq, idx) => {
      lines.push(`${idx + 1}. "${rq.question}" (Amaç: ${rq.strategicObjective})`);
    });

    navigator.clipboard.writeText(lines.join('\n'));
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  return (
    <div className="space-y-10">
      {/* Hero / Input Configuration Section */}
      <section className="bg-white rounded-xl border border-slate-200 p-6 lg:p-8 shadow-sm">
        <div className="max-w-3xl mb-6">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-2">
            <span>Mülakat Katılımcısı Analizi</span>
            <span aria-hidden="true">·</span>
            <span>Unvan Bazlı Psikolojik Simülasyon</span>
            <span aria-hidden="true">·</span>
            <span>STAR Modeli</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Mülakatçının Unvanına Özel Soru ve Perspektif Üretici
          </h1>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">
            Gireceğiniz mülakatta karşınızda oturacak kişinin unvanını girin. Yapay zeka, o unvanın organizasyondaki
            önceliklerini deşifre ederek size yöneltebileceği en muhtemel soruları, gizli niyetleri ve STAR formatında
            cevap taktiklerini çıkarsın.
          </p>
        </div>

        {/* Quick Scenario Presets */}
        <div className="mb-6 pb-6 border-b border-slate-100">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2.5">
            Hızlı Senaryo Şablonları
          </span>
          <div className="flex flex-wrap gap-2">
            {INTERVIEW_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleApplyPreset(preset.id)}
                className="px-3 py-1.5 text-xs font-medium bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg transition-colors text-left"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Mülakatçının Unvanı (Interviewer Title) *
              </label>
              <input
                type="text"
                required
                value={interviewerTitle}
                onChange={(e) => setInterviewerTitle(e.target.value)}
                placeholder="Örn: VP of Engineering, HR Director, Senior Product Lead, CFO"
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all text-slate-900 placeholder:text-slate-400"
              />
              <span className="text-xs text-slate-500 mt-1 block">
                Örn: Teknik Lider, İK Müdürü, Genel Müdür Yardımcısı, Departman Direktörü
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Başvurduğunuz Hedef Rol / Pozisyon
              </label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="Örn: Kıdemli Yazılım Mimarı, Ürün Yöneticisi, Veri Analisti"
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all text-slate-900 placeholder:text-slate-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Sektör / Çalışma Alanı
              </label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all text-slate-900"
              >
                <option value="Teknoloji & SaaS Platformları">Teknoloji & SaaS Platformları</option>
                <option value="Finans, Bankacılık & FinTech">Finans, Bankacılık & FinTech</option>
                <option value="E-Ticaret, Perakende & Lojistik">E-Ticaret, Perakende & Lojistik</option>
                <option value="Sağlık, Medikal & Biyoteknoloji">Sağlık, Medikal & Biyoteknoloji</option>
                <option value="Danışmanlık, Denetim & İş Hizmetleri">Danışmanlık, Denetim & İş Hizmetleri</option>
                <option value="Üretim, Otomotiv & Enerji">Üretim, Otomotiv & Enerji</option>
                <option value="Pazarlama, Medya & İletişim">Pazarlama, Medya & İletişim</option>
                <option value="Kamu, Eğitim & STK">Kamu, Eğitim & STK</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Deneyim Seviyeniz
              </label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all text-slate-900"
              >
                <option value="Giriş Düzeyi / Yeni Mezun (Junior)">Giriş Düzeyi / Yeni Mezun (Junior - 0-2 Yıl)</option>
                <option value="Orta Düzey (Mid-Level)">Orta Düzey (Mid-Level - 2-5 Yıl)</option>
                <option value="Kıdemli (Senior / Lead)">Kıdemli Uzman (Senior / Lead - 5-9 Yıl)</option>
                <option value="Yönetici / Ekip Lideri (Manager)">Yönetici / Ekip Lideri (Manager - 8+ Yıl)</option>
                <option value="Direktör / C-Suite (Executive)">Direktör / Üst Yönetim (Executive - 12+ Yıl)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Ek Şirket Notu veya Özel Odak (Opsiyonel)
            </label>
            <input
              type="text"
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              placeholder="Örn: Şirket hızlı büyüme aşamasında, ekip yeni kuruluyor veya teknik borç ağırlıklı"
              className="w-full px-3.5 py-2 text-sm bg-slate-50/50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all text-slate-900 placeholder:text-slate-400"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-500">
              Gemini 3.8 Flash motoru ile unvan psikolojisi taranır
            </span>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 rounded-lg shadow-sm transition-all flex items-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Analiz Ediliyor...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Soruları & Perspektifi Üret</span>
                </>
              )}
            </button>
          </div>
        </form>
      </section>

      {/* Loading Skeleton */}
      {loading && (
        <div className="bg-white rounded-xl border border-slate-200 p-8 space-y-6 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-indigo-200" />
            <div className="h-5 bg-slate-200 rounded w-64" />
          </div>
          <div className="h-20 bg-slate-100 rounded-lg" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="h-32 bg-slate-100 rounded-lg" />
            <div className="h-32 bg-slate-100 rounded-lg" />
            <div className="h-32 bg-slate-100 rounded-lg" />
          </div>
          <div className="space-y-4 pt-4">
            <div className="h-16 bg-slate-100 rounded-lg" />
            <div className="h-16 bg-slate-100 rounded-lg" />
            <div className="h-16 bg-slate-100 rounded-lg" />
          </div>
        </div>
      )}

      {/* Results View */}
      {analysis && !loading && (
        <div className="space-y-8">
          {/* Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 text-white p-4 rounded-xl">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 bg-indigo-400 rounded-sm" />
              <div>
                <h3 className="text-sm font-semibold text-white">
                  {analysis.interviewerPersona.title} için Hazırlık Dosyası
                </h3>
                <span className="text-xs text-slate-400">
                  {analysis.questions.length} Soru · {analysis.reverseInterviewQuestions.length} Ters Soru · STAR Rehberi
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onSaveReport(analysis)}
                disabled={isSaved}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                  isSaved
                    ? 'bg-emerald-800/60 text-emerald-200 cursor-default'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                }`}
              >
                <BookmarkPlus className="w-3.5 h-3.5" />
                <span>{isSaved ? 'Rapor Kaydedildi' : 'Raporu Kaydet'}</span>
              </button>

              <button
                type="button"
                onClick={handleCopyMarkdown}
                className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedNotification ? 'Kopyalandı!' : 'Metni Kopyala'}</span>
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Yazdır / PDF</span>
              </button>
            </div>
          </div>

          {/* Interviewer Persona Dossier */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                <span>Mülakatçı Profili</span>
                <span aria-hidden="true">·</span>
                <span>Değerlendirme Merceği</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                {analysis.interviewerPersona.title} Gözünden Mülakatın Anatomisi
              </h2>
              <p className="mt-2 text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-100">
                {analysis.interviewerPersona.mindset}
              </p>
            </div>

            {/* Structured 3-Column Mindset Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              {/* Priorities */}
              <div className="bg-slate-50/70 rounded-lg p-5 border border-slate-200/80">
                <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm mb-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>En Çok Neye Önem Verir?</span>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-700 leading-relaxed">
                  {analysis.interviewerPersona.keyPriorities.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Red Flags */}
              <div className="bg-slate-50/70 rounded-lg p-5 border border-slate-200/80">
                <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm mb-3">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  <span>Nelere Kırmızı Bayrak Çeker?</span>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-700 leading-relaxed">
                  {analysis.interviewerPersona.potentialRedFlags.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-rose-600 font-bold">✕</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* What Impresses Them */}
              <div className="bg-slate-50/70 rounded-lg p-5 border border-slate-200/80">
                <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm mb-3">
                  <Award className="w-4 h-4 text-indigo-600" />
                  <span>Ne Tür Yanıtlardan Etkilenir?</span>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-700 leading-relaxed">
                  {analysis.interviewerPersona.whatImpressesThem.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-indigo-600 font-bold">★</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Evaluation Rubric Criteria */}
            {analysis.evaluationCriteria && analysis.evaluationCriteria.length > 0 && (
              <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs text-slate-600">
                <span className="font-semibold text-slate-800">Değerlendirme Puanlama Kriterleri:</span>
                {analysis.evaluationCriteria.map((crit, idx) => (
                  <React.Fragment key={idx}>
                    {idx > 0 && <span aria-hidden="true">·</span>}
                    <span className="text-slate-700">{crit}</span>
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>

          {/* Question Hub & Categorized List */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Potansiyel Soru Havuzu ({analysis.questions.length})
                </h2>
                <span className="text-xs text-slate-500">
                  {analysis.interviewerPersona.title} unvanının en çok tercih ettiği soru tipleri
                </span>
              </div>

              {/* Category Segmented Control */}
              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg self-start sm:self-auto overflow-x-auto max-w-full">
                {(
                  [
                    { key: 'All', label: 'Tümü' },
                    { key: 'Behavioral', label: 'Davranışsal' },
                    { key: 'Functional_Technical', label: 'Teknik / Karar' },
                    { key: 'Leadership_Culture', label: 'Liderlik' },
                    { key: 'Curveball', label: 'Ezber Bozan' },
                  ] as { key: QuestionCategory; label: string }[]
                ).map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveCategory(tab.key)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                      activeCategory === tab.key
                        ? 'bg-white text-slate-900 shadow-sm font-semibold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Questions List */}
            <div className="space-y-4">
              {filteredQuestions.map((q, index) => {
                const isExpanded = expandedQuestionId === q.id || (!expandedQuestionId && index === 0);
                const isPracticeOpen = practiceOpenId === q.id;

                return (
                  <div
                    key={q.id}
                    className="border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition-all bg-white"
                  >
                    {/* Header Row */}
                    <div
                      className="cursor-pointer"
                      onClick={() => setExpandedQuestionId(isExpanded ? null : q.id)}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <span className="font-semibold text-indigo-700">{q.categoryLabel}</span>
                            <span aria-hidden="true">·</span>
                            <span>Soru #{index + 1}</span>
                          </div>
                          <h3 className="text-base font-semibold text-slate-900 leading-snug">
                            {q.questionText}
                          </h3>
                        </div>
                        <button
                          type="button"
                          className="text-slate-400 hover:text-slate-600 p-1 shrink-0"
                          aria-label="Detayları aç"
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5" />
                          ) : (
                            <ChevronDown className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Collapsible Details */}
                    {isExpanded && (
                      <div className="mt-5 pt-5 border-t border-slate-100 space-y-5 text-sm">
                        {/* Why They Ask & Evaluation Goal */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-900 uppercase tracking-wider mb-1.5">
                              <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
                              <span>Mülakatçının Gizli Niyeti (Neden Soruyor?)</span>
                            </div>
                            <p className="text-xs text-slate-700 leading-relaxed">{q.whyTheyAsk}</p>
                          </div>

                          <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-900 uppercase tracking-wider mb-1.5">
                              <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                              <span>Değerlendirme Ölçütü (Güçlü Yanıt Kriteri)</span>
                            </div>
                            <p className="text-xs text-slate-700 leading-relaxed">{q.evaluationGoal}</p>
                          </div>
                        </div>

                        {/* STAR Framework Guide */}
                        <div className="border border-indigo-100 bg-indigo-50/40 rounded-lg p-4">
                          <div className="text-xs font-bold text-indigo-900 uppercase tracking-wider mb-3 flex items-center justify-between">
                            <span>Önerilen STAR Yanıt İskeleti</span>
                            <span className="text-[11px] font-normal text-indigo-700">
                              Situation · Task · Action · Result
                            </span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                            <div className="bg-white p-3 rounded border border-indigo-100">
                              <span className="font-bold text-slate-900 block mb-1">1. Situation (Durum)</span>
                              <p className="text-slate-600 leading-relaxed">
                                {q.recommendedStarApproach.situation}
                              </p>
                            </div>
                            <div className="bg-white p-3 rounded border border-indigo-100">
                              <span className="font-bold text-slate-900 block mb-1">2. Task (Görev)</span>
                              <p className="text-slate-600 leading-relaxed">
                                {q.recommendedStarApproach.task}
                              </p>
                            </div>
                            <div className="bg-white p-3 rounded border border-indigo-100">
                              <span className="font-bold text-slate-900 block mb-1">3. Action (Eylem)</span>
                              <p className="text-slate-600 leading-relaxed">
                                {q.recommendedStarApproach.action}
                              </p>
                            </div>
                            <div className="bg-white p-3 rounded border border-indigo-100">
                              <span className="font-bold text-slate-900 block mb-1">4. Result (Sonuç)</span>
                              <p className="text-slate-600 leading-relaxed">
                                {q.recommendedStarApproach.result}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Do's & Don'ts */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <span className="text-xs font-semibold text-emerald-800 flex items-center gap-1">
                              <ThumbsUp className="w-3.5 h-3.5" /> Mutlaka Yapın (Do's)
                            </span>
                            <ul className="text-xs text-slate-700 space-y-1">
                              {q.doTips.map((tip, i) => (
                                <li key={i} className="flex items-start gap-1.5">
                                  <span className="text-emerald-600">✓</span>
                                  <span>{tip}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="space-y-1.5">
                            <span className="text-xs font-semibold text-rose-800 flex items-center gap-1">
                              <AlertTriangle className="w-3.5 h-3.5" /> Kesinlikle Kaçının (Don'ts)
                            </span>
                            <ul className="text-xs text-slate-700 space-y-1">
                              {q.dontTips.map((tip, i) => (
                                <li key={i} className="flex items-start gap-1.5">
                                  <span className="text-rose-600">✕</span>
                                  <span>{tip}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Sample Skeleton */}
                        {q.sampleAnswerSkeleton && (
                          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                            <span className="font-semibold text-slate-900 block mb-1">
                              Örnek Giriş Cümlesi & İskelet:
                            </span>
                            <p className="text-slate-600 italic">"{q.sampleAnswerSkeleton}"</p>
                          </div>
                        )}

                        {/* Interactive Practice Workspace */}
                        <div className="pt-2 border-t border-slate-100">
                          <button
                            type="button"
                            onClick={() => setPracticeOpenId(isPracticeOpen ? null : q.id)}
                            className="text-xs font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                          >
                            <span>{isPracticeOpen ? 'Pratik Alanını Kapat' : 'Bu Soru İçin Kendi Cevabımı Yaz & Pratik Yap'}</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>

                          {isPracticeOpen && (
                            <div className="mt-3 p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
                              <label className="block text-xs font-semibold text-slate-700">
                                Kendi Cevap Taslağınız (STAR Notları):
                              </label>
                              <textarea
                                rows={4}
                                value={userPracticeAnswers[q.id] || ''}
                                onChange={(e) =>
                                  setUserPracticeAnswers({
                                    ...userPracticeAnswers,
                                    [q.id]: e.target.value,
                                  })
                                }
                                placeholder="Örn: X projesinde benzer durum oldu. Durum şuydu..., görevim buydu..., şu eylemleri aldım..., sonuç olarak %30 verim artışı sağladık..."
                                className="w-full p-3 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-900 placeholder:text-slate-400"
                              />
                              <div className="flex items-center justify-between text-[11px] text-slate-500">
                                <span>Cevabınız tarayıcınızda geçici olarak saklanır</span>
                                <span className="font-medium text-indigo-600">
                                  {(userPracticeAnswers[q.id] || '').split(/\s+/).filter(Boolean).length} Kelime
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Reverse Interview Section (Questions the candidate should ask) */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                <span>Tersine Mülakat (Reverse Interviewing)</span>
                <span aria-hidden="true">·</span>
                <span>Stratejik Soru Yöneltme</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                Görüşme Sonunda {analysis.interviewerPersona.title} Kişisine Sormanız Gereken Sorular
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Mülakatın sonundaki "Bize bir sorunuz var mı?" anı, sizi diğer adaylardan ayıran en kritik fırsattır.
                Bu sorular unvanın stratejik ajandasını hedefler.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analysis.reverseInterviewQuestions.map((rq, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50/70 p-5 rounded-xl border border-slate-200/80 space-y-2 hover:bg-slate-50 transition-colors"
                >
                  <span className="text-xs font-bold text-indigo-700 block">Soru #{idx + 1}</span>
                  <p className="text-sm font-semibold text-slate-900 leading-snug">"{rq.question}"</p>
                  <div className="pt-2 border-t border-slate-200/60 text-xs text-slate-600">
                    <span className="font-semibold text-slate-700">Stratejik Amaç: </span>
                    {rq.strategicObjective}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Confidence Boost Tip Card */}
          {analysis.confidenceBoostTip && (
            <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-xl p-6 sm:p-8 flex items-start gap-4">
              <Sparkles className="w-6 h-6 text-indigo-300 shrink-0 mt-1" />
              <div>
                <h4 className="text-sm font-semibold text-indigo-200 uppercase tracking-wider mb-1">
                  Koçun Zihinsel Hazırlık & Özgüven Tavsiyesi
                </h4>
                <p className="text-sm text-slate-200 leading-relaxed">
                  {analysis.confidenceBoostTip}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
