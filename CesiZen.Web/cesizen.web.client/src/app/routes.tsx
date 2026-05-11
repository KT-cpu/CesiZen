// cesizen-web/src/app/routes.tsx
import { createBrowserRouter } from 'react-router';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Profile } from './pages/Profile';
import { InfoList } from './pages/InfoList';
import { InfoDetail } from './pages/InfoDetail';
import { EmotionTracker } from './pages/EmotionTracker';
import { EmotionReport } from './pages/EmotionReport';
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminContent } from './pages/admin/AdminContent';
import { AdminEmotions } from './pages/admin/AdminEmotions';
import { NotFound } from './pages/NotFound';
import React from 'react';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: 'connexion', Component: Login },
      { path: 'inscription', Component: Register },
      { path: 'informations', Component: InfoList },
      { path: 'informations/:id', Component: InfoDetail },
      {
        path: 'profil',
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: 'tracker',
        element: (
          <ProtectedRoute>
            <EmotionTracker />
          </ProtectedRoute>
        ),
      },
      {
        path: 'tracker/rapport',
        element: (
          <ProtectedRoute>
            <EmotionReport />
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin',
        element: (
          <ProtectedRoute adminOnly>
            <AdminLayout />
          </ProtectedRoute>
        ),
        children: [
          { index: true, Component: AdminDashboard },
          { path: 'utilisateurs', Component: AdminUsers },
          { path: 'contenus', Component: AdminContent },
          { path: 'emotions', Component: AdminEmotions },
        ],
      },
      { path: '*', Component: NotFound },
    ],
  },
]);