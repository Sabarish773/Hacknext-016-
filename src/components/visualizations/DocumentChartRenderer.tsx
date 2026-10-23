'use client';

import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { VisualizationConfig } from '@/types';
import { TrendingUp, BarChart3, PieChart as PieIcon, LineChart as LineIcon, Activity } from 'lucide-react';

interface ChartRendererProps {
  config: VisualizationConfig;
}

const PALETTE = ['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4', '#f97316'];

export function DocumentChartRenderer({ config }: ChartRendererProps) {
  const data = config.data || [];
  const xKey = config.xAxisKey || 'name';
  const yKey = config.yAxisKey || 'value';

  if (!data || data.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 text-center text-slate-400">
        No plot points available for this visualization.
      </div>
    );
  }

  // 1. KPI Cards
  if (config.chartType === 'kpi') {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-white flex items-center space-x-2">
              <Activity className="h-4 w-4 text-blue-400" />
              <span>{config.title}</span>
            </h4>
            {config.description && <p className="text-xs text-slate-400 mt-0.5">{config.description}</p>}
          </div>
          <span className="rounded bg-blue-500/10 px-2 py-0.5 text-[10px] font-semibold text-blue-400 border border-blue-500/20">
            KPI METRICS
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {data.map((item, idx) => (
            <div key={idx} className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5">
              <p className="text-xs text-slate-400 font-medium truncate">{item.name}</p>
              <p className="text-xl font-black text-white mt-1 tracking-tight">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-sm">
      <div className="mb-5 flex items-start justify-between">
        <div>
          <div className="flex items-center space-x-2">
            {config.chartType === 'bar' && <BarChart3 className="h-4 w-4 text-blue-400" />}
            {config.chartType === 'line' && <LineIcon className="h-4 w-4 text-emerald-400" />}
            {config.chartType === 'area' && <TrendingUp className="h-4 w-4 text-purple-400" />}
            {(config.chartType === 'pie' || config.chartType === 'donut') && <PieIcon className="h-4 w-4 text-amber-400" />}
            <h4 className="text-sm font-bold text-white">{config.title}</h4>
          </div>
          {config.description && <p className="text-xs text-slate-400 mt-1">{config.description}</p>}
        </div>

        <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-mono text-slate-300 uppercase border border-slate-700">
          {config.chartType}
        </span>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {config.chartType === 'bar' ? (
            <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey={xKey} stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#f8fafc', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar dataKey={yKey} fill="#3b82f6" radius={[6, 6, 0, 0]} />
            </BarChart>
          ) : config.chartType === 'line' ? (
            <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey={xKey} stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#f8fafc', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Line type="monotone" dataKey={yKey} stroke="#10b981" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          ) : config.chartType === 'area' ? (
            <AreaChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
              <defs>
                <linearGradient id={`grad-${config.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey={xKey} stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#f8fafc', fontSize: '12px' }}
              />
              <Area type="monotone" dataKey={yKey} stroke="#8b5cf6" fillOpacity={1} fill={`url(#grad-${config.id})`} strokeWidth={2} />
            </AreaChart>
          ) : (
            <PieChart>
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#f8fafc', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Pie
                data={data}
                dataKey={yKey}
                nameKey={xKey}
                cx="50%"
                cy="50%"
                innerRadius={config.chartType === 'donut' ? 50 : 0}
                outerRadius={80}
                paddingAngle={3}
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={PALETTE[index % PALETTE.length]} />
                ))}
              </Pie>
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
