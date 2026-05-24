import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

/**
 * AnalyticsDashboard Component
 * Visualizes telemetry data (UX feedback and Error logs) stored in Redux.
 * Uses Recharts for responsive, accessible charting.
 */
export default function AnalyticsDashboard({ isHighContrast, t }) {
  // Retrieve data from Redux store
  const { feedbackLogs, errorLogs } = useSelector((state) => state.analytics || { feedbackLogs: [], errorLogs: [] });

  // Process feedback logs for the Line Chart (UX Trends over time)
  const feedbackData = useMemo(() => {
    return feedbackLogs.map((log, index) => {
      const date = new Date(log.timestamp);
      return {
        name: `S${index + 1}`,
        date: date.toLocaleDateString(),
        // Map slider values (0-100)
        frustration: log.metrics?.frustration || 0,
        mentalEffort: log.metrics?.mental || 0,
        attractiveness: log.metrics?.attractiveness || 0,
      };
    });
  }, [feedbackLogs]);

  // Process error logs for the Bar Chart (Errors by Category)
  const errorData = useMemo(() => {
    const counts = {};
    errorLogs.forEach((log) => {
      const cat = log.type || 'General';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return Object.keys(counts).map((key) => ({
      category: t?.pillars?.[key] || key,
      errors: counts[key],
    }));
  }, [errorLogs, t]);

  // Dynamic styling variables
  const textColor = isHighContrast ? '#ffffff' : '#475569';
  const gridColor = isHighContrast ? '#333333' : '#e2e8f0';
  const cardBg = isHighContrast ? 'bg-black border-2 border-white' : 'bg-white border border-slate-200 shadow-sm';

  return (
    <div className="w-full flex flex-col gap-8 animate-in fade-in duration-500">
      
      <header className="px-2">
        <h2 className={`text-2xl font-black tracking-tight ${isHighContrast ? 'text-white' : 'text-slate-800'}`}>
          {t?.errorAnalysis || 'Analytics Dashboard'}
        </h2>
        <p className={`text-sm font-medium ${isHighContrast ? 'text-white/70' : 'text-slate-500'}`}>
          {t?.errorAnalysisSub || 'Track your cognitive load, UX feedback, and exercise errors over time.'}
        </p>
      </header>

      {/* 1. UX Feedback Trends (Line Chart) */}
      <section className={`p-4 sm:p-6 rounded-3xl ${cardBg}`}>
        <h3 className={`text-sm font-black uppercase tracking-widest mb-6 ${isHighContrast ? 'text-white' : 'text-slate-400'}`}>
          {t?.feedback?.title || 'UX Feedback Trends'}
        </h3>
        
        {feedbackData.length > 0 ? (
          <div className="w-full h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={feedbackData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis dataKey="name" stroke={textColor} fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke={textColor} fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontWeight: 'bold' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Line type="monotone" name="Frustration" dataKey="frustration" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" name="Mental Effort" dataKey="mentalEffort" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" name="Attractiveness" dataKey="attractiveness" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex items-center justify-center h-40 w-full rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200">
            <span className="text-sm font-bold text-slate-400">
              {t?.noData || 'No survey data available yet.'}
            </span>
          </div>
        )}
      </section>

      {/* 2. Error Analysis (Bar Chart) */}
      <section className={`p-4 sm:p-6 rounded-3xl ${cardBg}`}>
        <h3 className={`text-sm font-black uppercase tracking-widest mb-6 ${isHighContrast ? 'text-white' : 'text-slate-400'}`}>
          {t?.errorAnalysis || 'Errors by Category'}
        </h3>
        
        {errorData.length > 0 ? (
          <div className="w-full h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={errorData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis dataKey="category" stroke={textColor} fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke={textColor} fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip 
                  cursor={{ fill: isHighContrast ? '#333' : '#f8fafc' }}
                  contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar 
                  name="Mistakes made" 
                  dataKey="errors" 
                  fill={isHighContrast ? '#ffffff' : '#6366f1'} 
                  radius={[6, 6, 0, 0]} 
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex items-center justify-center h-40 w-full rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200">
            <span className="text-sm font-bold text-slate-400">
              {t?.noData || 'No errors recorded yet. Great job!'}
            </span>
          </div>
        )}
      </section>

    </div>
  );
}