import PersonalDetails from "@/app/comps/dash/profile/personalDetails";
import ProfileBar from "@/app/comps/dash/profile/profileBar";

const Profile = () => {
    return(
        <div className="sm:ml-[200px] mt-[85px] bg-slate-50 flex">
            <head>
                <title>Personal informations</title>
            </head>
            <div className="flex flex-col sm:flex-row">
            <ProfileBar />
            <PersonalDetails />
            </div>
        </div>
    );
}
export default Profile;