import React, { useState, useEffect } from 'react';

import { useTranslation } from 'react-i18next';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

import { getAllLogs } from '../utils/indexedDB.js';

import { useUserSettingsContext } from './UserSettingsContext.jsx';
import BionicText from './common/BionicText.jsx';
import Dialog from './common/Dialog.jsx';

export default function ProfileModal({ open, onClose }) {
  const { settings } = useUserSettingsContext();
  const {
    contrast: isHighContrast,
    motorik: bigTargets,
    bionicReading,
  } = settings;
  const { t } = useTranslation();

  const [nasaData, setNasaData] = useState([]);
  const [logCount, setLogCount] = useState(0);

  useEffect(() => {
    if (open) {
      loadData();
    }
  }, [open]);

  const loadData = async () => {
    try {
      const logs = await getAllLogs('ux_logs');

      const userLogs = logs;

      setLogCount(userLogs.length);

      if (userLogs.length > 0) {
        let tMental = 0,
          tEffort = 0,
          tFrust = 0;
        userLogs.forEach((l) => {
          tMental += l.metrics?.mental || 0;
          tEffort += l.metrics?.effort || 0;
          tFrust += l.metrics?.frustration || 0;
        });

        const n = userLogs.length;
        setNasaData([
          {
            subject: t('feedback.nasa.mental') || 'Mental',
            value: Number((tMental / n).toFixed(2)),
            fullMark: 5,
          },
          {
            subject: t('feedback.nasa.physical') || 'Effort',
            value: Number((tEffort / n).toFixed(2)),
            fullMark: 5,
          },
          {
            subject: t('feedback.nasa.frustration') || 'Frustration',
            value: Number((tFrust / n).toFixed(2)),
            fullMark: 5,
          },
        ]);
      }
    } catch (e) {
      console.error('Failed to load UX logs:', e);
    }
  };

  const handleExport = async () => {
    try {
      const logs = await getAllLogs('ux_logs');
      if (logs.length === 0) return;

      const headerTimestamp = t('common.date') || 'Timestamp';
      const headerMental = t('feedback.nasa.mental') || 'Mental';
      const headerEffort = t('feedback.nasa.effort') || 'Effort';
      const headerFrustration = t('feedback.nasa.frustration') || 'Frustration';

      const csvContent =
        `data:text/csv;charset=utf-8,${headerTimestamp},${headerMental},${headerEffort},${headerFrustration}\n` +
        logs
          .map(
            (e) =>
              `${e.timestamp},${e.metrics?.mental || 0},${e.metrics?.effort || 0},${e.metrics?.frustration || 0}`,
          )
          .join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', 'en_claro_ux_logs.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error('Failed to export logs', e);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      labelledBy="profile-title"
      overlayClassName="z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm"
      className={`flex max-h-[94vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-[40px] shadow-2xl outline-none sm:max-h-[92vh] sm:rounded-[40px] ${isHighContrast ? 'border-2 border-white bg-black' : 'bg-white'}`}
    >
      <div
        className={`sticky top-0 z-20 flex shrink-0 flex-col gap-4 border-b px-5 pt-4 pb-4 shadow-md backdrop-blur-xl transition-colors ${isHighContrast ? 'border-white/30 bg-black/90' : 'border-slate-200 bg-white/90'}`}
      >
        <div className="absolute top-2 left-1/2 h-1 w-10 -translate-x-1/2 rounded-full bg-slate-200 sm:hidden" />
        <div className="flex items-center justify-between px-1">
          <h2
            id="profile-title"
            className={`flex items-center gap-2 text-base font-black tracking-tight ${isHighContrast ? 'text-white' : 'text-slate-800'}`}
          >
            👤 {t('profile') || 'Profile'}
          </h2>
          <button
            onClick={onClose}
            className={`flex items-center justify-center rounded-full font-bold shadow-sm transition-all active:scale-95 ${bigTargets ? 'scale-size-12 text-lg' : 'scale-size-9 text-sm'} ${isHighContrast ? 'border border-white bg-black text-white hover:bg-white/20' : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-600'}`}
            aria-label={t('common.close') || 'Close'}
          >
            ✕
          </button>
        </div>
      </div>

      <div
        className="flex flex-col gap-6 overflow-y-auto p-4 sm:p-6"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: isHighContrast
            ? '#ffffff #000000'
            : '#cbd5e1 transparent',
        }}
      >
        <section>
          <div className="mb-4 text-center">
            <h3
              className={`text-sm font-black tracking-widest uppercase ${isHighContrast ? 'text-white/70' : 'text-slate-600'}`}
            >
              {t('feedback.nasaTitle') || 'NASA-TLX'}
            </h3>
            <p
              className={`mt-1 text-xs ${isHighContrast ? 'text-white/50' : 'text-slate-500'}`}
            >
              {logCount > 0
                ? `N = ${logCount}`
                : t('noDataToExport') || 'No data'}
            </p>
          </div>
          {logCount > 0 ? (
            <div
              className={`flex h-72 w-full items-center justify-center rounded-3xl border-2 p-4 sm:h-96 ${isHighContrast ? 'border-white/30 bg-black' : 'border-slate-100 bg-slate-50'}`}
            >
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={nasaData}>
                  <PolarGrid
                    stroke={isHighContrast ? '#ffffff' : '#cbd5e1'}
                    opacity={isHighContrast ? 0.3 : 1}
                  />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{
                      fill: isHighContrast ? '#ffffff' : '#475569',
                      fontSize: 11,
                      fontWeight: 700,
                    }}
                  />
                  <PolarRadiusAxis
                    angle={30}
                    domain={[0, 5]}
                    tick={{ fill: isHighContrast ? '#ffffff' : '#94a3b8' }}
                  />
                  <Radar
                    name="UX Metrics"
                    dataKey="value"
                    stroke={isHighContrast ? '#ffffff' : '#6366f1'}
                    fill={isHighContrast ? '#ffffff' : '#6366f1'}
                    fillOpacity={0.4}
                    isAnimationActive={!settings.noFlash}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isHighContrast ? '#000' : '#fff',
                      borderColor: isHighContrast ? '#fff' : '#e2e8f0',
                      color: isHighContrast ? '#fff' : '#000',
                      borderRadius: '12px',
                      fontWeight: 'bold',
                      whiteSpace: 'normal',
                      wordWrap: 'break-word',
                    }}
                    wrapperStyle={{
                      zIndex: 100,
                      maxWidth: '80vw',
                      outline: 'none',
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div
              className={`flex h-40 w-full items-center justify-center rounded-3xl border-2 border-dashed ${isHighContrast ? 'border-white/30 text-white/50' : 'border-slate-200 text-slate-600'}`}
            >
              <span className="text-sm font-bold">
                {t('noDataToExport') || 'No data'}
              </span>
            </div>
          )}
        </section>
        <section>
          <button
            onClick={handleExport}
            disabled={logCount === 0}
            className={`flex w-full flex-col items-center justify-center gap-1 rounded-2xl border-2 py-4 font-black tracking-widest uppercase shadow-md transition-all sm:gap-2 sm:py-5 ${logCount === 0 ? 'cursor-not-allowed border-transparent bg-slate-100 text-slate-600 opacity-50' : isHighContrast ? 'border-white bg-white text-black hover:bg-slate-200 active:scale-95' : 'border-indigo-500 bg-indigo-500 text-white hover:bg-indigo-400 active:scale-95'}`}
          >
            <span className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl" aria-hidden="true">
                📊
              </span>
              {t('exportLogs') || 'Export data (CSV)'}
            </span>
            <span
              className={`px-4 text-center text-[9px] font-medium tracking-normal normal-case sm:text-[10px] ${isHighContrast ? 'text-black/70' : 'text-indigo-100'}`}
            >
              <BionicText
                text={t('exportDesc') || 'Download survey results'}
                enabled={bionicReading}
              />
            </span>
          </button>
        </section>
      </div>
    </Dialog>
  );
}
