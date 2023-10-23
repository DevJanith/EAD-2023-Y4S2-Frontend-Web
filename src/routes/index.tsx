import { useRoutes } from 'react-router-dom';

// project import 
import LoginRoutes from './LoginRoutes';
import MainRoutes from './MainRoutes';
import useAuth from 'hooks/useAuth';


// ==============================|| ROUTING RENDER ||============================== //

export default function ThemeRoutes() {
  const { user } = useAuth()
  const mainRoutes = MainRoutes(user?.role!);

  return useRoutes([
    LoginRoutes,
    mainRoutes,
  ]);
}
