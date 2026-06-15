import React from 'react';
import { useAuth } from '../../mock/mockAuth';
import { ShieldAlert, RefreshCw, Home, ArrowLeft, Check, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';

export const CampusMismatch: React.FC = () => {
  const { user, switchProfile, allAvailableProfiles } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden select-none">
      {/* Background ambient lighting */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-gitam-coral/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-gitam-green/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gitam-antique-gold/5 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Top Header Logo Branding */}
      <div className="absolute top-6 left-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-gitam-green rounded-lg flex items-center justify-center font-black text-sm text-white shadow-[0_0_12px_rgba(0,115,103,0.3)]">
          P
        </div>
        <div>
          <h1 className="text-sm font-black tracking-widest text-white leading-none">PRAJNA</h1>
          <span className="text-[9px] text-gitam-antique-white font-bold tracking-wider block mt-0.5">
            GITAM DEEMED TO BE UNIVERSITY
          </span>
        </div>
      </div>

      <div className="max-w-4xl w-full flex flex-col items-center space-y-6 z-10 animate-scale-up py-12">
        {/* Warning card container */}
        <div className="w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden backdrop-blur-md">
          <div className="flex flex-col items-center text-center space-y-6">
            
            {/* Coral Shield Alert Icon */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gitam-coral/15 rounded-full flex items-center justify-center border border-gitam-coral/30 text-gitam-coral animate-pulse">
              <ShieldAlert className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>

            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 text-[9px] sm:text-[10px] font-black bg-gitam-coral/10 border border-gitam-coral/30 text-gitam-coral px-3.5 py-1.5 rounded-full uppercase tracking-widest">
                <Lock className="w-3 h-3" />
                Cross-Campus Boundary Isolation
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white font-display tracking-tight mt-1.5">
                403 - CAMPUS TENANT MISMATCH
              </h2>
              <p className="text-xs text-slate-400 max-w-lg mx-auto leading-relaxed">
                PRAJNA enforces strict tenant isolation rules. Academic records and profile verifications are restricted to your registered campus location to ensure local compliance and confidentiality.
              </p>
            </div>

            {/* Current Identity Details Card */}
            <div className="w-full max-w-xl bg-slate-950/80 border border-slate-850 rounded-2xl p-4 sm:p-5 text-left divide-y divide-slate-850 space-y-3.5">
              <div className="flex justify-between items-center text-xs pb-3.5">
                <span className="text-slate-500 font-bold uppercase tracking-wider">Active Identity</span>
                <div className="flex items-center gap-2">
                  {user?.profilePhotoUrl && (
                    <img src={user.profilePhotoUrl} alt="Avatar" className="w-6 h-6 rounded-full object-cover border border-slate-800" />
                  )}
                  <span className="text-white font-extrabold">{user?.firstName} {user?.lastName}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center text-xs py-3.5">
                <span className="text-slate-500 font-bold uppercase tracking-wider">Official Designation / Role</span>
                <span className="text-gitam-antique-gold font-extrabold">{user?.designation} ({user?.role})</span>
              </div>

              <div className="flex justify-between items-center text-xs pt-3.5">
                <span className="text-slate-500 font-bold uppercase tracking-wider">Authorized Campus Context</span>
                <span className="text-gitam-light-green font-extrabold uppercase tracking-wide bg-gitam-green/10 border border-gitam-green/20 px-2 py-0.5 rounded">
                  {user?.campus} Campus
                </span>
              </div>
            </div>

            {/* Switch Profile interactive sandbox */}
            <div className="w-full bg-slate-950/50 border border-slate-850 rounded-2xl p-5 sm:p-6 space-y-4">
              <div className="space-y-1">
                <h3 className="text-xs font-black text-slate-300 flex items-center gap-2 justify-center uppercase tracking-widest">
                  <RefreshCw className="w-3.5 h-3.5 text-gitam-antique-gold animate-spin-slow" />
                  Testing Sandbox - Identity Profiles
                </h3>
                <p className="text-[10px] text-slate-500 max-w-md mx-auto leading-normal">
                  Select a mock profile context below to verify how campus claims allow or deny loading of specific records dynamically.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                {allAvailableProfiles.map((p) => {
                  const isActive = user?.facultyId === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => switchProfile(p.id)}
                      className={`text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between h-24 relative overflow-hidden ${
                        isActive
                          ? 'bg-slate-900 border-gitam-green shadow-[0_0_12px_rgba(0,115,103,0.15)]'
                          : 'bg-slate-950 hover:bg-slate-900/60 border-slate-850 hover:border-slate-800'
                      }`}
                    >
                      <div className="truncate pr-4 space-y-0.5">
                        <p className={`text-xs font-bold ${isActive ? 'text-gitam-green' : 'text-white'}`}>
                          {p.name}
                        </p>
                        <p className="text-[9px] text-slate-500 font-medium">{p.role}</p>
                      </div>
                      
                      <div className="flex items-center justify-between mt-auto">
                        <span className={`text-[9px] font-black uppercase tracking-wider ${isActive ? 'text-gitam-light-green' : 'text-slate-400'}`}>
                          {p.campus}
                        </span>
                        {isActive && <Check className="w-3.5 h-3.5 text-gitam-green shrink-0" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <Button
                variant="outline"
                leftIcon={<ArrowLeft className="w-4 h-4" />}
                onClick={() => navigate('/profile/me')}
              >
                My Profile
              </Button>
              <Button
                variant="primary"
                leftIcon={<Home className="w-4 h-4" />}
                onClick={() => navigate('/')}
              >
                Portal Home
              </Button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default CampusMismatch;
