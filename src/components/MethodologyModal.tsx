import React from 'react';
import { X, CheckCircle2, Lightbulb, Target, Sparkles } from 'lucide-react';

interface MethodologyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MethodologyModal: React.FC<MethodologyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl border border-slate-200 max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-bold text-slate-900">
              Mülakat Koçluğu & STAR Metodolojisi
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto space-y-6 text-sm text-slate-700 pr-1">
          {/* Section 1: STAR Modeli */}
          <div className="space-y-3">
            <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-600" />
              1. STAR (Situation, Task, Action, Result) Tekniği
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Üst düzey yöneticiler ve İK liderleri, adayların geçmiş davranışlarının gelecekteki performansı öngördüğüne
              inanır. STAR modeli, dağılmadan ve hikayeden sapmadan güçlü yanıtlar vermenizi sağlar:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900 block">S - Situation (Durum)</span>
                <p className="text-slate-600">
                  Bağlamı ve ortamı 1-2 cümlede çizin. Çok fazla detaya boğulmayın.
                </p>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900 block">T - Task (Görev)</span>
                <p className="text-slate-600">
                  Sizin üzerinize düşen spesifik sorumluluk ve çözülmesi gereken ana engel neydi?
                </p>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900 block">A - Action (Eylem)</span>
                <p className="text-slate-600">
                  "Biz" değil "Ben" diyerek bizzat aldığınız aksiyonları, yöntem ve araçları aktarın.
                </p>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900 block">R - Result (Sonuç)</span>
                <p className="text-slate-600">
                  Ölçülebilir çıktı (%, zaman, maliyet tasarrufu) ve edindiğiniz ders ile bitirin.
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Unvan Psikolojisi */}
          <div className="space-y-3">
            <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              2. Neden Mülakatçının Unvanı Bu Kadar Önemli?
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Bir İK Direktörü ile bir Mühendislik Başkan Yardımcısı (VP of Engineering) aynı soruya farklı kulaklarla
              bakar. İK kültürel uyum, çatışma çözümü ve bağlılık sinyallerini dinlerken; teknik lider ölçeklenebilirlik,
              hata anındaki soğukkanlılık ve teknik borç vizyonunu tartar.
            </p>
          </div>

          {/* Section 3: Tersine Mülakat */}
          <div className="space-y-3">
            <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-600" />
              3. Tersine Mülakat (Reverse Interviewing) Gücü
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Mülakatın sonunda "Bize sormak istediğiniz bir şey var mı?" sorusuna verilecek yüzeysel sorular ("Yemek
              ücreti var mı?") adayı eler. Stratejik sorular ise mülakatçıya "Bu kişi şimdiden bizim takımın başarısını
              düşünüyor" hissi verir.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
          >
            Anladım, Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
