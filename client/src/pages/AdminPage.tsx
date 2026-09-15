import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { CAMPUS_LOCATIONS, type LocationItem } from '../data/locations';
import { Shield, Lock, Edit, Save, AlertCircle, RefreshCw } from 'lucide-react';

interface ClassroomAssignment {
  id: string;
  course_code: string;
  course_name: string;
  room_number: string;
  building: string;
  updated_at: string;
}

export const AdminPage: React.FC = () => {
  const { t } = useLanguage();
  const [pinInput, setPinInput] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [locationsList, setLocationsList] = useState<LocationItem[]>(CAMPUS_LOCATIONS);

  // Field research classroom reassignment state
  const [classrooms, setClassrooms] = useState<ClassroomAssignment[]>([
    { id: '1', course_code: 'CS301', course_name: 'DBMS (Database Systems)', room_number: 'C-103', building: 'Block C (1F)', updated_at: 'Today, 09:00 AM' },
    { id: '2', course_code: 'CS201', course_name: 'Operating Systems', room_number: 'B-204', building: 'Block B (2F)', updated_at: 'Yesterday' },
    { id: '3', course_code: 'ME101', course_name: 'Thermodynamics', room_number: 'C-001', building: 'Block C (GF)', updated_at: '2 days ago' },
  ]);

  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [newRoomVal, setNewRoomVal] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === '1234') {
      setIsAuthenticated(true);
      setErrorMsg('');
    } else {
      setErrorMsg('Invalid PIN code. Try default PIN: 1234');
    }
  };

  const handleUpdateRoom = (courseId: string) => {
    if (!newRoomVal.trim()) return;
    setClassrooms(prev =>
      prev.map(c =>
        c.id === courseId
          ? {
              ...c,
              room_number: newRoomVal,
              building: newRoomVal.startsWith('C') ? 'Block C (1F)' : 'Block B (2F)',
              updated_at: 'Just now'
            }
          : c
      )
    );
    setEditingCourseId(null);
    setNewRoomVal('');
  };

  const toggleLocationActive = (locId: string) => {
    setLocationsList(prev =>
      prev.map(l => (l.id === locId ? { ...l, is_active: !l.is_active } : l))
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto pt-12 pb-16 page-enter">
        <div className="glass-card p-6 md:p-8 space-y-6 text-center border border-white/10 shadow-2xl">
          <div className="w-12 h-12 rounded-2xl bg-brand-600/30 text-brand-400 border border-brand-500/40 flex items-center justify-center mx-auto">
            <Shield className="w-6 h-6" />
          </div>

          <div>
            <h1 className="text-xl font-bold text-white font-display">{t('adminTitle')}</h1>
            <p className="text-xs text-slate-400 mt-1">{t('adminPinLabel')}</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Enter PIN (1234)"
                className="input-field pl-9 text-center font-mono tracking-widest text-lg"
              />
            </div>

            {errorMsg && (
              <p className="text-xs text-rose-400 flex items-center justify-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errorMsg}
              </p>
            )}

            <button type="submit" className="btn-primary w-full justify-center py-3">
              {t('loginBtn')}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16 page-enter">
      {/* Header */}
      <div className="glass-card p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-400" />
            <h1 className="text-xl font-bold text-white font-display">Campus Admin Dashboard</h1>
            <span className="badge-green">AUTHENTICATED</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Manage locations, active status, and live classroom reassignments</p>
        </div>

        <button onClick={() => setIsAuthenticated(false)} className="btn-ghost text-xs">
          Lock Admin
        </button>
      </div>

      {/* Classroom Change Use Case Table (Field Research direct problem) */}
      <div className="glass-card p-6 space-y-4 border border-brand-500/30">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white font-display flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-brand-400" />
              Dynamic Classroom Assignment Manager
            </h2>
            <p className="text-xs text-slate-400">Update subject rooms dynamically (e.g. DBMS moved from B-204 to C-103)</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-surface-900/80 uppercase text-[10px] text-slate-400 font-semibold border-b border-white/10">
              <tr>
                <th className="p-3">Course Code</th>
                <th className="p-3">Course Name</th>
                <th className="p-3">Assigned Room</th>
                <th className="p-3">Building / Floor</th>
                <th className="p-3">Last Updated</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {classrooms.map((cls) => (
                <tr key={cls.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-3 font-mono font-bold text-brand-300">{cls.course_code}</td>
                  <td className="p-3 font-medium text-white">{cls.course_name}</td>
                  <td className="p-3">
                    {editingCourseId === cls.id ? (
                      <input
                        type="text"
                        value={newRoomVal}
                        onChange={(e) => setNewRoomVal(e.target.value)}
                        placeholder="e.g. C-103"
                        className="bg-surface-800 border border-brand-500 text-white px-2 py-1 rounded w-24 text-xs"
                      />
                    ) : (
                      <span className="bg-brand-900/60 text-brand-200 border border-brand-700/50 px-2 py-0.5 rounded font-mono font-bold">
                        {cls.room_number}
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-slate-400">{cls.building}</td>
                  <td className="p-3 text-[10px] text-slate-400">{cls.updated_at}</td>
                  <td className="p-3 text-right">
                    {editingCourseId === cls.id ? (
                      <button
                        onClick={() => handleUpdateRoom(cls.id)}
                        className="btn-primary py-1 px-3 text-xs"
                      >
                        <Save className="w-3 h-3" />
                        <span>Save</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingCourseId(cls.id);
                          setNewRoomVal(cls.room_number);
                        }}
                        className="btn-ghost py-1 px-2.5 text-xs"
                      >
                        <Edit className="w-3 h-3" />
                        <span>Reassign Room</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Campus Locations Master Table */}
      <div className="glass-card p-6 space-y-4 border border-white/10">
        <h2 className="text-base font-bold text-white font-display">Master Campus Locations</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-surface-900/80 uppercase text-[10px] text-slate-400 font-semibold border-b border-white/10">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Category</th>
                <th className="p-3">Building</th>
                <th className="p-3">Floor</th>
                <th className="p-3">Room</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Toggle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {locationsList.map((loc) => (
                <tr key={loc.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-3 font-medium text-white">{loc.name}</td>
                  <td className="p-3"><span className="badge-indigo">{loc.category}</span></td>
                  <td className="p-3 text-slate-400">{loc.building}</td>
                  <td className="p-3">{loc.floor}</td>
                  <td className="p-3 font-mono text-slate-400">{loc.room_number || '—'}</td>
                  <td className="p-3">
                    {loc.is_active ? (
                      <span className="badge-green">Active</span>
                    ) : (
                      <span className="badge-amber">Inactive</span>
                    )}
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => toggleLocationActive(loc.id)}
                      className="text-xs text-slate-400 hover:text-white underline"
                    >
                      {loc.is_active ? 'Disable' : 'Enable'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
