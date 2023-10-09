// Train Types

export type Train = {
    id?: string;
    trainName?: string;
    trainNumber?: string;
    allocatedDriver?: string;
    allocatedGuard?: string;
    status?: string;
    publishStatus?: string;
    totalSeats?: number
};

export type Trains = {
    id?: string;
    trainName?: string;
    trainNumber?: string;
    allocatedDriver?: string;
    allocatedGuard?: string;
    status?: string;
    publishStatus?: string;
    totalSeats?: number
};


export interface TrainStateProps {
    trains: Trains[];
    train: Train | null;
    error: object | string | null;
    success: object | string | null;
    isLoading: boolean
}

export interface DefaultRootStateProps {
    train: TrainStateProps;
} 