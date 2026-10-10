import React from 'react';
import { Briefcase, Compass, Bookmark, HelpCircle } from 'lucide-react';

interface HeaderProps {
  activeTab: 'interview' | 'learning';
  onSelectTab: (tab: 'interview' | 'learning') => void;
  savedCount: number;
  onOpenSavedModal: () => void;
  onOpenMethodologyModal: () => void;
  onResetToDemo: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  savedCount,
  onOpenSavedModal,
  onOpenMethodologyModal,
  onResetToDemo,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onSelectTab('interview');
          }}
          className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 flex items-center gap-2"
        >
          <span className="w-2.5 h-2.5 rounded-sm bg-indigo-600 inline-block" />
          <span>TalentForge Coach</span>
        </a>

        {/* Zone 2: 4 Navigation Items / Modes (Single-line, concise) */}
        <nav className="flex items-center gap-2 sm:gap-6 text-sm font-medium text-slate-600">
          <button
            onClick={() => onSelectTab('interview')}
            className={`flex items-center gap-2 py-1.5 transition-colors whitespace-nowrap shrink-0 border-b-2 text-sm ${
              activeTab === 'interview'
                ? 'text-slate-900 font-semibold border-indigo-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Mülakat Koçu</span>
          </button>

          <button
            onClick={() => onSelectTab('learning')}
            className={`flex items-center gap-2 py-1.5 transition-colors whitespace-nowrap shrink-0 border-b-2 text-sm ${
              activeTab === 'learning'
                ? 'text-slate-900 font-semibold border-indigo-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Eğitim Yol Haritası</span>
          </button>

          <button
            onClick={onOpenSavedModal}
            className="hidden md:flex items-center gap-1.5 py-1.5 transition-colors whitespace-nowrap shrink-0 text-slate-600 hover:text-slate-900"
          >
            <Bookmark className="w-4 h-4" />
            <span>Kayıtlı Raporlar ({savedCount})</span>
          </button>

          <button
            onClick={onOpenMethodologyModal}
            className="hidden lg:flex items-center gap-1.5 py-1.5 transition-colors whitespace-nowrap shrink-0 text-slate-600 hover:text-slate-900"
          >
            <HelpCircle className="w-4 h-4" />
            <span>STAR Metodolojisi</span>
          </button>
        </nav>

        {/* Zone 3: Single Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onResetToDemo}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 shadow-sm"
          >
            Hızlı Senaryo Yükle
          </button>
        </div>
      </div>
    </header>
  );
};
