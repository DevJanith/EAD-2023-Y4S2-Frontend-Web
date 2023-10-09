import { Column } from 'react-table';
import { Train, Trains } from 'types/train';

export interface dataProps extends Trains { }

export interface ReactTableProps {
    columns: Column[]
    data: dataProps[]
    handleAddEdit: () => void
}

export interface trainProps extends Train { }