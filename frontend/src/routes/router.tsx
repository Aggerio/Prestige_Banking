import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import paths, { rootPaths } from './path';
import RequireAuth from 'components/common/RequireAuth';
import PageEnter from 'components/common/PageEnter';
import { DashboardProvider } from 'providers/DashboardProvider';
import { NotificationProvider } from 'providers/NotificationProvider';

/* ---------------- Lazy loads various components ------------------------- */
const App = lazy(() => import('App'));
const MainLayout = lazy(() => import('layouts/main-layout'));
const AuthLayout = lazy(() => import('layouts/auth-layout'));
const Dashboard = lazy(() => import('pages/dashboard'));
const TransactionsPage = lazy(() => import('pages/transactions'));
const CardsPage = lazy(() => import('pages/cards'));
const AccountsPage = lazy(() => import('pages/accounts'));
const NotificationsPage = lazy(() => import('pages/notifications'));
const PublicHomePage = lazy(() => import('pages/public-home'));
const PublicInfoPage = lazy(() => import('pages/public-info'));
const Spinner = lazy(() => import('components/loading/Splash'));
const LoadingProgress = lazy(() => import('components/loading/LoadingProgress'));

const LoginPage = lazy(() => import('pages/authentication/login'));

const NotFoundPage = lazy(() => import('pages/not-found'));
/* -------------------------------------------------------------------------- */

/**
 * @Defines the routes for the application using React Router.
 */
export const routes = [
  {
    element: (
      <Suspense fallback={<Spinner />}>
        <App />
      </Suspense>
    ),
    children: [
      {
        // Home is public so visitors can explore the bank before signing in.
        index: true,
        element: (
          <PageEnter>
            <PublicHomePage />
          </PageEnter>
        ),
      },
      {
        // About Us uses the shared public page with its own content type.
        path: paths.aboutUs,
        element: (
          <PageEnter>
            <PublicInfoPage kind="about" />
          </PageEnter>
        ),
      },
      {
        // Investor updates use the same layout but render a list of published entries.
        path: paths.investors,
        element: (
          <PageEnter>
            <PublicInfoPage kind="investors" />
          </PageEnter>
        ),
      },
      {
        // Offers use the shared layout and retain their card presentation.
        path: paths.offers,
        element: (
          <PageEnter>
            <PublicInfoPage kind="offers" />
          </PageEnter>
        ),
      },
      {
        // Contact Us uses the shared page to display the current contact entry.
        path: paths.contactUs,
        element: (
          <PageEnter>
            <PublicInfoPage kind="contact" />
          </PageEnter>
        ),
      },
      {
        element: <RequireAuth />,
        children: [
          {
            element: (
              <NotificationProvider>
                <DashboardProvider>
                  <MainLayout>
                    <Suspense fallback={<LoadingProgress />}>
                      <PageEnter>
                        <Outlet />
                      </PageEnter>
                    </Suspense>
                  </MainLayout>
                </DashboardProvider>
              </NotificationProvider>
            ),
            children: [
              { path: paths.dashboard, element: <Dashboard /> },
              { path: paths.transactions, element: <TransactionsPage /> },
              { path: paths.creditCards, element: <CardsPage /> },
              { path: paths.accounts, element: <AccountsPage /> },
              { path: paths.notifications, element: <NotificationsPage /> },
            ],
          },
        ],
      },
      {
        // Authentication routes are separate from the protected banking workspace.
        path: rootPaths.authRoot,
        element: <AuthLayout />,
        children: [
          {
            path: paths.login,
            element: <LoginPage />,
          },
          { path: paths.signup, element: <Navigate to={paths.login} replace /> },
          { path: paths.forgetPassword, element: <Navigate to={paths.login} replace /> },
          { path: paths.resetPassword, element: <Navigate to={paths.login} replace /> },
        ],
      },
      {
        path: rootPaths.errorRoot,
        children: [
          {
            path: paths.notFound,
            element: <NotFoundPage />,
          },
        ],
      },
      {
        path: '*',
        element: <Navigate to={paths.notFound} replace />,
      },
    ],
  },
];

const router = createBrowserRouter(routes, {
  basename: '/bankdash',
});

export default router;
