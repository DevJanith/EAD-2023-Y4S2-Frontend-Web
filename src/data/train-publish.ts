export interface TrainPublishType {
    id: number
    code: string
    description: string
}

// ==============================|| DATA - TRAIN_PUBLISHED ||============================== //

const trainPublish: readonly TrainPublishType[] = [
    { id: 0, code: "PUBLISHED", description: "PUBLISHED" },
    { id: 1, code: "UN-PUBLISHED", description: "UN-PUBLISHED" }
];

export default trainPublish;
