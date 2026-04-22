import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, Clock, Settings, UserCircle, Map, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', issues: 12 },
  { name: 'Tue', issues: 19 },
  { name: 'Wed', issues: 15 },
  { name: 'Thu', issues: 22 },
  { name: 'Fri', issues: 28 },
  { name: 'Sat', issues: 18 },
  { name: 'Sun', issues: 25 },
];

export default function AdminDashboard() {
  const navigate = useNavigate();

  const stats = [
    { name: 'Open Reports', value: '142', icon: FileText, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { name: 'In Progress', value: '56', icon: Settings, color: 'text-amber-600', bg: 'bg-amber-50' },
    { name: 'Overdue SLAs', value: '12', icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
    { name: 'Resolved (7d)', value: '304', icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Admin Overview</h1>
          <p className="text-sm text-slate-500">City-wide complaint metrics and operational SLAs.</p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600 font-medium">
          <Clock className="w-4 h-4 text-slate-400" />
          Last updated: Just now
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">{stat.name}</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bg.replace(/indigo/g, 'blue')}`}>
                <Icon className={`w-6 h-6 ${stat.color.replace(/indigo/g, 'blue')}`} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Trend Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-bold text-sm text-slate-900">Issues Reported (7 Days)</h2>
            <select className="text-sm border-slate-200 rounded-md bg-slate-50 py-1 pl-2 pr-8 border">
              <option>All Wards</option>
              <option>North Zone</option>
              <option>South Zone</option>
            </select>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIssues" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="issues" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorIssues)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Hotspots & Departments */}
        <div className="space-y-6">
          {/* Hotspots */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="font-bold text-sm text-slate-900">Active Hotspots</h2>
              <Map className="w-4 h-4 text-slate-400" />
            </div>
            <div className="p-4 space-y-4">
              {[
                { area: 'Downtown Core', count: 45, trend: 'up' },
                { area: 'West End', count: 28, trend: 'down' },
                { area: 'University District', count: 22, trend: 'up' },
              ].map((hotspot, i) => (
                <div key={i} className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-700">{hotspot.area}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">{hotspot.count}</span>
                    <TrendingUp className={`w-3 h-3 ${hotspot.trend === 'up' ? 'text-red-500' : 'text-emerald-500'}`} />
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => navigate('/admin/hotspots')} className="mx-4 mb-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-blue-600 hover:bg-slate-50 transition">
              View Heatmap
            </button>
          </div>

          {/* SLA Performance */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
            <h2 className="font-bold text-sm text-slate-900 mb-4">Dept. Resolution Rate</h2>
            <div className="space-y-3">
              {[
                { name: 'Water Board', rate: 94 },
                { name: 'Sanitation', rate: 88 },
                { name: 'Public Works', rate: 76 },
              ].map((dept, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <span className="text-slate-700">{dept.name}</span>
                    <span className={dept.rate > 90 ? 'text-emerald-600' : dept.rate > 80 ? 'text-amber-600' : 'text-red-600'}>
                      {dept.rate}%
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${dept.rate > 90 ? 'bg-emerald-500' : dept.rate > 80 ? 'bg-amber-500' : 'bg-red-500'}`}
                      style={{ width: `${dept.rate}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Alerts / Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h2 className="font-bold text-sm text-slate-900">Urgent Escalations</h2>
            <Link to="/admin/complaints" className="text-[10px] font-bold text-blue-600 hover:underline tracking-wider uppercase">View All</Link>
        </div>
        <div className="divide-y divide-slate-50 p-4 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-50">
            <div className="flex items-center gap-3">
              <div className="bg-red-50 w-10 h-10 rounded flex items-center justify-center text-red-600">
                <AlertTriangle className="w-5 h-5"/>
              </div>
              <div>
                <p className="font-bold text-slate-900 text-xs">C-2026-042: Massive Pipe Burst (48h Overdue)</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Assigned to: Water Board • Location: West End</p>
                <span className="mt-1 inline-block px-1.5 py-0.5 rounded text-[8px] bg-red-100 text-red-700 font-bold uppercase">Priority 1</span>
              </div>
            </div>
            <Link to="/admin/complaints/C-2026-042" className="px-3 py-1.5 bg-white border border-slate-200 shadow-sm rounded text-xs font-bold hover:bg-slate-50 text-slate-800">Review</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
