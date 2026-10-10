import React from 'react';
import { Bookmark, Trash2, ArrowRight, X, Calendar, Briefcase, Compass } from 'lucide-react';
import { SavedReport } from '../types.ts';

interface SavedReportsModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedReports: SavedReport[];
  onSelectReport: (report: SavedReport) => void;
  onDeleteReport: (id: string) => void;
}

export const SavedReportsModal: React.FC<SavedReportsModalProps> = ({
  isOpen,
  onClose,
  savedReports,
  onSelectReport,
  onDeleteReport,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl border border-slate-200 max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <Bookmark className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-bold text-slate-900">
              Kayıtlı Koçluk & Hazırlık Raporları ({savedReports.length})
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {savedReports.length === 0 ? (
            <div className="py-12 text-center text-slate-500 space-y-2">
              <Bookmark className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-sm font-medium">Henüz kayıtlı raporunuz bulunmuyor.</p>
              <p className="text-xs text-slate-400">
                Mülakat veya eğitim yol haritası analizi yaptıktan sonra "Raporu Kaydet" butonuna tıklayarak buraya ekleyebilirsiniz.
              </p>
            </div>
          ) : (
            savedReports.map((report) => (
              <div
                key={report.id}
                className="p-4 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200 transition-colors flex items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="flex items-center gap-1 font-semibold text-indigo-700">
                      {report.type === 'interview' ? (
                        <>
                          <Briefcase className="w-3.5 h-3.5" />
                          <span>Mülakat Hazırlığı</span>
                        </>
                      ) : (
                        <>
                          <Compass className="w-3.5 h-3.5" />
                          <span>Eğitim Yol Haritası</span>
                        </>
                      )}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{report.date}</span>
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">{report.title}</h4>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      onSelectReport(report);
                      onClose();
                    }}
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg flex items-center gap-1 transition-colors"
                  >
                    <span>Raporu Aç</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onDeleteReport(report.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors rounded-lg"
                    title="Raporu Sil"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
          <span>Veriler tarayıcınızın yerel belleğinde (LocalStorage) saklanır.</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-700 hover:text-slate-900"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
