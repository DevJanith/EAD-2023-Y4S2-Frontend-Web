// third-party
import { FormattedMessage } from 'react-intl';

// assets

// type
import { NavItemType } from 'types/menu';

// icons

// ==============================|| MENU ITEMS - SUPPORT ||============================== //

const application: NavItemType = {
  id: 'application',
  title: <FormattedMessage id="application" />,
  type: 'group',
  children: [ 
  ]
};

export default application;
