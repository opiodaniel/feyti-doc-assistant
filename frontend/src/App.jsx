import React, { useState } from 'react';
import axios from 'axios';

/**
 * Accessing environment variables in Vite projects.
 * Using a safer check for import.meta to avoid build-time warnings
 * in certain target environments.
 */
const getApiBaseUrl = () => {
  try {
    // Check if import.meta and env exist before accessing
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_DJANGO_API_URL) {
      return import.meta.env.VITE_DJANGO_API_URL;
    }
  } catch (e) {
    // Fallback to local development URL if import.meta is unavailable
  }
  return 'http://localhost:8000/api';
};

const API_BASE_URL = getApiBaseUrl();

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    // Support both PDF and DOCX based on MIME type or file extension
    if (selected && (selected.type === 'application/pdf' ||
        selected.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        selected.name.endsWith('.docx'))) {
      setFile(selected);
      setError(null);
    } else {
      setError("Please upload a valid PDF or Word (.docx) document.");
      setFile(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      // Django requires trailing slashes on POST requests by default
      const response = await axios.post(`${API_BASE_URL}/analyze/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResult(response.data);
    } catch (err) {
      console.error("Upload error:", err);
      const message = err.response?.data?.error || "Analysis failed. Please check your connection and try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 flex flex-col items-center">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-6 md:p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Feyti DocAssistant</h1>
          <p className="text-slate-500 mt-2">Upload a document to generate an AI-powered summary.</p>
        </header>

        <div className="border-2 border-dashed border-slate-200 rounded-lg p-8 md:p-12 text-center hover:border-indigo-400 transition-colors bg-slate-50/50">
          <input
            type="file"
            id="fileInput"
            className="hidden"
            onChange={handleFileChange}
            accept=".pdf,.docx"
          />
          <label htmlFor="fileInput" className="cursor-pointer block">
            <div className="flex flex-col items-center">
              <svg className="w-12 h-12 text-indigo-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="Collection: 7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <div className="text-indigo-600 font-semibold text-lg">
                {file ? file.name : "Click to select a document"}
              </div>
              <div className="text-slate-400 text-sm mt-1">Supports PDF and Word (.docx)</div>
            </div>
          </label>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm flex items-start">
            <svg className="w-5 h-5 mr-2 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className="w-full mt-6 bg-indigo-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all shadow-md active:transform active:scale-[0.98]"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : "Analyze Document"}
        </button>

        {result && (
          <div className="mt-10 space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-500">
            <div className="border-t border-slate-100 pt-6">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Document Title</h2>
              <p className="text-xl font-bold text-slate-900">{result.title || "Unknown Title"}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Author</h2>
                <p className="text-slate-700 font-medium">{result.author || "Unknown Author"}</p>
              </div>
            </div>

            <div>
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Executive Summary</h2>
              <div className="bg-slate-50 rounded-lg p-4 text-slate-700 leading-relaxed border border-slate-100">
                {result.summary}
              </div>
            </div>

            <div>
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Key Insights</h2>
              <ul className="space-y-2">
                {result.key_points && Array.isArray(result.key_points) ? (
                  result.key_points.map((point, i) => (
                    <li key={i} className="flex items-start text-slate-700">
                      <span className="text-indigo-500 mr-2 mt-1">●</span>
                      {point}
                    </li>
                  ))
                ) : (
                  <li className="flex items-start text-slate-700">
                    <span className="text-indigo-500 mr-2 mt-1">●</span>
                    {result.key_points}
                  </li>
                )}
              </ul>
            </div>
          </div>
        )}
      </div>
      <footer className="mt-8 text-slate-400 text-sm">
        Built for Feyti Internship Assessment
      </footer>
    </div>
  );
}

export default App;