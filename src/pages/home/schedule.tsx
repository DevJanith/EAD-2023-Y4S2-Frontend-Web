// material-ui

// project import
import { useEffect, useMemo, useState } from 'react';
import { Chip, IconButton, Stack, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { Grid, Typography } from '@mui/material';
// third-party
import { Cell, Column, HeaderGroup, useFilters, usePagination, useTable } from 'react-table';
import { openSnackbar } from 'store/reducers/snackbar';
// project import

import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import { CSVExport, TablePagination } from 'components/third-party/ReactTable';
import axios from 'axios';
import moment from 'moment';

import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { dispatch } from 'store';
import { useNavigate } from 'react-router';
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
function ReactTable({ columns, data, striped }: { columns: Column[]; data: Schedule[]; striped?: boolean }) {
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
const Schedule = () => {
  const [data, setData] = useState([]);
  const [selectedItem, setSelectedItem] = useState<any>({});
  const navigate = useNavigate();

  const striped = true;
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
        accessor: 'ticketPrice'
      },

      {
        Header: 'Status',
        accessor: 'status',
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
          anchorOrigin: { vertical: 'top', horizontal: 'center' },
          close: false
        })
      );
    } else {
      navigate(`/home/schedule/${schedule.id}`);
    }
  };

  const getScheduleData = () => {
    axios
      .get('https://localhost:7051/api/Schedule')
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
          <DialogTitle>
            {' '}
            <Typography variant="h4">Schedule Details</Typography>
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Schedule Details for ID - <strong> {selectedItem.id}</strong>{' '}
            </DialogContentText>
            <Grid container spacing={1.5} alignItems="center" sx={{ mt: 1 }}>
              <Grid item>
                <Typography variant="h6">Start Location : </Typography>
              </Grid>
              <Grid item>
                <Typography variant="h6">{selectedItem.fromLocation}</Typography>
              </Grid>
            </Grid>
            <Grid container spacing={1.5} alignItems="center" sx={{ mt: 1 }}>
              <Grid item>
                <Typography variant="h6">End Location : </Typography>
              </Grid>
              <Grid item>
                <Typography variant="h6">{selectedItem.toLocation}</Typography>
              </Grid>
            </Grid>

            <Grid container spacing={1.5} alignItems="center" sx={{ mt: 1 }}>
              <Grid item>
                <Typography variant="h6">Start Date Time : </Typography>
              </Grid>
              <Grid item>
                <Typography variant="h6">{moment(selectedItem.startDatetime).format('YYYY-MM-DD HH:mm:ss')}</Typography>
              </Grid>
            </Grid>
            <Grid container spacing={1.5} alignItems="center" sx={{ mt: 1 }}>
              <Grid item>
                <Typography variant="h6">End Date Time : </Typography>
              </Grid>
              <Grid item>
                <Typography variant="h6">{moment(selectedItem.endDatetime).format('YYYY-MM-DD HH:mm:ss')}</Typography>
              </Grid>
            </Grid>

            <Grid container spacing={1.5} alignItems="center" sx={{ mt: 1 }}>
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
            </Grid>

            <Grid container spacing={1.5} alignItems="center" sx={{ mt: 2 }}>
              <Button variant="contained" fullWidth={true}>
                View Reservations
              </Button>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" color="error" onClick={handleClose}>
              Close
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
      <MainCard
        content={false}
        title="Schedule Data"
        secondary={<CSVExport data={data.slice(0, 10)} filename={striped ? 'striped-table.csv' : 'basic-table.csv'} />}
      >
        <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2}></Stack>
        <ScrollX>
          <ReactTable columns={columns} data={data} striped={striped} />
        </ScrollX>
      </MainCard>
    </>
  );
};

export default Schedule;
