import SignupForm from "@/app/comps/forms/signUpFrom";
const Register = ()=>{
    return(
        <>
        <head>
            <title>Register - Bia The African Touch</title>
        </head>
        <div className='flex w-full sm:h-screen bg-slate-200'>
         <SignupForm />
        </div>
    </>
);
};


export default Register;