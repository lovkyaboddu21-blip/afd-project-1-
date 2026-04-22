import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShieldAlert, AlertTriangle, Droplets, Zap, Camera, MapPin, BellRing } from 'lucide-react';

export default function Landing() {
  const stats = [
    { label: 'Total Reports', value: '14,203', suffix: '+' },
    { label: 'Issues Resolved', value: '12,054', suffix: '' },
    { label: 'Avg. Response', value: '24', suffix: 'h' },
  ];

  const categories = [
    { name: 'Potholes', icon: AlertTriangle, color: 'bg-amber-100 text-amber-600' },
    { name: 'Water Leak', icon: Droplets, color: 'bg-blue-100 text-blue-600' },
    { name: 'Streetlight', icon: Zap, color: 'bg-yellow-100 text-yellow-600' },
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 pb-1.5 rounded-full bg-blue-50 text-blue-700 font-medium text-xs tracking-wider uppercase mb-6 border border-blue-100">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                Live reporting active in your city
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 leading-[1.1] mb-6">
                Report city issues in <span className="text-blue-600">30 seconds</span>.
              </h1>
              <p className="text-lg text-slate-600 mb-8 max-w-lg">
                Help keep our community safe and clean. Snap a photo, drop a pin, and let the right city department handle the rest.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/signup" className="px-6 py-3 bg-blue-600 text-white rounded-md font-medium text-sm hover:bg-blue-700 transition shadow-sm text-center">
                  Report an Issue
                </Link>
                <Link to="/map" className="px-6 py-3 bg-white text-slate-700 border border-slate-200 rounded-md font-medium text-sm hover:bg-slate-50 transition text-center">
                  View Live Map
                </Link>
              </div>

              {/* Stats inline */}
              <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-slate-100">
                {stats.map((stat, i) => (
                  <div key={i}>
                    <div className="text-2xl font-bold text-slate-900">
                      {stat.value}<span className="text-blue-600">{stat.suffix}</span>
                    </div>
                    <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Hero Image/Mockup */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-slate-50 rounded-2xl transform rotate-3"></div>
              <div className="relative bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xl">
                <div className="h-10 bg-slate-50 border-b border-slate-200 flex items-center px-4 gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                </div>
                <div className="p-6 pb-10">
                  <div className="mb-6">
                    <h3 className="font-bold text-sm text-slate-900 mb-4 tracking-tight">Common Issues</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {categories.map((cat, i) => {
                        const Icon = cat.icon;
                        return (
                          <div key={i} className="flex flex-col items-center justify-center p-3 border border-slate-100 rounded-lg hover:shadow-sm transition bg-slate-50/50">
                            <div className={`p-2.5 rounded-md mb-2 ${cat.color}`}>
                              <Icon className="w-5 h-5" />
                            </div>
                            <span className="text-xs font-bold text-slate-700">{cat.name}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                    <div className="flex items-center gap-3 text-xs text-slate-600 font-medium">
                      <ShieldAlert className="w-4 h-4 text-blue-500" />
                      <span>Complaints are routed directly to assigned municipal departments with SLA tracking.</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-4">Transparency & Accountability</h2>
            <p className="text-sm text-slate-600">Civic systems bridge the gap between residents and city officials. Here is how your complaint becomes a solved issue.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Camera, title: '1. Snap & Describe', desc: 'Take a picture of the pothole, leak, or hazard. Describe the issue briefly.' },
              { icon: MapPin, title: '2. Drop a Pin', desc: 'Our system auto-detects your location or lets you pick the exact spot on the map.' },
              { icon: BellRing, title: '3. Track Resolution', desc: 'Get real-time updates as the city department verifies, assigns, and resolves it.' }
            ].map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col">
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-md flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
