
import React from 'react';
import { AWSAccount, LifecycleType } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface DashboardProps {
  accounts: AWSAccount[];
}

const Dashboard: React.FC<DashboardProps> = ({ accounts }) => {
  const getTotals = () => {
    let spot = 0;
    let onDemand = 0;
    accounts.forEach(acc => {
      acc.asgs.forEach(asg => {
        asg.metrics.forEach(m => {
          if (m.lifecycle === 'spot') spot += m.count;
          else onDemand += m.count;
        });
      });
    });
    return { spot, onDemand };
  };

  const { spot, onDemand } = getTotals();
  const data = [
    { name: 'Spot', value: spot, color: '#3b82f6' },
    { name: 'On-Demand', value: onDemand, color: '#6366f1' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-slate-500 text-sm font-medium">Total Running Instances</p>
          <div className="mt-2 flex items-end gap-2">
            <span className="text-3xl font-bold text-slate-900">{spot + onDemand}</span>
            <span className="text-green-500 text-sm font-medium mb-1">↑ 12%</span>
          </div>
          <div className="mt-4 flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              <span className="text-xs text-slate-500">{spot} Spot</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
              <span className="text-xs text-slate-500">{onDemand} On-Demand</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-slate-500 text-sm font-medium">Spot Savings Estimate</p>
          <div className="mt-2 flex items-end gap-2">
            <span className="text-3xl font-bold text-slate-900">$1,452.80</span>
            <span className="text-slate-400 text-xs mb-1">/ month</span>
          </div>
          <div className="mt-4 w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className="bg-green-500 h-full w-[72%]"></div>
          </div>
          <p className="mt-2 text-[10px] text-slate-400 font-medium tracking-wide uppercase">72% Optimized for Cost</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-slate-500 text-sm font-medium">Active ASGs</p>
          <div className="mt-2">
            <span className="text-3xl font-bold text-slate-900">
              {accounts.reduce((sum, acc) => sum + acc.asgs.length, 0)}
            </span>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {accounts.map(acc => (
              <span key={acc.id} className="px-2 py-0.5 bg-slate-50 border border-slate-200 rounded text-[10px] font-bold text-slate-600">
                {acc.name.split('-')[0]}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Fleet Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center">
          <h3 className="text-lg font-bold text-slate-800 mb-2">Quick Recommendations</h3>
          <p className="text-sm text-slate-500 mb-6">Automated cost savings based on current fleet configuration.</p>
          <div className="space-y-4">
            <div className="flex gap-4 p-4 rounded-lg bg-blue-50 border border-blue-100">
              <span className="text-xl">💰</span>
              <div>
                <p className="text-sm font-semibold text-blue-900">Switch On-Demand to Spot</p>
                <p className="text-xs text-blue-700 mt-0.5">Prod-Core has 4 t3.large on-demand. Savings potential: $120/mo.</p>
              </div>
            </div>
            <div className="flex gap-4 p-4 rounded-lg bg-indigo-50 border border-indigo-100">
              <span className="text-xl">📈</span>
              <div>
                <p className="text-sm font-semibold text-indigo-900">Over-provisioning Detected</p>
                <p className="text-xs text-indigo-700 mt-0.5">Dev-Playground idle time is >80%. Suggest downsizing micro nodes.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
