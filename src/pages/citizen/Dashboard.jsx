import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Clock, CheckCircle, Plus, AlertTriangle } from 'lucide-react';

export default function CitizenDashboard() {
  const stats = [
    { name: 'Total Submitted', value: '4', icon: FileText, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { name: 'Pending', value: '1', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { name: 'In Progress', value: '1', icon: AlertTriangle, color: 'text-blue-600', bg: 'bg-blue-50' },
    { name: 'Resolved', value: '2', icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  const recentActivity = [
    { id: 'C-2026-089', title: 'Pothole on 5th Ave', status: 'In Progress', date: '2 hours ago' },
    { id: 'C-2026-088', title: 'Broken streetlight', status: 'Pending', date: '1 day ago' },
    { id: 'C-2025-442', title: 'Water leakage', status: 'Resolved', date: 'Oct 12, 2025' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Welcome back, John!</h1>
          <p className="text-sm text-slate-500">Here is a summary of your civic reports.</p>
        </div>
        <Link 
          to="/citizen/report" 
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md font-medium text-sm hover:bg-blue-700 transition shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Report New Issue
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                 <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">{stat.name}</p>
                 <div className={`p-2 rounded-md ${stat.bg.replace(/indigo/g, 'blue')}`}>
                   <Icon className={`w-4 h-4 ${stat.color.replace(/indigo/g, 'blue')}`} />
                 </div>
              </div>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h2 className="font-bold text-sm text-slate-900">Recent Complaints</h2>
            <Link to="/citizen/complaints" className="text-[10px] font-bold text-blue-600 hover:underline tracking-wider uppercase">View All</Link>
          </div>
          <div className="divide-y divide-slate-100 p-4 space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="pb-3 border-b border-slate-50 last:border-0 last:pb-0 hover:bg-slate-50 transition cursor-pointer">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{activity.id}</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                    activity.status === 'Resolved' ? 'bg-emerald-100 text-emerald-700' :
                    activity.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {activity.status}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900">{activity.title}</h3>
                <p className="text-[10px] text-slate-500 mt-1">Submitted {activity.date}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50">
            <h2 className="font-bold text-sm text-slate-900">Nearby Issues</h2>
          </div>
          <div className="p-6 text-center text-slate-500">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-200">
              <AlertTriangle className="w-6 h-6 text-slate-400" />
            </div>
            <p className="text-sm text-slate-600">There are 3 reported issues within 1km of your registered ward.</p>
            <Link to="/map" className="inline-block mt-4 text-xs font-bold text-blue-600 hover:text-blue-700 uppercase tracking-wider">View on Map</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
