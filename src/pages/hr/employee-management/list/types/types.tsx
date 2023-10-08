import { Column } from 'react-table';
import { User, Users } from 'types/user';

export interface dataProps extends Users { }

export interface ReactTableProps {
    columns: Column[]
    data: dataProps[]
    handleAddEdit: () => void
}

export interface userProps extends User { }