// third-party
import { FormattedMessage } from 'react-intl';

// assets
import {
  ClusterOutlined,
  ControlOutlined,
  OrderedListOutlined,
  ScheduleOutlined,
  UserOutlined,
  UsergroupAddOutlined
} from '@ant-design/icons';

// type
import { NavItemType } from 'types/menu';

// icons
const icons = {
  UserOutlined,
  ClusterOutlined,
  ControlOutlined,
  OrderedListOutlined,
  ScheduleOutlined,
  UsergroupAddOutlined
};

// ==============================|| MENU ITEMS - SUPPORT ||============================== //

const application: NavItemType = {
  id: 'application',
  title: <FormattedMessage id="application" />,
  type: 'group',
  children: [
    {
      id: 'user-management',
      title: <FormattedMessage id="user-management" />,
      type: 'collapse',
      icon: icons.UsergroupAddOutlined,
      children: [
        {
          id: 'user-list',
          title: <FormattedMessage id="user-list" />,
          type: 'item',
          icon: icons.OrderedListOutlined,
          url: '/application/user-management/list',
        }, 
        {
          id: 'user-profile',
          title: <FormattedMessage id="user-profile" />,
          type: 'item',
          icon: icons.UserOutlined,
          url: '/application/user-management/profile',
        }
      ]
    },
    {
      id: 'train-management',
      title: <FormattedMessage id="train-management" />,
      type: 'collapse',
      icon: icons.ClusterOutlined,
      children: [
        {
          id: 'train-list',
          title: <FormattedMessage id="train-list" />,
          type: 'item',
          icon: icons.OrderedListOutlined,
          url: '/application/train-management/list',
        },
      ]
    },
    {
      id: 'schedule-management',
      title: <FormattedMessage id="schedule-management" />,
      type: 'collapse',
      icon: icons.ScheduleOutlined,
      children: [
        {
          id: 'schedule-list',
          title: <FormattedMessage id="schedule-list" />,
          type: 'item',
          icon: icons.OrderedListOutlined,
          url: '/application/schedule-management/list',
        },
      ]
    },
    {
      id: 'reservation-management',
      title: <FormattedMessage id="reservation-management" />,
      type: 'collapse',
      icon: icons.ControlOutlined,
      children: [
        {
          id: 'reservation-list',
          title: <FormattedMessage id="reservation-list" />,
          type: 'item',
          icon: icons.OrderedListOutlined,
          url: '/application/reservation-management/list',
        },
      ]
    },
  ]
};

export default application;
