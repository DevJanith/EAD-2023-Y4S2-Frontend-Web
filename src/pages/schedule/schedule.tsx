// material-ui

// project import
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
// third-party
import { Cell, Column, HeaderGroup, Row, useFilters, useGlobalFilter, usePagination, useTable } from 'react-table';
import { openSnackbar } from 'store/reducers/snackbar';
// project import

import { CloseOutlined, DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import IconButton from 'components/@extended/IconButton';
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import { CSVExport, EmptyTable, TablePagination } from 'components/third-party/ReactTable';
import moment from 'moment';
import { useNavigate } from 'react-router';
import { dispatch } from 'store';
import { DefaultColumnFilter, GlobalFilter, renderFilterTypes } from 'utils/react-table';
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

// ==============================|| REACT TABLE ||============================== //
function ReactTable({
  columns,
  data,
  handleAddEdit
}: {
  columns: Column[];
  data: Schedule[];
  striped?: boolean;
  handleAddEdit: () => void;
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
          <CSVExport data={rows.map((d: Row) => d.original)} filename={'all-schedules.csv'} />
          <Button variant="contained" startIcon={<PlusOutlined />} onClick={handleAddEdit}>
            Add New Schedule
          </Button>
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

// ==============================|| SCHEDULE ||============================== //
const Schedule = () => {
  const [data, setData] = useState([]);
  const [selectedItem, setSelectedItem] = useState<any>({});
  const navigate = useNavigate();

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
            <IconButton
              color="primary"
              size="large"
              onClick={() => {
                editScheduleInfo(row.original);
              }}
            >
              <EditOutlined />
            </IconButton>
            <IconButton
              color="inherit"
              size="large"
              onClick={() => {
                handleClickOpenDelete(row.original);
              }}
            >
              <DeleteOutlined />
            </IconButton>

            <IconButton
              color="inherit"
              size="large"
              onClick={() => {
                handleClickOpen(row.original);
              }}
            >
              <EyeOutlined />
            </IconButton>
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
    console.log(data);

    getScheduleData();
  }, []);

  const editScheduleInfo = (schedule: any) => {
    if (schedule.reservations.length > 0) {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Can not edit schedule with existing Reservations.',
          variant: 'alert',
          alert: {
            color: 'error'
          },
          anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
          close: false
        })
      );
    } else {
      navigate(`/home/schedule/${schedule.id}`);
    }
  };

  const getScheduleData = () => {
    axiosServices
      .get('/api/Schedule')
      .then((response) => {
        if (response.status == 200) {
          setData(response.data);
        } else {
          console.log('ERROR  >>> ');
          dispatch(
            openSnackbar({
              open: true,
              message: 'Something went wrong!',
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
        dispatch(
          openSnackbar({
            open: true,
            message: 'Something went wrong!',
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
          anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
          close: false
        })
      );
    } else {
      axiosServices
        .delete(`/api/Schedule/${schedule.id}`)
        .then((response) => {
          if (response.status == 200) {
            dispatch(
              openSnackbar({
                open: true,
                message: 'Schedule deleted succesfully.',
                variant: 'alert',
                alert: {
                  color: 'success'
                },
                anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
                close: false
              })
            );
            getScheduleData();
          } else {
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
              anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
              close: false
            })
          );
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

  const handleClickOpenDelete = (data: any) => {
    setOpenDelete(true);
    setSelectedItem(data);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

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
              <Typography variant="h4">Schedule Details</Typography>
            </DialogTitle>

            <IconButton shape="rounded" color="error" onClick={handleClose}>
              <CloseOutlined />
            </IconButton>
          </Stack>

          <Divider />

          <DialogContent>
            <DialogContentText>
              Schedule Details for ID : <strong> {selectedItem.id}</strong>{' '}
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
                    <Chip color="error" label="INACTIVE" size="small" variant="light" />
                  )}
                </Typography>
              </Grid>
            </Stack>
            <Divider />
            <Grid container spacing={1.5} alignItems="center" sx={{ mt: 2 }}>
              <Button
                variant="contained"
                fullWidth={true}
                onClick={() => {
                  navigate(`/home/schedule/reservations/${selectedItem.id}`);
                }}
              >
                View Reservations
              </Button>
            </Grid>
          </DialogContent>
        </Box>
      </Dialog>
      <MainCard content={false}>
        <ScrollX>
          <ReactTable
            columns={columns}
            data={data}
            handleAddEdit={() => {
              navigate('/application/schedule-management/schedule-create');
            }}
          />
        </ScrollX>
      </MainCard>
    </>
  );
};

export default Schedule;
