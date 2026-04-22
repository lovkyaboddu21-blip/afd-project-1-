import React, { useState } from 'react';
import { ArrowLeft, MapPin, Calendar, Clock, User, CheckCircle2, AlertCircle, Camera, Check, ChevronRight } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

const MOCK_COMPLAINT = {
  id: 'C-2026-042',
  title: 'Massive Pipe Burst on West End Avenue',
  category: 'Water Leakage',
  severity: 'High (Safety hazard, urgent)',
  description: 'There is a massive water leak from the main pipe under the sidewalk. Water is flooding the street and causing a hazard for traffic and pedestrians. It has been like this since yesterday evening.',
  location: '452 West End Ave, North Ward',
  date: '2026-04-20 08:30 AM',
  status: 'In Progress',
  department: 'Water Board',
  assignedTo: 'Officer Michael B.',
  images: {
    before: 'https://picsum.photos/seed/pipeburst/600/400',
    after: null, // Issue not resolved yet
  },
  timeline: [
    { status: 'Reported', date: '2026-04-20 08:30 AM', comment: 'Complaint submitted by resident.', active: false, done: true },
    { status: 'Verified', date: '2026-04-20 09:15 AM', comment: 'Priority marked as High. Location verified via maps.', active: false, done: true },
    { status: 'Assigned', date: '2026-04-20 10:00 AM', comment: 'Routed to Water Board. Assigned to Michael B.', active: false, done: true },
    { status: 'In Progress', date: '2026-04-20 02:45 PM', comment: 'Crew on site. Excavation started to reach main pipe.', active: true, done: false },
    { status: 'Resolved', date: null, comment: 'Pending resolution.', active: false, done: false },
  ]
};

export default function ComplaintDetail() {
  const { id } = useParams();
  const isPublic = window.location.pathname.startsWith('/issue');
  const isAdmin = window.location.pathname.startsWith('/admin');
  const backLink = isPublic ? '/map' : (isAdmin ? '/admin/complaints' : '/citizen/complaints');
  
  // Using mock data for demo
  const data = MOCK_COMPLAINT;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link to={backLink} className="p-2 border border-slate-200 bg-white rounded-md hover:bg-slate-50 transition">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </Link>
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-xl font-bold text-slate-900">{data.title}</h1>
            <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
              {data.status}
            </span>
          </div>
          <p className="text-xs text-slate-500 font-mono tracking-wider uppercase">ID: {data.id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Details & Images */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h2 className="font-bold text-sm text-slate-900">Complaint Details</h2>
              <span className="bg-red-50 text-red-700 border border-red-100 px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider">
                Priority: {data.severity.split(' ')[0]}
              </span>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-2 gap-y-6 gap-x-4 mb-6">
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Category</p>
                  <p className="text-sm font-medium text-slate-900">{data.category}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Assigned Department</p>
                  <p className="text-sm font-medium text-slate-900">{data.department}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Date Submitted</p>
                  <div className="flex items-center gap-1.5 text-sm font-medium text-slate-900">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    {data.date}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Location</p>
                  <div className="flex items-center gap-1.5 text-sm font-medium text-slate-900">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    {data.location}
                  </div>
                  <a href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(data.location)}`} target="_blank" rel="noopener noreferrer" className="inline-block mt-2 text-[10px] font-bold uppercase tracking-wider text-blue-600 border border-blue-100 bg-blue-50 px-2 py-1.5 rounded hover:bg-blue-100 transition">
                    Get Directions
                  </a>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-50">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">Description</p>
                <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-md border border-slate-100">
                  {data.description}
                </p>
              </div>
            </div>
          </div>

          {/* Evidence / Attachments */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <h2 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Camera className="w-4 h-4 text-slate-500" />
                Attached Evidence
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-2">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Before (Reported Image)</p>
                <div className="rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                  <img src={data.images.before} alt="Reported issue" className="w-full h-64 object-cover" referrerPolicy="no-referrer" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Timeline & Status */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
             <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <h2 className="font-bold text-sm text-slate-900">Resolution Timeline</h2>
                {data.status !== 'Resolved' && (
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                  </span>
                )}
             </div>
             
             <div className="p-6">
                <div className="relative border-l border-slate-200 ml-3 space-y-6 pb-2">
                  {data.timeline.map((step, index) => (
                    <div key={index} className="relative pl-6">
                      {/* Timeline Dot */}
                      {step.done ? (
                        <div className="absolute -left-2.5 top-0 w-5 h-5 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 text-white" />
                        </div>
                      ) : step.active ? (
                        <div className="absolute -left-2.5 top-0 w-5 h-5 rounded-full bg-blue-100 border-2 border-blue-600 flex items-center justify-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                        </div>
                      ) : (
                        <div className="absolute -left-2 top-1 w-4 h-4 rounded-full bg-white border-2 border-slate-200"></div>
                      )}

                      <div>
                        <h4 className={`text-sm font-bold ${step.active || step.done ? 'text-slate-900' : 'text-slate-400'}`}>
                          {step.status}
                        </h4>
                        {step.date && (
                          <div className="flex items-center gap-1.5 mt-1 text-[10px] text-slate-500 font-medium">
                            <Clock className="w-3 h-3" />
                            {step.date}
                          </div>
                        )}
                        <p className={`mt-2 text-xs p-3 rounded-md border ${
                          step.active ? 'bg-blue-50 border-blue-100 text-blue-800' : 
                          step.done ? 'bg-slate-50 border-slate-100 text-slate-600' : 
                          'bg-transparent border-dashed border-slate-200 text-slate-400'
                        }`}>
                          {step.comment}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
             </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-6 text-center">
            <h3 className="font-bold text-sm text-slate-900 mb-2">Need Help?</h3>
            <p className="text-xs text-slate-500 mb-4">If this issue has escalated or is an emergency, contact city authorities immediately.</p>
            <button 
              onClick={() => alert("🚨 Issue Escalated! Emergency services have been notified and priority has been raised.")}
              className="w-full py-2 bg-red-50 text-red-700 border border-red-100 rounded-md text-xs font-bold uppercase tracking-wider hover:bg-red-100 transition"
            >
              Escalate Issue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
