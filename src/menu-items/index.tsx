// project import
import application from './application';
import home from './home';

// types
import { NavItemType } from 'types/menu';
import hr from './hr';

// ==============================|| MENU ITEMS ||============================== //

const menuItems: { items: NavItemType[] } = {
  items: [home, hr, application]
};

export default menuItems;
