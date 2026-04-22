import React, { useState, useEffect } from 'react';
import { Search, Filter, ChevronDown, Download, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

import { Link } from 'react-router-dom';

export default function AdminComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const staffList = [
    "Unassigned",
    "Officer Michael B.",
    "Engineer Sarah T.",
    "Crew Alpha",
    "Insp. Patel"
  ];

  useEffect(() => {
    fetch('/api/complaints')
      .then(res => res.json())
      .then(data => {
        setComplaints(data);
        setLoading(false);
      });
  }, []);

  const handleAssign = async (id, assignee) => {
    try {
      const assignedTo = assignee === "Unassigned" ? null : assignee;
      await fetch(`/api/complaints/${id}/assign`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignedTo })
      });
      // Update local state
      setComplaints(prev => prev.map(c => 
        c.id === id ? { ...c, assignedTo } : c
      ));
    } catch (err) {
      console.error('Failed to assign complaint', err);
      alert('Failed to assign complaint. Please try again.');
    }
  };

  const downloadCSV = () => {
    if (!complaints.length) return alert('No data to export');
    
    // Create CSV Header
    const headers = ['ID', 'Title', 'Category', 'Department', 'Severity', 'Status', 'Assigned To', 'Location', 'Date'];
    const csvContent = [
      headers.join(','),
      ...complaints.map(c => 
        [
          c.id, 
          `"${c.title}"`, 
          `"${c.category}"`, 
          `"${c.department}"`, 
          `"${c.severity}"`, 
          `"${c.status}"`, 
          `"${c.assignedTo || 'Unassigned'}"`, 
          `"${c.location}"`, 
          `"${c.date}"`
        ].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `complaints_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">All Complaints</h1>
          <p className="text-sm text-slate-500">Manage, filter, and assign city-wide civic issues.</p>
        </div>
        <button onClick={downloadCSV} className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 text-slate-700 rounded-md text-sm font-medium hover:bg-slate-50 transition shadow-sm">
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        {/* Advanced Filters */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-3 items-center">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search ID, Title, or Assignee..." 
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm bg-white"
            />
          </div>
          
          <select className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-600 font-medium">
            <option>All Departments</option>
            <option>Water Board</option>
            <option>Sanitation</option>
            <option>Roads</option>
          </select>

          <select className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-600 font-medium">
            <option>All Statuses</option>
            <option>Pending</option>
            <option>In Progress</option>
            <option>Resolved</option>
          </select>

          <select className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-600 font-medium">
            <option>All Priorities</option>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>

          <button onClick={() => alert("Advanced filters modal would open here!")} className="flex items-center justify-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 transition">
            <Filter className="w-4 h-4" />
            More
          </button>
        </div>

        {/* Action Bar (Mock bulk actions) */}
        <div className="px-4 py-2 border-b border-slate-100 flex items-center gap-3 bg-white text-xs">
          <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
          <span className="text-slate-500 font-medium">0 Selected</span>
          <div className="w-px h-4 bg-slate-200 mx-1"></div>
          <button className="text-slate-400 hover:text-slate-700 font-medium disabled:opacity-50" onClick={() => alert("Select complaints first to assign bulk staff.")}>Assign</button>
          <button className="text-slate-400 hover:text-slate-700 font-medium disabled:opacity-50" onClick={() => alert("Select complaints first to bulk change status.")}>Change Status</button>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-4 py-3 w-8"><input type="checkbox" className="rounded border-slate-300" /></th>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Complaint</th>
                <th className="px-4 py-3">Zone</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Assigned To</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              {loading && (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-slate-500">Loading complaints...</td>
                </tr>
              )}
              {!loading && complaints.map((comp) => (
                <tr key={comp.id} className="hover:bg-slate-50 transition group cursor-pointer">
                  <td className="px-4 py-4 w-8"><input type="checkbox" className="rounded border-slate-300" /></td>
                  <td className="px-4 py-4 font-mono text-[10px] font-bold text-slate-500">{comp.id}</td>
                  <td className="px-4 py-4">
                    <p className="font-bold text-slate-900 text-xs">{comp.title}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{comp.department}</p>
                  </td>
                  <td className="px-4 py-4 text-xs font-medium">{comp.location || 'Unknown Zone'}</td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider ${
                      comp.severity?.includes('High') ? 'text-red-700' : 
                      comp.severity?.includes('Medium') ? 'text-amber-700' : 'text-slate-600'
                    }`}>
                      {comp.severity?.includes('High') && <AlertCircle className="w-3 h-3" />}
                      {comp.severity?.split(' ')[0] || comp.severity}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                     <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        comp.status === 'Resolved' ? 'bg-emerald-100 text-emerald-700' :
                        comp.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                        comp.status === 'Assigned' ? 'bg-indigo-100 text-indigo-700' :
                        'bg-amber-100 text-amber-700'
                     }`}>
                        {comp.status}
                     </span>
                  </td>
                  <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                    <select 
                      value={comp.assignedTo || "Unassigned"}
                      onChange={(e) => handleAssign(comp.id, e.target.value)}
                      className="w-full px-2 py-1 text-xs border border-slate-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-700 font-medium cursor-pointer"
                    >
                      {staffList.map(staff => (
                        <option key={staff} value={staff}>{staff}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-4 text-slate-500 text-xs">{comp.date}</td>
                  <td className="px-4 py-4 text-right">
                    <Link to={`/admin/complaints/${comp.id}`} className="text-blue-600 hover:text-blue-900 font-bold text-[10px] uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                      Review
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-4 py-3 border-t border-slate-200 flex items-center justify-between bg-slate-50/50">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Showing 1 to 5 of 142 records</span>
          <div className="flex gap-1">
            <button className="px-2 py-1 border border-slate-200 rounded text-xs font-medium text-slate-500 bg-white hover:bg-slate-50">Prev</button>
            <button className="px-2 py-1 bg-blue-600 border border-blue-600 text-white rounded text-[10px] font-bold">1</button>
            <button className="px-2 py-1 border border-slate-200 rounded text-[10px] font-medium text-slate-600 bg-white hover:bg-slate-50">2</button>
            <button className="px-2 py-1 border border-slate-200 rounded text-[10px] font-medium text-slate-600 bg-white hover:bg-slate-50">3</button>
            <span className="px-2 py-1 text-slate-400">...</span>
            <button className="px-2 py-1 border border-slate-200 rounded text-xs font-medium text-slate-500 bg-white hover:bg-slate-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
