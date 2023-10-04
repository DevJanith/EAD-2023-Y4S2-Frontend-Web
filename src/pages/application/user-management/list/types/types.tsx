import { Column } from 'react-table';

export interface dataProps {
    id?: number | string
    salutation?: string
    firstName?: string
    lastName?: string
    contactNumber?: string
    email?: string
    userType?: "Admin" | "Back-Office" | "Travel-Agent" | "User"
    status?: "Default" | "New" | "Approved" | "Deleted"
    isActive?: boolean
    createdOn?: string
    updatedOn?: string
    createdBy?: string
    updatedBy?: string
}

export interface ReactTableProps {
    columns: Column[]
    data: dataProps[]
    handleAddEdit: () => void
}

export interface userProps {
    id?: number | string
    salutation?: string
    firstName?: string
    lastName?: string
    contactNumber?: string
    email?: string
    userType?: "Admin" | "Back-Office" | "Travel-Agent" | "User"
    status?: "Default" | "New" | "Approved" | "Deleted"
    isActive?: boolean
    createdOn?: string
    updatedOn?: string
    createdBy?: string
    updatedBy?: string
}