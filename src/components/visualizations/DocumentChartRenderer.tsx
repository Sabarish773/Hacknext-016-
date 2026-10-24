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

// Dedicated Cyan Aash palette with carefully chosen harmonic shades
const PALETTE = ['#00E5FF', '#00B4D8', '#38BDF8', '#06B6D4', '#0891B2', '#67E8F9', '#99F6E4'];

export function DocumentChartRenderer({ config }: ChartRendererProps) {
  const data = config.data || [];
  const xKey = config.xAxisKey || 'name';
  const yKey = config.yAxisKey || 'value';

  if (!data || data.length === 0) {
    return (
      <div className="rounded-2xl border border-[#262626] bg-[#161616] p-6 text-center text-[#737373]">
        No plot points available for this visualization.
      </div>
    );
  }

  // 1. KPI Cards
  if (config.chartType === 'kpi') {
    return (
      <div className="rounded-2xl border border-[#262626] bg-[#161616] p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-white flex items-center space-x-2">
              <Activity className="h-4 w-4 text-[#00E5FF]" />
              <span>{config.title}</span>
            </h4>
            {config.description && <p className="text-xs text-[#a3a3a3] mt-0.5">{config.description}</p>}
          </div>
          <span className="rounded bg-[#00E5FF]/10 px-2 py-0.5 text-[10px] font-semibold text-[#00E5FF] border border-[#00E5FF]/25">
            KPI METRICS
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {data.map((item, idx) => (
            <div key={idx} className="rounded-xl border border-[#262626] bg-[#111111] p-3.5 hover:border-[#00E5FF]/30 transition">
              <p className="text-xs text-[#a3a3a3] font-medium truncate">{item.name}</p>
              <p className="text-xl font-black text-white mt-1 tracking-tight">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[#262626] bg-[#161616] p-5 shadow-sm">
      <div className="mb-5 flex items-start justify-between">
        <div>
          <div className="flex items-center space-x-2">
            {config.chartType === 'bar' && <BarChart3 className="h-4 w-4 text-[#00E5FF]" />}
            {config.chartType === 'line' && <LineIcon className="h-4 w-4 text-[#00E5FF]" />}
            {config.chartType === 'area' && <TrendingUp className="h-4 w-4 text-[#00E5FF]" />}
            {(config.chartType === 'pie' || config.chartType === 'donut') && <PieIcon className="h-4 w-4 text-[#00E5FF]" />}
            <h4 className="text-sm font-bold text-white">{config.title}</h4>
          </div>
          {config.description && <p className="text-xs text-[#a3a3a3] mt-1">{config.description}</p>}
        </div>

        <span className="rounded bg-[#1f1f1f] px-2 py-0.5 text-[10px] font-mono text-[#a3a3a3] uppercase border border-[#262626]">
          {config.chartType}
        </span>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {config.chartType === 'bar' ? (
            <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
              <XAxis dataKey={xKey} stroke="#737373" tick={{ fontSize: 11, fill: '#a3a3a3' }} axisLine={{ stroke: '#262626' }} />
              <YAxis stroke="#737373" tick={{ fontSize: 11, fill: '#a3a3a3' }} axisLine={{ stroke: '#262626' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#161616',
                  borderColor: '#00E5FF40',
                  borderRadius: '0.75rem',
                  color: '#ededed',
                  fontSize: '12px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px', color: '#a3a3a3' }} />
              <Bar dataKey={yKey} fill="#00E5FF" radius={[6, 6, 0, 0]} />
            </BarChart>
          ) : config.chartType === 'line' ? (
            <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
              <XAxis dataKey={xKey} stroke="#737373" tick={{ fontSize: 11, fill: '#a3a3a3' }} axisLine={{ stroke: '#262626' }} />
              <YAxis stroke="#737373" tick={{ fontSize: 11, fill: '#a3a3a3' }} axisLine={{ stroke: '#262626' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#161616',
                  borderColor: '#00E5FF40',
                  borderRadius: '0.75rem',
                  color: '#ededed',
                  fontSize: '12px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px', color: '#a3a3a3' }} />
              <Line
                type="monotone"
                dataKey={yKey}
                stroke="#00E5FF"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#00E5FF', stroke: '#111111', strokeWidth: 2 }}
                activeDot={{ r: 6, fill: '#33EBFF', stroke: '#00E5FF' }}
              />
            </LineChart>
          ) : config.chartType === 'area' ? (
            <AreaChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
              <defs>
                <linearGradient id={`grad-${config.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00E5FF" stopOpacity={0.7} />
                  <stop offset="95%" stopColor="#00E5FF" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
              <XAxis dataKey={xKey} stroke="#737373" tick={{ fontSize: 11, fill: '#a3a3a3' }} axisLine={{ stroke: '#262626' }} />
              <YAxis stroke="#737373" tick={{ fontSize: 11, fill: '#a3a3a3' }} axisLine={{ stroke: '#262626' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#161616',
                  borderColor: '#00E5FF40',
                  borderRadius: '0.75rem',
                  color: '#ededed',
                  fontSize: '12px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                }}
              />
              <Area
                type="monotone"
                dataKey={yKey}
                stroke="#00E5FF"
                fillOpacity={1}
                fill={`url(#grad-${config.id})`}
                strokeWidth={2.5}
              />
            </AreaChart>
          ) : (
            <PieChart>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#161616',
                  borderColor: '#00E5FF40',
                  borderRadius: '0.75rem',
                  color: '#ededed',
                  fontSize: '12px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px', color: '#a3a3a3' }} />
              <Pie
                data={data}
                dataKey={yKey}
                nameKey={xKey}
                cx="50%"
                cy="50%"
                innerRadius={config.chartType === 'donut' ? 50 : 0}
                outerRadius={80}
                paddingAngle={3}
                stroke="#111111"
                strokeWidth={2}
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
