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
            icon: icons.DashboardOutlined,
        }
    ]
};

export default home;
