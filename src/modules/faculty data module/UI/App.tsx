import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './mock/mockAuth';
import MainLayout from './components/layout/MainLayout';
import { ProfileViewPage } from './pages/ProfileViewPage';
import { ProfileEditPage } from './pages/ProfileEditPage';
import { QualificationsPage } from './pages/QualificationsPage';
import { HierarchyPage } from './pages/HierarchyPage';
import { ForbiddenPage } from './pages/ForbiddenPage';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Full-screen forbidden page escapes layout boundaries */}
          <Route path="/forbidden" element={<ForbiddenPage />} />

          {/* Normal application pages are wrapped in MainLayout */}
          <Route
            path="*"
            element={
              <MainLayout>
                <Routes>
                  <Route path="/" element={<Navigate to="/profile/me" replace />} />
                  <Route path="/profile" element={<Navigate to="/profile/me" replace />} />
                  <Route path="/profile/me" element={<ProfileViewPage />} />
                  <Route path="/profile/edit" element={<ProfileEditPage />} />
                  <Route path="/profile/qualifications" element={<QualificationsPage />} />
                  <Route path="/profile/hierarchy" element={<HierarchyPage />} />
                  <Route path="/profile/:facultyId" element={<ProfileViewPage />} />
                  <Route path="*" element={<Navigate to="/profile/me" replace />} />
                </Routes>
              </MainLayout>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};
export default App;
