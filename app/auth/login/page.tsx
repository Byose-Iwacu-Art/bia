import React from 'react';
import LoginForm from '@/app/comps/forms/loginForm';

const Login: React.FC = () => {
  return (
    <>
      <head>
        <title>Login - Bia The African Touch</title>
      </head>
      {/** login form */}
     <div className='flex w-full h-screen justify-between bg-slate-200'>
      <LoginForm />
     </div>
      
     
    </>
  );
};

export default Login;
