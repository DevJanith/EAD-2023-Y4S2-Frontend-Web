import { MouseEvent, useEffect, useMemo, useState } from 'react';

// material-ui
import {
    Button,
    Dialog,
    IconButton,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Tooltip,
    useTheme,
} from '@mui/material';

// third-party
import { Cell, Column, HeaderGroup, Row, useFilters, useGlobalFilter, usePagination, useTable } from 'react-table';

// project import
import { PopupTransition } from 'components/@extended/Transitions';
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import { CSVExport, EmptyTable, TablePagination } from 'components/third-party/ReactTable';

import {
    DefaultColumnFilter,
    GlobalFilter,
    renderFilterTypes
} from 'utils/react-table';

// assets
import { DeleteTwoTone, EditTwoTone, EyeTwoTone, PlusOutlined } from '@ant-design/icons';

//types 
import { Typography } from '@mui/material';
import Dot from 'components/@extended/Dot';
import salutations from 'data/salutations';
import statuses from 'data/statuses';
import userTypes from 'data/userTypes';
import AddEditEmployee from 'sections/hr/employee-management/AddEditEmployee';
import AlertEmployeeDelete from 'sections/hr/employee-management/AlertEmployeeDelete';
import { useDispatch, useSelector } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';
import { fetchUsers, toInitialState } from 'store/reducers/user';
import { ColorProps } from 'types/extended';
import { queryParamsProps } from 'types/user';
import { ReactTableProps, dataProps, userProps } from './types/types';

// ==============================|| REACT TABLE ||============================== //

