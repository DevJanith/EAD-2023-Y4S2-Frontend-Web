// material-ui
// project import
import { useEffect, useMemo, useState } from 'react';
import {
  Chip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Divider,
  InputLabel,
  FormControl,
  FormHelperText,
  RadioGroup,
  Alert,
  CardContent
} from '@mui/material';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { Grid, Typography } from '@mui/material';
// third-party
import { useFormik } from 'formik';
import * as yup from 'yup';

import { Cell, Column, HeaderGroup, useFilters, usePagination, useTable } from 'react-table';
import { openSnackbar } from 'store/reducers/snackbar';
// project import

import ScrollX from 'components/ScrollX';
import { CSVExport, TablePagination } from 'components/third-party/ReactTable';
import axios from 'axios';

import { CheckCircleOutlined, CloseCircleOutlined, PlusCircleOutlined, WarningFilled } from '@ant-design/icons';
import { dispatch } from 'store';

import MainCard from 'components/MainCard';
import trimFc from 'utils/trimFc';
import { TextField } from '@mui/material';
import { FormControlLabel } from '@mui/material';
import { Radio } from '@mui/material';
import { AlertTitle } from '@mui/material';
import { useNavigate, useParams } from 'react-router';
import moment from 'moment';
import Avatar from 'components/@extended/Avatar';

// Define a type for the data

type Train = {
  id: string;
  trainName: string;
  trainNumber: string;
  allocatedDriver: string;
  allocatedGuard: string;
  status: string;
  publishStatus: string;
  totalSeats: number;
};

