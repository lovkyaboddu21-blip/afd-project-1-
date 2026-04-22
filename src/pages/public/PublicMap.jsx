import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Search, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';

// Fix for default marker icons in react-leaflet
// @ts-ignore
import icon from 'leaflet/dist/images/marker-icon.png';
// @ts-ignore
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const complaints = [
  { id: 1, title: 'Large Pothole on CP Circle', category: 'Roads', status: 'In Progress', lat: 28.6304, lng: 77.2177 },
  { id: 2, title: 'Streetlight out near India Gate', category: 'Electricity', status: 'Reported', lat: 28.6129, lng: 77.2295 },
  { id: 3, title: 'Water leakage in Hauz Khas', category: 'Water', status: 'Verified', lat: 28.5494, lng: 77.2001 },
  { id: 4, title: 'Waste accumulated in Karol Bagh', category: 'Waste', status: 'Pending', lat: 28.6515, lng: 77.1903 },
];

export default function PublicMap() {
  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      {/* Map Header / Filters */}
      <div className="bg-slate-50 p-4 border-b border-slate-200">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">Public Issue Map</h1>
            <p className="text-sm text-slate-500">Viewing all reported issues in the city</p>
          </div>
          
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search location or issue..." 
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm bg-white"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white rounded-md text-sm font-medium hover:bg-slate-50 transition">
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 w-full relative z-0">
        <MapContainer center={[28.6139, 77.2090]} zoom={12} scrollWheelZoom={false} className="h-full w-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />
          
          {complaints.map(comp => (
            <Marker key={comp.id} position={[comp.lat, comp.lng]}>
              <Popup>
                <div className="p-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-blue-600 mb-1">{comp.category}</div>
                  <h3 className="font-bold text-slate-900 mb-2">{comp.title}</h3>
                  <div className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-700 mb-3">
                    Status: {comp.status}
                  </div>
                  <div className="flex gap-2">
                    <Link to={`/issue/${comp.id}`} className="flex-1 text-center text-[10px] font-bold uppercase tracking-wider text-white bg-blue-600 rounded px-2 py-1.5 hover:bg-blue-700">
                      View Details
                    </Link>
                    <a href={`https://www.google.com/maps/dir/?api=1&destination=${comp.lat},${comp.lng}`} target="_blank" rel="noopener noreferrer" className="flex-1 text-center text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 border border-blue-100 rounded px-2 py-1.5 hover:bg-blue-100">
                      Directions
                    </a>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
