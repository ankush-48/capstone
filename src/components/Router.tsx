import { MemberProvider } from '@/integrations';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { ScrollToTop } from '@/lib/scroll-to-top';
import { LanguageProvider } from '@/contexts/LanguageContext';
import Layout from '@/components/Layout';
import HomePage from '@/components/pages/HomePage';
import CoursesPage from '@/components/pages/CoursesPage';
import CourseDetailPage from '@/components/pages/CourseDetailPage';
import CoursePlayerPage from '@/components/pages/CoursePlayerPage';
import DashboardPage from '@/components/pages/DashboardPage';
import ProfilePage from '@/components/pages/ProfilePage';
import AdminPage from '@/components/pages/AdminPage';
import CertificatesPage from '@/components/pages/CertificatesPage';

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <ScrollToTop />
        <Layout />
      </>
    ),
    children: [
      {
        index: true,
        element: <HomePage />, // MIXED ROUTE: Shows different content for authenticated vs anonymous users
      },
      {
        path: "courses",
        element: <CoursesPage />,
      },
      {
        path: "courses/:id",
        element: <CourseDetailPage />,
      },
      {
        path: "courses/:id/learn",
        element: <CoursePlayerPage />,
      },
      {
        path: "dashboard",
        element: <DashboardPage />,
      },
      {
        path: "profile",
        element: <ProfilePage />,
      },
      {
        path: "certificates",
        element: <CertificatesPage />,
      },
      {
        path: "admin",
        element: <AdminPage />,
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
], {
  basename: import.meta.env.BASE_NAME,
});

export default function AppRouter() {
  return (
    <LanguageProvider>
      <MemberProvider>
        <RouterProvider router={router} />
      </MemberProvider>
    </LanguageProvider>
  );
}
