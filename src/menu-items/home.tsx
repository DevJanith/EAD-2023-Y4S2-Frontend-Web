// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { DashboardOutlined } from '@ant-design/icons';

// type
import { NavItemType } from 'types/menu';

// icons
const icons = { DashboardOutlined };

// ==============================|| MENU ITEMS - Home ||============================== //

const home: NavItemType = {
  id: 'home',
  title: <FormattedMessage id="home" />,
  type: 'group',
  children: [
    {
      id: 'dashboard',
      title: <FormattedMessage id="dashboard" />,
      type: 'item',
      url: '/home/dashboard',
      icon: icons.DashboardOutlined
    },
    {
      id: 'schedule',
      title: <FormattedMessage id="Train Schedules" />,
      type: 'item',
      url: '/home/schedule',
      icon: icons.DashboardOutlined
    },
    {
      id: 'schedule create',
      title: <FormattedMessage id="Create Train Schedule" />,
      type: 'item',
      url: '/home/schedule-create',
      icon: icons.DashboardOutlined
    },
    {
      id: 'active schedules',
      title: <FormattedMessage id="Active Schedules" />,
      type: 'item',
      url: '/home/active-schedules',
      icon: icons.DashboardOutlined
    },
    {
      id: 'my schedules',
      title: <FormattedMessage id="My Schedules" />,
      type: 'item',
      url: '/home/my-schedules',
      icon: icons.DashboardOutlined
    }
  ]
};

export default home;
