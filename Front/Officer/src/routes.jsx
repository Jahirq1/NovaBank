import React, { Suspense, Fragment, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Loader from './components/Loader/Loader';
import AdminLayout from './layouts/AdminLayout';
import { BASE_URL } from './config/constant';

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
                <Layout>{route.routes ? renderRoutes(route.routes) : <Element />}</Layout>
              </Guard>
            }
          />
        );
      })}
    </Routes>
  </Suspense>
);

const routes = [
  {
    path: '*',
    layout: AdminLayout,
    routes: [
      {
        path: '/app/dashboard/default',
        element: lazy(() => import('./views/dashboard/index.jsx'))
      },
      {
        path: '/app/transactions/default',
        element: lazy(() => import('./views/transactions'))
      },
      {
        path: '/app/kredia/default',
        element: lazy(() => import('./views/kredia'))
      },
      {
        path: '/app/account/default',
        element: lazy(() => import('./views/addaccount'))
      },
      {
        path: '/app/profile/default',
        element: lazy(() => import('./views/profile'))
      },
      {
        path: '/app/settings/default',
        element: lazy(() => import('./views/settings'))
      },
            {
        path: '*',
        exact: 'true',
        element: () => <Navigate to={BASE_URL} />
      }
    ]
  }
];

export default routes;
