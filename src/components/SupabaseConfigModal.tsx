import React, { useState, useEffect } from 'react';
import { X, Database, Check, Copy, AlertCircle, RefreshCw, Server } from 'lucide-react';
import {
  getSavedSupabaseConfig,
  saveSupabaseConfig,
  clearSupabaseConfig,
  testSupabaseConnection,
  SUPABASE_SQL_SCHEMA
} from '../services/supabaseClient';

interface SupabaseConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseConfigModal: React.FC<SupabaseConfigModalProps> = ({
  isOpen,
  onClose
}) => {
  const [url, setUrl] = useState('');
  const [anonKey, setAnonKey] = useState('');
  const [copied, setCopied] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    if (isOpen) {
      const config = getSavedSupabaseConfig();
      setUrl(config.url);
      setAnonKey(config.anonKey);
      setTestResult(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveAndTest = async () => {
    if (!url || !anonKey) {
      setTestResult({ success: false, message: 'Please provide both Supabase Project URL and Anon Public Key.' });
      return;
    }

    setTesting(true);
    setTestResult(null);
    saveSupabaseConfig(url, anonKey);

    const res = await testSupabaseConnection(url, anonKey);
    setTesting(false);
    setTestResult(res);
  };

  const handleClear = () => {
    clearSupabaseConfig();
    setUrl('');
    setAnonKey('');
    setTestResult({ success: true, message: 'Supabase credentials cleared. Using built-in real-time WebSocket server.' });
  };

  const handleCopySQL = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-[#0b0f17] border border-slate-800 rounded-xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6 text-slate-200 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-950/60 text-blue-400 border border-blue-800/50">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
                Supabase Real-Time Persistence
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800/50">
                  Optional
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Connect your Supabase project for cloud storage or use the built-in real-time server.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Built-in WebSocket Status info */}
        <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-start gap-2.5 text-xs">
          <Server className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-blue-300">Zero-Config Live Sync Active: </span>
            <span className="text-slate-400">
              Changes sync instantly across all connected browser tabs and users via WebSockets and local JSON persistence.
            </span>
          </div>
        </div>

        {/* Inputs */}
        <div className="space-y-3 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Supabase Project URL</label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://xyzcompany.supabase.co"
              className="w-full bg-[#070a0f] border border-slate-800 rounded px-3 py-2 text-slate-200 font-mono outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Supabase Anon Public API Key</label>
            <input
              type="password"
              value={anonKey}
              onChange={(e) => setAnonKey(e.target.value)}
              placeholder="eyJhbGciOi..."
              className="w-full bg-[#070a0f] border border-slate-800 rounded px-3 py-2 text-slate-200 font-mono outline-none focus:border-blue-500"
            />
          </div>

          {testResult && (
            <div
              className={`p-3 rounded border text-xs flex items-start gap-2 ${
                testResult.success
                  ? 'bg-emerald-950/40 border-emerald-700/60 text-emerald-300'
                  : 'bg-rose-950/40 border-rose-700/60 text-rose-300'
              }`}
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{testResult.message}</span>
            </div>
          )}

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={handleSaveAndTest}
              disabled={testing}
              className="flex-1 py-2 px-3 rounded bg-blue-600 hover:bg-blue-500 text-white font-semibold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
            >
              {testing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />}
              <span>{testing ? 'Testing...' : 'Save & Connect'}</span>
            </button>

            <button
              onClick={handleClear}
              className="py-2 px-3 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold transition-colors"
            >
              Disconnect
            </button>
          </div>
        </div>

        {/* SQL Schema helper */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-400">SQL Schema (Run in Supabase SQL Editor):</span>
            <button
              onClick={handleCopySQL}
              className="flex items-center gap-1 text-[11px] text-blue-400 hover:underline"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy SQL'}</span>
            </button>
          </div>

          <pre className="p-2.5 bg-[#070a0f] rounded border border-slate-800 text-[10px] font-mono text-slate-400 overflow-x-auto max-h-28">
            {SUPABASE_SQL_SCHEMA}
          </pre>
        </div>
      </div>
    </div>
  );
};
