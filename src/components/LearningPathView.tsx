import React, { useState } from 'react';
import {
  Compass,
  Plus,
  Trash2,
  Sparkles,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Copy,
  Printer,
  BookmarkPlus,
  ArrowRight,
  GraduationCap,
  Layers,
  Target,
  Clock,
  Briefcase,
} from 'lucide-react';
import { LearningPathAnalysis, TrainingItem } from '../types.ts';
import { CAREER_GOAL_PRESETS, INITIAL_TRAININGS } from '../data/presets.ts';

interface LearningPathViewProps {
  learningPath: LearningPathAnalysis | null;
  loading: boolean;
  onAnalyze: (data: {
    completedTrainings: TrainingItem[];
    targetCareerGoal: string;
    currentRole: string;
    industry: string;
  }) => Promise<void>;
  onSaveReport: (report: LearningPathAnalysis) => void;
  isSaved?: boolean;
}

export const LearningPathView: React.FC<LearningPathViewProps> = ({
  learningPath,
  loading,
  onAnalyze,
  onSaveReport,
  isSaved = false,
}) => {
  const [trainings, setTrainings] = useState<TrainingItem[]>(INITIAL_TRAININGS);
  const [targetCareerGoal, setTargetCareerGoal] = useState(
    'Teknik Lider / Çözüm Mimarı (Solution Architect) Rolüne Yükselmek'
  );
  const [currentRole, setCurrentRole] = useState('Senior Full-Stack Developer');
  const [industry, setIndustry] = useState('Teknoloji & Yazılım');

  // New Training Form Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newProvider, setNewProvider] = useState('');
  const [newYear, setNewYear] = useState(new Date().getFullYear().toString());
  const [newContent, setNewContent] = useState('');
  const [newSkills, setNewSkills] = useState('');

  // Bulk Paste State
  const [isBulkOpen, setIsBulkOpen] = useState(false);
  const [bulkText, setBulkText] = useState('');

  const [copiedNotification, setCopiedNotification] = useState(false);

  const handleAddTraining = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newItem: TrainingItem = {
      id: `tr-${Date.now()}`,
      title: newTitle.trim(),
      providerOrInstitution: newProvider.trim() || 'Belirtilmedi',
      completedYear: newYear.trim() || undefined,
      contentDescription: newContent.trim() || 'Detaylı içerik belirtilmedi.',
      keySkillsCovered: newSkills
        ? newSkills.split(',').map((s) => s.trim()).filter(Boolean)
        : [],
    };

    setTrainings([...trainings, newItem]);
    setNewTitle('');
    setNewProvider('');
    setNewContent('');
    setNewSkills('');
    setIsAddModalOpen(false);
  };

  const handleRemoveTraining = (id: string) => {
    setTrainings(trainings.filter((t) => t.id !== id));
  };

  const handleBulkImport = () => {
    if (!bulkText.trim()) return;
    const blocks = bulkText.split(/\n\s*\n/).filter(Boolean);
    const imported: TrainingItem[] = blocks.map((block, i) => {
      const lines = block.split('\n').map((l) => l.trim()).filter(Boolean);
      return {
        id: `tr-bulk-${Date.now()}-${i}`,
        title: lines[0] || `Eğitim ${i + 1}`,
        providerOrInstitution: lines[1] || 'Platform / Kurum',
        completedYear: '2024',
        contentDescription: lines.slice(2).join(' ') || block,
        keySkillsCovered: [],
      };
    });
    setTrainings([...trainings, ...imported]);
    setBulkText('');
    setIsBulkOpen(false);
  };

  const handleSubmitAnalysis = () => {
    if (trainings.length === 0) return;
    onAnalyze({
      completedTrainings: trainings,
      targetCareerGoal,
      currentRole,
      industry,
    });
  };

  const handleCopyMarkdown = () => {
    if (!learningPath) return;
    const lines: string[] = [];
    lines.push(`# Eğitim & Yetkinlik Yol Haritası Raporu`);
    lines.push(`Mevcut Rol: ${currentRole}`);
    lines.push(`Hedef: ${targetCareerGoal}`);
    lines.push('');
    lines.push(`## Profil Teşhisi`);
    lines.push(`Seviye: ${learningPath.profileDiagnosis.currentMasteryLevel}`);
    lines.push(`Kazanılan Güçlü Yönler:`);
    learningPath.profileDiagnosis.acquiredCoreStrengths.forEach((s) => lines.push(`- ${s}`));
    lines.push('');
    lines.push(`## Beceri Açıkları (Skill Gaps)`);
    learningPath.skillGaps.forEach((g) => {
      lines.push(`- [${g.priority}] ${g.skill} (${g.gapType}): ${g.impactOnCareer}`);
    });
    lines.push('');
    lines.push(`## 3 Aşamalı Eğitim Yol Haritası`);
    learningPath.recommendedRoadmap.forEach((step) => {
      lines.push(`### ${step.phaseTitle}: ${step.courseTopic}`);
      lines.push(`Neden Şimdi?: ${step.whyThisNow}`);
      lines.push(`Müfredat: ${step.curriculumOutline.join(', ')}`);
      lines.push(`Platformlar: ${step.recommendedPlatformsOrCerts.join(', ')}`);
      lines.push(`Bitirme Projesi: ${step.handsOnProject}`);
      lines.push('');
    });
    lines.push(`## Koçun Yönetici Özeti`);
    lines.push(learningPath.coachExecutiveSummary);

    navigator.clipboard.writeText(lines.join('\n'));
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  return (
    <div className="space-y-10">
      {/* Configuration & Training Inventory Section */}
      <section className="bg-white rounded-xl border border-slate-200 p-6 lg:p-8 shadow-sm">
        <div className="max-w-3xl mb-6">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-2">
            <span>Eğitim Geçmişi Analizi</span>
            <span aria-hidden="true">·</span>
            <span>Beceri Açığı (Skill Gap) Teşhisi</span>
            <span aria-hidden="true">·</span>
            <span>Gelişim Planı</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Katıldığınız Eğitimlerden Sonraki Adım Eğitim Yol Haritası
          </h1>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">
            Şimdiye kadar tamamladığınız kursları ve eğitim içeriklerini girin. Yapay zeka, mevcut yetkinlik
            seviyenizi analiz etsin; hedeflediğiniz rol için eksik kalan beceri açıklarını çıkarıp adım adım hangi
            eğitimleri almanız gerektiğini planlasın.
          </p>
        </div>

        {/* Goals & Context */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8 pb-8 border-b border-slate-100">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Mevcut Rolünüz / Uzmanlığınız
            </label>
            <input
              type="text"
              value={currentRole}
              onChange={(e) => setCurrentRole(e.target.value)}
              placeholder="Örn: Senior Yazılım Geliştirici, İş Analisti"
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-900 placeholder:text-slate-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Hedeflediğiniz Kariyer Amacı *
            </label>
            <input
              type="text"
              required
              value={targetCareerGoal}
              onChange={(e) => setTargetCareerGoal(e.target.value)}
              placeholder="Örn: Çözüm Mimarı olmak, Ürün Direktörlüğüne terfi"
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-900 placeholder:text-slate-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Sektör / Uzmanlık Alanı
            </label>
            <input
              type="text"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              placeholder="Örn: Finans & Bankacılık, E-Ticaret"
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-900"
            />
          </div>

          {/* Quick presets for career goal */}
          <div className="md:col-span-3">
            <span className="text-xs text-slate-500 mr-2">Örnek Hedefler:</span>
            <div className="inline-flex flex-wrap gap-2 mt-1">
              {CAREER_GOAL_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setTargetCareerGoal(preset)}
                  className="text-xs text-indigo-700 hover:text-indigo-900 hover:underline"
                >
                  {preset}
                  {idx < CAREER_GOAL_PRESETS.length - 1 && ' · '}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Training Inventory Table / Cards */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Katılınan Eğitimlerin Listesi ({trainings.length})
              </h3>
              <span className="text-xs text-slate-500">
                Eğitimin içeriği ve müfredat detayları ne kadar zengin olursa, tavsiye edilen yol haritası o kadar keskin olur.
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsBulkOpen(!isBulkOpen)}
                className="px-3 py-1.5 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
              >
                Toplu Metin Yapıştır
              </button>

              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="px-3.5 py-1.5 text-xs font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Yeni Eğitim Ekle</span>
              </button>
            </div>
          </div>

          {/* Bulk Paste Area */}
          {isBulkOpen && (
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-800">
                  Toplu Eğitim Girişi (CV veya LinkedIn Metni):
                </span>
                <span className="text-xs text-slate-500">Her eğitimi boş bir satırla ayırın</span>
              </div>
              <textarea
                rows={4}
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
                placeholder="Örnek:&#10;AWS Cloud Practitioner Bootcamp&#10;Amazon Web Services&#10;Bulut bilişim temelleri, S3, EC2, IAM güvenlik politikaları...&#10;&#10;İleri Düzey Python ile Makine Öğrenmesi&#10;DataCamp&#10;Scikit-learn, regresyon, sınıflandırma modelleri..."
                className="w-full p-3 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-900 placeholder:text-slate-400"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsBulkOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900"
                >
                  Vazgeç
                </button>
                <button
                  type="button"
                  onClick={handleBulkImport}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg"
                >
                  İçeri Aktar
                </button>
              </div>
            </div>
          )}

          {/* Training Cards Grid */}
          {trainings.length === 0 ? (
            <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-xl">
              <BookOpen className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-700">Henüz eğitim eklenmedi</p>
              <p className="text-xs text-slate-500 mt-1">
                Yukarıdaki "Yeni Eğitim Ekle" butonuna tıklayarak veya hazır şablonu yükleyerek başlayın.
              </p>
              <button
                type="button"
                onClick={() => setTrainings(INITIAL_TRAININGS)}
                className="mt-3 text-xs font-semibold text-indigo-600 hover:underline"
              >
                Örnek 3 Eğitimi Yükle
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {trainings.map((item, idx) => (
                <div
                  key={item.id}
                  className="bg-slate-50/70 border border-slate-200 rounded-xl p-4 flex flex-col justify-between hover:bg-slate-50 transition-colors"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="text-xs text-slate-500">
                        <span>{item.providerOrInstitution}</span>
                        {item.completedYear && (
                          <>
                            <span aria-hidden="true"> · </span>
                            <span>{item.completedYear}</span>
                          </>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveTraining(item.id)}
                        className="text-slate-400 hover:text-rose-600 p-0.5 shrink-0"
                        title="Eğitimi Kaldır"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 leading-snug">{item.title}</h4>

                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {item.contentDescription}
                    </p>

                    {item.keySkillsCovered && item.keySkillsCovered.length > 0 && (
                      <div className="pt-2 border-t border-slate-200/60 flex flex-wrap gap-1 text-[11px] text-slate-500">
                        {item.keySkillsCovered.map((skill, sIdx) => (
                          <span key={sIdx} className="bg-white px-2 py-0.5 rounded border border-slate-200/80">
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Submit Trigger */}
          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-slate-500">
              {trainings.length} tamamlanan eğitim içeriği sentezlenecek
            </span>
            <button
              type="button"
              onClick={handleSubmitAnalysis}
              disabled={loading || trainings.length === 0}
              className="w-full sm:w-auto px-6 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 rounded-lg shadow-sm transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Eğitim Yol Haritası Çıkarılıyor...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Beceri Açığını & Sonraki Adım Eğitimleri Analiz Et</span>
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Add Training Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 max-w-lg w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Yeni Tamamlanan Eğitim Ekle</h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddTraining} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Eğitim / Kurs Başlığı *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Örn: İleri Düzey Dağıtık Sistemler ve Mikroservis Mimarisi"
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-900 placeholder:text-slate-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Veren Kurum / Platform
                  </label>
                  <input
                    type="text"
                    value={newProvider}
                    onChange={(e) => setNewProvider(e.target.value)}
                    placeholder="Örn: Coursera, O'Reilly, Üniversite"
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Tamamlanma Yılı
                  </label>
                  <input
                    type="text"
                    value={newYear}
                    onChange={(e) => setNewYear(e.target.value)}
                    placeholder="Örn: 2024"
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Eğitimin İçeriği & İşlenen Konular (Müfredat Detayı) *
                </label>
                <textarea
                  rows={4}
                  required
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Eğitimde hangi konular, teknolojiler, teorik veya pratik metodolojiler ele alındı? Kursun izlencesini buraya yapıştırabilirsiniz."
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-900 placeholder:text-slate-400"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Kazanılan Beceriler (Virgülle ayırın)
                </label>
                <input
                  type="text"
                  value={newSkills}
                  onChange={(e) => setNewSkills(e.target.value)}
                  placeholder="Örn: Kafka, Kubernetes, Event-Driven Architecture, CQRS"
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3.5 py-2 text-slate-600 hover:text-slate-900"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
                >
                  Listeye Ekle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && (
        <div className="bg-white rounded-xl border border-slate-200 p-8 space-y-6 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-indigo-200" />
            <div className="h-5 bg-slate-200 rounded w-72" />
          </div>
          <div className="h-24 bg-slate-100 rounded-lg" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="h-36 bg-slate-100 rounded-lg" />
            <div className="h-36 bg-slate-100 rounded-lg" />
            <div className="h-36 bg-slate-100 rounded-lg" />
          </div>
          <div className="h-48 bg-slate-100 rounded-lg" />
        </div>
      )}

      {/* Analysis Results View */}
      {learningPath && !loading && (
        <div className="space-y-8">
          {/* Action Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 text-white p-4 rounded-xl">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 bg-emerald-400 rounded-sm" />
              <div>
                <h3 className="text-sm font-semibold text-white">
                  Kişiselleştirilmiş Kariyer & Eğitim Yol Haritası
                </h3>
                <span className="text-xs text-slate-400">
                  {learningPath.profileDiagnosis.currentMasteryLevel} · {learningPath.skillGaps.length} Beceri Açığı · 3 Aşamalı Müfredat
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onSaveReport(learningPath)}
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

          {/* Profile Diagnosis Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                <span>Profil Teşhisi</span>
                <span aria-hidden="true">·</span>
                <span>Yetkinlik Envanteri Değerlendirmesi</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                Eğitimlerinizin Oluşturduğu Yetkinlik Zemini
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Mastery Level */}
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                  Mevcut Teşhis Seviyesi
                </span>
                <div className="text-lg font-bold text-indigo-700">
                  {learningPath.profileDiagnosis.currentMasteryLevel}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {learningPath.profileDiagnosis.domainBreadth}
                </p>
              </div>

              {/* Acquired Strengths */}
              <div className="md:col-span-2 bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                  Kazanılmış Çekirdek Güçlü Yönler (Eğitimlerden Kanıtlananlar)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {learningPath.profileDiagnosis.acquiredCoreStrengths.map((strength, sIdx) => (
                    <div key={sIdx} className="flex items-start gap-2 text-xs text-slate-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{strength}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Skill Gaps Breakdown */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                <span>Beceri Açığı (Skill Gap) Analizi</span>
                <span aria-hidden="true">·</span>
                <span>Hedefe Ulaşmak İçin Eksik Kalan Halkalar</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                "{targetCareerGoal}" Vizyonu İçin Kapatılması Gereken Açıklar
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Tamamladığınız eğitimler sağlam bir zemin kurdu; ancak bir sonraki seviyeye atlamak için aşağıdaki yetkinlik
                kümeleri henüz adreslenmemiş görünüyor:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {learningPath.skillGaps.map((gap, gIdx) => {
                const isHigh = gap.priority === 'High' || gap.priority === 'Yüksek';
                return (
                  <div
                    key={gIdx}
                    className={`rounded-xl p-5 border flex flex-col justify-between space-y-3 ${
                      isHigh
                        ? 'bg-amber-50/40 border-amber-200'
                        : 'bg-slate-50/70 border-slate-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="font-semibold text-slate-600">{gap.gapType}</span>
                        <span
                          className={`font-bold ${
                            isHigh ? 'text-amber-700' : 'text-slate-600'
                          }`}
                        >
                          Öncelik: {gap.priority}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">{gap.skill}</h4>
                      <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                        {gap.impactOnCareer}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3-Phase Recommended Roadmap */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-8">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                <span>Adım Adım Gelişim Müfredatı</span>
                <span aria-hidden="true">·</span>
                <span>Zaman Çizelgesi ve Eylem Planı</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                Bir Sonraki Adım İçin Önerilen 3 Aşamalı Eğitim Yol Haritası
              </h2>
            </div>

            <div className="space-y-6">
              {learningPath.recommendedRoadmap.map((step, idx) => (
                <div
                  key={idx}
                  className="border border-slate-200 rounded-xl p-6 bg-slate-50/40 hover:bg-slate-50 transition-colors space-y-5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200/80">
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                        {step.step || idx + 1}
                      </span>
                      <div>
                        <h3 className="text-base font-bold text-slate-900">{step.phaseTitle}</h3>
                        <span className="text-xs font-semibold text-indigo-700">
                          Önerilen Konu: {step.courseTopic}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Why this now */}
                  <div className="bg-white p-3.5 rounded-lg border border-slate-200 text-xs">
                    <span className="font-semibold text-slate-900 block mb-1">
                      Neden Tam Olarak Bu Eğitimi Almalısınız? (Stratejik Gerekçe):
                    </span>
                    <p className="text-slate-700 leading-relaxed">{step.whyThisNow}</p>
                  </div>

                  {/* Curriculum Outline */}
                  <div>
                    <span className="text-xs font-semibold text-slate-800 block mb-2">
                      Odaklanılacak Müfredat Modülleri:
                    </span>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                      {step.curriculumOutline.map((item, cIdx) => (
                        <li key={cIdx} className="flex items-start gap-1.5">
                          <span className="text-indigo-600 font-bold">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Recommended Platforms / Certs & Hands-on Project */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="bg-white p-4 rounded-lg border border-slate-200 space-y-1">
                      <span className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                        <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
                        Tavsiye Edilen Platform & Sertifikalar
                      </span>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {step.recommendedPlatformsOrCerts.join(' · ')}
                      </p>
                    </div>

                    <div className="bg-white p-4 rounded-lg border border-slate-200 space-y-1">
                      <span className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-emerald-600" />
                        Uygulamalı Portfolyo Bitirme Projesi (Hands-on Project)
                      </span>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {step.handsOnProject}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* High-ROI Global Certifications */}
          {learningPath.highValueCertifications && learningPath.highValueCertifications.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-6">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                  <span>Piyasa Değeri Yüksek Sertifikalar</span>
                  <span aria-hidden="true">·</span>
                  <span>Endüstriyel Akreditasyon</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900">
                  Kariyer Sıçraması Yaptıracak Prestijli Sertifikasyonlar
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {learningPath.highValueCertifications.map((cert, cIdx) => (
                  <div
                    key={cIdx}
                    className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-2 hover:bg-white transition-colors"
                  >
                    <span className="text-xs text-indigo-700 font-semibold">{cert.issuer}</span>
                    <h4 className="text-sm font-bold text-slate-900 leading-snug">{cert.name}</h4>
                    <p className="text-xs text-slate-600 pt-1 leading-relaxed">{cert.careerImpact}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Coach Executive Summary */}
          {learningPath.coachExecutiveSummary && (
            <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-xl p-6 sm:p-8 flex items-start gap-4">
              <Sparkles className="w-6 h-6 text-indigo-300 shrink-0 mt-1" />
              <div>
                <h4 className="text-sm font-semibold text-indigo-200 uppercase tracking-wider mb-1">
                  Baş Danışman Yönetici Özeti & Stratejik Tavsiye
                </h4>
                <p className="text-sm text-slate-200 leading-relaxed">
                  {learningPath.coachExecutiveSummary}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
