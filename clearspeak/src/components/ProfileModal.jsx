import React, { useState, useEffect, useRef } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { useTranslation } from '../i18n/i18n.js';
import { getAllLogs } from '../utils/indexedDB.js';
import { useUserSettingsContext } from './UserSettingsContext.jsx';
import BionicText from './common/BionicText.jsx';

export default function ProfileModal({ open, onClose }) {
  const { settings } = useUserSettingsContext();
  const { language, contrast: isHighContrast, motorik: bigTargets, bionicReading } = settings;
  const t = useTranslation(language);
  
  const [nasaData, setNasaData] = useState([]);
  const [logCount, setLogCount] = useState(0);
  const modalRef = useRef(null);

  useEffect(() => {
    if (open && modalRef.current) {
      modalRef.current.focus();
      loadData();
    }
  }, [open]);

  const loadData = async () => {
    try {
      const logs = await getAllLogs('ux_logs');
      
      // 🔒 ZABEZPIECZENIE (Only this user)
      // W wersji PWA IndexedDB dane są lokalne, więc siłą rzeczy należą do tego urządzenia/użytkownika.
      // Po wpięciu logowania chmurowego (Supabase) wystarczy dodać:
      // const userLogs = logs.filter(log => log.user_id === currentUser.id);
      const userLogs = logs;
      
      setLogCount(userLogs.length);
      
      if (userLogs.length > 0) {
        let tMental = 0, tEffort = 0, tFrust = 0;
        userLogs.forEach(l => {
          tMental += l.metrics?.mental || 0;
          tEffort += l.metrics?.effort || 0;
          tFrust += l.metrics?.frustration || 0;
        });
        
        const n = userLogs.length;
        setNasaData([
          { subject: t.feedback?.nasa?.mental || 'Mental', value: Number((tMental/n).toFixed(2)), fullMark: 5 },
          { subject: t.feedback?.nasa?.physical || 'Effort', value: Number((tEffort/n).toFixed(2)), fullMark: 5 },
          { subject: t.feedback?.nasa?.frustration || 'Frustration', value: Number((tFrust/n).toFixed(2)), fullMark: 5 }
        ]);
      }
    } catch(e) {
      console.error("Failed to load UX logs:", e);
    }
  };

  const handleExport = async () => {
    try {
      const logs = await getAllLogs('ux_logs');
      if (logs.length === 0) return;
      
      const headerTimestamp = t.common?.date || 'Timestamp';
      const headerMental = t.feedback?.nasa?.mental || 'Mental';
      const headerEffort = t.feedback?.nasa?.effort || 'Effort';
      const headerFrustration = t.feedback?.nasa?.frustration || 'Frustration';
      
      const csvContent = `data:text/csv;charset=utf-8,${headerTimestamp},${headerMental},${headerEffort},${headerFrustration}\n` 
        + logs.map(e => `${e.timestamp},${e.metrics?.mental || 0},${e.metrics?.effort || 0},${e.metrics?.frustration || 0}`).join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "en_claro_ux_logs.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error("Failed to export logs", e);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div ref={modalRef} tabIndex="-1" role="dialog" aria-modal="true" aria-labelledby="profile-title" className={`rounded-t-[40px] sm:rounded-[40px] shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[94vh] sm:max-h-[92vh] focus:outline-none ${isHighContrast ? 'bg-black border-2 border-white' : 'bg-white'}`}>
        <div className={`px-5 pt-4 pb-4 flex flex-col gap-4 border-b sticky top-0 z-20 shrink-0 shadow-md backdrop-blur-xl transition-colors ${isHighContrast ? 'bg-black/90 border-white/30' : 'bg-white/90 border-slate-200'}`}>
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full sm:hidden bg-slate-200" />
          <div className="flex items-center justify-between px-1">
            <h2 id="profile-title" className={`text-base font-black tracking-tight flex items-center gap-2 ${isHighContrast ? 'text-white' : 'text-slate-800'}`}>
              👤 {t.profile || 'Profile'}
            </h2>
            <button onClick={onClose} className={`rounded-full font-bold transition-all active:scale-95 flex items-center justify-center shadow-sm ${bigTargets ? 'scale-size-12 text-lg' : 'scale-size-9 text-sm'} ${isHighContrast ? 'bg-black border border-white text-white hover:bg-white/20' : 'bg-white border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`} aria-label={t.common?.close || 'Close'}>✕</button>
          </div>
        </div>

        <div className="p-4 sm:p-6 overflow-y-auto flex flex-col gap-6" style={{ scrollbarWidth: 'thin', scrollbarColor: isHighContrast ? '#ffffff #000000' : '#cbd5e1 transparent' }}>
          <section>
            <div className="mb-4 text-center">
              <h3 className={`text-sm font-black uppercase tracking-widest ${isHighContrast ? 'text-white/70' : 'text-slate-400'}`}>{t.feedback?.nasaTitle || 'NASA-TLX'}</h3>
              <p className={`text-xs mt-1 ${isHighContrast ? 'text-white/50' : 'text-slate-500'}`}>{logCount > 0 ? `N = ${logCount}` : (t.noDataToExport || 'No data')}</p>
            </div>
            {logCount > 0 ? (
              <div className={`w-full h-72 sm:h-96 rounded-3xl p-4 flex items-center justify-center border-2 ${isHighContrast ? 'bg-black border-white/30' : 'bg-slate-50 border-slate-100'}`}>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={nasaData}>
                    <PolarGrid stroke={isHighContrast ? '#ffffff' : '#cbd5e1'} opacity={isHighContrast ? 0.3 : 1} />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: isHighContrast ? '#ffffff' : '#475569', fontSize: 11, fontWeight: 700 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 5]} tick={{ fill: isHighContrast ? '#ffffff' : '#94a3b8' }} />
                    <Radar name="UX Metrics" dataKey="value" stroke={isHighContrast ? '#ffffff' : '#6366f1'} fill={isHighContrast ? '#ffffff' : '#6366f1'} fillOpacity={0.4} isAnimationActive={!settings.noFlash} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: isHighContrast ? '#000' : '#fff', borderColor: isHighContrast ? '#fff' : '#e2e8f0', color: isHighContrast ? '#fff' : '#000', borderRadius: '12px', fontWeight: 'bold', whiteSpace: 'normal', wordWrap: 'break-word' }} 
                      wrapperStyle={{ zIndex: 100, maxWidth: '80vw', outline: 'none' }} 
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            ) : (<div className={`w-full h-40 rounded-3xl flex items-center justify-center border-2 border-dashed ${isHighContrast ? 'border-white/30 text-white/50' : 'border-slate-200 text-slate-400'}`}><span className="font-bold text-sm">{t.noDataToExport || 'No data'}</span></div>)}
          </section>
          <section>
            <button onClick={handleExport} disabled={logCount === 0} className={`w-full py-4 sm:py-5 rounded-2xl border-2 font-black uppercase tracking-widest transition-all shadow-md flex flex-col items-center justify-center gap-1 sm:gap-2 ${logCount === 0 ? 'opacity-50 cursor-not-allowed bg-slate-100 border-transparent text-slate-400' : isHighContrast ? 'bg-white text-black border-white hover:bg-slate-200 active:scale-95' : 'bg-indigo-500 text-white border-indigo-500 hover:bg-indigo-400 active:scale-95'}`}><span className="flex items-center gap-2"><span className="text-xl sm:text-2xl" aria-hidden="true">📊</span>{t.exportLogs || 'Export data (CSV)'}</span><span className={`text-[9px] sm:text-[10px] normal-case tracking-normal font-medium px-4 text-center ${isHighContrast ? 'text-black/70' : 'text-indigo-100'}`}><BionicText text={t.exportDesc || 'Download survey results'} enabled={bionicReading} /></span></button>
          </section>
        </div>
      </div>
    </div>
  );
}