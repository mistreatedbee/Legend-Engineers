import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import { NotifyProvider } from './components/Notify';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminLayout } from './components/AdminLayout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { ProjectsList } from './pages/projects/ProjectsList';
import { ProjectForm } from './pages/projects/ProjectForm';
import { JobsList } from './pages/jobs/JobsList';
import { JobForm } from './pages/jobs/JobForm';
import { Applications } from './pages/Applications';
import { ApplicationDetail } from './pages/ApplicationDetail';
import { Queries } from './pages/Queries';
import { Media } from './pages/Media';
import { Settings } from './pages/Settings';
import { Account } from './pages/Account';

export function AdminApp() {
  return (
    <AuthProvider>
      <NotifyProvider>
        <Routes>
          <Route path="login" element={<Login />} />
          <Route
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }>
            <Route index element={<Dashboard />} />
            <Route path="projects" element={<ProjectsList />} />
            <Route path="projects/new" element={<ProjectForm />} />
            <Route path="projects/:id" element={<ProjectForm />} />
            <Route path="jobs" element={<JobsList />} />
            <Route path="jobs/new" element={<JobForm />} />
            <Route path="jobs/:id" element={<JobForm />} />
            <Route path="applications" element={<Applications />} />
            <Route path="applications/:id" element={<ApplicationDetail />} />
            <Route path="queries" element={<Queries />} />
            <Route path="media" element={<Media />} />
            <Route path="settings" element={<Settings />} />
            <Route path="account" element={<Account />} />
          </Route>
        </Routes>
      </NotifyProvider>
    </AuthProvider>
  );
}
