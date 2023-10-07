// material-ui

// project import
import { useEffect, useMemo, useState } from 'react';
import { Alert, AlertTitle, Chip, Stack, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

import { Grid, Typography } from '@mui/material';
// third-party
import { Cell, Column, HeaderGroup, useFilters, usePagination, useTable } from 'react-table';

// project import

import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import { CSVExport, TablePagination } from 'components/third-party/ReactTable';
import axios from 'axios';
import moment from 'moment';

import { useParams } from 'react-router';
import { ListItem } from '@mui/material';
import { List } from '@mui/material';
import { Divider } from '@mui/material';
import Avatar from 'components/@extended/Avatar';
import { CheckCircleOutlined, CloseCircleOutlined, WarningFilled } from '@ant-design/icons';
import { CardContent } from '@mui/material';
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
function ReactTable({ columns, data, striped }: { columns: Column[]; data: Reservation[]; striped?: boolean }) {
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
const ScheduleReservations = () => {
  const [data, setData] = useState([]);
  // const [selectedItem, setSelectedItem] = useState<any>({});
  const [selectedSchedule, setSelectedSchedule] = useState<any>({});

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
      }
      // {
      //   Header: 'Actions',
      //   accessor: 'progress',
      //   className: 'cell-center',
      //   Cell: ({ row }: { row: any }) => (
      //     <>
      //       <IconButton
      //         color="primary"
      //         size="large"
      //         onClick={() => {
      //           editScheduleInfo(row.original);
      //         }}
      //       >
      //         <EditOutlined />
      //       </IconButton>
      //       <IconButton
      //         color="inherit"
      //         size="large"
      //         onClick={() => {
      //           handleClickOpenDelete(row.original);
      //         }}
      //       >
      //         <DeleteOutlined />
      //       </IconButton>

      //       <IconButton
      //         color="inherit"
      //         size="large"
      //         onClick={() => {
      //           handleClickOpen(row.original);
      //         }}
      //       >
      //         <EyeOutlined />
      //       </IconButton>
      //     </>
      //   )
      // }
    ],
    []
  );

  useEffect(() => {
    console.log(data);

    getScheduleData();
  }, []);

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
  //         anchorOrigin: { vertical: 'top', horizontal: 'center' },
  //         close: false
  //       })
  //     );
  //   } else {
  //     navigate(`/home/schedule/${schedule.id}`);
  //   }
  // };

  const getScheduleData = () => {
    axios
      .get(`https://localhost:7051/api/Schedule/${params.id}`)
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

  // const DeleteSchedule = (schedule: any) => {
  //   handleCloseDelete();
  //   if (schedule.reservations.length > 0) {
  //     dispatch(
  //       openSnackbar({
  //         open: true,
  //         message: 'Can not delete schedule with existing Reservations.',
  //         variant: 'alert',
  //         alert: {
  //           color: 'error'
  //         },
  //         anchorOrigin: { vertical: 'top', horizontal: 'center' },
  //         close: false
  //       })
  //     );
  //   } else {
  //     axios
  //       .delete(`https://localhost:7051/api/Schedule/${schedule.id}`)
  //       .then((response) => {
  //         if (response.status == 200) {
  //           getScheduleData();
  //         } else {
  //           console.log('ERROR  >>> ');
  //         }
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });
  //   }
  // };

  // const [open, setOpen] = useState(false);
  // const [openDelete, setOpenDelete] = useState(false);

  // const handleClickOpen = (data: any) => {
  //   setOpen(true);
  //   setSelectedItem(data);
  // };

  // const handleClose = () => {
  //   setOpen(false);
  // };

  // const handleClickOpenDelete = (data: any) => {
  //   setOpenDelete(true);
  //   setSelectedItem(data);
  // };

  // const handleCloseDelete = () => {
  //   setOpenDelete(false);
  // };

  return (
    <>
      {/* Delete Dialog */}

      {/* Info Dialog */}

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
          <ReactTable columns={columns} data={data} striped={striped} />
        </ScrollX>
      </MainCard>
    </>
  );
};

export default ScheduleReservations;
