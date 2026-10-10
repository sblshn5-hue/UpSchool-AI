import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.tsx';
import { InterviewCoachView } from './components/InterviewCoachView.tsx';
import { LearningPathView } from './components/LearningPathView.tsx';
import { SavedReportsModal } from './components/SavedReportsModal.tsx';
import { MethodologyModal } from './components/MethodologyModal.tsx';
import { InterviewAnalysis, LearningPathAnalysis, SavedReport } from './types.ts';
import { INITIAL_TRAININGS } from './data/presets.ts';

const LOCAL_STORAGE_REPORTS_KEY = 'talentforge_saved_reports';
const LOCAL_STORAGE_LAST_INTERVIEW = 'talentforge_last_interview';
const LOCAL_STORAGE_LAST_LEARNING = 'talentforge_last_learning';

export default function App() {
  const [activeTab, setActiveTab] = useState<'interview' | 'learning'>('interview');
  const [interviewAnalysis, setInterviewAnalysis] = useState<InterviewAnalysis | null>(null);
  const [learningPathAnalysis, setLearningPathAnalysis] = useState<LearningPathAnalysis | null>(null);

  const [loadingInterview, setLoadingInterview] = useState(false);
  const [loadingLearning, setLoadingLearning] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const [savedReports, setSavedReports] = useState<SavedReport[]>([]);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [isMethodologyModalOpen, setIsMethodologyModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load saved state from LocalStorage on mount
  useEffect(() => {
    try {
      const storedReports = localStorage.getItem(LOCAL_STORAGE_REPORTS_KEY);
      if (storedReports) {
        setSavedReports(JSON.parse(storedReports));
      }

      const storedInterview = localStorage.getItem(LOCAL_STORAGE_LAST_INTERVIEW);
      if (storedInterview) {
        setInterviewAnalysis(JSON.parse(storedInterview));
      }

      const storedLearning = localStorage.getItem(LOCAL_STORAGE_LAST_LEARNING);
      if (storedLearning) {
        setLearningPathAnalysis(JSON.parse(storedLearning));
      }
    } catch (e) {
      console.warn('LocalStorage load error:', e);
    }
  }, []);

  // Save changes to LocalStorage
  const persistReports = (newReports: SavedReport[]) => {
    setSavedReports(newReports);
    try {
      localStorage.setItem(LOCAL_STORAGE_REPORTS_KEY, JSON.stringify(newReports));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // 1. Generate Interview Questions & Persona
  const handleGenerateInterview = async (params: {
    interviewerTitle: string;
    targetRole: string;
    industry: string;
    experienceLevel: string;
    additionalNotes: string;
  }) => {
    setLoadingInterview(true);
    setApiError(null);
    try {
      const res = await fetch('/api/interview/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Mülakat analizi oluşturulurken sunucu hatası oluştu.');
      }

      const data: InterviewAnalysis = await res.json();
      data.metadata = {
        interviewerTitle: params.interviewerTitle,
        targetRole: params.targetRole,
        industry: params.industry,
        experienceLevel: params.experienceLevel,
      };
      data.timestamp = Date.now();

      setInterviewAnalysis(data);
      localStorage.setItem(LOCAL_STORAGE_LAST_INTERVIEW, JSON.stringify(data));
      showToast(`${params.interviewerTitle} için mülakat hazırlığı başarıyla üretildi.`);
    } catch (err: any) {
      console.error(err);
      setApiError(err.message || 'Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoadingInterview(false);
    }
  };

  // 2. Generate Learning Path & Skill Gaps
  const handleGenerateLearningPath = async (params: {
    completedTrainings: any[];
    targetCareerGoal: string;
    currentRole: string;
    industry: string;
  }) => {
    setLoadingLearning(true);
    setApiError(null);
    try {
      const res = await fetch('/api/training/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Eğitim analizi oluşturulurken sunucu hatası oluştu.');
      }

      const data: LearningPathAnalysis = await res.json();
      data.metadata = {
        trainingsCount: params.completedTrainings.length,
        targetCareerGoal: params.targetCareerGoal,
        currentRole: params.currentRole,
      };
      data.timestamp = Date.now();

      setLearningPathAnalysis(data);
      localStorage.setItem(LOCAL_STORAGE_LAST_LEARNING, JSON.stringify(data));
      showToast('Kariyer gelişim ve sonraki adım eğitim planı hazırlandı.');
    } catch (err: any) {
      console.error(err);
      setApiError(err.message || 'Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoadingLearning(false);
    }
  };

  // 3. Save Report
  const handleSaveInterviewReport = (item: InterviewAnalysis) => {
    const title = `${item.interviewerPersona.title} (${item.metadata?.targetRole || 'Mülakat'})`;
    const newReport: SavedReport = {
      id: `report-${Date.now()}`,
      type: 'interview',
      title,
      date: new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' }),
      interviewData: item,
    };
    persistReports([newReport, ...savedReports]);
    showToast('Mülakat raporu kayıtlarınıza eklendi.');
  };

  const handleSaveLearningReport = (item: LearningPathAnalysis) => {
    const title = `Eğitim Yol Haritası: ${item.metadata?.targetCareerGoal || 'Kariyer Planı'}`;
    const newReport: SavedReport = {
      id: `report-${Date.now()}`,
      type: 'learning_path',
      title,
      date: new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' }),
      learningPathData: item,
    };
    persistReports([newReport, ...savedReports]);
    showToast('Eğitim yol haritası kayıtlarınıza eklendi.');
  };

  const handleDeleteReport = (id: string) => {
    const updated = savedReports.filter((r) => r.id !== id);
    persistReports(updated);
    showToast('Rapor silindi.');
  };

  const handleSelectReport = (report: SavedReport) => {
    if (report.type === 'interview' && report.interviewData) {
      setInterviewAnalysis(report.interviewData);
      setActiveTab('interview');
    } else if (report.type === 'learning_path' && report.learningPathData) {
      setLearningPathAnalysis(report.learningPathData);
      setActiveTab('learning');
    }
    showToast(`"${report.title}" görüntülendi.`);
  };

  // Reset to Demo data trigger
  const handleResetToDemo = () => {
    handleGenerateInterview({
      interviewerTitle: 'VP of Engineering',
      targetRole: 'Senior Full-Stack & System Architect',
      industry: 'Teknoloji & SaaS Platformları',
      experienceLevel: 'Kıdemli (Senior / Lead)',
      additionalNotes: 'Şirket monolitik mimariden dağıtık mikroservis mimarisine geçiş yapıyor.',
    });
  };

  const isCurrentInterviewSaved = Boolean(
    interviewAnalysis &&
      savedReports.some(
        (r) =>
          r.type === 'interview' &&
          r.interviewData?.interviewerPersona.title === interviewAnalysis.interviewerPersona.title
      )
  );

  const isCurrentLearningSaved = Boolean(
    learningPathAnalysis &&
      savedReports.some(
        (r) =>
          r.type === 'learning_path' &&
          r.learningPathData?.metadata?.targetCareerGoal === learningPathAnalysis.metadata?.targetCareerGoal
      )
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-indigo-500/10 selection:text-indigo-900">
      {/* Top Bar Header */}
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        savedCount={savedReports.length}
        onOpenSavedModal={() => setIsSavedModalOpen(true)}
        onOpenMethodologyModal={() => setIsMethodologyModalOpen(true)}
        onResetToDemo={handleResetToDemo}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-lg shadow-xl border border-slate-800 transition-all animate-fade-in flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* API Error Notification */}
      {apiError && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs px-4 py-3 rounded-lg flex items-center justify-between">
            <span>{apiError}</span>
            <button
              type="button"
              onClick={() => setApiError(null)}
              className="text-rose-600 hover:text-rose-800 font-bold ml-4"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Main Workspace Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'interview' ? (
          <InterviewCoachView
            analysis={interviewAnalysis}
            loading={loadingInterview}
            onGenerate={handleGenerateInterview}
            onSaveReport={handleSaveInterviewReport}
            isSaved={isCurrentInterviewSaved}
          />
        ) : (
          <LearningPathView
            learningPath={learningPathAnalysis}
            loading={loadingLearning}
            onAnalyze={handleGenerateLearningPath}
            onSaveReport={handleSaveLearningReport}
            isSaved={isCurrentLearningSaved}
          />
        )}
      </main>

      {/* Modals */}
      <SavedReportsModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        savedReports={savedReports}
        onSelectReport={handleSelectReport}
        onDeleteReport={handleDeleteReport}
      />

      <MethodologyModal
        isOpen={isMethodologyModalOpen}
        onClose={() => setIsMethodologyModalOpen(false)}
      />

      {/* Minimal Editorial Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-xs text-slate-500 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">TalentForge AI</span>
            <span aria-hidden="true">·</span>
            <span>Interview & Career Coach Agent</span>
            <span aria-hidden="true">·</span>
            <span>Google Gemini 3.8 Flash Engine</span>
          </div>
          <div>
            <span>Tüm hakları saklıdır © {new Date().getFullYear()}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
