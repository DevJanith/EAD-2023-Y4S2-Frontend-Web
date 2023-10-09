import { User } from "types/user";
import ProfileUpdate from "./profile-update";
import ProfileView from "./profile-view";

// ==============================|| Profile ||============================== // 
export interface Props {
    profile?: User;
    onCancel: () => void;
    profileStatus: "view" | "update"
}

const Profile = ({ profile, onCancel, profileStatus }: Props) => {
    return (
        <>
            {profileStatus == "view" && <ProfileView onCancel={onCancel} />}
            {profileStatus == "update" && <ProfileUpdate onCancel={onCancel} />}
        </>
    );
};

export default Profile;
