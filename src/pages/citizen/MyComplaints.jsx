import React, { useState, useEffect } from 'react';
import { Search, Filter, ChevronDown, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MyComplaints() {
  const [mockComplaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/complaints')
      .then(res => res.json())
      .then(data => {
        setComplaints(data);
        setLoading(false);
      });
  }, []);
  const getStatusBadge = (status) => {
    switch(status) {
      case 'Resolved': return <span className="inline-flex flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-emerald-700"><CheckCircle className="w-3 h-3 mr-1"/>Resolved</span>;
      case 'In Progress': return <span className="inline-flex flex-shrink-0 items-center justify-center rounded-full bg-blue-100 px-2.5 py-0.5 text-blue-700"><AlertTriangle className="w-3 h-3 mr-1"/>In Progress</span>;
      default: return <span className="inline-flex flex-shrink-0 items-center justify-center rounded-full bg-amber-100 px-2.5 py-0.5 text-amber-700"><Clock className="w-3 h-3 mr-1"/>Pending</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">My Complaints</h1>
          <p className="text-sm text-slate-500">Track and manage your submitted civic reports.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search ID or Title..." 
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">
              <Filter className="w-4 h-4" />
              Filter
            </button>
            <button className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">
              Sort by
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-6 py-3">Complaint ID</th>
                <th className="px-6 py-3">Issue Details</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Submitted On</th>
                <th className="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              {loading && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">Loading your complaints...</td>
                </tr>
              )}
              {!loading && mockComplaints.map((comp) => (
                <tr key={comp.id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4 font-mono text-[10px] font-bold text-slate-500">{comp.id}</td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-900 text-xs">{comp.title}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{comp.department} Dept.</p>
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(comp.status)}</td>
                  <td className="px-6 py-4">
                    <span className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase">
                      {comp.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500 text-xs">{comp.date}</td>
                  <td className="px-6 py-4 text-right">
                    <Link to={`/citizen/complaints/${comp.id}`} className="text-blue-600 hover:text-blue-900 font-bold text-[10px] uppercase tracking-wider">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Stub */}
        <div className="px-6 py-3 border-t border-slate-200 flex items-center justify-between bg-slate-50/50">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Showing 1 to 4 of 4 results</span>
          <div className="flex gap-1">
            <button className="px-2 py-1 border border-slate-200 rounded text-xs font-medium text-slate-500 disabled:opacity-50" disabled>Prev</button>
            <button className="px-2 py-1 border border-slate-200 rounded text-xs font-medium text-slate-500 disabled:opacity-50" disabled>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
