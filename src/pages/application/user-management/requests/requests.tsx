import { MouseEvent, useEffect, useMemo, useState } from 'react';

// material-ui
import {
    IconButton,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Tooltip,
    Typography,
    useTheme
} from '@mui/material';

// third-party
import { Cell, Column, HeaderGroup, Row, useFilters, useGlobalFilter, usePagination, useTable } from 'react-table';

// project import
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import { CSVExport, EmptyTable, TablePagination } from 'components/third-party/ReactTable';

import {
    DefaultColumnFilter,
    GlobalFilter,
    renderFilterTypes
} from 'utils/react-table';

// assets
import { CheckCircleOutlined, DeleteTwoTone, ExclamationCircleOutlined } from '@ant-design/icons';

//types 
import Dot from 'components/@extended/Dot';
import AlertUserRequestApprove from 'sections/application/user-management/AlertUserRequestApprove';
import AlertUserRequestDelete from 'sections/application/user-management/AlertUserRequestDelete';
import AlertUserRequestReject from 'sections/application/user-management/AlertUserRequestReject';
import { useDispatch, useSelector } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';
import { fetchUserRequests, toInitialState } from 'store/reducers/user-request';
import { ColorProps } from 'types/extended';
import { queryParamsProps } from 'types/user';
import { UserRequest } from 'types/user-request';
import { ReactTableProps, dataProps } from './types/types';

// ==============================|| REACT TABLE ||============================== //

function ReactTable({ columns, data }: ReactTableProps) {
    const filterTypes = useMemo(() => renderFilterTypes, []);
    const defaultColumn = useMemo(() => ({ Filter: DefaultColumnFilter }), []);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        preGlobalFilteredRows,
        setGlobalFilter,
        globalFilter,
        page,
        gotoPage,
        setPageSize,
        state: { pageIndex, pageSize }
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
                    {/* <Button variant="contained" startIcon={<PlusOutlined />} onClick={handleAddEdit}>
                        Add New User
                    </Button> */}
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
                        <EmptyTable msg="No Data" colSpan={5} />
                    )}
                    <TableRow>
                        <TableCell sx={{ p: 2 }} colSpan={5}>
                            <TablePagination gotoPage={gotoPage} rows={rows} setPageSize={setPageSize} pageIndex={pageIndex} pageSize={pageSize} />
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </>
    );
}
// ==============================|| User TABLE - STATUS ||============================== //

interface Props {
    status: "Default" | "New" | "Approved" | "Deleted" | "Active" | "In-Active" | "PENDING" | "APPROVED" | "REJECTED" | string
}

const UserStatus = ({ status }: Props) => {
    let color: ColorProps;
    let title: string;

    switch (status) {
        case 'Default':
            color = 'primary';
            title = 'Default';
            break;
        case 'New':
            color = 'warning';
            title = 'New';
            break;
        case 'Approved':
            color = 'success';
            title = 'Approved';
            break;
        case 'Deleted':
            color = 'error';
            title = 'Deleted';
            break;
        case 'Active':
            color = 'success';
            title = 'Active';
            break;
        case "In-Active":
            color = 'error';
            title = 'In-Active';
            break;
        case 'PENDING':
            color = 'warning';
            title = 'PENDING';
            break;
        case 'APPROVED':
            color = 'success';
            title = 'APPROVED';
            break;
        case 'REJECTED':
            color = 'error';
            title = 'REJECTED';
            break;
        default:
            color = 'primary';
            title = '-';
    }

    return (
        <Stack direction="row" spacing={1} alignItems="center">
            <Dot color={color} />
            <Typography>{title}</Typography>
        </Stack>
    );
};

// ==============================|| Requests ||============================== //

