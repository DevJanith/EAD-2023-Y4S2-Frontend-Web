import { useEffect, useState } from 'react';

// material-ui
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import {
    Autocomplete, Button, Chip, DialogActions, DialogContent, DialogTitle, Divider,
    FormControlLabel,
    FormHelperText, Grid, InputLabel, List, ListItemButton, ListItemIcon, ListItemText, Stack, TextField, Typography
} from "@mui/material";
import { useTheme } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';


// third-party
import { Form, FormikProvider, FormikValues, useFormik } from 'formik';
import _ from 'lodash';
import * as Yup from 'yup';

// other
import { useDispatch, useSelector } from "store";
import { openSnackbar } from "store/reducers/snackbar";
import { fetchCurrentUser, toInitialState } from "store/reducers/user";

// project imports

// assets
import Avatar from "components/@extended/Avatar";
import MainCard from "components/MainCard";
import salutations, { SalutationsType } from "data/salutations";
import userTypes from "data/userTypes";
import { updateUser } from 'store/reducers/user';
import avatar from "../../assets/images/users/vector-2.png";
import { Switch } from '@mui/material';

// constant
const getInitialValues = (profile: FormikValues | null) => {

    const newProfile = {
        id: undefined,
        salutation: undefined,
        firstName: "",
        lastName: "",
        contactNumber: "",
        email: "",
        nic: "",
        userType: undefined,
        status: undefined,
        isActive: false,
        password: "",
    }

    if (profile) {
        return _.merge({}, newProfile, profile);
    }

    return newProfile;
};

// ==============================|| ProfileUpdate ||============================== // 

export interface Props {
    onCancel: () => void;
}

