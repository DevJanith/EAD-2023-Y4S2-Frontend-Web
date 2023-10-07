export interface StatusesType {
    id: number
    code: string
    description: string
}

// ==============================|| DATA - STATUSES ||============================== //

const statuses: readonly StatusesType[] = [
    { id: 0, code: "Default", description: "Default" },
    { id: 1, code: "New", description: "New" },
    { id: 2, code: "Approved", description: "Approved" },
    { id: 3, code: "Deleted", description: "Deleted" }, 
];

export default statuses;
