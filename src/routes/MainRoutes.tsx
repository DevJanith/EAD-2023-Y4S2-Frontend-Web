import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import CommonLayout from 'layout/CommonLayout';
import MainLayout from 'layout/MainLayout';
import MyScheduleReservations from 'pages/reservation/MyScheduleReservations';
import MySchedules from 'pages/reservation/MySchedules';
import ScheduleReservations from 'pages/reservation/ScheduleReservations';
import ActiveSchedules from 'pages/schedule/ActiveSchedules';
import CreateSchedule from 'pages/schedule/CreateSchedule';
import EditSchedule from 'pages/schedule/EditSchedule';
import IncomingSchedules from 'pages/schedule/IncomingSchedules';
import Schedule from 'pages/schedule/schedule';
import AuthGuard from 'utils/route-guard/AuthGuard';
import TravelAgentBooking from 'pages/schedule/TravelAgentBooking';

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

// render - application page
const UserList = Loadable(lazy(() => import('pages/application/user-management/list/list')));
const UserProfile = Loadable(lazy(() => import('pages/application/user-management/profile/profile')));

// render - hr page
const EmployeeList = Loadable(lazy(() => import('pages/hr/employee-management/list/list')));
const EmployeeProfile = Loadable(lazy(() => import('pages/hr/employee-management/profile/profile')));

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
              path: 'schedule/:id',
              element: <EditSchedule />
            },
            {
              path: 'schedule/reservations/:id',
              element: <ScheduleReservations />
            },
            {
              path: 'my-schedule/reservations/:id',
              element: <MyScheduleReservations />
            }
            // {
            //   path: 'schedule',
            //   element: <Schedule />
            // },
            // {
            //   path: 'incoming-schedules',
            //   element: <IncomingSchedules />
            // },
            // {
            //   path: 'schedule-create',
            //   element: <CreateSchedule />
            // },

            // {
            //   path: 'dashboard',
            //   element: <Dashboard />
            // },
            // {
            //   path: 'schedule',
            //   element: <Schedule />
            // },
            // {
            //   path: 'schedule/:id',
            //   element: <EditSchedule />
            // },
            // {
            //   path: 'schedule-create',
            //   element: <CreateSchedule />
            // },
            // {
            //   path: 'schedule/reservations/:id',
            //   element: <ScheduleReservations />
            // },
            // {
            //   path: 'active-schedules',
            //   element: <ActiveSchedules />
            // },
            // {
            //   path: 'my-schedules',
            //   element: <MySchedules />
            // },
          ]
        },
        {
          path: 'application',
          children: [
            {
              path: 'user-management',
              children: [
                {
                  path: 'list',
                  element: <UserList />
                },
                {
                  path: 'profile',
                  element: <UserProfile />
                }
              ]
            },
            {
              path: 'schedule-management',
              children: [
                {
                  path: 'schedule',
                  element: <Schedule />
                },
                {
                  path: 'incoming-schedules',
                  element: <IncomingSchedules />
                },
                {
                  path: 'schedule-create',
                  element: <CreateSchedule />
                }
              ]
            },
            {
              path: 'reservation-management',
              children: [
                {
                  path: 'travel-agent-booking',
                  element: <TravelAgentBooking />
                },
                {
                  path: 'active-schedules',
                  element: <ActiveSchedules />
                },
                {
                  path: 'my-schedules',
                  element: <MySchedules />
                }
              ]
            }
          ]
        },
        {
          path: 'hr',
          children: [
            {
              path: 'employee-management',
              children: [
                {
                  path: 'list',
                  element: <EmployeeList />
                },
                {
                  path: 'profile',
                  element: <EmployeeProfile />
                }
              ]
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
