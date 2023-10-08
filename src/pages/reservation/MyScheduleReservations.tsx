// material-ui

// project import
import { useEffect, useState } from 'react';
import { Button, CardContent, Divider, Stack } from '@mui/material';
import { Grid, Typography } from '@mui/material';
// third-party
// project import

import MainCard from 'components/MainCard';
import { CSVExport } from 'components/third-party/ReactTable';
import axios from 'axios';
import moment from 'moment';

import { ClockCircleOutlined, CheckCircleOutlined, CloseCircleOutlined, EditOutlined, CloseOutlined } from '@ant-design/icons';
import { useParams } from 'react-router';
import { ListItem } from '@mui/material';
import { List } from '@mui/material';
import Avatar from 'components/@extended/Avatar';
import { Chip } from '@mui/material';
import { Box } from '@mui/system';
import { Dialog } from '@mui/material';
import { DialogTitle } from '@mui/material';
import { DialogContent } from '@mui/material';
import { DialogContentText } from '@mui/material';
import IconButton from 'components/@extended/IconButton';
import { TextField } from '@mui/material';
import { InputLabel } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';
import trimFc from 'utils/trimFc';
import { Slider } from '@mui/material';
// Define a type for the data

// ==============================|| Dashboard ||============================== //

const MyScheduleReservations = () => {
  const [data, setData] = useState([]);

  const [selectedSchedule, setSelectedSchedule] = useState<any>({});
  const [selectedItem, setSelectedItem] = useState<any>({});

  const params = useParams();
  const [seatCount, setSeatCount] = useState(0);
  const striped = true;
  const [open, setOpen] = useState(false);
  function valuetext(value: number) {
    setSeatCount(value);
    return `${value} Seats`;
  }

  const handleClickOpen = (data: any) => {
    setSelectedItem(data);
    setSeatCount(data.reservedCount);
    valuetext(data.reservedCount);

    formik.setValues({
      displayName: data.displayName
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    console.log(data);

    getScheduleData();
  }, []);
  const isUploadButtonEnabled = (item: any) => {
    const currentDate = moment();
    const reservationDate = moment(item.reservationDate);
    let daysUntilReservation = reservationDate.diff(currentDate, 'days');

    return daysUntilReservation >= 5;
  };
  const getScheduleData = () => {
    axios
      .get(`https://localhost:7051/api/Schedule/${params.id}`)
      .then((response) => {
        if (response.status == 200) {
          setSelectedSchedule(response.data);

          let reservationData: any = [];
          response.data.reservations.forEach((item: any) => {
            if (item.userId == 'string') {
              reservationData.push(item);
            }
          });
          // @ts-ignore
          setData(reservationData);
        } else {
          console.log('ERROR  >>> ');
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const iconSX = {
    fontSize: '0.675rem'
  };

  const validationSchema = yup.object({
    displayName: yup.string().required('Display Name required')
  });

  const formik = useFormik({
    initialValues: {
      displayName: ''
    },
    validationSchema,
    onSubmit: async (values, { setErrors, setStatus, setSubmitting }) => {
      // submit location

      let amount = seatCount * selectedSchedule.ticketPrice;
      let data = {
        id: selectedItem.id,
        userId: sessionStorage.getItem('userId') ? sessionStorage.getItem('userId') : 'string',
        displayName: values.displayName,
        createdAt: moment(),
        reservedCount: seatCount,
        reservationDate: selectedItem.reservationDate,
        reservationStatus: 'RESERVED',
        amount: amount,
        scheduleId: selectedItem.id
      };
      axios
        .put(`https://localhost:7051/api/Reservation/updateReservationForSchedule/${params.id}/${selectedItem.id}`, data)
        .then((response) => {
          if (response.status == 200) {
            dispatch(
              openSnackbar({
                open: true,
                message: 'Reservation created succesfully.',
                variant: 'alert',
                alert: {
                  color: 'success'
                },
                anchorOrigin: { vertical: 'top', horizontal: 'center' },
                close: false
              })
            );

            handleClose();
            getScheduleData();
          } else {
            dispatch(
              openSnackbar({
                open: true,
                message: response.data,
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
          console.log(err.response);
          dispatch(
            openSnackbar({
              open: true,
              message: err.response.data,
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

  const cancelReservation = () => {
    let data = {
      id: selectedItem.id,
      userId: selectedItem.userId,
      displayName: selectedItem.displayName,
      createdAt: selectedItem.createdAt,
      reservedCount: selectedItem.reservedCount,
      reservationDate: selectedItem.reservationDate,
      reservationStatus: 'CANCELLED',
      amount: selectedItem.amount,
      scheduleId: selectedItem.scheduleId
    };
    axios
      .put(`https://localhost:7051/api/Reservation/updateReservationForSchedule/${params.id}/${selectedItem.id}`, data)
      .then((response) => {
        if (response.status == 200) {
          dispatch(
            openSnackbar({
              open: true,
              message: 'Reservation cancelled succesfully.',
              variant: 'alert',
              alert: {
                color: 'success'
              },
              anchorOrigin: { vertical: 'top', horizontal: 'center' },
              close: false
            })
          );

          handleClose();
          getScheduleData();
        } else {
          dispatch(
            openSnackbar({
              open: true,
              message: response.data,
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
        console.log(err.response);
        dispatch(
          openSnackbar({
            open: true,
            message: err.response.data,
            variant: 'alert',
            alert: {
              color: 'error'
            },
            anchorOrigin: { vertical: 'top', horizontal: 'center' },
            close: false
          })
        );
      });
  };

  return (
    <>
      {/* Info Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <Box sx={{ p: 1, py: 1.5 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
            <DialogTitle>
              <Typography variant="h4">Reservation</Typography>
            </DialogTitle>

            <IconButton shape="rounded" color="error" onClick={handleClose}>
              <CloseOutlined />
            </IconButton>
          </Stack>

          <Divider />

          <DialogContent>
            <DialogContentText>
              Reservation Reference : <strong> {selectedItem.id}</strong>{' '}
            </DialogContentText>

            <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1.5} sx={{ mt: 1.5 }}>
              <Grid item>
                <Typography variant="h6">Reservation Date : </Typography>
              </Grid>
              <Grid item>
                <Typography variant="h6">{moment(selectedItem.reservationDate).format('YYYY-MM-DD HH:mm:ss')}</Typography>
              </Grid>
            </Stack>

            <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1.5} sx={{ mt: 1.5 }}>
              <Grid item>
                <Typography variant="h6">Status : </Typography>
              </Grid>
              <Grid item>
                <Typography variant="h6">
                  {/*  @ts-ignore */}
                  {selectedItem.reservationStatus === 'RESERVED' ? (
                    <Chip color="success" label="RESERVED" size="small" variant="light" />
                  ) : /*  @ts-ignore */
                  selectedItem.reservationStatus === 'PENDING' ? (
                    <Chip color="info" label="PENDING" size="small" variant="light" />
                  ) : (
                    <Chip color="error" label="CANCELLED" size="small" variant="light" />
                  )}
                </Typography>
              </Grid>
            </Stack>
            <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1.5} sx={{ mt: 2 }}>
              <Typography variant="h5">Number of Seats : </Typography>

              <Typography variant="h5">
                {seatCount} Seat{seatCount > 1 ? 's' : ''}{' '}
              </Typography>
            </Stack>

            <Grid container spacing={1.5} alignItems="center">
              <Grid item>
                <Typography variant="h6" color="red">
                  <strong> * Maximum 4 seats per reservation</strong>
                </Typography>
              </Grid>

              <Slider
                aria-label="Seats"
                defaultValue={seatCount}
                getAriaValueText={valuetext}
                valueLabelDisplay="auto"
                step={1}
                marks
                min={1}
                max={4}
                sx={{ mx: 3, mt: 2 }}
              />
              <Grid item sx={{ mx: 1, mt: -2, mb: 1 }}>
                <Typography variant="h6">Select seat count from this slider.</Typography>
              </Grid>
            </Grid>
            <form onSubmit={formik.handleSubmit} id="create-scheule-form">
              <Grid container spacing={3.5}>
                <Grid item xs={12} sm={12}>
                  <Stack spacing={1}>
                    <InputLabel>Display Name </InputLabel>
                    <TextField
                      id="displayName"
                      name="displayName"
                      placeholder="Enter Display Name Here"
                      value={formik.values.displayName}
                      onChange={trimFc(formik)}
                      onBlur={formik.handleBlur}
                      error={formik.touched.displayName && Boolean(formik.errors.displayName)}
                      helperText={formik.touched.displayName && formik.errors.displayName}
                      fullWidth
                    />
                  </Stack>
                </Grid>
              </Grid>
              <Divider />
              <Grid container spacing={0.1} alignItems="center" sx={{ mt: 4 }}>
                <Button variant="contained" fullWidth={true} type="submit">
                  Update Reservation
                </Button>
              </Grid>
            </form>
            <Grid container spacing={0.1} alignItems="center" sx={{ mt: 2 }}>
              <Button
                variant="outlined"
                color="error"
                fullWidth={true}
                onClick={() => {
                  cancelReservation();
                }}
              >
                Cancel Reservation
              </Button>
            </Grid>
            <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1.5} sx={{ mt: 1.5 }}>
              <Grid item>
                <Typography variant="h6" color="info">
                  * You can <strong>update</strong> or <strong>cancel</strong> the reservation at least 5 days before the reservation date.
                </Typography>
              </Grid>
            </Stack>
          </DialogContent>
        </Box>
      </Dialog>

      <MainCard
        content={false}
        title={``}
        secondary={<CSVExport data={data.slice(0, 10)} filename={striped ? 'striped-table.csv' : 'basic-table.csv'} />}
      >
        <Grid item xs={12}>
          <MainCard title={`Schedule Details : ${params.id}`}>
            <List sx={{ py: 0 }}>
              <ListItem divider>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Stack spacing={0.5}>
                      <Typography color="secondary">Start Location</Typography>
                      <Typography>{selectedSchedule.fromLocation}</Typography>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Stack spacing={0.5}>
                      <Typography color="secondary">End Location</Typography>
                      <Typography>{selectedSchedule.fromLocation}</Typography>
                    </Stack>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem divider>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Stack spacing={0.5}>
                      <Typography color="secondary">Schedule Start Date & Time</Typography>
                      <Typography>{moment(selectedSchedule.startDatetime).format('YYYY-MM-DD HH:MM')}</Typography>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Stack spacing={0.5}>
                      <Typography color="secondary">Schedule End Date & Time</Typography>
                      <Typography>{moment(selectedSchedule.endDatetime).format('YYYY-MM-DD HH:MM')}</Typography>
                    </Stack>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Stack spacing={0.5}>
                      <Typography color="secondary">Ticket Price</Typography>
                      <Typography> Rs. {selectedSchedule.ticketPrice}</Typography>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Stack spacing={0.5}>
                      <Typography color="secondary">Allocated Train Name</Typography>
                      <Typography>
                        {selectedSchedule.train && selectedSchedule.train.trainName ? selectedSchedule.train.trainName : 'N/A'}
                      </Typography>
                    </Stack>
                  </Grid>
                </Grid>
              </ListItem>
            </List>
          </MainCard>
        </Grid>
        <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2}></Stack>
      </MainCard>
      <MainCard title="Your Reservations for this Schedule" content={false} secondary={<div>All Reservations</div>}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            {data.map((item) => (
              <Grid item xs={12}>
                <Grid container spacing={2}>
                  <Grid item>
                    {/*  @ts-ignore */}

                    {item.reservationStatus == 'RESERVED' ? (
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
                      {item.displayName}
                    </Typography>
                    {/*  @ts-ignore */}
                    <Typography align="left" variant="subheading" color="secondary">
                      {/*  @ts-ignore */}
                      Reference No : {item.id}
                    </Typography>
                  </Grid>
                  <Grid item xs zeroMinWidth>
                    <Typography align="left" variant="subtitle1">
                      {/*  @ts-ignore */}
                      Rs. {item.amount.toLocaleString()}
                    </Typography>
                    <Typography align="left" variant="caption" color="secondary">
                      {/*  @ts-ignore */}
                      {item.reservedCount} Seat{item.reservedCount > 1 ? 's' : ''}{' '}
                    </Typography>
                  </Grid>

                  <Grid item>
                    <Stack direction="column" spacing={0.5} alignItems="end">
                      {/*  @ts-ignore */}
                      {item.reservationStatus == 'RESERVED' ? (
                        <Button
                          variant="outlined"
                          color="warning"
                          size="small"
                          endIcon={<EditOutlined />}
                          sx={{
                            mb: 2
                          }}
                          disabled={!isUploadButtonEnabled(item)}
                          onClick={() => {
                            handleClickOpen(item);
                          }}
                        >
                          Update a Reservation
                        </Button>
                      ) : (
                        ''
                      )}

                      {/*  @ts-ignore */}
                      {item.reservationStatus === 'RESERVED' ? (
                        <Chip color="success" label="RESERVED" size="small" variant="light" />
                      ) : /*  @ts-ignore */
                      item.reservationStatus === 'PENDING' ? (
                        <Chip color="info" label="PENDING" size="small" variant="light" />
                      ) : (
                        <Chip color="error" label="CANCELLED" size="small" variant="light" />
                      )}
                      <Stack direction="row">
                        <Box>
                          <Typography variant="caption" color="secondary">
                            {/*  @ts-ignore */}
                            Created On: {moment(item.createdAt).format('YYYY-MM-DD MM-HH')}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            ml: 0.5,
                            mb: 0.1
                          }}
                        >
                          <ClockCircleOutlined style={iconSX} />
                        </Box>
                      </Stack>
                    </Stack>
                  </Grid>
                </Grid>

                <Divider
                  sx={{
                    mt: 2
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </MainCard>
    </>
  );
};

export default MyScheduleReservations;
