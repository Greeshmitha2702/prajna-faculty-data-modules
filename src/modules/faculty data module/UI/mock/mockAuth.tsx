import React, { createContext, useContext, useState, useEffect } from 'react';
import { FacultyProfile, mockProfiles } from './mockProfiles';

interface AuthContextType {
  user: FacultyProfile | null;
  isAuthenticated: boolean;
  activeProfileId: string;
  switchProfile: (profileId: string) => void;
  logout: () => void;
  login: (profileId: string) => void;
  allAvailableProfiles: { id: string; name: string; role: string; campus: string }[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeProfileId, setActiveProfileId] = useState<string>(() => {
    return localStorage.getItem('prajna_mock_profile_id') || 'FAC123';
  });

  const [user, setUser] = useState<FacultyProfile | null>(null);

  useEffect(() => {
    const profile = mockProfiles[activeProfileId];
    if (profile) {
      setUser(profile);
      localStorage.setItem('prajna_mock_profile_id', activeProfileId);
    } else {
      setUser(null);
    }
  }, [activeProfileId]);

  const switchProfile = (profileId: string) => {
    if (mockProfiles[profileId]) {
      setActiveProfileId(profileId);
    }
  };

  const login = (profileId: string) => {
    switchProfile(profileId);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('prajna_mock_profile_id');
  };

  const allAvailableProfiles = Object.keys(mockProfiles).map((id) => ({
    id,
    name: `${mockProfiles[id].firstName} ${mockProfiles[id].lastName}`,
    role: mockProfiles[id].role,
    campus: mockProfiles[id].campus,
  }));

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        activeProfileId,
        switchProfile,
        login,
        logout,
        allAvailableProfiles,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
export type { AuthContextType };
