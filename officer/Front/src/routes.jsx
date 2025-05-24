import React, { Suspense, Fragment, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Loader from './components/Loader/Loader';
import AdminLayout from './layouts/AdminLayout';
import AuthLayout from './layouts/AuthLayout/index';
import UserLayout from'./layouts/UserLayout';
import ManagerLayout from './layouts/managerLayout';
import managerMenu from 'menu-roles/managerMenu';
// Render flat routes
export const renderRoutes = (routes = []) => (
  <Suspense fallback={<Loader />}>
    <Routes>
      {routes.map((route, i) => {
        const Guard = route.guard || Fragment;
        const Layout = route.layout || Fragment;
        const Element = route.element;

        return (
          <Route
            key={i}
            path={route.path}
            element={
              <Guard>
                <Layout>
                  <Element />
                </Layout>
              </Guard>
            }
          />
        );
      })}
    </Routes>
  </Suspense>
);

const routes = [
  // Auth routes
  {
    path: '/login/signin',
    layout: AuthLayout,
    element: lazy(() => import('./views/auth/signin/SignIn1'))
  },

  // Admin routes
  {
    path: '/officer/app/dashboard/default',
    layout: AdminLayout,
    element: lazy(() => import('./views/officer/dashboard/index.jsx'))
  },
  {
    path: '/officer/app/transactions/default',
    layout: AdminLayout,
    element: lazy(() => import('./views/officer/transactions'))
  },
  {
    path: '/officer/app/kredia/default',
    layout: AdminLayout,
    element: lazy(() => import('./views/officer/kredia'))
  },
  {
    path: '/officer/app/account/default',
    layout: AdminLayout,
    element: lazy(() => import('./views/officer/addaccount'))
  },
  {
    path: '/officer/app/profile/default',
    layout: AdminLayout,
    element: lazy(() => import('./views/officer/profile'))
  },
  {
    path: '/officer/app/settings/default',
    layout: AdminLayout,
    element: lazy(() => import('./views/officer/settings'))
  },
  //===================================manager=======================================
  {
    path: '/manager/app/dashboard',
    layout: ManagerLayout,
    element: lazy(() => import('./views/manager/dashboard'))
  },
  {
    path: '/manager/app/loans',
    layout: ManagerLayout,
    element: lazy(() => import('./views/manager/loans/LoanMenagment'))
  },
  {
    path: '/manager/app/register',
    layout: ManagerLayout,
    element: lazy(() => import('./views/manager/register/OfficerRegister'))
  },
  {
    path: '/manager/app/profile',
    layout: ManagerLayout,
    element: lazy(() => import('./views/manager/profile/profile'))
  },



  //==============================user
  {
    path: '/user/app/dashboard',
    layout: UserLayout,
    element: lazy(() => import('./views/user/dashboard'))
  },
  {
    path: '/user/app/balance',
    layout: UserLayout,
    element: lazy(() => import('./views/user/BalancePage/BalancePage'))
  },
  {
    path: '/user/app/transaction',
    layout: UserLayout,
    element: lazy(() => import('./views/user/TransactionsPage/Transactions'))
  },
  {
    path: '/user/app/profile',
    layout: UserLayout,
    element: lazy(() => import('./views/user/Profile/Profile'))
  },
  // Optional: fallback route (404)
  {
    path: '*',
    layout: AuthLayout,
    element: () => <div>404 - Page Not Found</div>
  }
];

export default routes;