const Requests = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const { userRequests, error, success, isLoading } = useSelector(state => state.userRequest);

    // table
    const [data, setData] = useState<dataProps[]>([])

    const columns = useMemo(
        () =>
            [
                {
                    Header: '#',
                    accessor: 'id',
                    className: 'cell-center',
                    Cell: ({ row }: { row: Row }) => {
                        if (row.id === undefined || row.id === null || row.id === '') {
                            return <>-</>
                        }
                        if (typeof row.id === 'string') {
                            return <>{(parseInt(row.id) + 1).toString()}</>;
                        }
                        if (typeof row.id === 'number') {
                            return <>{row.id + 1}</>;
                        }
                        // Handle any other data types if necessary
                        return <>-</>;
                    }
                },
                {
                    Header: 'NIC',
                    accessor: 'nic'
                },
                {
                    Header: 'Remark',
                    accessor: 'remark'
                },
                {
                    Header: 'Status',
                    accessor: 'status',
                    Cell: ({ row }: { row: Row }) => {
                        if (row.values.status === undefined || row.values.status === null || row.values.status === '') {
                            return <>-</>
                        }
                        if (typeof row.values.status === 'string') {
                            return <><UserStatus status={row.values.status} />  </>;
                        }
                        // Handle any other data types if necessary
                        return <>-</>;
                    }
                },
                {
                    id: "actions",
                    Header: 'Actions',
                    accessor: 'actions',
                    className: 'cell-center',
                    Cell: ({ row }: { row: Row }) => {
                        //@ts-ignore
                        const data: dataProps = row.original;

                        return (
                            <>
                                <Stack direction="row" alignItems="center" justifyContent="center" spacing={0}>
                                    <Tooltip title="Approve">
                                        <IconButton
                                            color="success"
                                            onClick={(e: MouseEvent<HTMLButtonElement>) => {
                                                e.stopPropagation();
                                                setUserRequest(data)
                                                setOpenAlertApprove(true)
                                            }}
                                        >
                                            <CheckCircleOutlined twoToneColor={theme.palette.success.main} />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Reject">
                                        <IconButton
                                            color="warning"
                                            onClick={(e: MouseEvent<HTMLButtonElement>) => {
                                                e.stopPropagation();
                                                setUserRequest(data)
                                                setOpenAlertReject(true)
                                            }}
                                        >
                                            <ExclamationCircleOutlined twoToneColor={theme.palette.warning.main} />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Delete">
                                        <IconButton
                                            color="error"
                                            onClick={(e: MouseEvent<HTMLButtonElement>) => {
                                                e.stopPropagation();
                                                setUserRequestId(data.id)
                                                setOpenAlert(true)
                                            }}
                                        >
                                            <DeleteTwoTone twoToneColor={theme.palette.error.main} />
                                        </IconButton>
                                    </Tooltip>
                                </Stack>
                            </>
                        )
                    }
                }
            ] as Column[],
        []
    );

    //alert model
    const [openAlert, setOpenAlert] = useState(false);
    const [openAlertApprove, setOpenAlertApprove] = useState(false);
    const [openAlertReject, setOpenAlertReject] = useState(false);
    const [userRequestId, setUserRequestId] = useState<string | undefined>()
    const [userRequest, setUserRequest] = useState<UserRequest | undefined>()

    const handleAlertClose = () => {
        setOpenAlert(!openAlert);
    };

    const handleAlertCloseApprove = () => {
        setOpenAlertApprove(!openAlertApprove);
    };

    const handleAlertCloseReject = () => {
        setOpenAlertReject(!openAlertReject);
    };

    /**
    * API Config 
    * User API
    */
    useEffect(() => {
        const queryParams: queryParamsProps = {
            page: 1,
            perPage: 1000,
            direction: "desc",
        };
        dispatch(fetchUserRequests(queryParams));
    }, [dispatch, success]);

    useEffect(() => {
        setData(userRequests?.userRequests || [])
    }, [userRequests])

    //  handel error 
    useEffect(() => {
        if (error != null) {
            dispatch(
                openSnackbar({
                    open: true,
                    //@ts-ignore
                    message: error ? error.Message : "Something went wrong ...",
                    variant: 'alert',
                    alert: {
                        color: 'error'
                    },
                    close: true
                })
            );
            dispatch(toInitialState())
        }
    }, [error])

    //  handel success
    useEffect(() => {
        if (success != null) {
            dispatch(
                openSnackbar({
                    open: true,
                    message: success,
                    variant: 'alert',
                    alert: {
                        color: 'success'
                    },
                    close: true
                })
            );
            dispatch(toInitialState())
        }
    }, [success])

    if (isLoading) {
        return <div>Loading...</div>;
    }
    return (
        <>
            <MainCard content={false}>
                <ScrollX>
                    <ReactTable columns={columns} data={data || []} />
                </ScrollX>
                {/* alert model */}
                {userRequest && <AlertUserRequestApprove title={""} open={openAlertApprove} handleClose={handleAlertCloseApprove} userRequest={userRequest} />}
                {userRequest && <AlertUserRequestReject title={""} open={openAlertReject} handleClose={handleAlertCloseReject} userRequest={userRequest} />}
                {userRequestId && <AlertUserRequestDelete title={""} open={openAlert} handleClose={handleAlertClose} deleteId={userRequestId} />}
            </MainCard>
        </>
    );
}

export default Requests;