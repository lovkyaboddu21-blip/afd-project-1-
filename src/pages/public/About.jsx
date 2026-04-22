import React from 'react';
import { ShieldAlert, Users, TrendingUp, Filter, BarChart, Server } from 'lucide-react';

export default function About() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <div className="bg-slate-50 border-b border-slate-200 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
              <ShieldAlert className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 mb-6">
            Bridging the gap between <br className="hidden md:block"/>
            <span className="text-blue-600">residents and city officials</span>.
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            CivicConnect is a public services platform designed to bring transparency, accountability, and efficiency to municipal issue resolution.
          </p>
        </div>
      </div>

      {/* Core Values */}
      <div className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-12">
          <div>
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-6 border border-blue-100">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-3">Citizen Empowerment</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              We believe every resident should have a direct line to city services. Snap a photo, drop a pin, and track your complaint until it is completely resolved.
            </p>
          </div>
          <div>
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-6 border border-blue-100">
              <Server className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-3">Direct Routing</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              No more getting bounced between phone numbers. Issues are instantly categorized and automatically routed to the precise municipal department responsible.
            </p>
          </div>
          <div>
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-6 border border-blue-100">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-3">Radical Transparency</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Through our live public issue map and SLA performance dashboards, city compliance rates and operational bottlenecks become visible to everyone.
            </p>
          </div>
        </div>
      </div>

      {/* Stats/Accountability Section */}
      <div className="bg-slate-900 py-24 px-4 sm:px-6 lg:px-8 text-white border-y border-slate-800">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
             <h2 className="text-3xl font-bold tracking-tight mb-6">Why civic reporting matters</h2>
             <p className="text-slate-400 mb-8 leading-relaxed max-w-lg">
               When citizens can easily report issues, cities become safer, cleaner, and more resilient. But without accountability, reports disappear into bureaucratic black holes. CivicConnect enforces Service Level Agreements (SLAs) on every ticket.
             </p>
             <div className="space-y-4">
               <div className="flex items-center gap-4">
                 <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center text-blue-400">
                   <Filter className="w-4 h-4" />
                 </div>
                 <span className="text-sm font-medium">Automatic Duplicate Detection</span>
               </div>
               <div className="flex items-center gap-4">
                 <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center text-blue-400">
                   <BarChart className="w-4 h-4" />
                 </div>
                 <span className="text-sm font-medium">Departmental Accountability Metrics</span>
               </div>
             </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
              <p className="text-4xl font-bold text-white mb-2">94%</p>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Average Resolution Rate</p>
            </div>
             <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 mt-8">
              <p className="text-4xl font-bold text-white mb-2">48<span className="text-2xl text-slate-400">hr</span></p>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Median Response Time</p>
            </div>
             <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
              <p className="text-4xl font-bold text-white mb-2">12k+</p>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Issues Resolved Monthly</p>
            </div>
             <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 mt-8">
              <p className="text-4xl font-bold text-white mb-2">5</p>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Active Municipal Depts</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
