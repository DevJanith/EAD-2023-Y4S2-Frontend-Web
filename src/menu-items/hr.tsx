// third-party
import { FormattedMessage } from 'react-intl';

// assets
import {
    UserOutlined,
    OrderedListOutlined,
    UsergroupAddOutlined,
} from '@ant-design/icons';

// type
import { NavItemType } from 'types/menu';

// icons
const icons = {
    UserOutlined,
    OrderedListOutlined,
    UsergroupAddOutlined
};

// ==============================|| MENU ITEMS - HR ||============================== //

const hr: NavItemType = {
    id: 'hr',
    title: <FormattedMessage id="hr" />,
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
                    url: '/hr/user-management/list',
                },
                {
                    id: 'user-profile',
                    title: <FormattedMessage id="user-profile" />,
                    type: 'item',
                    icon: icons.UserOutlined,
                    url: '/hr/user-management/profile',
                }
            ]
        },
    ]
};

export default hr;
