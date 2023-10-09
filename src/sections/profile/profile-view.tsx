
// ==============================|| ProfileView ||============================== // 

import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Chip, DialogActions, DialogContent, DialogTitle, Divider, Grid, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Stack, Typography, useMediaQuery } from "@mui/material";
import { Theme, useTheme } from '@mui/material/styles';
import Avatar from "components/@extended/Avatar";
import MainCard from "components/MainCard";
import salutations from "data/salutations";
import userTypes from "data/userTypes";
import { useEffect, useState } from "react";
import { PatternFormat } from "react-number-format";
import { useDispatch, useSelector } from "store";
import { openSnackbar } from "store/reducers/snackbar";
import { fetchCurrentUser, toInitialState } from "store/reducers/user";
import avatar from "../../assets/images/users/vector-2.png";

export interface Props { 
    onCancel: () => void;
}

const ProfileView = ({ onCancel }: Props) => {
    const theme = useTheme();
    const matchDownMD = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));

    const [selectedIndex, setSelectedIndex] = useState(0);
    const handleListItemClick = (index: number, route: string) => {
        setSelectedIndex(index);
    };

    /**
     * API Config 
     * User API
     */
    const dispatch = useDispatch();
    const { currentUser, error, success, isLoading } = useSelector(state => state.user);

    useEffect(() => {
        dispatch(fetchCurrentUser());
    }, [dispatch, success]);

    //  handel error 
    useEffect(() => {
        if (error != null) {
            dispatch(
                openSnackbar({
                    open: true,
                    //@ts-ignore
                    message: error ? error.Message : "Something went wrong ...",
                    variant: 'alert',
                    alert: {
                        color: 'error'
                    },
                    close: true
                })
            );
            dispatch(toInitialState())
        }
    }, [error])

    //  handel success
    useEffect(() => {
        if (success != null) {
            dispatch(
                openSnackbar({
                    open: true,
                    message: success,
                    variant: 'alert',
                    alert: {
                        color: 'success'
                    },
                    close: true
                })
            );
            dispatch(toInitialState())
        }
    }, [success])

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <DialogTitle>Profile View</DialogTitle>
            <Divider />
            <DialogContent sx={{ p: 2.5 }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={5} md={5} xl={5}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <MainCard style={{ height: "363px" }}>
                                    <Grid container spacing={3} >
                                        <Grid item xs={12}>
                                            <Stack direction="row" justifyContent="flex-end">
                                                <Chip label={currentUser?.isActive ? "ACTIVE" : "IN-ACTIVE"} size="small" color={currentUser?.isActive ? "success" : "error"} />
                                            </Stack>
                                            <Stack spacing={2.5} alignItems="center">
                                                <Avatar alt="Avatar 1" size="xl" src={avatar} />
                                                <Stack spacing={0.5} alignItems="center">
                                                    <Typography variant="h5">{salutations.find(option => option.id == currentUser?.salutation)?.description || "-"}{currentUser?.firstName} {currentUser?.lastName}</Typography>
                                                    <Typography color="secondary">{userTypes.find(option => option.id == currentUser?.userType)?.description || "-"}</Typography>
                                                </Stack>
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Divider />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <List component="nav" sx={{ p: 0, '& .MuiListItemIcon-root': { minWidth: 32, color: theme.palette.grey[500] } }}>
                                                <ListItemButton selected={selectedIndex === 0} onClick={() => handleListItemClick(0, '/apps/profiles/user/personal')}>
                                                    <ListItemIcon>
                                                        <UserOutlined />
                                                    </ListItemIcon>
                                                    <ListItemText primary="Personal Details" />
                                                </ListItemButton>
                                                <ListItemButton selected={selectedIndex === 1} onClick={() => handleListItemClick(1, '/apps/profiles/user/password')}>
                                                    <ListItemIcon>
                                                        <LockOutlined />
                                                    </ListItemIcon>
                                                    <ListItemText primary="Password Details" />
                                                </ListItemButton>
                                            </List>
                                        </Grid>
                                    </Grid>
                                </MainCard>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={7} md={7} xl={7}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <MainCard title="Personal Details">
                                    <List sx={{ py: 0 }}>
                                        <ListItem divider={!matchDownMD}>
                                            <Grid container spacing={3}>
                                                <Grid item xs={12} md={12}>
                                                    <Stack spacing={0.5}>
                                                        <Typography color="secondary">NIC</Typography>
                                                        <Typography>{currentUser?.nic}</Typography>
                                                    </Stack>
                                                </Grid>
                                            </Grid>
                                        </ListItem>
                                        <ListItem divider={!matchDownMD}>
                                            <Grid container spacing={3}>
                                                <Grid item xs={12} md={12}>
                                                    <Stack spacing={0.5}>
                                                        <Typography color="secondary">Full Name</Typography>
                                                        <Typography>{salutations.find(option => option.id == currentUser?.salutation)?.description || "-"}{currentUser?.firstName} {currentUser?.lastName}</Typography>
                                                    </Stack>
                                                </Grid>
                                            </Grid>
                                        </ListItem>
                                        <ListItem divider={!matchDownMD}>
                                            <Grid container spacing={3}> <Grid item xs={12} md={12}>
                                                <Stack spacing={0.5}>
                                                    <Typography color="secondary">Email Address</Typography>
                                                    <Typography>{currentUser?.email}</Typography>
                                                </Stack>
                                            </Grid>
                                            </Grid>
                                        </ListItem>
                                        <ListItem divider={!matchDownMD}>
                                            <Grid container spacing={3}> <Grid item xs={12} md={12}>
                                                <Stack spacing={0.5}>
                                                    <Typography color="secondary">Contact Number</Typography>
                                                    <Typography>
                                                        <PatternFormat value={currentUser?.contactNumber} displayType="text" type="text" format="### ### ####" />
                                                    </Typography>
                                                </Stack>
                                            </Grid>
                                            </Grid>
                                        </ListItem>
                                    </List>
                                </MainCard>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </DialogContent>
            <Divider />
            <DialogActions sx={{ p: 2.5 }}>
                <Grid container justifyContent="space-between" alignItems="center">
                    <Grid item />
                    <Grid item>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Button color="error" onClick={onCancel}>
                                Cancel
                            </Button>
                            {/* <Button type="submit" variant="contained" disabled={isSubmitting}>
                                Save
                            </Button> */}
                        </Stack>
                    </Grid>
                </Grid>
            </DialogActions>
        </>
    );
};

export default ProfileView;
