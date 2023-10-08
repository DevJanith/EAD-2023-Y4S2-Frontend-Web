// material-ui
import { Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// project imports

// assets
import {
    CarOutlined,
    FileSearchOutlined,
    ScheduleOutlined,
    UserAddOutlined,
    UserOutlined,
} from '@ant-design/icons';
import EcommerceMetrix from 'components/cards/statistics/EcommerceMetrix';

// types

// ==============================|| Dashboard ||============================== //

const Dashboard = () => {
    const theme = useTheme();

    return (
        <>
            <Grid container spacing={3}>
                <Grid item xs={12} lg={4} sm={12}>
                    <EcommerceMetrix
                        primary="Total Users"
                        secondary="100"
                        content="Users & Traveler Agent Total"
                        color={theme.palette.success.main}
                        iconPrimary={UserOutlined}
                    />
                </Grid>
                <Grid item xs={12} lg={4} sm={12}>
                    <EcommerceMetrix
                        primary="Total Employees"
                        secondary="15"
                        content="Admin & Back Office User Total"
                        color={theme.palette.primary.main}
                        iconPrimary={UserAddOutlined}
                    />
                </Grid>
                <Grid item xs={12} lg={4} sm={12}>
                    <EcommerceMetrix
                        primary="Total Trains"
                        secondary="10"
                        content="Registered trains at system Total"
                        color={theme.palette.warning.main}
                        iconPrimary={CarOutlined}
                    />
                </Grid>
                <Grid item xs={12} lg={4} sm={12}>
                    <EcommerceMetrix
                        primary="Total Scheduled"
                        secondary="1641"
                        content="Train schedules for the year Total"
                        color={theme.palette.error.main}
                        iconPrimary={ScheduleOutlined}
                    />
                </Grid>
                <Grid item xs={12} lg={4} sm={12}>
                    <EcommerceMetrix
                        primary="Total Reservations"
                        secondary="1641"
                        content="Reservations done by the users Total"
                        color={theme.palette.info.main}
                        iconPrimary={FileSearchOutlined}
                    />
                </Grid>
            </Grid>
        </>
    )
};

export default Dashboard;
