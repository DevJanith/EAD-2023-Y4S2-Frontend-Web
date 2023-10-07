// User Type

export type User = {
    id?: string;
    salutation?: number;
    firstName?: string;
    lastName?: string;
    contactNumber?: string;
    email?: string;
    nic?: string;
    userType?: number;
    status?: number;
    isActive?: true;
    password?: string;
    createdOn?: Date;
    updatedOn?: Date;
    createdBy?: string;
    updatedBy?: string;
};

export type Users = {
    id?: string;
    salutation?: number;
    firstName?: string;
    lastName?: string;
    contactNumber?: string;
    email?: string;
    nic?: string;
    userType?: number;
    status?: number;
    isActive?: true;
    password?: string;
    createdOn?: Date;
    updatedOn?: Date;
    createdBy?: string;
    updatedBy?: string;
};

export interface UserStateProps {
    users: Users[];
    user: User | null;
    error: object | string | null;
    success: object | string | null;
    isLoading: boolean
}

export interface DefaultRootStateProps {
    user: UserStateProps;
}

export interface queryParamsProps {
    perPage: number
    page: number
    direction: "asc" | "desc"
    status?: 0 | 1 | 2 | 3
    userType?: 0 | 1 | 2 | 3
    isActive?: boolean
} 