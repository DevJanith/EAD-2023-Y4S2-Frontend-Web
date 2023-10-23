// User Request Type

export type UserRequest = {
    id?: string;
    nic?: string;
    remark?: string;
    createdOn?: Date;
    updatedOn?: Date;
    createdBy?: string;
    updatedBy?: string;
};

export type UserRequests = {
    id?: string;
    nic?: string;
    remark?: string;
    createdOn?: Date;
    updatedOn?: Date;
    createdBy?: string;
    updatedBy?: string;
};

export type UserRequestList = {
    userRequests: UserRequests[],
    total: number
}

export interface UserRequestStateProps {
    userRequests: UserRequestList | null;
    userRequest: UserRequest | null;
    error: object | string | null;
    success: object | string | null;
    isLoading: boolean
}

export interface DefaultRootStateProps {
    userRequest: UserRequestStateProps;
}

export interface queryParamsProps {
    perPage: number
    page: number
    direction: "asc" | "desc"
} 