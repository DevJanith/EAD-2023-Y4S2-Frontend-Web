// third-party
import { FormattedMessage } from 'react-intl';

// assets
import {
  UserOutlined
} from '@ant-design/icons';

// type
import { NavItemType } from 'types/menu';

// icons
const icons = {
  UserOutlined, 
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
      icon: icons.UserOutlined,
      children: [
        {
          id: 'user-list',
          title: <FormattedMessage id="user-list" />,
          type: 'item',
          url: '/application/user-management/list',
        },
        {
          id: 'user-profile',
          title: <FormattedMessage id="user-profile" />,
          type: 'item',
          url: '/application/user-management/profile/1',
        }
      ]
    },
  ]
};

export default application;
