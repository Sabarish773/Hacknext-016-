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

// Royal Blue harmonic palette
const PALETTE = ['#014BAA', '#0D6EFD', '#2563EB', '#3B82F6', '#60A5FA', '#93C5FD', '#1E40AF'];

export function DocumentChartRenderer({ config }: ChartRendererProps) {
  const data = config.data || [];
  const xKey = config.xAxisKey || 'name';
  const yKey = config.yAxisKey || 'value';

  if (!data || data.length === 0) {
    return (
      <div className="rounded-2xl border border-[#DCE5EE] bg-white p-6 text-center text-[#64748B]">
        No plot points available for this visualization.
      </div>
    );
  }

  // 1. KPI Cards
  if (config.chartType === 'kpi') {
    return (
      <div className="rounded-2xl border border-[#DCE5EE] bg-white p-5 royal-shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-[#0B192C] font-heading flex items-center space-x-2">
              <Activity className="h-4 w-4 text-[#014BAA]" />
              <span>{config.title}</span>
            </h4>
            {config.description && <p className="text-xs text-[#64748B] mt-0.5">{config.description}</p>}
          </div>
          <span className="rounded-md bg-[#EBF3FC] px-2 py-0.5 text-[10px] font-bold text-[#014BAA] border border-[#BFD7F5]">
            KPI METRICS
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {data.map((item, idx) => (
            <div key={idx} className="rounded-xl border border-[#DCE5EE] bg-[#F8F3F0] p-3.5 hover:border-[#014BAA]/40 transition">
              <p className="text-xs text-[#64748B] font-medium truncate">{item.name}</p>
              <p className="text-xl font-bold text-[#0B192C] mt-1 tracking-tight font-heading">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[#DCE5EE] bg-white p-5 royal-shadow-sm">
      <div className="mb-5 flex items-start justify-between">
        <div>
          <div className="flex items-center space-x-2">
            {config.chartType === 'bar' && <BarChart3 className="h-4 w-4 text-[#014BAA]" />}
            {config.chartType === 'line' && <LineIcon className="h-4 w-4 text-[#014BAA]" />}
            {config.chartType === 'area' && <TrendingUp className="h-4 w-4 text-[#014BAA]" />}
            {(config.chartType === 'pie' || config.chartType === 'donut') && <PieIcon className="h-4 w-4 text-[#014BAA]" />}
            <h4 className="text-sm font-bold text-[#0B192C] font-heading">{config.title}</h4>
          </div>
          {config.description && <p className="text-xs text-[#64748B] mt-1">{config.description}</p>}
        </div>

        <span className="rounded-md bg-[#F8F3F0] px-2 py-0.5 text-[10px] font-mono font-semibold text-[#64748B] uppercase border border-[#DCE5EE]">
          {config.chartType}
        </span>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {config.chartType === 'bar' ? (
            <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E6DFD8" vertical={false} />
              <XAxis dataKey={xKey} stroke="#64748B" tick={{ fontSize: 11, fill: '#3B4D63' }} axisLine={{ stroke: '#DCE5EE' }} />
              <YAxis stroke="#64748B" tick={{ fontSize: 11, fill: '#3B4D63' }} axisLine={{ stroke: '#DCE5EE' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderColor: '#BFD7F5',
                  borderRadius: '0.75rem',
                  color: '#0B192C',
                  fontSize: '12px',
                  boxShadow: '0 10px 25px -5px rgba(1, 75, 170, 0.1)',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px', color: '#64748B' }} />
              <Bar dataKey={yKey} fill="#014BAA" radius={[6, 6, 0, 0]} />
            </BarChart>
          ) : config.chartType === 'line' ? (
            <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E6DFD8" vertical={false} />
              <XAxis dataKey={xKey} stroke="#64748B" tick={{ fontSize: 11, fill: '#3B4D63' }} axisLine={{ stroke: '#DCE5EE' }} />
              <YAxis stroke="#64748B" tick={{ fontSize: 11, fill: '#3B4D63' }} axisLine={{ stroke: '#DCE5EE' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderColor: '#BFD7F5',
                  borderRadius: '0.75rem',
                  color: '#0B192C',
                  fontSize: '12px',
                  boxShadow: '0 10px 25px -5px rgba(1, 75, 170, 0.1)',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px', color: '#64748B' }} />
              <Line
                type="monotone"
                dataKey={yKey}
                stroke="#014BAA"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#014BAA', stroke: '#FFFFFF', strokeWidth: 2 }}
                activeDot={{ r: 6, fill: '#0D6EFD', stroke: '#014BAA' }}
              />
            </LineChart>
          ) : config.chartType === 'area' ? (
            <AreaChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
              <defs>
                <linearGradient id={`grad-${config.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#014BAA" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#014BAA" stopOpacity={0.03} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E6DFD8" vertical={false} />
              <XAxis dataKey={xKey} stroke="#64748B" tick={{ fontSize: 11, fill: '#3B4D63' }} axisLine={{ stroke: '#DCE5EE' }} />
              <YAxis stroke="#64748B" tick={{ fontSize: 11, fill: '#3B4D63' }} axisLine={{ stroke: '#DCE5EE' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderColor: '#BFD7F5',
                  borderRadius: '0.75rem',
                  color: '#0B192C',
                  fontSize: '12px',
                  boxShadow: '0 10px 25px -5px rgba(1, 75, 170, 0.1)',
                }}
              />
              <Area
                type="monotone"
                dataKey={yKey}
                stroke="#014BAA"
                fillOpacity={1}
                fill={`url(#grad-${config.id})`}
                strokeWidth={2.5}
              />
            </AreaChart>
          ) : (
            <PieChart>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderColor: '#BFD7F5',
                  borderRadius: '0.75rem',
                  color: '#0B192C',
                  fontSize: '12px',
                  boxShadow: '0 10px 25px -5px rgba(1, 75, 170, 0.1)',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px', color: '#64748B' }} />
              <Pie
                data={data}
                dataKey={yKey}
                nameKey={xKey}
                cx="50%"
                cy="50%"
                innerRadius={config.chartType === 'donut' ? 50 : 0}
                outerRadius={80}
                paddingAngle={3}
                stroke="#FFFFFF"
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