function ReactTable({ columns, data, handleAddEdit }: ReactTableProps) {
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
                    <Button variant="contained" startIcon={<PlusOutlined />} onClick={handleAddEdit}>
                        Add New Employee
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

// ==============================|| User TABLE - STATUS ||============================== //

interface Props {
    status: "Default" | "New" | "Approved" | "Deleted" | "Active" | "In-Active" | string
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

// ==============================|| List ||============================== //

const List = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const { users, error, success, isLoading } = useSelector(state => state.user);

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
                    Header: 'Employee Name',
                    accessor: 'firstName',
                    Cell: ({ row }: { row: Row }) => {
                        //@ts-ignore
                        const data: dataProps = row.original

                        if (data.firstName === undefined || data.firstName === null || data.firstName === '') {
                            return <>-</>
                        }
                        if (typeof data.firstName === 'string') {
                            return <> {salutations.find(salutation => salutation.id == data.salutation)?.description}{data.firstName} {data.lastName}</>;
                        }
                        if (typeof data.firstName === 'number') {
                            return <>{data.firstName}</>;
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
                    Header: 'Email',
                    accessor: 'email'
                },
                {
                    Header: 'Contact Number',
                    accessor: 'contactNumber'
                },
                {
                    Header: 'User Type',
                    accessor: 'userType',
                    Cell: ({ row }: { row: Row }) => {
                        if (row.values.userType === undefined || row.values.userType === null || row.values.userType === '') {
                            return <>-</>
                        }
                        if (typeof row.values.userType === 'string') {
                            return <> {userTypes.find(userType => userType.id == row.values.userType)?.description} </>;
                        }
                        if (typeof row.values.userType === 'number') {
                            return <> {userTypes.find(userType => userType.id == row.values.userType)?.description} </>;
                        }
                        // Handle any other data types if necessary
                        return <>-</>;
                    }
                },
                {
                    Header: 'Status',
                    accessor: 'status',
                    Cell: ({ row }: { row: Row }) => {
                        if (row.values.status === undefined || row.values.status === null || row.values.status === '') {
                            return <>-</>
                        }
                        if (typeof row.values.status === 'string') {
                            return <><UserStatus status={statuses.find(status => status.id == row.values.status)?.description!} />  </>;
                        }
                        if (typeof row.values.status === 'number') {
                            return <><UserStatus status={statuses.find(status => status.id == row.values.status)?.description!} />  </>;
                        }
                        // Handle any other data types if necessary
                        return <>-</>;
                    }
                },
                {
                    Header: 'Is Active',
                    accessor: 'isActive',
                    Cell: ({ row }: { row: Row }) => {
                        if (row.values.isActive === undefined || row.values.isActive === null || row.values.isActive === '') {
                            return <>-</>
                        }
                        if (typeof row.values.isActive === 'string') {
                            return <><UserStatus status={row.values.isActive ? "Active" : "In-Active"} />  </>;
                        }
                        if (typeof row.values.isActive === 'boolean') {
                            return <><UserStatus status={row.values.isActive ? "Active" : "In-Active"} />  </>;
                        }
                        if (typeof row.values.isActive === 'number') {
                            return <>{row.values.isActive}</>;
                        }
                        // Handle any other data types if necessary
                        return <>-</>;
                    }
                },
                // {
                //     Header: 'Created By | On',
                //     accessor: 'createdOn',
                //     Cell: ({ row }: { row: Row }) => {
                //         //@ts-ignore
                //         const data: dataProps = row.original

                //         if (row.values.createdOn === undefined || row.values.createdOn === null || row.values.createdOn === '') {
                //             return <>-</>
                //         }
                //         if (typeof row.values.createdOn === 'string') {
                //             return <> {data.createdBy} | {row.values.createdOn}  </>;
                //         }
                //         if (typeof row.values.createdOn === 'number') {
                //             return <>{row.values.createdOn}</>;
                //         }
                //         // Handle any other data types if necessary
                //         return <>-</>;
                //     }
                // },
                // {
                //     Header: 'Updated By | On',
                //     accessor: 'updatedOn',
                //     Cell: ({ row }: { row: Row }) => {
                //         //@ts-ignore
                //         const data: dataProps = row.original

                //         if (row.values.updatedOn === undefined || row.values.updatedOn === null || row.values.updatedOn === '') {
                //             return <>-</>
                //         }
                //         if (typeof row.values.updatedOn === 'string') {
                //             return <> {data.updatedBy} | {row.values.updatedOn}  </>;
                //         }
                //         if (typeof row.values.updatedOn === 'number') {
                //             return <>{row.values.updatedOn}</>;
                //         }
                //         // Handle any other data types if necessary
                //         return <>-</>;
                //     }
                // },
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
                                    <Tooltip title="View">
                                        <IconButton
                                            color="secondary"
                                            onClick={(e: MouseEvent<HTMLButtonElement>) => {
                                                e.stopPropagation();
                                            }}
                                        >
                                            <EyeTwoTone twoToneColor={theme.palette.secondary.main} />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Edit">
                                        <IconButton
                                            color="primary"
                                            onClick={(e: MouseEvent<HTMLButtonElement>) => {
                                                e.stopPropagation();
                                                handleAddEdit()
                                                setEmployee(({
                                                    id: data.id,
                                                    salutation: data.salutation,
                                                    firstName: data.firstName,
                                                    lastName: data.lastName,
                                                    contactNumber: data.contactNumber,
                                                    email: data.email,
                                                    nic: data.nic,
                                                    userType: data.userType,
                                                    status: data.status,
                                                    isActive: data.isActive,
                                                }))
                                            }}
                                        >
                                            <EditTwoTone twoToneColor={theme.palette.primary.main} />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Delete">
                                        <IconButton
                                            color="error"
                                            onClick={(e: MouseEvent<HTMLButtonElement>) => {
                                                e.stopPropagation();
                                                setEmployeeId(data.id)
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

    //dialog model 
    const [addEdit, setAddEdit] = useState<boolean>(false);
    const [employee, setEmployee] = useState<userProps>();

    const handleAddEdit = () => {
        setAddEdit(!addEdit);
        if (employee && !addEdit) setEmployee(undefined);
    };

    //alert model
    const [openAlert, setOpenAlert] = useState(false);
    const [employeeId, setEmployeeId] = useState<string | undefined>()

    const handleAlertClose = () => {
        setOpenAlert(!openAlert);
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
            userTypes: "0,1"
        };
        dispatch(fetchUsers(queryParams));
    }, [dispatch, success]);

    useEffect(() => {
        setData(users?.users || [])
    }, [users])

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
                    <ReactTable columns={columns} data={data || []} handleAddEdit={handleAddEdit} />
                </ScrollX>
                {/* add / edit user dialog */}
                <Dialog
                    maxWidth="sm"
                    TransitionComponent={PopupTransition}
                    keepMounted
                    fullWidth
                    onClose={handleAddEdit}
                    open={addEdit}
                    sx={{ '& .MuiDialog-paper': { p: 0 }, transition: 'transform 225ms' }}
                    aria-describedby="alert-dialog-slide-description"
                >
                    <AddEditEmployee employee={employee} onCancel={handleAddEdit} />
                </Dialog>
                {/* alert model */}
                {employeeId && <AlertEmployeeDelete title={""} open={openAlert} handleClose={handleAlertClose} deleteId={employeeId} />}
            </MainCard>
        </>
    );
}

export default List;