// material-ui

// project import
import { useEffect, useState } from 'react';
import { CardContent, Divider, Stack } from '@mui/material';
import { Grid, Typography } from '@mui/material';
// third-party
// project import

import MainCard from 'components/MainCard';
import { CSVExport } from 'components/third-party/ReactTable';
import axios from 'axios';
import moment from 'moment';

import { ClockCircleOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { useParams } from 'react-router';
import { ListItem } from '@mui/material';
import { List } from '@mui/material';
import Avatar from 'components/@extended/Avatar';
import { Chip } from '@mui/material';
import { Box } from '@mui/system';

// Define a type for the data

// ==============================|| Dashboard ||============================== //

const MyScheduleReservations = () => {
  const [data, setData] = useState([]);

  const [selectedSchedule, setSelectedSchedule] = useState<any>({});

  const params = useParams();

  const striped = true;

  useEffect(() => {
    console.log(data);

    getScheduleData();
  }, []);

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

  const iconSX = {
    fontSize: '0.675rem'
  };

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
                      <Stack direction="row">
                        <Box>
                          <Typography variant="caption" color="secondary">
                            {/*  @ts-ignore */}
                            Created On: {moment(item.reservationDate).format('YYYY-MM-DD MM-HH')}
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

                      {/*  @ts-ignore */}
                      {item.reservationStatus === 'RESERVED' ? (
                        <Chip color="success" label="RESERVED" size="small" variant="light" />
                      ) : /*  @ts-ignore */
                      item.reservationStatus === 'PENDING' ? (
                        <Chip color="info" label="PENDING" size="small" variant="light" />
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
            ))}
          </Grid>
        </CardContent>
      </MainCard>
    </>
  );
};

export default MyScheduleReservations;
