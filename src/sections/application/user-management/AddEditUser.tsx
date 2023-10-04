import { useState } from 'react';

// material-ui
import {
    Button,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Grid,
    InputLabel,
    Stack,
    TextField,
    Tooltip
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// third-party
import { Form, FormikProvider, FormikValues, useFormik } from 'formik';
import _ from 'lodash';
import * as Yup from 'yup';

// project imports
import IconButton from 'components/@extended/IconButton';

// assets
import { DeleteFilled } from '@ant-design/icons';
import AlertUserDelete from './AlertUserDelete';

// types

// constant
const getInitialValues = (user: FormikValues | null) => {

    const newUser = {
        id: undefined, 
        salutation: "",
        firstName: "",
        lastName: "",
        contactNumber: "",
        email: "",
        userType: undefined,
        status: undefined,
        isActive: undefined,
        createdOn: "",
        updatedOn: "",
        createdBy: "",
        updatedBy: "",
    }

    if (user) {
        return _.merge({}, newUser, user);
    }

    return newUser;
};

// ==============================|| CUSTOMER ADD / EDIT ||============================== //

export interface Props {
    user?: {
        id?: number | string
        salutation?: string
        firstName?: string
        lastName?: string
        contactNumber?: string
        email?: string
        userType?: "Admin" | "Back-Office" | "Travel-Agent" | "User"
        status?: "Default" | "New" | "Approved" | "Deleted"
        isActive?: boolean
        createdOn?: string
        updatedOn?: string
        createdBy?: string
        updatedBy?: string
    };
    onCancel: () => void;
}

const AddEditUser = ({ user, onCancel }: Props) => {
    const isCreating = !user;

    const UserSchema = Yup.object().shape({});

    const [openAlert, setOpenAlert] = useState(false);

    const handleAlertClose = () => {
        setOpenAlert(!openAlert);
        onCancel();
    };

    const formik = useFormik({
        initialValues: getInitialValues(user!),
        validationSchema: UserSchema,
        enableReinitialize: true,
        onSubmit: (values, { setSubmitting, resetForm }) => {
            try {
                if (user) {
                    //PUT API 
                    // dispatch(api_function(ob_id!))  
                } else {
                    //POST API
                    // dispatch(api_function(ob_id!))  
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

    return (
        <>
            <FormikProvider value={formik}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                        <DialogTitle>{user ? 'Edit User' : 'New User'}</DialogTitle>
                        <Divider />
                        <DialogContent sx={{ p: 2.5 }}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={12}>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12}>
                                            <Stack spacing={1.25}>
                                                <InputLabel htmlFor="email">Email Address</InputLabel>
                                                <TextField
                                                    fullWidth
                                                    id="email"
                                                    placeholder="Enter Email Address"
                                                    {...getFieldProps('email')}
                                                    error={Boolean(touched.email && errors.email)}
                                                    helperText={touched.email && errors.email}
                                                />
                                            </Stack>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <Divider />
                        <DialogActions sx={{ p: 2.5 }}>
                            <Grid container justifyContent="space-between" alignItems="center">
                                <Grid item>
                                    {!isCreating && (
                                        <Tooltip title="Delete Nutrition" placement="top">
                                            <IconButton onClick={() => setOpenAlert(true)} size="large" color="error">
                                                <DeleteFilled />
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                </Grid>
                                <Grid item>
                                    <Stack direction="row" spacing={2} alignItems="center">
                                        <Button color="error" onClick={onCancel}>
                                            Cancel
                                        </Button>
                                        <Button type="submit" variant="contained" disabled={isSubmitting}>
                                            {user ? 'Edit' : 'Add'}
                                        </Button>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </DialogActions>
                    </Form>
                </LocalizationProvider>
            </FormikProvider>
            {!isCreating && <AlertUserDelete title={""} open={openAlert} handleClose={handleAlertClose} deleteId={user.id} />}
        </>
    );
};

export default AddEditUser;
