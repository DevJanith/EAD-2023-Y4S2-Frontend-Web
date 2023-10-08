// material-ui

// project import
import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  AlertTitle,
  Chip,
  DialogContentText,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField
} from '@mui/material';

import { Grid, Typography } from '@mui/material';
// third-party
import { Cell, Column, HeaderGroup, useFilters, usePagination, useTable } from 'react-table';

// project import

import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import { CSVExport, EmptyTable, TablePagination } from 'components/third-party/ReactTable';

import moment from 'moment';

import { useParams } from 'react-router';
import { ListItem } from '@mui/material';
import { List } from '@mui/material';
import { Divider } from '@mui/material';
import Avatar from 'components/@extended/Avatar';
import { CheckCircleOutlined, CloseCircleOutlined, CloseOutlined, EditOutlined, WarningFilled } from '@ant-design/icons';
import { CardContent } from '@mui/material';
import IconButton from 'components/@extended/IconButton';
import { Dialog } from '@mui/material';
import { Box } from '@mui/system';
import { DialogTitle } from '@mui/material';
import { DialogContent } from '@mui/material';
import * as yup from 'yup';
import { InputLabel } from '@mui/material';
import { Button } from '@mui/material';
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';
import trimFc from 'utils/trimFc';
import { useFormik } from 'formik';
import { Slider } from '@mui/material';
import useAuth from 'hooks/useAuth';
import { DefaultColumnFilter, GlobalFilter, renderFilterTypes } from 'utils/react-table';
import { Row } from 'react-table';
import { useGlobalFilter } from 'react-table';
import { axiosServices } from 'utils/axios';
// Define a type for the data
type Reservation = {
  id: string;
  userId: string;
  displayName: string;
  createdAt: string;
  reservedCount: number;
  reservationDate: string;
  reservationStatus: string;
  amount: number;
  scheduleId: string | null;
};

// type Train = {
//   id: string;
//   trainName: string;
//   trainNumber: string;
//   allocatedDriver: string;
//   allocatedGuard: string;
//   status: string;
//   publishStatus: string;
//   totalSeats: number;
// };

// type Schedule = {
//   id: string;
//   fromLocation: string;
//   toLocation: string;
//   startDatetime: string;
//   endDatetime: string;
//   ticketPrice: number;
//   status: string;
//   train: Train;
//   reservations: Reservation[];
// };

