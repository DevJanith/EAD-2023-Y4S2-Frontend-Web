import { Column } from 'react-table';
import { UserRequest, UserRequests } from 'types/user-request';

export interface dataProps extends UserRequests { }

export interface ReactTableProps {
    columns: Column[]
    data: dataProps[] 
}

export interface userProps extends UserRequest { }