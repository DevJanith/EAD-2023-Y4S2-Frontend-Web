// material-ui

// project import
import { useEffect, useMemo, useState } from 'react';
import { Chip, Divider, InputLabel, Stack, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { Grid, Typography } from '@mui/material';
// third-party
import { Cell, Column, HeaderGroup, useFilters, usePagination, useTable } from 'react-table';
import { openSnackbar } from 'store/reducers/snackbar';
// project import
import * as yup from 'yup';
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import { CSVExport, EmptyTable, TablePagination } from 'components/third-party/ReactTable';
import axios from 'axios';
import moment from 'moment';

import { CloseOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { dispatch } from 'store';

import { Slider } from '@mui/material';
import IconButton from 'components/@extended/IconButton';
import { useFormik } from 'formik';
import { TextField } from '@mui/material';
import trimFc from 'utils/trimFc';
import useAuth from 'hooks/useAuth';
import { useGlobalFilter } from 'react-table';
import { Row } from 'react-table';
import { DefaultColumnFilter, GlobalFilter, renderFilterTypes } from 'utils/react-table';

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

type Schedule = {
  id: string;
  fromLocation: string;
  toLocation: string;
  startDatetime: string;
  endDatetime: string;
  ticketPrice: number;
  status: string;
  train: Train;
  reservations: Reservation[];
};

// ==============================|| Dashboard ||============================== //
function ReactTable({
  columns,
  data,
  handleAddEdit
}: {
  columns: Column[];
  data: Schedule[];
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
          <CSVExport data={rows.map((d: Row) => d.original)} filename={'active-schedules.csv'} />
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
const ActiveSchedules = () => {
  const [data, setData] = useState([]);
  const [selectedItem, setSelectedItem] = useState<any>({});
  const { user } = useAuth();

  const columns = useMemo(
    () => [
      {
        Header: 'Schedule ID',
        accessor: 'id',
        className: 'cell-left'
      },
      {
        Header: 'Start Location',
        accessor: 'fromLocation'
      },
      {
        Header: 'End Location',
        accessor: 'toLocation'
      },
      {
        Header: 'Start Date Time',
        accessor: 'startDatetime',
        Cell: ({ value }: { value: any }) => <div>{moment(value).format('YYYY-MM-DD HH:mm:ss')}</div>
      },
      {
        Header: 'End Date Time',
        accessor: 'endDatetime',
        Cell: ({ value }: { value: any }) => <div>{moment(value).format('YYYY-MM-DD HH:mm:ss')}</div>
      },

      {
        Header: 'Ticket Price',
        accessor: 'ticketPrice',
        Cell: ({ value }: { value: any }) => <div>Rs. {value.toLocaleString()} </div>
      },

      {
        Header: 'Status',
        accessor: 'status',
        className: 'cell-center',
        Cell: ({ value }: { value: string }) => {
          switch (value) {
            case 'CANCELLED':
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
                handleClickOpen(row.original);
              }}
            >
              Make Reservation
            </Button>
          </>
        )
      }
      //   {
      //     Header: 'Profile Progress',
      //     accessor: 'progress',
      //     Cell: ({ value }: { value: number }) => <LinearWithLabel value={value} sx={{ minWidth: 75 }} />
      //   }
    ],
    []
  );

  useEffect(() => {
    getScheduleData();
  }, []);

  const getScheduleData = () => {
    axios
      .get('https://localhost:7051/api/Schedule/getSchedulesByStatus/ACTIVE')
      .then((response) => {
        if (response.status === 200) {
          setData(response.data);
        } else {
          dispatch(
            openSnackbar({
              open: true,
              message: 'Something went wrong!',
              variant: 'alert',
              alert: {
                color: 'error'
              },
              anchorOrigin: { vertical: 'top', horizontal: 'center' },
              close: false
            })
          );
          console.log('ERROR  >>> ');
        }
      })
      .catch((err) => {
        console.log(err);
        dispatch(
          openSnackbar({
            open: true,
            message: 'Something went wrong!',
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

  const DeleteSchedule = (schedule: any) => {
    handleCloseDelete();
    if (schedule.reservations.length > 0) {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Can not delete schedule with existing Reservations.',
          variant: 'alert',
          alert: {
            color: 'error'
          },
          anchorOrigin: { vertical: 'top', horizontal: 'center' },
          close: false
        })
      );
    } else {
      axios
        .delete(`https://localhost:7051/api/Schedule/${schedule.id}`)
        .then((response) => {
          if (response.status == 200) {
            getScheduleData();
          } else {
            console.log('ERROR  >>> ');
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const handleClickOpen = (data: any) => {
    setOpen(true);
    setSelectedItem(data);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // const handleClickOpenDelete = (data: any) => {
  //   setOpenDelete(true);
  //   setSelectedItem(data);
  // };

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };
  const [seatCount, setSeatCount] = useState(0);
  function valuetext(value: number) {
    setSeatCount(value);
    return `${value} Seats`;
  }
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

      let amount = seatCount * selectedItem.ticketPrice;
      let data = {
        // @ts-ignore
        userId: user.id,
        displayName: values.displayName,
        createdAt: moment(),
        reservedCount: seatCount,
        reservationDate: selectedItem.startDatetime,
        reservationStatus: 'RESERVED',
        amount: amount,
        scheduleId: selectedItem.id
      };
      axios
        .post(`https://localhost:7051/api/Reservation/createForSchedule/${selectedItem.id}`, data)
        .then((response) => {
          if (response.status == 201) {
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
                DeleteSchedule(selectedItem);
              }}
              autoFocus
            >
              Yes
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

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
              Schedule Details for ID - <strong> {selectedItem.id}</strong>{' '}
            </DialogContentText>
            <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1.5} sx={{ mt: 1.5 }}>
              <Grid item>
                <Typography variant="h6">Start Location : </Typography>
              </Grid>
              <Grid item>
                <Typography variant="h6">{selectedItem.fromLocation}</Typography>
              </Grid>
            </Stack>
            <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1.5} sx={{ mt: 1.5 }}>
              <Grid item>
                <Typography variant="h6">End Location : </Typography>
              </Grid>
              <Grid item>
                <Typography variant="h6">{selectedItem.toLocation}</Typography>
              </Grid>
            </Stack>

            <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1.5} sx={{ mt: 1.5 }}>
              <Grid item>
                <Typography variant="h6">Start Date Time : </Typography>
              </Grid>
              <Grid item>
                <Typography variant="h6">{moment(selectedItem.startDatetime).format('YYYY-MM-DD HH:mm:ss')}</Typography>
              </Grid>
            </Stack>
            <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1.5} sx={{ mt: 1.5 }}>
              <Grid item>
                <Typography variant="h6">End Date Time : </Typography>
              </Grid>
              <Grid item>
                <Typography variant="h6">{moment(selectedItem.endDatetime).format('YYYY-MM-DD HH:mm:ss')}</Typography>
              </Grid>
            </Stack>

            <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1.5} sx={{ mt: 1.5 }}>
              <Grid item>
                <Typography variant="h6">Status : </Typography>
              </Grid>
              <Grid item>
                <Typography variant="h6">
                  {selectedItem.status == 'ACTIVE' ? (
                    <Chip color="success" label="ACTIVE" size="small" variant="light" />
                  ) : (
                    <Chip color="error" label="CANCELLED" size="small" variant="light" />
                  )}
                </Typography>
              </Grid>
            </Stack>

            <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1.5} sx={{ mt: 1.5 }}>
              <Grid item>
                <Typography variant="h6">Available Seat Count : </Typography>
              </Grid>
              <Grid item>
                <Typography variant="h6">
                  {/*  @ts-ignore */}
                  {calculateAvailableSeats(selectedItem) <= 10 ? (
                    <Chip color="error" label={calculateAvailableSeats(selectedItem)} size="small" variant="light" />
                  ) : (
                    <Chip color="success" label={calculateAvailableSeats(selectedItem)} size="small" variant="light" />
                  )}
                </Typography>
              </Grid>
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1.5} sx={{ mt: 2 }}>
              <Typography variant="h5">Number of Seats : </Typography>

              <Typography variant="h5">
                {seatCount} Seat{seatCount > 1 ? 's' : ''}{' '}
                <strong>
                  {' '}
                  {'( Rs. '}
                  {Number(seatCount * selectedItem.ticketPrice).toLocaleString()} {')'}
                </strong>
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
                defaultValue={1}
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
              <Grid container spacing={0.1} alignItems="center" sx={{ mt: 2 }}>
                <Button variant="contained" fullWidth={true} type="submit" disabled={formik.isSubmitting}>
                  Make a Reservation
                </Button>
              </Grid>
            </form>
          </DialogContent>
        </Box>
      </Dialog>
      <MainCard content={false}>
        <ScrollX>
          <ReactTable columns={columns} data={data} />
        </ScrollX>
      </MainCard>
    </>
  );
};

export default ActiveSchedules;
