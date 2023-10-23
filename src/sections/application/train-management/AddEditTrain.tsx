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
import AlertTrainDelete from './AlertTrainDelete';

// assets
import { DeleteFilled } from '@ant-design/icons';
import trainPublish, { TrainPublishType } from 'data/train-publish';
import trainStatuses, { TrainStatusType } from 'data/train-statuses';
import { dispatch } from 'store';
import { addTrain, updateTrain } from 'store/reducers/train';
import { Train } from 'types/train';

// types

// constant
const getInitialValues = (train: FormikValues | null) => {

    const newTrain = {
        id: undefined,
        trainName: "",
        trainNumber: "",
        allocatedDriver: "",
        allocatedGuard: "",
        status: "",
        publishStatus: "",
        totalSeats: undefined
    }

    if (train) {
        return _.merge({}, newTrain, train);
    }

    return newTrain;
};

// ==============================|| CUSTOMER ADD / EDIT ||============================== //

export interface Props {
    train?: Train
    onCancel: () => void;
}

const AddEditTrain = ({ train, onCancel }: Props) => {
    const theme = useTheme();

    const isCreating = !train;

    const TrainSchema = Yup.object().shape({
        trainName: Yup.string().required('Train Name is required'),
        trainNumber: Yup.string().required('Train Number is required'),
        allocatedDriver: Yup.string().required('Allocated Driver is required'),
        allocatedGuard: Yup.string().required('Allocated Guard is required'),
        status: Yup.string().required('Status is required'),
        publishStatus: Yup.string().required('Publish Status is required'),
        totalSeats: Yup.number().required('Total Seats is required'),
    });

    const [openAlert, setOpenAlert] = useState(false);

    const handleAlertClose = () => {
        setOpenAlert(!openAlert);
        onCancel();
    };

    const formik = useFormik({
        initialValues: getInitialValues(train!),
        validationSchema: TrainSchema,
        enableReinitialize: true,
        onSubmit: (values, { setSubmitting, resetForm }) => {
            try {
                if (train) {
                    dispatch(updateTrain({
                        id: values.id!,
                        trainName: values.trainName,
                        trainNumber: values.trainNumber,
                        allocatedDriver: values.allocatedDriver,
                        allocatedGuard: values.allocatedGuard,
                        status: values.status,
                        publishStatus: values.publishStatus,
                        totalSeats: values.totalSeats,
                    }));
                } else {
                    dispatch(addTrain({
                        id: undefined,
                        trainName: values.trainName,
                        trainNumber: values.trainNumber,
                        allocatedDriver: values.allocatedDriver,
                        allocatedGuard: values.allocatedGuard,
                        status: values.status,
                        publishStatus: values.publishStatus,
                        totalSeats: values.totalSeats,
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
    // const { handleSubmit, isSubmitting } = formik;

    return (
        <>
            <FormikProvider value={formik}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                        <DialogTitle>{train ? 'Edit Train' : 'New Train'}</DialogTitle>
                        <Divider />
                        <DialogContent sx={{ p: 2.5 }}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={12}>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} sm={6}>
                                            <Stack spacing={1.25}>
                                                <InputLabel htmlFor="trainNumber">Train Number</InputLabel>
                                                <TextField
                                                    fullWidth
                                                    id="trainNumber"
                                                    placeholder="Enter Train Number"
                                                    {...getFieldProps('trainNumber')}
                                                    error={Boolean(touched.trainNumber && errors.trainNumber)}
                                                    helperText={touched.trainNumber && errors.trainNumber}
                                                />
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Stack spacing={1.25}>
                                                <InputLabel htmlFor="trainName">Train Name</InputLabel>
                                                <TextField
                                                    fullWidth
                                                    id="trainName"
                                                    placeholder="Enter Train Name"
                                                    {...getFieldProps('trainName')}
                                                    error={Boolean(touched.trainName && errors.trainName)}
                                                    helperText={touched.trainName && errors.trainName}
                                                />
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Stack spacing={1.25}>
                                                <InputLabel htmlFor="allocatedDriver">Train Allocated Driver</InputLabel>
                                                <TextField
                                                    fullWidth
                                                    id="allocatedDriver"
                                                    placeholder="Enter Train Allocated Driver"
                                                    {...getFieldProps('allocatedDriver')}
                                                    error={Boolean(touched.allocatedDriver && errors.allocatedDriver)}
                                                    helperText={touched.allocatedDriver && errors.allocatedDriver}
                                                />
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Stack spacing={1.25}>
                                                <InputLabel htmlFor="allocatedGuard">Train Allocated Guard</InputLabel>
                                                <TextField
                                                    fullWidth
                                                    id="allocatedGuard"
                                                    placeholder="Enter Train Allocated Guard"
                                                    {...getFieldProps('allocatedGuard')}
                                                    error={Boolean(touched.allocatedGuard && errors.allocatedGuard)}
                                                    helperText={touched.allocatedGuard && errors.allocatedGuard}
                                                />
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={12} sm={6}> 
                                            <Stack spacing={1.25}>
                                                <InputLabel htmlFor="status">Train Status</InputLabel>
                                                <Autocomplete
                                                    fullWidth
                                                    id="status"
                                                    value={trainStatuses.find((option) => option.description === formik.values.status) || null}
                                                    onChange={(event: any, newValue: TrainStatusType | null) => {
                                                        formik.setFieldValue('status', newValue?.description);
                                                    }}
                                                    options={trainStatuses}
                                                    getOptionLabel={(item) => `${item.description}`}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            placeholder="Select Train Status"
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
                                        <Grid item xs={12} sm={6}>
                                            <Stack spacing={1.25}>
                                                <InputLabel htmlFor="publishStatus">Train Publish Status</InputLabel>
                                                <Autocomplete
                                                    fullWidth
                                                    id="publishStatus"
                                                    value={trainPublish.find((option) => option.description === formik.values.publishStatus) || null}
                                                    onChange={(event: any, newValue: TrainPublishType | null) => {
                                                        formik.setFieldValue('publishStatus', newValue?.description);
                                                    }}
                                                    options={trainPublish}
                                                    getOptionLabel={(item) => `${item.description}`}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            placeholder="Select Train Publish Status"
                                                            sx={{ '& .MuiAutocomplete-input.Mui-disabled': { WebkitTextFillColor: theme.palette.text.primary } }}
                                                        />
                                                    )}
                                                />
                                                {formik.touched.publishStatus && formik.errors.publishStatus && (
                                                    <FormHelperText error id="helper-text-publishStatus">
                                                        {formik.errors.publishStatus}
                                                    </FormHelperText>
                                                )}
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Stack spacing={1.25}>
                                                <InputLabel htmlFor="totalSeats">Train Total Seats</InputLabel>
                                                <TextField
                                                    fullWidth
                                                    id="totalSeats"
                                                    type='number'
                                                    placeholder="Enter Total Seats"
                                                    {...getFieldProps('totalSeats')}
                                                    error={Boolean(touched.totalSeats && errors.totalSeats)}
                                                    helperText={touched.totalSeats && errors.totalSeats}
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
                                        <Tooltip title="Delete Train" placement="top">
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
                                            {train ? 'Edit' : 'Add'}
                                        </Button>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </DialogActions>
                    </Form>
                </LocalizationProvider>
            </FormikProvider>
            {!isCreating && <AlertTrainDelete title={""} open={openAlert} handleClose={handleAlertClose} deleteId={train.id} />}
        </>
    );
};

export default AddEditTrain;
