import React, { useState } from 'react';
import axios from 'axios';
import { Upload, FileText, User, AlignLeft, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

function App() {
  const [file, setFile] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError(null);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first.");
      return;
    }

    setLoading(true);
    setError(null);
    setData(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      // Pointing to your Django backend
      const response = await axios.post('http://127.0.0.1:8000/api/analyze/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setData(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong while analyzing the document.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-indigo-600 mb-2">Feyti DocAssistant</h1>
          <p className="text-slate-600">AI-Powered Document Summarization & Analysis</p>
        </header>

        {/* Upload Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-8">
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-xl p-10 hover:border-indigo-400 transition-colors bg-slate-50">
            <Upload className="w-12 h-12 text-slate-400 mb-4" />
            <input
              type="file"
              onChange={handleFileChange}
              className="hidden"
              id="fileInput"
              accept=".pdf"
            />
            <label htmlFor="fileInput" className="cursor-pointer text-indigo-600 font-semibold hover:underline">
              {file ? file.name : "Click to upload a PDF document"}
            </label>
            <p className="text-xs text-slate-500 mt-2">Maximum file size: 10MB</p>
          </div>

          <button
            onClick={handleUpload}
            disabled={loading || !file}
            className={`w-full mt-6 py-3 px-6 rounded-lg  cursor-pointer font-bold text-white transition-all flex items-center justify-center gap-2 ${
              loading || !file ? 'bg-slate-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 shadow-md'
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyzing with AI...
              </>
            ) : (
              "Analyze Document"
            )}
          </button>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              {error}
            </div>
          )}
        </div>

        {/* Results Section */}
        {data && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title Card */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="flex items-center gap-3 mb-3 text-indigo-600">
                  <FileText className="w-5 h-5" />
                  <h3 className="font-bold uppercase tracking-wider text-sm">Document Title</h3>
                </div>
                <p className="text-lg font-semibold text-slate-800">{data.title || "N/A"}</p>
              </div>

              {/* Author Card */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="flex items-center gap-3 mb-3 text-emerald-600">
                  <User className="w-5 h-5" />
                  <h3 className="font-bold uppercase tracking-wider text-sm">Author / Organization</h3>
                </div>
                <p className="text-lg font-semibold text-slate-800">{data.author || "Unknown"}</p>
              </div>
            </div>

            {/* Summary Card */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <div className="flex items-center gap-3 mb-4 text-amber-600">
                <AlignLeft className="w-5 h-5" />
                <h3 className="font-bold uppercase tracking-wider text-sm">Executive Summary</h3>
              </div>
              <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{data.summary}</p>
            </div>

            {/* Key Points */}
            {data.key_points && (
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="flex items-center gap-3 mb-4 text-purple-600">
                  <CheckCircle className="w-5 h-5" />
                  <h3 className="font-bold uppercase tracking-wider text-sm">Key Takeaways</h3>
                </div>
                <ul className="grid grid-cols-1 gap-3">
                  {Array.isArray(data.key_points) ? data.key_points.map((point, i) => (
                    <li key={i} className="flex gap-3 text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <span className="text-indigo-500 font-bold">•</span>
                      {point}
                    </li>
                  )) : <p className="text-slate-700">{data.key_points}</p>}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      <footer className="mt-20 text-center text-slate-400 text-sm border-t border-slate-200 pt-8">
        Built by <span className="font-bold text-slate-600">Opio Daniel</span> for Feyti Medical Group Internship
      </footer>
    </div>
  );
}

export default App;