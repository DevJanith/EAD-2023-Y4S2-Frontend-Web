import { Column } from 'react-table';

export interface dataProps {
    id: number | string | undefined 
    email: string
}

export interface ReactTableProps {
    columns: Column[]
    data: dataProps[]
    handleAddEdit: () => void
} 

export interface userProps {
    id: number | string | undefined 
    email: string
}