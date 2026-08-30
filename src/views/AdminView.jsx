import React, { useState } from 'react';

export default function AdminView() {
  const [users, setUsers] = useState([
    { id: 'BP-1001', name: 'Amina Hassan', pathway: 'Healthcare Administration', readiness: 92, simStatus: 'Completed (95% Match)', role: 'Individual', overrideStatus: 'Default' },
    { id: 'BP-1002', name: 'Maria Garcia', pathway: 'School Support (LSA)', readiness: 86, simStatus: 'Completed (92% Match)', role: 'Individual', overrideStatus: 'Default' },
    { id: 'BP-1003', name: 'Fatima Zahra', pathway: 'Admin & Office Support', readiness: 89, simStatus: 'Completed (95% Match)', role: 'Individual', overrideStatus: 'Default' },
    { id: 'BP-1004', name: 'David Chen', pathway: 'Admin & Office Support', readiness: 78, simStatus: 'In Progress (82% Match)', role: 'Individual', overrideStatus: 'Default' },
    { id: 'BP-1005', name: 'Sarah Jenkins', pathway: 'Healthcare Administration', readiness: 94, simStatus: 'Completed (96% Match)', role: 'Individual', overrideStatus: 'Overridden' },
  ]);

  const [selectedUser, setSelectedUser] = useState(null);
  const [overridePathway, setOverridePathway] = useState('');
  const [exportNotice, setExportNotice] = useState(false);

  const handleOpenOverrideModal = (user) => {
    setSelectedUser(user);
    setOverridePathway(user.pathway);
  };

  const handleSaveOverride = (e) => {
    e.preventDefault();
    setUsers(users.map(u => u.id === selectedUser.id ? { ...u, pathway: overridePathway, overrideStatus: 'Manually Overridden' } : u));
    setSelectedUser(null);
  };

  const handleGlobalExportCSV = () => {
    const csvHeader = "User_ID,Candidate_Name,Assigned_Pathway,Readiness_Score,Simulation_Status,Override_Status\n";
    const csvRows = users.map(u => `${u.id},"${u.name}","${u.pathway}",${u.readiness}%,"${u.simStatus}","${u.overrideStatus}"`).join("\n");
    const csvData = `data:text/csv;charset=utf-8,${csvHeader}${csvRows}`;

    const encodedUri = encodeURI(csvData);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "BloomingPath_Global_Platform_Simulation_Results.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExportNotice(true);
    setTimeout(() => setExportNotice(false), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6 animate-fadeIn">
      
      {/* Top Title & Global Export Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-sm">
        <div>
          <span className="px-3 py-1 rounded-full bg-primary text-on-primary text-xs font-bold uppercase tracking-wider mb-2 inline-block">
            System Admin Portal (4th Role View)
          </span>
          <h2 className="text-2xl font-bold text-on-surface">Platform Administration & User Directory</h2>
          <p className="text-xs text-on-surface-variant mt-1">
            Global user record management, manual pathway assignment override, and full platform telemetry.
          </p>
        </div>

        <button
          onClick={handleGlobalExportCSV}
          className="px-5 py-2.5 rounded-xl bg-primary-container text-on-primary font-bold text-xs hover:bg-primary transition-all shadow-sm flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">download</span>
          {exportNotice ? 'Global CSV Downloaded!' : 'Export Global Platform CSV'}
        </button>
      </div>

      {/* Admin Summary Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-4 border border-outline-variant">
          <p className="text-xs font-semibold text-on-surface-variant mb-1">Total Platform Accounts</p>
          <p className="text-2xl font-extrabold text-primary">3,890</p>
          <span className="text-[11px] text-secondary font-bold">100% System Operational</span>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-outline-variant">
          <p className="text-xs font-semibold text-on-surface-variant mb-1">Active Simulations Completed</p>
          <p className="text-2xl font-extrabold text-secondary">12,450</p>
          <span className="text-[11px] text-on-surface-variant">Real-time Rubric Scoring</span>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-outline-variant">
          <p className="text-xs font-semibold text-on-surface-variant mb-1">Manual Pathway Overrides</p>
          <p className="text-2xl font-extrabold text-tertiary">14</p>
          <span className="text-[11px] text-on-surface-variant">Admin Override Logging</span>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-outline-variant">
          <p className="text-xs font-semibold text-on-surface-variant mb-1">GDPR Telemetry Status</p>
          <p className="text-2xl font-extrabold text-secondary">Compliant</p>
          <span className="text-[11px] text-on-surface-variant">Anonymized for B2B/B2G</span>
        </div>
      </div>

      {/* Global User Directory Table */}
      <div className="glass-card rounded-2xl p-6 border border-outline-variant space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-outline-variant">
          <h3 className="text-sm font-bold text-on-surface">Single Learner Directory & Override Control</h3>
          <span className="text-xs text-on-surface-variant">Showing active platform users</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-outline-variant text-on-surface-variant font-bold uppercase tracking-wider">
                <th className="pb-3 px-3">User ID</th>
                <th className="pb-3 px-3">Learner Name</th>
                <th className="pb-3 px-3">Assigned Pathway</th>
                <th className="pb-3 px-3">Readiness Score</th>
                <th className="pb-3 px-3">Simulation Status</th>
                <th className="pb-3 px-3">Override Status</th>
                <th className="pb-3 px-3 text-right">Admin Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/60">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-surface-container-low transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-primary">{u.id}</td>
                  <td className="py-3 px-3 font-bold text-on-surface">{u.name}</td>
                  <td className="py-3 px-3">
                    <span className="px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface font-medium">
                      {u.pathway}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-extrabold text-secondary">{u.readiness}%</span>
                  </td>
                  <td className="py-3 px-3 text-on-surface-variant">{u.simStatus}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      u.overrideStatus.includes('Manually')
                        ? 'bg-secondary-container text-on-secondary-container'
                        : 'bg-surface-variant text-on-surface-variant'
                    }`}>
                      {u.overrideStatus}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => handleOpenOverrideModal(u)}
                      className="px-3 py-1 rounded-lg bg-primary-container text-on-primary font-bold text-[11px] hover:bg-primary transition-all"
                    >
                      Override Pathway
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pathway Manual Override Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/50 backdrop-blur-sm">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-outline-variant mb-4">
              <h3 className="font-bold text-base text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">edit_road</span>
                Manual Pathway Override: {selectedUser.name}
              </h3>
              <button onClick={() => setSelectedUser(null)} className="text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveOverride} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1">Current Assigned Pathway</label>
                <p className="text-xs font-bold text-on-surface p-2 rounded bg-surface-container-low mb-3">
                  {selectedUser.pathway}
                </p>

                <label className="block text-xs font-semibold text-on-surface mb-1">Select New Target Pathway</label>
                <select
                  value={overridePathway}
                  onChange={(e) => setOverridePathway(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-outline-variant text-xs text-on-surface bg-surface focus:ring-1 focus:ring-primary"
                >
                  <option value="Healthcare Administration">Healthcare Administration</option>
                  <option value="School Support (LSA)">School Support (LSA)</option>
                  <option value="Admin & Office Support">Admin & Office Support</option>
                </select>
              </div>

              <p className="text-[11px] text-on-surface-variant italic">
                Note: Overriding a learner's pathway immediately updates their assigned AI simulations and employer pipeline visibility.
              </p>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedUser(null)}
                  className="px-4 py-2 rounded-lg border border-outline-variant text-xs text-on-surface hover:bg-surface-container-low"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-primary-container text-on-primary text-xs font-semibold hover:bg-primary"
                >
                  Save Pathway Override
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
