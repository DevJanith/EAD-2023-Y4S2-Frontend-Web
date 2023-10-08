export interface SalutationsType {
    id: number
    code: string
    description: string
}

// ==============================|| DATA - SALUTATIONS ||============================== //

const salutations: readonly SalutationsType[] = [
    { id: 0, code: "Mr.", description: "Mr." },
    { id: 1, code: "Mrs.", description: "Mrs." },
    { id: 2, code: "Miss.", description: "Miss." },
    { id: 3, code: "Dr.", description: "Dr." },
    { id: 4, code: "Prof.", description: "Prof." },
    { id: 5, code: "Rev.", description: "Rev." },
    { id: 6, code: "Other.", description: "Other." },
];

export default salutations;
