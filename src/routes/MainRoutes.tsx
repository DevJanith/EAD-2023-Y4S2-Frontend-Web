import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import CommonLayout from 'layout/CommonLayout';
import MainLayout from 'layout/MainLayout';
import AuthGuard from 'utils/route-guard/AuthGuard';
import Schedule from 'pages/schedule/schedule';
import EditSchedule from 'pages/schedule/EditSchedule';
import CreateSchedule from 'pages/schedule/CreateSchedule';
import ScheduleReservations from 'pages/reservation/ScheduleReservations';
import ActiveSchedules from 'pages/schedule/ActiveSchedules';
import MySchedules from 'pages/reservation/MySchedules';
import MyScheduleReservations from 'pages/reservation/MyScheduleReservations';
import IncomingSchedules from 'pages/schedule/IncomingSchedules';

// pages routing
const AuthLogin = Loadable(lazy(() => import('pages/auth/login')));
const AuthRegister = Loadable(lazy(() => import('pages/auth/register')));
const AuthForgotPassword = Loadable(lazy(() => import('pages/auth/forgot-password')));
const AuthResetPassword = Loadable(lazy(() => import('pages/auth/reset-password')));
const AuthCheckMail = Loadable(lazy(() => import('pages/auth/check-mail')));
const AuthCodeVerification = Loadable(lazy(() => import('pages/auth/code-verification')));

const MaintenanceError = Loadable(lazy(() => import('pages/maintenance/404')));
const MaintenanceError500 = Loadable(lazy(() => import('pages/maintenance/500')));
const MaintenanceUnderConstruction = Loadable(lazy(() => import('pages/maintenance/under-construction')));
const MaintenanceComingSoon = Loadable(lazy(() => import('pages/maintenance/coming-soon')));

// render - home page
const Dashboard = Loadable(lazy(() => import('pages/home/dashboard')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  children: [
    {
      path: '/',
      element: (
        <AuthGuard>
          <MainLayout />
        </AuthGuard>
      ),
      children: [
        {
          path: 'home',
          children: [
            {
              path: 'dashboard',
              element: <Dashboard />
            },
            {
              path: 'schedule',
              element: <Schedule />
            },
            {
              path: 'incoming-schedules',
              element: <IncomingSchedules />
            },
            {
              path: 'schedule/:id',
              element: <EditSchedule />
            },
            {
              path: 'schedule-create',
              element: <CreateSchedule />
            },
            {
              path: 'schedule/reservations/:id',
              element: <ScheduleReservations />
            }
          ]
        },
        {
          path: 'home',
          children: [
            {
              path: 'dashboard',
              element: <Dashboard />
            },
            {
              path: 'schedule',
              element: <Schedule />
            },
            {
              path: 'schedule/:id',
              element: <EditSchedule />
            },
            {
              path: 'schedule-create',
              element: <CreateSchedule />
            },
            {
              path: 'schedule/reservations/:id',
              element: <ScheduleReservations />
            },
            {
              path: 'active-schedules',
              element: <ActiveSchedules />
            },
            {
              path: 'my-schedules',
              element: <MySchedules />
            },
            {
              path: 'my-schedule/reservations/:id',
              element: <MyScheduleReservations />
            }
          ]
        }
      ]
    },
    {
      path: '/maintenance',
      element: <CommonLayout />,
      children: [
        {
          path: '404',
          element: <MaintenanceError />
        },
        {
          path: '500',
          element: <MaintenanceError500 />
        },
        {
          path: 'under-construction',
          element: <MaintenanceUnderConstruction />
        },
        {
          path: 'coming-soon',
          element: <MaintenanceComingSoon />
        }
      ]
    },
    {
      path: '/auth',
      element: <CommonLayout />,
      children: [
        {
          path: 'login',
          element: <AuthLogin />
        },
        {
          path: 'register',
          element: <AuthRegister />
        },
        {
          path: 'forgot-password',
          element: <AuthForgotPassword />
        },
        {
          path: 'reset-password',
          element: <AuthResetPassword />
        },
        {
          path: 'check-mail',
          element: <AuthCheckMail />
        },
        {
          path: 'code-verification',
          element: <AuthCodeVerification />
        }
      ]
    }
  ]
};

export default MainRoutes;
