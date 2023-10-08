import { useState } from 'react';

// material-ui
import {
    Autocomplete,
    Button,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    FormHelperText,
    Grid,
    InputLabel,
    Stack,
    TextField,
    Tooltip
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
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
import isActives, { IsActivesTypes } from 'data/isActives';
import salutations, { SalutationsType } from 'data/salutations';
import statuses, { StatusesType } from 'data/statuses';
import userTypes, { UserTypesType } from 'data/userTypes';
import { dispatch } from 'store';
import { addUser, updateUser } from 'store/reducers/user';
import { User } from 'types/user';
import AlertUserDelete from './AlertUserDelete';

// types

// constant
const getInitialValues = (user: FormikValues | null) => {

    const newUser = {
        id: undefined,
        salutation: undefined,
        firstName: "",
        lastName: "",
        contactNumber: "",
        email: "",
        nic: "",
        userType: undefined,
        status: undefined,
        isActive: undefined
    }

    if (user) {
        return _.merge({}, newUser, user);
    }

    return newUser;
};

// ==============================|| CUSTOMER ADD / EDIT ||============================== //

export interface Props {
    user?: User;
    onCancel: () => void;
}

const AddEditUser = ({ user, onCancel }: Props) => {
    const theme = useTheme();
    const isCreating = !user;

    const UserSchema = Yup.object().shape({
        salutation: Yup.number().required("Salutation is required"),
        firstName: Yup.string().required("First name is required"),
        lastName: Yup.string().required("Last name is required"),
        contactNumber: Yup.string()
            .matches(/^(?:\+94|0)[1-9][0-9]{8}$/, "Invalid Sri Lankan phone number")
            .required("Contact Number is required"),
        email: Yup.string().email("Invalid email address").required("Email is required"),
        nic: Yup.string()
            .matches(/^[0-9]{9}[vVxX]?$|^[0-9]{12}$/i, "Invalid NIC format")
            .required("NIC is required"),
        userType: Yup.number().required("User Type is required"),
        status: Yup.string().required("Status is required"),
        isActive: Yup.boolean().required("Is Active is required"),
    });

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
                } else {
                    // POST API
                    dispatch(addUser({
                        id: undefined,
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

    return (
        <>
            <FormikProvider value={formik}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                        <DialogTitle>{user ? 'Edit User' : 'New User'}</DialogTitle>
                        <Divider />
                        <DialogContent sx={{ p: 2.5 }}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={2}>
                                    <Stack spacing={1.25}>
                                        <InputLabel htmlFor="isActive">Is Active</InputLabel>
                                        <Autocomplete
                                            fullWidth
                                            id="isActive"
                                            value={isActives.find((option) => option.id === formik.values.isActive) || null}
                                            onChange={(event: any, newValue: IsActivesTypes | null) => {
                                                formik.setFieldValue('isActive', newValue?.id);
                                            }}
                                            options={isActives}
                                            getOptionLabel={(item) => `${item.description}`}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    placeholder="Select Salutation"
                                                    sx={{ '& .MuiAutocomplete-input.Mui-disabled': { WebkitTextFillColor: theme.palette.text.primary } }}
                                                />
                                            )}
                                        />
                                        {formik.touched.isActive && formik.errors.isActive && (
                                            <FormHelperText error id="helper-text-isActive">
                                                {formik.errors.isActive}
                                            </FormHelperText>
                                        )}
                                    </Stack>
                                </Grid>
                                <Grid item xs={12} sm={10}>
                                    <Stack spacing={1.25}>
                                        <InputLabel htmlFor="nic">NIC</InputLabel>
                                        <TextField
                                            fullWidth
                                            id="nic"
                                            placeholder="Enter NIC"
                                            {...getFieldProps('nic')}
                                            error={Boolean(touched.nic && errors.nic)}
                                            helperText={touched.nic && errors.nic}
                                        />
                                    </Stack>
                                </Grid>
                                <Grid item xs={12} sm={2}>
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
                                <Grid item xs={12} sm={4}>
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
                                <Grid item xs={12} sm={6}>
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
                                <Grid item xs={12} sm={6}>
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
                                <Grid item xs={12} sm={6}>
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
                                <Grid item xs={12} sm={6}>
                                    <Stack spacing={1.25}>
                                        <InputLabel htmlFor="userType">User Type</InputLabel>
                                        <Autocomplete
                                            fullWidth
                                            id="userType"
                                            value={userTypes.find((option) => option.id === formik.values.userType) || null}
                                            onChange={(event: any, newValue: UserTypesType | null) => {
                                                formik.setFieldValue('userType', newValue?.id);
                                            }}
                                            options={userTypes}
                                            getOptionLabel={(item) => `${item.description}`}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    placeholder="Select userType"
                                                    sx={{ '& .MuiAutocomplete-input.Mui-disabled': { WebkitTextFillColor: theme.palette.text.primary } }}
                                                />
                                            )}
                                        />
                                        {formik.touched.userType && formik.errors.userType && (
                                            <FormHelperText error id="helper-text-userType">
                                                {formik.errors.userType}
                                            </FormHelperText>
                                        )}
                                    </Stack>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Stack spacing={1.25}>
                                        <InputLabel htmlFor="status">User Status</InputLabel>
                                        <Autocomplete
                                            fullWidth
                                            id="status"
                                            value={statuses.find((option) => option.id === formik.values.status) || null}
                                            onChange={(event: any, newValue: StatusesType | null) => {
                                                formik.setFieldValue('status', newValue?.id);
                                            }}
                                            options={statuses}
                                            getOptionLabel={(item) => `${item.description}`}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    placeholder="Select status"
                                                    sx={{ '& .MuiAutocomplete-input.Mui-disabled': { WebkitTextFillColor: theme.palette.text.primary } }}
                                                />
                                            )}
                                        />
                                        {formik.touched.status && formik.errors.status && (
                                            <FormHelperText error id="helper-text-status">
                                                {formik.errors.status}
                                            </FormHelperText>
                                        )}
                                    </Stack>
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