// ==============================|| Dashboard ||============================== //
function ReactTable({
  columns,
  data,
  handleAddEdit
}: {
  columns: Column[];
  data: Reservation[];
  striped?: boolean;
  handleAddEdit?: () => void;
}) {
  const filterTypes = useMemo(() => renderFilterTypes, []);
  const defaultColumn = useMemo(() => ({ Filter: DefaultColumnFilter }), []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    gotoPage,
    setPageSize,
    state: { pageIndex, pageSize },
    preGlobalFilteredRows,
    setGlobalFilter,
    globalFilter,
    page
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      filterTypes,
      initialState: { pageIndex: 0, pageSize: 10 }
    },
    useGlobalFilter,
    useFilters,
    usePagination
  );

  return (
    <>
      <Stack direction="row" spacing={2} justifyContent="space-between" sx={{ padding: 2 }}>
        <GlobalFilter preGlobalFilteredRows={preGlobalFilteredRows} globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />
        <Stack direction="row" alignItems="center" spacing={1}>
          <CSVExport data={rows.map((d: Row) => d.original)} filename={'filtering-table.csv'} />
        </Stack>
      </Stack>
      <Table {...getTableProps()}>
        <TableHead sx={{ borderTopWidth: 2 }}>
          {headerGroups.map((headerGroup) => (
            <TableRow {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column: HeaderGroup) => (
                <TableCell {...column.getHeaderProps([{ className: column.className }])}>{column.render('Header')}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody {...getTableBodyProps()}>
          {page.length > 0 ? (
            page.map((row, i) => {
              prepareRow(row);
              return (
                <TableRow {...row.getRowProps()}>
                  {row.cells.map((cell: Cell) => (
                    <TableCell {...cell.getCellProps([{ className: cell.column.className }])}>{cell.render('Cell')}</TableCell>
                  ))}
                </TableRow>
              );
            })
          ) : (
            <EmptyTable msg="No Data" colSpan={12} />
          )}
          <TableRow>
            <TableCell sx={{ p: 2 }} colSpan={12}>
              <TablePagination gotoPage={gotoPage} rows={rows} setPageSize={setPageSize} pageIndex={pageIndex} pageSize={pageSize} />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </>
  );
}
const ScheduleReservations = () => {
  const [data, setData] = useState([]);
  // const [selectedItem, setSelectedItem] = useState<any>({});
  const [selectedSchedule, setSelectedSchedule] = useState<any>({});
  const { user } = useAuth();
  const params = useParams();

  const striped = true;
  const columns = useMemo(
    () => [
      {
        Header: 'Reservation ID',
        accessor: 'id',
        className: 'cell-left'
      },
      {
        Header: 'Display Name',
        accessor: 'displayName'
      },

      {
        Header: 'Created At',
        accessor: 'createdAt',
        Cell: ({ value }: { value: any }) => <div>{moment(value).format('YYYY-MM-DD HH:mm:ss')}</div>
      },
      {
        Header: 'Reservation Date',
        accessor: 'reservationDate',
        Cell: ({ value }: { value: any }) => <div>{moment(value).format('YYYY-MM-DD HH:mm:ss')}</div>
      },
      {
        Header: 'Reserve Count',
        accessor: 'reservedCount',
        className: 'cell-center'
      },
      {
        Header: 'Amount',
        accessor: 'amount',
        Cell: ({ value }: { value: any }) => <div>Rs. {value.toLocaleString()} </div>
      },
      {
        Header: 'Status',
        accessor: 'reservationStatus',
        className: 'cell-center',
        Cell: ({ value }: { value: string }) => {
          switch (value) {
            case 'CANCELLED':
              return <Chip color="error" label="CANCELLED" size="small" variant="light" />;
            case 'RESERVED':
              return <Chip color="success" label="RESERVED" size="small" variant="light" />;
            case 'PENDING':
            default:
              return <Chip color="info" label="PENDING" size="small" variant="light" />;
          }
        }
      },
      {
        Header: 'Actions',
        accessor: 'progress',
        className: 'cell-center',
        Cell: ({ row }: { row: any }) => (
          <>
            <IconButton
              color="primary"
              size="large"
              disabled={!isUpdateButtonEnabled(row.original)}
              onClick={() => {
                handleClickOpen(row.original);
              }}
            >
              <EditOutlined />
            </IconButton>
            {/* <IconButton
              color="inherit"
              size="large"
              onClick={() => {
                // handleClickOpenDelete(row.original);
                console.log(row.original);
              }}
            >
              <DeleteOutlined />
            </IconButton> */}

            {/* <IconButton
              color="inherit"
              size="large"
              onClick={() => {
                handleClickOpen(row.original);
              }}
            >
              <EyeOutlined />
            </IconButton> */}
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

  function calculateAvailableSeats(data: any) {
    if (!data || !data.train || !data.train.totalSeats || !data.reservations) {
      // Handle missing or invalid data
      return null;
    }

    const totalSeats = data.train.totalSeats;
    const reservations = data.reservations;

    if (!Array.isArray(reservations)) {
      // Handle invalid reservations data
      return null;
    }

    // Filter reservations where ReservationStatus is "RESERVED" and calculate the sum of reservedCount
    const reservedCountSum = reservations
      .filter((reservation) => reservation.reservationStatus === 'RESERVED')
      .reduce((sum, reservation) => {
        return sum + (reservation.reservedCount || 0);
      }, 0);

    // Calculate available seats by subtracting reservedCountSum from totalSeats
    const availableSeats = totalSeats - reservedCountSum;

    return availableSeats;
  }

  // const editScheduleInfo = (schedule: any) => {
  //   if (schedule.reservations.length > 0) {
  //     dispatch(
  //       openSnackbar({
  //         open: true,
  //         message: 'Can not edit schedule with existing Reservations.',
  //         variant: 'alert',
  //         alert: {
  //           color: 'error'
  //         },
  //         anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
  //         close: false
  //       })
  //     );
  //   } else {
  //     navigate(`/home/schedule/${schedule.id}`);
  //   }
  // };

  const getScheduleData = () => {
    axiosServices
      .get(`/api/Schedule/${params.id}`)
      .then((response) => {
        if (response.status == 200) {
          setSelectedSchedule(response.data);
          setData(response.data.reservations);
        } else {
          console.log('ERROR  >>> ');
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const [selectedItem, setSelectedItem] = useState<any>({});
  const [seatCount, setSeatCount] = useState(0);
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
        // @ts-ignore
        userId: user.id,
        displayName: values.displayName,
        createdAt: moment(),
        reservedCount: seatCount,
        reservationDate: selectedItem.reservationDate,
        reservationStatus: 'RESERVED',
        amount: amount,
        scheduleId: selectedItem.id
      };
      axiosServices
        .put(`/api/Reservation/updateReservationForSchedule/${params.id}/${selectedItem.id}`, data)
        .then((response) => {
          if (response.status == 200) {
            dispatch(
              openSnackbar({
                open: true,
                message: 'Reservation updated succesfully.',
                variant: 'alert',
                alert: {
                  color: 'success'
                },
                anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
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
                anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
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
              anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
              close: false
            })
          );
        });
    }
  });

  const isUpdateButtonEnabled = (item: any) => {
    const currentDate = moment();
    const reservationDate = moment(item.reservationDate);
    let daysUntilReservation = reservationDate.diff(currentDate, 'days');

    return daysUntilReservation >= 5 && item.reservationStatus == 'RESERVED';
  };

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
    axiosServices
      .put(`/api/Reservation/updateReservationForSchedule/${params.id}/${selectedItem.id}`, data)
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
              anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
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
              anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
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
            anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
            close: false
          })
        );
      });
  };

  return (
    <>
      {/* Delete Dialog */}

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
                  * Maximum 4 seats per reservation
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
                <Typography variant="h6">
                  <strong> Select seat count from this slider.</strong>
                </Typography>
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
          <MainCard
            title={<h3>Schedule Details : ${params.id}</h3>}
            secondary={
              <Typography variant="h5">
                {/*  @ts-ignore */}
                {calculateAvailableSeats(selectedSchedule) <= 10 ? (
                  <Chip color="error" label={<h3>{calculateAvailableSeats(selectedSchedule)}</h3>} size="small" variant="light" />
                ) : (
                  <Chip color="success" label={<h3>{calculateAvailableSeats(selectedSchedule)}</h3>} size="small" variant="light"></Chip>
                )}
                seats available
              </Typography>
            }
          >
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
          {selectedSchedule.train != null ? (
            <div>
              <MainCard title="Selected Train" content={false}>
                <CardContent>
                  <Grid container spacing={3} alignItems="center">
                    <Grid item xs={12}>
                      <Grid container spacing={2}>
                        <Grid item>
                          {/*  @ts-ignore */}

                          {selectedSchedule.train.status == 'ACTIVE' ? (
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
                            {selectedSchedule.train.trainName}
                          </Typography>
                          {/*  @ts-ignore */}
                          <Typography align="left" variant="subheading" color="secondary">
                            {/*  @ts-ignore */}
                            Train Number : {selectedSchedule.train.trainNumber}
                          </Typography>
                        </Grid>
                        <Grid item xs zeroMinWidth>
                          <Typography align="left" variant="subtitle1">
                            {/*  @ts-ignore */}
                            {selectedSchedule.train.totalSeats} Seat{selectedSchedule.train.totalSeats > 1 ? 's' : ''}{' '}
                          </Typography>

                          <Typography align="left" variant="caption" color="secondary">
                            {/*  @ts-ignore */}
                            Driver Name : {selectedSchedule.train.allocatedDriver}
                          </Typography>
                          <br />
                          <Typography align="left" variant="caption" color="secondary">
                            {/*  @ts-ignore */}
                            Guard Name : {selectedSchedule.train.allocatedGuard}
                          </Typography>
                        </Grid>

                        <Grid item>
                          <Stack direction="column" spacing={0.5} alignItems="end">
                            {/*  @ts-ignore */}
                            {selectedSchedule.train.status == 'ACTIVE' ? (
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
        </Grid>
        <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2}></Stack>
        <ScrollX>
          <ReactTable columns={columns} data={data} />
        </ScrollX>
      </MainCard>
    </>
  );
};

export default ScheduleReservations;
