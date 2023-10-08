
// material-ui
import { Box, useMediaQuery } from '@mui/material';
import { Theme } from '@mui/material/styles';

// project import
import Customization from './Customization';
import MobileSection from './MobileSection';
import Profile from './Profile';
import Search from './Search';

import useConfig from 'hooks/useConfig';
import DrawerHeader from 'layout/MainLayout/Drawer/DrawerHeader';

// types
import { MenuOrientation } from 'types/config';

// ==============================|| HEADER - CONTENT ||============================== //

const HeaderContent = () => {
  const { menuOrientation } = useConfig();
  const downLG = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg')); 
  return (
    <>
      {menuOrientation === MenuOrientation.HORIZONTAL && !downLG && <DrawerHeader open={true} />}
      {!downLG && <Search />} 
      {downLG && <Box sx={{ width: '100%', ml: 1 }} />} 
      <Customization />
      {!downLG && <Profile />}
      {downLG && <MobileSection />}
    </>
  );
};

export default HeaderContent;
