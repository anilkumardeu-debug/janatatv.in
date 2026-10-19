import React, { useState } from 'react';
import { X, ShieldCheck, Cookie, Lock, FileText, CheckCircle, Mail, Info, Scale } from 'lucide-react';

export default function PrivacyPolicyModal({ onClose, defaultTab = 'privacy' }) {
  const [activeTab, setActiveTab] = useState(defaultTab);

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
              <h2 className="text-lg font-bold text-white">JanataTV Media Trust &amp; Transparency Center</h2>
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

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 px-6 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('privacy')}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'privacy' 
                ? 'border-emerald-500 text-emerald-400' 
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cookie className="w-3.5 h-3.5" />
            <span>Privacy &amp; Cookies (AdSense)</span>
          </button>

          <button
            onClick={() => setActiveTab('about')}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'about' 
                ? 'border-rose-500 text-rose-400' 
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            <span>About JanataTV</span>
          </button>

          <button
            onClick={() => setActiveTab('contact')}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'contact' 
                ? 'border-amber-500 text-amber-400' 
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Contact &amp; Grievances</span>
          </button>

          <button
            onClick={() => setActiveTab('terms')}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'terms' 
                ? 'border-purple-500 text-purple-400' 
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Terms &amp; Disclaimer</span>
          </button>
        </div>

        {/* Scrollable Policy Body */}
        <div className="overflow-y-auto p-6 space-y-6 text-sm text-slate-300 leading-relaxed">
          {activeTab === 'privacy' && (
            <div className="space-y-5 animate-fadeIn">
              <section className="space-y-2">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Lock className="w-4 h-4 text-emerald-400" />
                  1. General Information &amp; Data Handling
                </h3>
                <p>
                  JanataTV (accessible at <strong className="text-rose-400">https://janatatv.in</strong>) respects the privacy of its visitors. This Privacy Policy document outlines the types of personal and non-personal information collected by JanataTV and how it is used.
                </p>
              </section>

              <section className="space-y-3 p-4 rounded-2xl bg-slate-950 border border-amber-500/30">
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
                    <span>Users may opt out of personalized advertising at any time by visiting <a href="https://adssettings.google.com" target="_blank" rel="noreferrer" className="text-amber-400 hover:underline">Google Ads Settings</a> or through <a href="https://www.aboutads.info" target="_blank" rel="noreferrer" className="text-amber-400 hover:underline">aboutads.info</a>.</span>
                  </li>
                </ul>
              </section>

              <section className="space-y-2">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-rose-400" />
                  3. Log Files &amp; Analytics
                </h3>
                <p className="text-xs text-slate-400">
                  Like most modern web publications, JanataTV utilizes standard web server log files and client analytics. Information collected includes internet protocol (IP) addresses, browser types, internet service providers (ISPs), date/time stamps, referring/exit pages, and visitor click counts to analyze trends and administer the site.
                </p>
              </section>
            </div>
          )}

          {activeTab === 'about' && (
            <div className="space-y-5 animate-fadeIn">
              <section className="space-y-2">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Info className="w-4 h-4 text-rose-400" />
                  About JanataTV (జనతా టీవీ)
                </h3>
                <p>
                  <strong>JanataTV</strong> is India’s next-generation digital entertainment news network, delivering real-time scoops, box office trade analytics, movie reviews, and celebrity culture updates across <strong>Telugu, Hindi, Tamil, and English</strong>.
                </p>
              </section>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="font-bold text-white block mb-1">🎭 Tollywood &amp; South Focus</span>
                  Comprehensive coverage of Telugu, Tamil, Malayalam, and Kannada cinema stars, trailers, and audio launches.
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="font-bold text-white block mb-1">📊 Verified Box Office Data</span>
                  Unbiased box office collections, opening day figures, theater occupancy, and overseas rights analysis.
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="font-bold text-white block mb-1">🌐 Indic Transcreation</span>
                  Autonomous journalistic localization serving news in authentic native languages for 1B+ cinema fans.
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="font-bold text-white block mb-1">⚡ Fast 30-Sec Highlights</span>
                  TL;DR bullet points designed for busy mobile readers on the go.
                </div>
              </div>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="space-y-5 animate-fadeIn">
              <section className="space-y-2">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Mail className="w-4 h-4 text-amber-400" />
                  Editorial Desk &amp; Grievance Redressal
                </h3>
                <p className="text-xs text-slate-300">
                  We welcome tips, press releases, media kits, correction requests, and direct reader inquiries.
                </p>
              </section>

              <div className="space-y-3 text-xs">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-slate-400 block text-[11px] uppercase tracking-wider font-semibold">Editorial Team &amp; Press Releases</span>
                  <p className="text-white font-medium text-sm">editorial@janatatv.in / editor.janatatv@gmail.com</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-slate-400 block text-[11px] uppercase tracking-wider font-semibold">Advertising &amp; Brand Partnerships</span>
                  <p className="text-white font-medium text-sm">advertise@janatatv.in</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-slate-400 block text-[11px] uppercase tracking-wider font-semibold">Registered Domain &amp; Network</span>
                  <p className="text-white font-medium text-sm">JanataTV Media Network, Hyderabad / Bengaluru, India</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'terms' && (
            <div className="space-y-5 animate-fadeIn">
              <section className="space-y-2">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Scale className="w-4 h-4 text-purple-400" />
                  Terms of Service &amp; Fair Use Disclaimer
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  By accessing JanataTV (<strong className="text-white">https://janatatv.in</strong>), you agree to comply with our Terms of Service. All content published is for informational and entertainment purposes.
                </p>
              </section>
              <section className="space-y-2 text-xs text-slate-400">
                <h4 className="font-bold text-slate-200">Copyright &amp; Image Attribution</h4>
                <p>
                  All celebrity images, movie posters, and stills displayed on JanataTV remain the copyright of their respective producers, actors, and photographic agencies. They are displayed strictly under <em>Fair Use</em> provisions for the purpose of critique, news reporting, and commentary.
                </p>
              </section>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-950 px-6 py-3 border-t border-slate-800 flex justify-between items-center text-xs text-slate-500">
          <span>Certified Compliant with Google AdSense Publisher Policies</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
