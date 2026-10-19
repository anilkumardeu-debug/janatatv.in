import React from 'react';
import { X, ShieldCheck, Cookie, Lock, FileText, CheckCircle } from 'lucide-react';

export default function PrivacyPolicyModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div 
        className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden my-6 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-rose-950/40 to-slate-900 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Privacy, Cookies &amp; AdSense Policy</h2>
              <p className="text-xs text-slate-400">
                Official Compliance Statement for Google AdSense &amp; JanataTV Media Network
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Policy Body */}
        <div className="overflow-y-auto p-6 space-y-6 text-sm text-slate-300 leading-relaxed">
          <section className="space-y-2">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400" />
              1. General Information
            </h3>
            <p>
              JanataTV (accessible at <strong className="text-rose-400">https://janatatv.in</strong>) respects the privacy of its visitors. This Privacy Policy document outlines the types of personal information that is received and collected by JanataTV and how it is utilized.
            </p>
          </section>

          <section className="space-y-2 p-4 rounded-2xl bg-slate-950 border border-amber-500/30">
            <h3 className="text-base font-bold text-amber-300 flex items-center gap-2">
              <Cookie className="w-4 h-4 text-amber-400" />
              2. Google AdSense &amp; Advertising Cookies (Mandatory Disclosure)
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Third-party vendors, including <strong>Google</strong>, use cookies to serve ads based on a user's prior visits to this website or other websites on the internet.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Google's use of advertising cookies enables it and its partners to serve advertisements to visitors of JanataTV based on their visits to our site and other internet properties.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Users may opt out of personalized advertising by visiting <a href="https://adssettings.google.com" target="_blank" rel="noreferrer" className="text-amber-400 hover:underline">Google Ads Settings</a> or through <a href="https://www.aboutads.info" target="_blank" rel="noreferrer" className="text-amber-400 hover:underline">aboutads.info</a>.</span>
              </li>
            </ul>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-rose-400" />
              3. Entertainment Gossip &amp; Editorial Disclaimer
            </h3>
            <p className="text-xs text-slate-400">
              The articles and celebrity gossip featured on JanataTV are synthesized from public wires, media press releases, and entertainment social trends. We respect celebrity privacy and always attribute breaking news to respective trade publications. Content is localized and transcreated using responsible artificial intelligence workflows.
            </p>
          </section>

          <section className="space-y-2 border-t border-slate-800 pt-4 text-xs text-slate-400">
            <p>
              If you have any questions or require further information regarding our privacy practices, please contact our editorial desk at <strong className="text-white">editorial@janatatv.in</strong>.
            </p>
            <p className="text-[11px] text-slate-500">
              Last updated: October 2026. Certified compliant with Google AdSense Publisher Policies &amp; GDPR.
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="bg-slate-950 px-6 py-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
          >
            I Understand &amp; Close
          </button>
        </div>
      </div>
    </div>
  );
}
