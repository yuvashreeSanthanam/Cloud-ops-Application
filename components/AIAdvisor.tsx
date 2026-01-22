
import React, { useState, useEffect } from 'react';
import { AWSAccount } from '../types';
import { getAIRecommendations } from '../services/geminiService';

interface AIAdvisorProps {
  accounts: AWSAccount[];
}

const AIAdvisor: React.FC<AIAdvisorProps> = ({ accounts }) => {
  const [recommendations, setRecommendations] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true);
      const result = await getAIRecommendations(accounts);
      setRecommendations(result);
      setLoading(false);
    };
    fetchRecommendations();
  }, [accounts]);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="text-center space-y-4">
        <div className="inline-block p-3 bg-blue-100 rounded-2xl text-3xl">🤖</div>
        <h3 className="text-2xl font-bold text-slate-900">Gemini Cloud Architect</h3>
        <p className="text-slate-600 max-w-lg mx-auto">
          Our AI assistant has analyzed your multi-account EC2 fleet. 
          Here are your personalized architectural recommendations.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
        <div className="p-6 bg-slate-900 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-white font-medium text-sm">Real-time Analysis Active</span>
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="text-xs font-bold text-slate-400 hover:text-white transition-colors"
          >
            REFRESH DATA
          </button>
        </div>

        <div className="p-8">
          {loading ? (
            <div className="space-y-6">
              <div className="h-4 bg-slate-100 rounded w-3/4 animate-pulse"></div>
              <div className="h-4 bg-slate-100 rounded w-1/2 animate-pulse"></div>
              <div className="h-4 bg-slate-100 rounded w-2/3 animate-pulse"></div>
              <div className="pt-8 flex justify-center">
                <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              </div>
            </div>
          ) : (
            <div className="prose prose-slate max-w-none">
              <div className="whitespace-pre-wrap text-slate-700 leading-relaxed font-medium">
                {recommendations}
              </div>
            </div>
          )}
        </div>

        {!loading && (
          <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
            <p className="text-xs text-slate-500 font-medium italic">
              Recommendations based on real-time pricing and historical interruption rates.
            </p>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800">
                Apply Optimizations
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-center">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Cost Score</p>
          <p className="text-3xl font-bold text-blue-600">88/100</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-center">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Risk Score</p>
          <p className="text-3xl font-bold text-indigo-600">Low</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-center">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Fleet Health</p>
          <p className="text-3xl font-bold text-green-600">94%</p>
        </div>
      </div>
    </div>
  );
};

export default AIAdvisor;
