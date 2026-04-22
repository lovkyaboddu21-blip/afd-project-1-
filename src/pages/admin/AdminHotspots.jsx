import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { TrendingUp, AlertTriangle, Flame, Filter, ChevronDown } from 'lucide-react';

const mockHotspots = [
  { id: 1, lat: 28.6304, lng: 77.2177, intensity: 80, area: 'Connaught Place', issues: 45, mainIssue: 'Roads/Potholes' },
  { id: 2, lat: 28.6129, lng: 77.2295, intensity: 50, area: 'India Gate Circle', issues: 28, mainIssue: 'Water/Leakage' },
  { id: 3, lat: 28.5494, lng: 77.2001, intensity: 60, area: 'Hauz Khas', issues: 33, mainIssue: 'Waste/Garbage' },
  { id: 4, lat: 28.6515, lng: 77.1903, intensity: 30, area: 'Karol Bagh', issues: 12, mainIssue: 'Parks' },
];

export default function AdminHotspots() {
  const [activeLayer, setActiveLayer] = useState('heatmap');
  const navigate = useNavigate();
  
  return (
    <div className="space-y-6 flex flex-col h-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
            <Flame className="w-5 h-5 text-red-500" />
            Hotspot Analytics
          </h1>
          <p className="text-sm text-slate-500">Analyze geographic density of civic issues to allocate resources.</p>
        </div>
        
        <div className="flex gap-2">
           <div className="bg-slate-200 p-1 rounded-md flex text-[10px] font-bold uppercase tracking-wider">
             <button 
               className={`px-3 py-1.5 rounded-sm transition ${activeLayer === 'heatmap' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
               onClick={() => setActiveLayer('heatmap')}
             >Heatmap</button>
             <button 
               className={`px-3 py-1.5 rounded-sm transition ${activeLayer === 'clusters' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
               onClick={() => setActiveLayer('clusters')}
             >Clusters</button>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Analytics List */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
             <h2 className="text-sm font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Top Affected Areas</h2>
             <div className="space-y-4">
                {mockHotspots.sort((a,b) => b.issues - a.issues).map((hot, i) => (
                  <div key={hot.id} className="cursor-pointer group">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition">{i + 1}. {hot.area}</span>
                      <span className="text-[10px] font-bold bg-red-100 text-red-700 px-1.5 py-0.5 rounded">{hot.issues} active</span>
                    </div>
                    <div className="text-[10px] text-slate-500 font-medium">Primary issue: {hot.mainIssue}</div>
                    
                    <div className="w-full bg-slate-100 h-1 mt-2 rounded-full overflow-hidden">
                      <div className="bg-red-500 h-full" style={{ width: `${hot.intensity}%`}}></div>
                    </div>
                  </div>
                ))}
             </div>
          </div>
          
          <div className="bg-slate-900 text-white rounded-xl border border-slate-800 shadow-sm p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">AI Insights</h3>
            <div className="flex gap-3 items-start">
              <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-300 leading-relaxed">
                Water leakages in <strong>Hauz Khas</strong> have spiked by 40% in the last 48 hours. Suggest deploying emergency maintenance crew to Zone E.
              </p>
            </div>
          </div>
        </div>
        
        {/* Map */}
        <div className="lg:col-span-3 bg-slate-100 rounded-xl border border-slate-200 shadow-sm overflow-hidden h-[600px] relative z-0 flex flex-col">
          <div className="bg-white px-4 py-2 border-b border-slate-200 flex gap-2 overflow-x-auto text-xs">
            <button className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-100 font-medium text-slate-700 hover:bg-slate-200 whitespace-nowrap">
               <Filter className="w-3 h-3" /> Category <ChevronDown className="w-3 h-3" />
            </button>
            <button className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-100 font-medium text-slate-700 hover:bg-slate-200 whitespace-nowrap">
               Time Range <ChevronDown className="w-3 h-3" />
            </button>
          </div>
          
          <div className="flex-1 relative z-0">
            <MapContainer center={[28.6139, 77.2090]} zoom={12} scrollWheelZoom={false} className="h-full w-full">
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              />
              
              {mockHotspots.map(hot => (
                <CircleMarker 
                  key={hot.id} 
                  center={[hot.lat, hot.lng]} 
                  pathOptions={{ 
                    color: hot.intensity > 60 ? '#ef4444' : '#f59e0b', 
                    fillColor: hot.intensity > 60 ? '#ef4444' : '#f59e0b',
                    fillOpacity: 0.4
                  }} 
                  radius={hot.intensity / 2}
                >
                  <Popup>
                    <div className="p-1">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-red-600 mb-1">Hotspot</div>
                      <h3 className="font-bold text-slate-900 mb-1">{hot.area}</h3>
                      <div className="text-xs text-slate-600 mb-2">Total Issues: <strong>{hot.issues}</strong></div>
                      <button onClick={() => navigate('/admin/complaints')} className="block w-full text-center text-[10px] font-bold uppercase tracking-wider text-white bg-slate-900 rounded px-2 py-1.5 hover:bg-slate-800 mb-1 pointer-events-auto">
                        View Sector Analytics
                      </button>
                      <a href={`https://www.google.com/maps/dir/?api=1&destination=${hot.lat},${hot.lng}`} target="_blank" rel="noopener noreferrer" className="block w-full text-center text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 border border-blue-100 rounded px-2 py-1.5 hover:bg-blue-100">
                        Get Directions
                      </a>
                    </div>
                  </Popup>
                </CircleMarker>
              ))}
            </MapContainer>
            
            {/* Legend */}
            <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg border border-slate-200 shadow-sm z-[1000] text-[10px] font-bold">
              <div className="mb-2 uppercase tracking-wider text-slate-500">Density</div>
              <div className="flex items-center justify-between gap-1 w-32 h-2 rounded-full overflow-hidden mb-1">
                 <div className="flex-1 h-full bg-blue-300"></div>
                 <div className="flex-1 h-full bg-green-400"></div>
                 <div className="flex-1 h-full bg-amber-400"></div>
                 <div className="flex-1 h-full bg-orange-500"></div>
                 <div className="flex-1 h-full bg-red-600"></div>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Low</span>
                <span>Critical</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
