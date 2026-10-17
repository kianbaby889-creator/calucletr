import React from 'react';
import { X, BookOpen, Database, Check, Server, Terminal, Copy } from 'lucide-react';
import { SUPABASE_SQL_SCHEMA } from '../services/supabaseClient';

interface DeployGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeployGuideModal: React.FC<DeployGuideModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div
        dir="rtl"
        className="bg-[#0b0f17] border border-slate-800 rounded-xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6 text-slate-200 space-y-4 font-['Cairo',sans-serif]"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-950/60 text-blue-400 border border-blue-800/50">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-100">
                دليل نشر وتشغيل حاسبة التكرير وربط Supabase
              </h3>
              <p className="text-xs text-blue-400">
                Albion Online T2-T3 Real-Time Deployment Manual
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-200"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section 1: Running & Deploying */}
        <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-2 text-xs leading-relaxed">
          <h4 className="font-bold text-blue-300 flex items-center gap-2">
            <Server className="w-4 h-4 text-blue-400" /> 1. تشغيل ونشر التطبيق (Deployment):
          </h4>
          <p className="text-slate-300">
            التطبيق مصمم ليعمل كـ Full-Stack Web App متكامل (React + Node.js/Express + WebSockets) جاهز للنشر السحابي (Cloud Run, VPS, Docker, أو Vercel):
          </p>
          <div className="bg-[#070a0f] p-2.5 rounded border border-slate-800 font-mono text-[11px] text-slate-300 space-y-1" dir="ltr">
            <div className="text-slate-500"># 1. Install packages:</div>
            <div className="text-blue-400">npm install</div>
            <div className="text-slate-500 pt-1"># 2. Run dev server with real-time WebSockets:</div>
            <div className="text-blue-400">npm run dev</div>
            <div className="text-slate-500 pt-1"># 3. Production build & start:</div>
            <div className="text-blue-400">npm run build && npm start</div>
          </div>
        </div>

        {/* Section 2: Supabase Connection */}
        <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-2 text-xs leading-relaxed">
          <h4 className="font-bold text-emerald-400 flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-400" /> 2. ربط قاعدة بيانات Supabase للمزامنة:
          </h4>
          <ol className="pr-4 list-decimal space-y-1.5 text-slate-300 text-[11px]">
            <li>أنشئ مشروعاً مجانياً على منصة <strong className="text-white">supabase.com</strong>.</li>
            <li>اذهب إلى <strong>Project Settings → API</strong> وانسخ <strong>Project URL</strong> ومفتاح <strong>anon public key</strong>.</li>
            <li>اضغط على أيقونة <strong>Supabase</strong> في الشريط العلوي لهذا الموقع وألصق الرابط والمفتاح.</li>
            <li>افتح <strong>SQL Editor</strong> في Supabase، والصق الكود البرمجي أدناه واضغط <strong>Run</strong> لإنشاء الجدول وتفعيل المزامنة:</li>
          </ol>

          <div className="relative pt-1" dir="ltr">
            <button
              onClick={handleCopy}
              className="absolute top-2 right-2 px-2 py-1 rounded bg-slate-800 text-[10px] text-blue-300 hover:bg-slate-700 flex items-center gap-1"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied' : 'Copy SQL'}</span>
            </button>
            <pre className="p-2.5 bg-[#070a0f] rounded border border-slate-800 text-[10px] font-mono text-slate-400 overflow-x-auto max-h-28">
              {SUPABASE_SQL_SCHEMA}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
