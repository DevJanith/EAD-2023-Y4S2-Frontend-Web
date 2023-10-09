export interface TrainPublishType {
    id: number
    code: string
    description: string
}

// ==============================|| DATA - TRAIN_PUBLISH ||============================== //

const trainPublish: readonly TrainPublishType[] = [
    { id: 0, code: "PUBLISH", description: "PUBLISH" },
    { id: 1, code: "UN-PUBLISH", description: "UN-PUBLISH" }
];

export default trainPublish;
