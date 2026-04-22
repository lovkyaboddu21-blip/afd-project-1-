import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, MapPin, UploadCloud, AlertCircle, X } from 'lucide-react';

export default function ReportIssue() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [complaintId, setComplaintId] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Pothole',
    severity: 'Medium (Needs attention soon)',
    description: '',
    location: ''
  });

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImagePreview(URL.createObjectURL(file));
      // In a real app we'd upload the file to S3/CDN and store the URL in formData
    }
  };

  const handleDetectLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData, 
            location: `${position.coords.latitude.toFixed(5)}, ${position.coords.longitude.toFixed(5)}`
          });
        }, 
        () => {
          alert("Could not access your location. Please enter it manually.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch('/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const cdata = await res.json();
      setComplaintId(cdata.id);
      setSubmitted(true);
    } catch (error) {
      console.error(error);
      alert('Failed to submit complaint. Make sure the server is running.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center max-w-2xl mx-auto mt-8">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-semibold text-slate-900 mb-2">Complaint Submitted Successfully!</h2>
        <p className="text-slate-500 mb-6">Your complaint has been registered. The assigned department will review it shortly.</p>
        <div className="bg-slate-50 rounded-lg p-4 mb-8 inline-block">
          <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">Complaint ID</p>
          <p className="text-xl font-bold text-blue-600 tracking-wider">{complaintId}</p>
        </div>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button onClick={() => navigate('/citizen/complaints')} className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700">
            Track Complaint
          </button>
          <button onClick={() => {
            setSubmitted(false);
            setFormData({...formData, title: '', description: '', location: ''});
            setImagePreview(null);
          }} className="px-4 py-2 border border-slate-200 text-slate-700 rounded-md text-sm font-medium hover:bg-slate-50">
            Report Another Issue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-slate-900">Report a Civic Issue</h1>
        <p className="text-sm text-slate-500 mt-1">Provide details about the issue to help us resolve it faster.</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
          
          {/* Section 1: Basic Info */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 mb-4 bg-slate-50/50 -mx-6 md:-mx-8 px-6 md:px-8 py-3">1. Issue Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Issue Title</label>
                <input 
                  type="text" 
                  required 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="E.g., Large Pothole on 5th Avenue" 
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:ring-1 focus:ring-blue-500 focus:outline-none" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select 
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:ring-1 focus:ring-blue-500 focus:outline-none bg-white">
                    <option>Pothole</option>
                    <option>Garbage / Waste</option>
                    <option>Streetlight</option>
                    <option>Water Leakage</option>
                    <option>Drain Blockage</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Severity</label>
                  <select 
                    value={formData.severity}
                    onChange={(e) => setFormData({...formData, severity: e.target.value})}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:ring-1 focus:ring-blue-500 focus:outline-none bg-white">
                    <option>Low (Minor inconvenience)</option>
                    <option>Medium (Needs attention soon)</option>
                    <option>High (Safety hazard, urgent)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                <textarea 
                  rows={4} 
                  required 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Describe the issue, landmarks, and any other helpful details..." 
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:ring-1 focus:ring-blue-500 focus:outline-none"></textarea>
              </div>
            </div>
          </div>

          {/* Section 2: Media */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 mb-4 bg-slate-50/50 -mx-6 md:-mx-8 px-6 md:px-8 py-3 dark:bg-slate-800 dark:border-slate-700 dark:text-white">2. Upload Photos/Videos</h3>
            
            {imagePreview ? (
              <div className="relative mt-2 rounded-md overflow-hidden border border-slate-200 inline-block w-full sm:w-auto">
                <img src={imagePreview} alt="Preview" className="h-48 object-cover w-full sm:w-auto" />
                <button 
                  type="button" 
                  onClick={() => setImagePreview(null)}
                  className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white p-1 rounded-full backdrop-blur-sm transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="mt-2 flex justify-center px-6 pt-5 pb-6 border border-slate-200 border-dashed rounded-md hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                <div className="space-y-1 text-center">
                  <Camera className="mx-auto h-10 w-10 text-slate-400" />
                  <div className="flex text-sm text-slate-600 dark:text-slate-400 justify-center">
                    <span className="relative rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                      <span>Upload a file</span>
                      <input 
                        ref={fileInputRef}
                        type="file" 
                        accept="image/*,video/*"
                        className="sr-only" 
                        onChange={handleImageChange}
                      />
                    </span>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-slate-500">PNG, JPG, MP4 up to 10MB</p>
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Location */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 mb-4 bg-slate-50/50 -mx-6 md:-mx-8 px-6 md:px-8 py-3 dark:bg-slate-800 dark:border-slate-700 dark:text-white">3. Location</h3>
            <div className="space-y-4">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  placeholder="Auto-detecting address or manually enter..." 
                  className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-md focus:ring-1 focus:ring-blue-500 focus:outline-none dark:bg-slate-900 dark:border-slate-700 dark:text-white" />
                <button 
                  type="button" 
                  onClick={handleDetectLocation}
                  className="inline-flex items-center px-4 py-2 border border-slate-200 shadow-sm text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700 transition"
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  Detect
                </button>
              </div>
              <div className="h-48 bg-slate-100 rounded-md border border-slate-200 flex items-center justify-center text-slate-400 text-sm">
                Map view placeholder
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end pb-2 border-t border-slate-100">
            <button type="button" className="mr-3 px-4 py-2 border border-slate-200 text-slate-700 rounded-md text-sm font-medium hover:bg-slate-50">
              Save Draft
            </button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 shadow-sm flex items-center gap-2">
              <UploadCloud className="w-4 h-4" />
              {loading ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
