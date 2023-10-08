export interface IsActivesTypes {
    id: boolean
    code: string
    description: string
}

// ==============================|| DATA - IS-ACTIVES ||============================== //

const isActives: readonly IsActivesTypes[] = [
    { id: true, code: "Active", description: "Active" },
    { id: false, code: "In-Active", description: "In-Active" },
];

export default isActives;
