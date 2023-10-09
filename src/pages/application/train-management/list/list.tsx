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
import { DeleteTwoTone, EditTwoTone, PlusOutlined } from '@ant-design/icons';

//types
import AddEditTrain from 'sections/application/train-management/AddEditTrain';
import AlertTrainDelete from 'sections/application/train-management/AlertTrainDelete';
import { useDispatch, useSelector } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';
import { fetchTrains, toInitialState } from 'store/reducers/train';
import { ReactTableProps, dataProps, trainProps } from './types/types';

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
                        Add New Train
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

// ==============================|| List ||============================== //

const List = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const { trains, error, success, isLoading } = useSelector(state => state.train);

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
                    Header: 'Train Name',
                    accessor: 'trainName',
                },
                {
                    Header: 'Train Number',
                    accessor: 'trainNumber',
                },
                {
                    Header: 'Train Allocated Driver',
                    accessor: 'allocatedDriver',
                },
                {
                    Header: 'Train Allocated Guard',
                    accessor: 'allocatedGuard',
                },
                {
                    Header: 'Train Status',
                    accessor: 'status',
                },
                {
                    Header: 'Train Publish Status',
                    accessor: 'publishStatus',
                }, {
                    Header: 'Train Total Seats',
                    accessor: 'totalSeats',
                },

                {
                    id: "actions",
                    Header: 'Actions',
                    accessor: 'actions',
                    className: 'cell-center',
                    Cell: ({ row }: { row: Row }) => {
                        return (
                            <>
                                <Stack direction="row" alignItems="center" justifyContent="center" spacing={0}>
                                    {/* <Tooltip title="View">
                                        <IconButton
                                            color="secondary"
                                            onClick={(e: MouseEvent<HTMLButtonElement>) => {
                                                e.stopPropagation();
                                            }}
                                        >
                                            <EyeTwoTone twoToneColor={theme.palette.secondary.main} />
                                        </IconButton>
                                    </Tooltip> */}
                                    <Tooltip title="Edit">
                                        <IconButton
                                            color="primary"
                                            onClick={(e: MouseEvent<HTMLButtonElement>) => {
                                                handleAddEdit()
                                                setTrain({
                                                    id: row.values.id,
                                                    trainName: row.values.trainName,
                                                    trainNumber: row.values.trainNumber,
                                                    allocatedDriver: row.values.allocatedDriver,
                                                    allocatedGuard: row.values.allocatedGuard,
                                                    status: row.values.status,
                                                    publishStatus: row.values.publishStatus,
                                                    totalSeats: row.values.totalSeats,
                                                })
                                                e.stopPropagation();
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
                                                setTrainId(row.values.id)
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
    const [train, setTrain] = useState<trainProps>();

    const handleAddEdit = () => {
        setAddEdit(!addEdit);
        if (train && !addEdit) setTrain(undefined);
    };

    //alert model
    const [openAlert, setOpenAlert] = useState(false);
    const [trainId, setTrainId] = useState<string>()

    const handleAlertClose = () => {
        setOpenAlert(!openAlert);
    };

    /**
     * API Config 
     * Train API
     */
    useEffect(() => {
        dispatch(fetchTrains());
    }, [dispatch, success]);

    useEffect(() => {
        setData(trains);
    }, [trains])

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
                    <ReactTable columns={columns} data={data} handleAddEdit={handleAddEdit} />
                </ScrollX>
                {/* add / edit train dialog */}
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
                    <AddEditTrain train={train} onCancel={handleAddEdit} />
                </Dialog>
                {/* alert model */}
                {trainId && <AlertTrainDelete title={""} open={openAlert} handleClose={handleAlertClose} deleteId={trainId!} />}
            </MainCard>
        </>
    );
}

export default List;
