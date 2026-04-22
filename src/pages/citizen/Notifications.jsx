import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle2, AlertCircle, Clock, Info, Mail } from 'lucide-react';

const mockNotifications = [
  { id: 1, type: 'status_update', title: 'Issue Resolved', message: 'Your complaint "Pothole on Main" has been successfully resolved by the Roads Department.', time: '10 mins ago', read: false, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { id: 2, type: 'alert', title: 'Road Closure Notice', message: 'Due to severe water logging, West End Avenue is temporarily closed for maintenance.', time: '2 hours ago', read: false, icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-50' },
  { id: 3, type: 'status_update', title: 'Assigned to Staff', message: 'Officer Michael B. has been assigned to your report "Massive Pipe Burst".', time: 'Yesterday', read: true, icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
  { id: 4, type: 'system', title: 'Duplicate Detected', message: 'We noticed a similar report for "Streetlight out" in your area. Your ticket has been merged for faster resolution.', time: 'Oct 20, 2026', read: true, icon: Info, color: 'text-slate-600', bg: 'bg-slate-100' },
];

export default function Notifications() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/settings/email')
      .then(r => r.json())
      .then(d => {
        setEmail(d.email);
        setLoading(false);
      });
  }, []);

  const handleSaveEmail = async (e) => {
    e.preventDefault();
    setSaving(true);
    await fetch('/api/settings/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    setSaving(false);
    alert('Email prefernces saved! You will now receive notifications here.');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notifications
          </h1>
          <p className="text-sm text-slate-500">Stay updated on your reports and city alerts.</p>
        </div>
        <button className="text-[10px] font-bold uppercase tracking-wider text-blue-600 hover:text-blue-900 transition bg-blue-50 px-3 py-1.5 border border-blue-100 rounded-md">
          Mark All as Read
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-6 mb-6 flex flex-col md:flex-row gap-6 md:items-center justify-between">
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
            <Mail className="w-5 h-5 text-slate-600" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 mb-1">Email Notifications</h2>
            <p className="text-xs text-slate-500 max-w-md">Get instant alerts via email when your complaint status changes or when it gets assigned to staff.</p>
          </div>
        </div>
        
        <form onSubmit={handleSaveEmail} className="flex gap-2 w-full md:w-auto">
           <input 
             type="email" 
             placeholder="Enter your email..." 
             value={email}
             onChange={e => setEmail(e.target.value)}
             className="flex-1 md:w-64 px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm bg-slate-50"
             disabled={loading}
           />
           <button 
             type="submit" 
             disabled={loading || saving}
             className="px-4 py-2 bg-slate-900 text-white rounded-md text-sm font-medium hover:bg-slate-800 disabled:opacity-50 transition"
           >
             {saving ? 'Saving...' : 'Subscribe'}
           </button>
        </form>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden divide-y divide-slate-100">
         {mockNotifications.map(notification => {
           const Icon = notification.icon;
           return (
             <div key={notification.id} className={`p-4 sm:p-6 hover:bg-slate-50 transition flex gap-4 ${!notification.read ? 'bg-blue-50/10' : ''}`}>
               <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${notification.bg}`}>
                  <Icon className={`w-5 h-5 ${notification.color}`} />
               </div>
               <div className="flex-1">
                 <div className="flex justify-between items-start mb-1">
                    <h3 className={`text-sm ${!notification.read ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>
                      {notification.title}
                    </h3>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 whitespace-nowrap ml-4">
                      {notification.time}
                    </span>
                 </div>
                 <p className="text-xs text-slate-600 leading-relaxed max-w-xl">
                   {notification.message}
                 </p>
                 
                 {notification.type === 'status_update' && (
                   <button className="mt-3 text-[10px] font-bold uppercase tracking-wider text-blue-600 hover:text-blue-800 transition">
                     View Complaint &rarr;
                   </button>
                 )}
               </div>
               {!notification.read && (
                 <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 shrink-0"></div>
               )}
             </div>
           )
         })}
      </div>
    </div>
  );
}
