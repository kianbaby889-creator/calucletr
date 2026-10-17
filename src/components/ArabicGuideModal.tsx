import React from 'react';
import { X, BookOpen, CheckCircle2, Coins, ArrowRight, Shield, Database, Sparkles } from 'lucide-react';

interface ArabicGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArabicGuideModal: React.FC<ArabicGuideModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div
        className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-4 sm:p-6 text-slate-200 space-y-4"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-100 font-['Cinzel',serif] flex items-center gap-2">
                <span>Albion Online Refining Guide</span>
                <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  دليل المستخدم
                </span>
              </h3>
              <p className="text-xs text-amber-400">
                Real-Time T2 & T3 Multi-User Refining & Arbitrage Manual
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Overview Box in Arabic & English */}
        <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-xs leading-relaxed space-y-2">
          <h4 className="font-bold text-amber-300 text-sm flex items-center gap-1.5">
            <Coins className="w-4 h-4" /> ما تم إنجازه في هذا التطبيق (Overview):
          </h4>
          <p className="text-slate-300 leading-relaxed font-['Cairo',sans-serif]">
            تم بناء حاسبة تكرير متطورة وفائقة الأداء للاعبي ألبيون أونلاين لمستويات المواد <strong>Tier 2</strong> و <strong>Tier 3</strong> لجميع الموارد الـ 5 مع حساب دقيق لمعدل الاسترجاع (RRR) والضرائب، وإبراز أفضل مدن الشراء والصقل والبيع، مع دعم المزامنة اللحظية بين مستخدمين متعددين عبر WebSockets و Supabase.
          </p>
          <p className="text-slate-400 text-[11px]">
            Comprehensive real-time refining & hauling arbitrage engine for Tier 2 and Tier 3 materials with auto-synchronized prices across all connected crafters.
          </p>
        </div>

        {/* 2-Column Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {/* Card 1: Cities & Resources */}
          <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800/80 space-y-2">
            <h5 className="font-bold text-slate-100 flex items-center gap-1.5 text-cyan-400">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" /> 1. Royal Cities Bonus Matrix (+40%)
            </h5>
            <ul className="text-slate-300 space-y-1.5 text-[11px] leading-relaxed">
              <li className="flex items-start gap-1">
                <span className="text-cyan-400 font-bold">•</span>
                <span><strong>Martlock (مارتلوك):</strong> Leather / Hide (+40% RRR bonus)</span>
              </li>
              <li className="flex items-start gap-1">
                <span className="text-emerald-400 font-bold">•</span>
                <span><strong>Fort Sterling (فورت ستيرلينغ):</strong> Wood / Planks (+40% RRR bonus)</span>
              </li>
              <li className="flex items-start gap-1">
                <span className="text-teal-400 font-bold">•</span>
                <span><strong>Lymhurst (ليمهرست):</strong> Cloth / Fiber (+40% RRR bonus)</span>
              </li>
              <li className="flex items-start gap-1">
                <span className="text-purple-400 font-bold">•</span>
                <span><strong>Thetford (ثيتفورد):</strong> Metal / Ore (+40% RRR bonus)</span>
              </li>
              <li className="flex items-start gap-1">
                <span className="text-amber-400 font-bold">•</span>
                <span><strong>Bridgewatch (بريدج ووتش):</strong> Stone / Rock (+40% RRR bonus)</span>
              </li>
              <li className="flex items-start gap-1">
                <span className="text-rose-400 font-bold">•</span>
                <span><strong>Caerleon (كارليون):</strong> High Margin / Black Market sales</span>
              </li>
            </ul>
          </div>

          {/* Card 2: RRR & Taxes */}
          <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800/80 space-y-2">
            <h5 className="font-bold text-slate-100 flex items-center gap-1.5 text-amber-400">
              <CheckCircle2 className="w-4 h-4 text-amber-400" /> 2. RRR Formulas & Market Taxes
            </h5>
            <div className="space-y-1.5 text-[11px] text-slate-300 leading-relaxed font-['Cairo',sans-serif]">
              <div>
                <strong className="text-amber-300">معدل الاسترجاع (Resource Return Rate):</strong>
                <p className="text-slate-400 text-[10px] mt-0.5 font-sans">
                  • 36.7% في المدينة ذات البونص (الناتج الفعلي = 1.58x)
                  <br />• 53.9% عند استخدام نقاط التركيز Focus (الناتج الفعلي = 2.17x)
                  <br />• 15.2% في المدن بدون بونص تكرير.
                </p>
              </div>
              <div className="pt-1 border-t border-slate-800">
                <strong className="text-amber-300">ضرائب السوق (Market Taxes):</strong>
                <p className="text-slate-400 text-[10px] mt-0.5 font-sans">
                  • Premium: 4% ضريبة بيع + 2.5% رسوم طلب = <strong>6.5% إجمالي</strong>.
                  <br />• Non-Premium: 8% ضريبة بيع + 2.5% رسوم طلب = <strong>10.5% إجمالي</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Database & Real-Time Sync Guide */}
        <div className="p-3.5 bg-slate-950 rounded-xl border border-emerald-900/60 text-xs space-y-2">
          <h5 className="font-bold text-emerald-400 flex items-center gap-2 text-sm">
            <Database className="w-4 h-4" /> كيفية تفعيل المزامنة اللحظية وربط Supabase:
          </h5>
          <ol className="text-slate-300 space-y-2 text-[11px] leading-relaxed font-['Cairo',sans-serif]">
            <li className="flex items-start gap-2">
              <span className="w-4 h-4 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-700 flex items-center justify-center text-[10px] shrink-0 font-bold font-mono">1</span>
              <div>
                <strong className="text-white">المزامنة التلقائية (WebSockets):</strong> يعمل التطبيق تلقائياً وبشكل فوري بمجرد فتحه! عند مشاركة الرابط مع أعضاء الجيلد أو أصدقائك، أي سعر يقوم أي مستخدم بتعديله يتم تحديثه لدى الجميع في نفس اللحظة بدون إعادة تحميل الصفحة.
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-4 h-4 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-700 flex items-center justify-center text-[10px] shrink-0 font-bold font-mono">2</span>
              <div>
                <strong className="text-white">ربط Supabase (اختياري للحفظ السحابي الدائم):</strong> اضغط على زر <code>Supabase</code> في أعلى الصفحة، وأدخل رابط المشروع <code>Project URL</code> والمفتاح العام <code>Anon Key</code>.
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-4 h-4 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-700 flex items-center justify-center text-[10px] shrink-0 font-bold font-mono">3</span>
              <div>
                <strong className="text-white">إنشاء الجدول في Supabase:</strong> افتح لوحة تحكم مشروعك في Supabase واذهب إلى <em>SQL Editor</em> والصق كود الـ SQL المعروض بالنافذة، واضغط Run لإنشاء جدول <code>albion_prices</code> وتفعيل الـ Realtime بنقرة واحدة!
              </div>
            </li>
          </ol>
        </div>

        {/* Footer */}
        <div className="pt-2 flex justify-between items-center text-xs">
          <span className="text-[11px] text-slate-500">
            Albion Online T2-T3 Real-Time Refining Engine
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-colors"
          >
            Close & Start Calculating
          </button>
        </div>
      </div>
    </div>
  );
};