// ==============================|| Dashboard ||============================== //
function ReactTable({ columns, data, striped }: { columns: Column[]; data: Train[]; striped?: boolean }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    gotoPage,
    setPageSize,
    state: { pageIndex, pageSize }
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 10 }
    },
    useFilters,
    usePagination
  );

  return (
    <>
      <Table {...getTableProps()}>
        <TableHead>
          {headerGroups.map((headerGroup: HeaderGroup<{}>) => (
            <TableRow {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column: HeaderGroup<{}>) => (
                <TableCell {...column.getHeaderProps([{ className: column.className }])}>{column.render('Header')}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody {...getTableBodyProps()} {...(striped && { className: 'striped' })}>
          {rows.map((row, i) => {
            prepareRow(row);
            return (
              <TableRow {...row.getRowProps()}>
                {row.cells.map((cell: Cell<{}>) => (
                  <TableCell {...cell.getCellProps([{ className: cell.column.className }])}>{cell.render('Cell')}</TableCell>
                ))}
              </TableRow>
            );
          })}

          <TableRow>
            <TableCell sx={{ p: 2 }} colSpan={7}>
              <TablePagination gotoPage={gotoPage} rows={rows} setPageSize={setPageSize} pageIndex={pageIndex} pageSize={pageSize} />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </>
  );
}
// @ts-ignore
const EditSchedule = () => {
  const [data, setData] = useState([]);
  const [selectedTrain, setSelectedTrain] = useState<any>(null);
  const navigate = useNavigate();
  const params = useParams();
  const striped = true;
  const columns = useMemo(
    () => [
      {
        Header: 'Train Name',
        accessor: 'trainName',
        className: 'cell-left'
      },
      {
        Header: 'Train Number',
        accessor: 'trainNumber'
      },
      {
        Header: 'Allocated Driver',
        accessor: 'allocatedDriver'
      },
      {
        Header: 'Allocated Guard',
        accessor: 'allocatedGuard'
      },

      {
        Header: 'Tatal Seats',
        accessor: 'totalSeats'
      },

      {
        Header: 'Status',
        accessor: 'status',
        Cell: ({ value }: { value: string }) => {
          switch (value) {
            case 'INACTIVE':
              return <Chip color="error" label="CANCELLED" size="small" variant="light" />;
            case 'ACTIVE':
              return <Chip color="success" label="ACTIVE" size="small" variant="light" />;
            case 'OTHER':
            default:
              return <Chip color="info" label="N/A" size="small" variant="light" />;
          }
        }
      },
      {
        Header: 'Published Status',
        accessor: 'publishStatus',
        Cell: ({ value }: { value: string }) => {
          switch (value) {
            case 'UNPUBLISHED':
              return <Chip color="error" label="UNPUBLISHED" size="small" variant="light" />;
            case 'PUBLISHED':
              return <Chip color="success" label="PUBLISHED" size="small" variant="light" />;
            case 'OTHER':
            default:
              return <Chip color="info" label="N/A" size="small" variant="light" />;
          }
        }
      },
      {
        Header: 'Actions',
        accessor: 'progress',
        className: 'cell-center',
        Cell: ({ row }: { row: any }) => (
          <>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<PlusCircleOutlined />}
              onClick={() => {
                setSelectedTrain(row.original);
                handleClose();
              }}
            >
              Add Train
            </Button>
          </>
        )
      }
    ],
    []
  );

  useEffect(() => {
    console.log(data);

    getScheduleData();
  }, []);

  const getScheduleData = () => {
    axios
      .get('https://localhost:7051/api/Train')
      .then((response) => {
        if (response.status == 200) {
          setData(response.data);
        } else {
          console.log('ERROR  >>> ');
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };
  const validationSchema = yup.object({
    fromLocation: yup.string().required('Start Location is required').nullable(),
    toLocation: yup.string().required('End Location required'),
    startDatetime: yup.string().required('Start Date & Time required'),
    endDatetime: yup.string().required('Start Date & Time required'),
    ticketPrice: yup.number().typeError('Price must be a number').required('Price is required'),
    status: yup.string().required('Status selection is required')
  });

  const formik = useFormik({
    initialValues: {
      fromLocation: '',
      toLocation: '',
      startDatetime: '',
      endDatetime: '',
      ticketPrice: '',
      status: ''
    },
    validationSchema,
    onSubmit: async (values, { setErrors, setStatus, setSubmitting }) => {
      console.log(selectedTrain);
      // submit location
      let data = {
        id: params.id,
        fromLocation: values.fromLocation,
        toLocation: values.toLocation,
        startDatetime: values.startDatetime,
        endDatetime: values.endDatetime,
        ticketPrice: values.ticketPrice,
        status: values.status,
        train: selectedTrain != null ? selectedTrain : null,
        reservations: []
      };

      axios
        .put(`https://localhost:7051/api/Schedule/${params.id}`, data)
        .then((response) => {
          if (response.status == 200) {
            dispatch(
              openSnackbar({
                open: true,
                message: 'Schedule updated succesfully.',
                variant: 'alert',
                alert: {
                  color: 'success'
                },
                anchorOrigin: { vertical: 'top', horizontal: 'center' },
                close: false
              })
            );
            navigate(`/home/schedule`);
          } else {
            dispatch(
              openSnackbar({
                open: true,
                message: 'Failed to update schedule.',
                variant: 'alert',
                alert: {
                  color: 'error'
                },
                anchorOrigin: { vertical: 'top', horizontal: 'center' },
                close: false
              })
            );
          }
        })
        .catch((err) => {
          console.log(err);
          dispatch(
            openSnackbar({
              open: true,
              message: 'Something went wrong.',
              variant: 'alert',
              alert: {
                color: 'error'
              },
              anchorOrigin: { vertical: 'top', horizontal: 'center' },
              close: false
            })
          );
        });
    }
  });

  useEffect(() => {
    // Fetch the data of the schedule to edit using the scheduleId
    axios
      .get(`https://localhost:7051/api/Schedule/${params.id}`)
      .then((response) => {
        if (response.status === 200) {
          const scheduleData = response.data;

          // Populate the form fields with the fetched data

          formik.setValues({
            fromLocation: scheduleData.fromLocation,
            toLocation: scheduleData.toLocation,
            startDatetime: moment(scheduleData.startDatetime).format('YYYY-MM-DDTHH:MM'),
            endDatetime: moment(scheduleData.endDatetime).format('YYYY-MM-DDTHH:MM'),
            ticketPrice: scheduleData.ticketPrice,
            status: scheduleData.status
          });

          // You can also set the selectedTrain if it's related to the schedule
          setSelectedTrain(scheduleData.train);
        } else {
          console.log('Error fetching schedule data');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, []);

  return (
    <>
      {/* Delete Dialog */}
      <Dialog
        open={openDelete}
        onClose={handleCloseDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <Box sx={{ p: 1, py: 1.5 }}>
          <DialogTitle id="alert-dialog-title">Alert !!!</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">Do you want to delete the schedule ?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button color="error" onClick={handleCloseDelete}>
              No
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                handleCloseDelete();
              }}
              autoFocus
            >
              Yes
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Info Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth={true}
        PaperProps={{
          style: {
            minWidth: '90%'
          }
        }}
      >
        <Box sx={{ p: 1, py: 1.5 }}>
          <DialogTitle>
            <Typography variant="h4">Select Train For Schedule</Typography>
          </DialogTitle>
          <DialogContent>
            <MainCard
              content={false}
              title="Upate Train Schedule"
              secondary={<CSVExport data={data.slice(0, 10)} filename={striped ? 'striped-table.csv' : 'basic-table.csv'} />}
            >
              <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2}></Stack>
              <ScrollX>
                <ReactTable columns={columns} data={data} striped={striped} />
              </ScrollX>
            </MainCard>
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" color="error" onClick={handleClose}>
              Close
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <MainCard title="Create new Train Schedule">
        <form onSubmit={formik.handleSubmit} id="create-scheule-form">
          <Grid container spacing={3.5}>
            <Grid item xs={12} sm={6}>
              <Stack spacing={1}>
                <InputLabel>Start Location</InputLabel>
                <TextField
                  id="fromLocation"
                  name="fromLocation"
                  placeholder="Enter Start Location Here"
                  value={formik.values.fromLocation}
                  onChange={trimFc(formik)}
                  onBlur={formik.handleBlur}
                  error={formik.touched.fromLocation && Boolean(formik.errors.fromLocation)}
                  helperText={formik.touched.fromLocation && formik.errors.fromLocation}
                  fullWidth
                />
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Stack spacing={1}>
                <InputLabel>End Location</InputLabel>
                <TextField
                  id="toLocation"
                  name="toLocation"
                  placeholder="Enter ENd Location Here"
                  value={formik.values.toLocation}
                  onChange={trimFc(formik)}
                  onBlur={formik.handleBlur}
                  error={formik.touched.toLocation && Boolean(formik.errors.toLocation)}
                  helperText={formik.touched.toLocation && formik.errors.toLocation}
                  fullWidth
                />
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Stack spacing={1}>
                <InputLabel>Start Date & Time</InputLabel>

                <TextField
                  type="datetime-local"
                  defaultValue="2017-05-24T10:30"
                  InputLabelProps={{
                    shrink: true
                  }}
                  id="startDatetime"
                  name="startDatetime"
                  placeholder="Select Train Start Date & Time"
                  value={formik.values.startDatetime}
                  onChange={trimFc(formik)}
                  onBlur={formik.handleBlur}
                  error={formik.touched.startDatetime && Boolean(formik.errors.startDatetime)}
                  helperText={formik.touched.startDatetime && formik.errors.startDatetime}
                  fullWidth
                />
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Stack spacing={1}>
                <InputLabel>End Date & Time</InputLabel>

                <TextField
                  type="datetime-local"
                  defaultValue="2017-05-24T10:30"
                  InputLabelProps={{
                    shrink: true
                  }}
                  id="endDatetime"
                  name="endDatetime"
                  placeholder="Select Train Start Date & Time"
                  value={formik.values.endDatetime}
                  onChange={trimFc(formik)}
                  onBlur={formik.handleBlur}
                  error={formik.touched.endDatetime && Boolean(formik.errors.endDatetime)}
                  helperText={formik.touched.endDatetime && formik.errors.endDatetime}
                  fullWidth
                />
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Stack spacing={1}>
                <InputLabel>Price (Per 1 Ticket)</InputLabel>
                <TextField
                  id="ticketPrice"
                  name="ticketPrice"
                  placeholder="Enter ticket price"
                  value={formik.values.ticketPrice}
                  onChange={trimFc(formik)}
                  onBlur={formik.handleBlur}
                  error={formik.touched.ticketPrice && Boolean(formik.errors.ticketPrice)}
                  helperText={formik.touched.ticketPrice && formik.errors.ticketPrice}
                  fullWidth
                />
              </Stack>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Stack spacing={1}>
                <InputLabel>Select Status </InputLabel>
                <FormControl>
                  <RadioGroup
                    row
                    aria-label="color"
                    value={formik.values.status}
                    onChange={(e) => {
                      formik.handleChange(e);
                      setSelectedTrain(null);
                    }}
                    name="status"
                    id="status"
                  >
                    <FormControlLabel value="ACTIVE" control={<Radio color="success" />} label="Active" />
                    <FormControlLabel value="CANCELLED" control={<Radio color="error" />} label="Cancelled" />
                  </RadioGroup>
                </FormControl>
                {formik.errors.status && (
                  <FormHelperText error id="standard-weight-helper-text-email-login">
                    {' '}
                    {formik.errors.status}{' '}
                  </FormHelperText>
                )}
              </Stack>
            </Grid>

            <Grid item>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<PlusCircleOutlined />}
                onClick={() => {
                  handleClickOpen();
                }}
                disabled={formik.values.status == 'INACTIVE'}
              >
                Add Train to Schedule
              </Button>
            </Grid>

            <Grid item xs={12} sm={12}>
              <Stack spacing={1}>
                {selectedTrain != null ? (
                  <div>
                    <MainCard title="Selected Train" content={false}>
                      <CardContent>
                        <Grid container spacing={3} alignItems="center">
                          <Grid item xs={12}>
                            <Grid container spacing={2}>
                              <Grid item>
                                {/*  @ts-ignore */}

                                {selectedTrain.status == 'ACTIVE' ? (
                                  <Avatar color="primary">
                                    <CheckCircleOutlined />
                                  </Avatar>
                                ) : (
                                  <Avatar color="error">
                                    <CloseCircleOutlined />
                                  </Avatar>
                                )}
                              </Grid>
                              <Grid item xs zeroMinWidth>
                                <Typography align="left" variant="h5">
                                  {/*  @ts-ignore */}
                                  {selectedTrain.trainName}
                                </Typography>
                                {/*  @ts-ignore */}
                                <Typography align="left" variant="subheading" color="secondary">
                                  {/*  @ts-ignore */}
                                  Train Number : {selectedTrain.trainNumber}
                                </Typography>
                              </Grid>
                              <Grid item xs zeroMinWidth>
                                <Typography align="left" variant="subtitle1">
                                  {/*  @ts-ignore */}
                                  {selectedTrain.totalSeats} Seat{selectedTrain.totalSeats > 1 ? 's' : ''}{' '}
                                </Typography>

                                <Typography align="left" variant="caption" color="secondary">
                                  {/*  @ts-ignore */}
                                  Driver Name : {selectedTrain.allocatedDriver}
                                </Typography>
                                <br />
                                <Typography align="left" variant="caption" color="secondary">
                                  {/*  @ts-ignore */}
                                  Guard Name : {selectedTrain.allocatedGuard}
                                </Typography>
                              </Grid>

                              <Grid item>
                                <Stack direction="column" spacing={0.5} alignItems="end">
                                  {/*  @ts-ignore */}
                                  {selectedTrain.status == 'ACTIVE' ? (
                                    <Chip color="success" label="ACTIVE" size="small" variant="light" />
                                  ) : (
                                    <Chip color="error" label="CANCELLED" size="small" variant="light" />
                                  )}
                                </Stack>
                              </Grid>
                            </Grid>

                            <Divider
                              sx={{
                                mt: 2
                              }}
                            />
                          </Grid>
                        </Grid>
                      </CardContent>
                    </MainCard>
                  </div>
                ) : (
                  <Alert color="warning" variant="border" icon={<WarningFilled />}>
                    <AlertTitle>No Train Selected.</AlertTitle>
                    <Typography variant="h6">You haven't selected a train to the schedule. Please select train from above list.</Typography>
                  </Alert>
                )}
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12}>
              <Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={2}>
                <Button variant="outlined" color="secondary" type="reset" onClick={() => formik.resetForm()}>
                  Reset Form
                </Button>
                <Button variant="contained" type="submit" disabled={formik.isSubmitting} color="warning">
                  Update Schedule
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </form>
      </MainCard>
    </>
  );
};

export default EditSchedule;
