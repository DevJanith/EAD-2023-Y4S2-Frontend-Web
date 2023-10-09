import { useState } from 'react';

// material-ui
import { Dialog, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';

// assets
import { EditOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { PopupTransition } from 'components/@extended/Transitions';
import Profile from 'sections/profile/profile';
import { User } from 'types/user';

// ==============================|| HEADER PROFILE - PROFILE TAB ||============================== //

interface Props {
  handleLogout: () => void;
}

const ProfileTab = ({ handleLogout }: Props) => {
  const [selectedIndex, setSelectedIndex] = useState<number>();
  const handleListItemClick = (event: React.MouseEvent<HTMLDivElement>, index: number) => {
    setSelectedIndex(index);
    handleDialogModel()
  };

  //dialog model 
  const [open, setOpen] = useState<boolean>(false);
  const [profileStatus, setProfileStatus] = useState<"view" | "update">("view");
  const [profile, setProfile] = useState<User>();

  const handleDialogModel = () => {
    setOpen(!open);
    if (profile && !open) setProfile(undefined);
  };

  return (
    <>
      <List component="nav" sx={{ p: 0, '& .MuiListItemIcon-root': { minWidth: 32 } }}>
        <ListItemButton selected={selectedIndex === 0} onClick={(event: React.MouseEvent<HTMLDivElement>) => {
          handleListItemClick(event, 0)
          setProfileStatus("update")
        }}>
          <ListItemIcon>
            <EditOutlined />
          </ListItemIcon>
          <ListItemText primary="Edit Profile" />
        </ListItemButton>
        <ListItemButton selected={selectedIndex === 1} onClick={(event: React.MouseEvent<HTMLDivElement>) => {
          handleListItemClick(event, 1)
          setProfileStatus("view")
        }}>
          <ListItemIcon>
            <UserOutlined />
          </ListItemIcon>
          <ListItemText primary="View Profile" />
        </ListItemButton>
        <ListItemButton selected={selectedIndex === 2} onClick={handleLogout}>
          <ListItemIcon>
            <LogoutOutlined />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </List>
      {/* add / edit user dialog */}
      <Dialog
        maxWidth="sm"
        TransitionComponent={PopupTransition}
        keepMounted
        fullWidth
        onClose={handleDialogModel}
        open={open}
        sx={{ '& .MuiDialog-paper': { p: 0 }, transition: 'transform 225ms' }}
        aria-describedby="alert-dialog-slide-description"
      >
        <Profile profile={profile} onCancel={handleDialogModel} profileStatus={profileStatus} />
      </Dialog>
    </>
  );
};

export default ProfileTab;