const ProfileUpdate = ({ onCancel }: Props) => {
    const theme = useTheme();

    const dispatch = useDispatch();
    const { currentUser, error, success, isLoading } = useSelector(state => state.user);

    const [selectedIndex, setSelectedIndex] = useState(0);
    const handleListItemClick = (index: number, route: string) => {
        setSelectedIndex(index);
    };

    const ProfileSchema = Yup.object().shape({
        salutation: Yup.number().required("Salutation is required"),
        firstName: Yup.string().required("First name is required"),
        lastName: Yup.string().required("Last name is required"),
        contactNumber: Yup.string()
            .matches(/^(?:\+94|0)[1-9][0-9]{8}$/, "Invalid Sri Lankan phone number")
            .required("Contact Number is required"),
        email: Yup.string().email("Invalid email address").required("Email is required"), 
    });

    const formik = useFormik({
        initialValues: getInitialValues(currentUser!),
        validationSchema: ProfileSchema,
        enableReinitialize: true,
        onSubmit: (values, { setSubmitting, resetForm }) => {
            try {
                if (currentUser) {
                    // PUT API
                    dispatch(updateUser({
                        id: values.id,
                        salutation: values.salutation,
                        firstName: values.firstName,
                        lastName: values.lastName,
                        contactNumber: values.contactNumber,
                        email: values.email,
                        nic: values.nic,
                        userType: values.userType,
                        status: values.status,
                        isActive: values.isActive,
                    }));
                }
                resetForm()
                setSubmitting(false);
                onCancel();
            } catch (error) {
                console.error(error);
            }
        }
    });

    const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;


    /**
     * API Config 
     * User API
     */
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
            <DialogTitle>Profile Update</DialogTitle>
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
                                <MainCard title="Personal Details Update">
                                    <FormikProvider value={formik}>
                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                                                <Grid container spacing={3}>
                                                    <Grid item xs={12}>
                                                        <Divider sx={{ my: 0.5 }} />
                                                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                                                            <Stack spacing={0.5}>
                                                                <Typography variant="subtitle1">Active / In Active</Typography>
                                                                <Typography variant="caption" color="textSecondary">
                                                                    description here ....
                                                                </Typography>
                                                            </Stack>
                                                            <FormControlLabel
                                                                control={
                                                                    <Switch
                                                                        {...getFieldProps('isActive')}
                                                                        checked={formik.values.isActive}
                                                                        sx={{ mt: 0 }}
                                                                    // onError={formik.touched.isActive && Boolean(formik.errors.isActive)}
                                                                    />
                                                                }
                                                                label=""
                                                                labelPlacement="start"
                                                            />
                                                        </Stack>
                                                        <Divider sx={{ my: 0.5 }} />
                                                    </Grid>
                                                    <Grid item xs={12} sm={12}>
                                                        <Stack spacing={1.25}>
                                                            <InputLabel htmlFor="nic">NIC</InputLabel>
                                                            <TextField
                                                                fullWidth
                                                                id="nic"
                                                                placeholder="Enter NIC"
                                                                {...getFieldProps('nic')}
                                                                error={Boolean(touched.nic && errors.nic)}
                                                                helperText={touched.nic && errors.nic}
                                                                disabled
                                                            />
                                                        </Stack>
                                                    </Grid>
                                                    <Grid item xs={12} sm={4}>
                                                        <Stack spacing={1.25}>
                                                            <InputLabel htmlFor="salutation">Salutation</InputLabel>
                                                            <Autocomplete
                                                                fullWidth
                                                                id="salutation"
                                                                value={salutations.find((option) => option.id === formik.values.salutation) || null}
                                                                onChange={(event: any, newValue: SalutationsType | null) => {
                                                                    formik.setFieldValue('salutation', newValue?.id);
                                                                }}
                                                                options={salutations}
                                                                getOptionLabel={(item) => `${item.description}`}
                                                                renderInput={(params) => (
                                                                    <TextField
                                                                        {...params}
                                                                        placeholder="Select Salutation"
                                                                        sx={{ '& .MuiAutocomplete-input.Mui-disabled': { WebkitTextFillColor: theme.palette.text.primary } }}
                                                                    />
                                                                )}
                                                            />
                                                            {formik.touched.salutation && formik.errors.salutation && (
                                                                <FormHelperText error id="helper-text-salutation">
                                                                    {formik.errors.salutation}
                                                                </FormHelperText>
                                                            )}
                                                        </Stack>
                                                    </Grid>
                                                    <Grid item xs={12} sm={8}>
                                                        <Stack spacing={1.25}>
                                                            <InputLabel htmlFor="firstName">First Name</InputLabel>
                                                            <TextField
                                                                fullWidth
                                                                id="firstName"
                                                                placeholder="Enter First Name"
                                                                {...getFieldProps('firstName')}
                                                                error={Boolean(touched.firstName && errors.firstName)}
                                                                helperText={touched.firstName && errors.firstName}
                                                            />
                                                        </Stack>
                                                    </Grid>
                                                    <Grid item xs={12} sm={12}>
                                                        <Stack spacing={1.25}>
                                                            <InputLabel htmlFor="lastName">Last Name</InputLabel>
                                                            <TextField
                                                                fullWidth
                                                                id="lastName"
                                                                placeholder="Enter Last Name"
                                                                {...getFieldProps('lastName')}
                                                                error={Boolean(touched.lastName && errors.lastName)}
                                                                helperText={touched.lastName && errors.lastName}
                                                            />
                                                        </Stack>
                                                    </Grid>
                                                    <Grid item xs={12} sm={12}>
                                                        <Stack spacing={1.25}>
                                                            <InputLabel htmlFor="email">Email</InputLabel>
                                                            <TextField
                                                                fullWidth
                                                                type="email"
                                                                id="email"
                                                                placeholder="Enter Email"
                                                                {...getFieldProps('email')}
                                                                error={Boolean(touched.email && errors.email)}
                                                                helperText={touched.email && errors.email}
                                                            />
                                                        </Stack>
                                                    </Grid>
                                                    <Grid item xs={12} sm={12}>
                                                        <Stack spacing={1.25}>
                                                            <InputLabel htmlFor="contactNumber">Contact Number</InputLabel>
                                                            <TextField
                                                                fullWidth
                                                                id="contactNumber"
                                                                placeholder="Enter Contact Number"
                                                                {...getFieldProps('contactNumber')}
                                                                error={Boolean(touched.contactNumber && errors.contactNumber)}
                                                                helperText={touched.contactNumber && errors.contactNumber}
                                                            />
                                                        </Stack>
                                                    </Grid>
                                                </Grid>
                                            </Form>
                                        </LocalizationProvider>
                                    </FormikProvider>
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
                            <Button type="submit" variant="contained" disabled={isSubmitting}>
                                Save
                            </Button>
                        </Stack>
                    </Grid>
                </Grid>
            </DialogActions>
        </>
    );
};

export default ProfileUpdate;
