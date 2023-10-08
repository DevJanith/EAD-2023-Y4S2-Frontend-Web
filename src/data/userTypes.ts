export interface UserTypesType {
    id: number
    code: string
    description: string
}

// ==============================|| DATA - USER TYPES ||============================== //

const userTypes: readonly UserTypesType[] = [
    { id: 0, code: "Admin", description: "Admin" },
    { id: 1, code: "BackOffice", description: "BackOffice" },
    { id: 2, code: "TravelAgent", description: "TravelAgent" },
    { id: 3, code: "User", description: "User" }, 
];

export default userTypes;
