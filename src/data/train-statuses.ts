export interface TrainStatusType {
    id: number
    code: string
    description: string
}

// ==============================|| DATA - TRAIN_STATUSES ||============================== //

const trainStatuses: readonly TrainStatusType[] = [
    { id: 0, code: "ACTIVE", description: "ACTIVE" },
    { id: 1, code: "IN-ACTIVE", description: "IN-ACTIVE" }
];

export default trainStatuses;
