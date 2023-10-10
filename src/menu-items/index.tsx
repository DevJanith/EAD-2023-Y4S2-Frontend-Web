// project import
import useAuth from 'hooks/useAuth';
import application from './application';
import home from './home';

// types
import hr from './hr';

// ==============================|| MENU ITEMS ||============================== //

const MenuItems = () => {
  const { user } = useAuth()
  const applicationMenuItems = application(user?.role!)

  if (user?.role) {

    switch (user?.role) {
      case "Admin":
        return {
          items: [home, applicationMenuItems, hr]
        }
        break;
      case "BackOffice":
        return {
          items: [home, applicationMenuItems, hr]
        }
        break;
      case "TravelAgent":
        return {
          items: [home, applicationMenuItems]
        }
        break;
      case "User":
        return {
          items: [home, applicationMenuItems]
        }
        break;
      default:
        return {
          items: [home]
        }
        break;
    }
  } else {
    return {
      items: [home]
    }
  }

}

export default MenuItems;
