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
            id: 'employee-management',
            title: <FormattedMessage id="employee-management" />,
            type: 'collapse',
            icon: icons.UsergroupAddOutlined,
            children: [
                {
                    id: 'employee-list',
                    title: <FormattedMessage id="employee-list" />,
                    type: 'item',
                    icon: icons.OrderedListOutlined,
                    url: '/hr/employee-management/list',
                },
                {
                    id: 'employee-profile',
                    title: <FormattedMessage id="employee-profile" />,
                    type: 'item',
                    icon: icons.UserOutlined,
                    url: '/hr/employee-management/profile',
                }
            ]
        },
    ]
};

export default hr;
