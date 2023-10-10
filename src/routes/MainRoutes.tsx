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
import TravelAgentBooking from 'pages/schedule/TravelAgentBooking';
import Schedule from 'pages/schedule/schedule';
import { Navigate } from 'react-router';
import AuthGuard from 'utils/route-guard/AuthGuard';

// pages routing
const AuthLogin = Loadable(lazy(() => import('pages/auth/login')));
const AuthRegister = Loadable(lazy(() => import('pages/auth/register')));
const AuthForgotPassword = Loadable(lazy(() => import('pages/auth/forgot-password')));
const AuthResetPassword = Loadable(lazy(() => import('pages/auth/reset-password')));
const AuthCheckMail = Loadable(lazy(() => import('pages/auth/check-mail')));
const AuthCodeVerification = Loadable(lazy(() => import('pages/auth/code-verification')));

const MaintenanceError = Loadable(lazy(() => import('pages/maintenance/access-denied')));
const MaintenanceError500 = Loadable(lazy(() => import('pages/maintenance/500')));
const MaintenanceAccessDenied = Loadable(lazy(() => import('pages/maintenance/access-denied')));
const MaintenanceUnderConstruction = Loadable(lazy(() => import('pages/maintenance/access-denied')));
const MaintenanceComingSoon = Loadable(lazy(() => import('pages/maintenance/coming-soon')));

// render - home page
const Dashboard = Loadable(lazy(() => import('pages/home/dashboard')));

// render - application page
const UserList = Loadable(lazy(() => import('pages/application/user-management/list/list')));
const UserRequests = Loadable(lazy(() => import('pages/application/user-management/requests/requests')));
const TrainList = Loadable(lazy(() => import('pages/application/train-management/list/list')));

// render - hr page
const EmployeeList = Loadable(lazy(() => import('pages/hr/employee-management/list/list')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = (userType: string) => {

  const isUserAllowed = (allowedTypes: string[]) => {
    return userType && allowedTypes.includes(userType);
  }

  return ({
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
                element: isUserAllowed(["Admin", "BackOffice", "TravelAgent", "User"]) ? (<Dashboard />) : (<Navigate to="/maintenance/access-denied" replace />)
              },
              {
                path: 'schedule/:id',
                element: isUserAllowed(["Admin", "BackOffice"]) ? (<EditSchedule />) : (<Navigate to="/maintenance/access-denied" replace />)
              },
              {
                path: 'schedule/reservations/:id',
                element: isUserAllowed(["Admin", "BackOffice"]) ? (<ScheduleReservations />) : (<Navigate to="/maintenance/access-denied" replace />)
              },
              {
                path: 'my-schedule/reservations/:id',
                element: isUserAllowed(["Admin", "BackOffice"]) ? (<MyScheduleReservations />) : (<Navigate to="/maintenance/access-denied" replace />)
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
                    element: isUserAllowed(["Admin", "BackOffice"]) ? (<UserList />) : (<Navigate to="/maintenance/access-denied" replace />)
                  },
                  {
                    path: 'requests',
                    element: isUserAllowed(["Admin", "BackOffice"]) ? (<UserRequests />) : (<Navigate to="/maintenance/access-denied" replace />)
                  },
                ]
              },
              {
                path: 'train-management',
                children: [
                  {
                    path: 'list',
                    element: isUserAllowed(["Admin", "BackOffice"]) ? (<TrainList />) : (<Navigate to="/maintenance/access-denied" replace />)
                  },
                ]
              },
              {
                path: 'schedule-management',
                children: [
                  {
                    path: 'schedule',
                    element: isUserAllowed(["Admin", "BackOffice"]) ? (<Schedule />) : (<Navigate to="/maintenance/access-denied" replace />)
                  },
                  {
                    path: 'incoming-schedules',
                    element: isUserAllowed(["Admin", "BackOffice"]) ? (<IncomingSchedules />) : (<Navigate to="/maintenance/access-denied" replace />)
                  },
                  {
                    path: 'schedule-create',
                    element: isUserAllowed(["Admin", "BackOffice"]) ? (<CreateSchedule />) : (<Navigate to="/maintenance/access-denied" replace />)
                  }
                ]
              },
              {
                path: 'reservation-management',
                children: [
                  {
                    path: 'travel-agent-booking',
                    element: isUserAllowed(["Admin", "BackOffice", "TravelAgent"]) ? (<TravelAgentBooking />) : (<Navigate to="/maintenance/access-denied" replace />)
                  },
                  {
                    path: 'active-schedules',
                    element: isUserAllowed(["Admin", "BackOffice", "TravelAgent", "User"]) ? (<ActiveSchedules />) : (<Navigate to="/maintenance/access-denied" replace />)
                  },
                  {
                    path: 'my-schedules',
                    element: isUserAllowed(["Admin", "BackOffice", "TravelAgent", "User"]) ? (<MySchedules />) : (<Navigate to="/maintenance/access-denied" replace />)
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
                    element: isUserAllowed(["Admin", "BackOffice"]) ? (<EmployeeList />) : (<Navigate to="/maintenance/access-denied" replace />)
                  },
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
            path: 'access-denied',
            element: <MaintenanceAccessDenied />
          },
          {
            path: 'under-construction',
            element: <MaintenanceUnderConstruction />
          },
          {
            path: 'coming-soon',
            element: <MaintenanceComingSoon />
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
  })
}

export default MainRoutes;
