"use client"; // Make sure this is at the top of the file

import React, { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import AlertNotification from '../nav/notify';
import { EmailVerifyModal } from './verify';

const LoginForm: React.FC = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        userName: "",
        password: ""
    });
    const [responseMessage, setResponseMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const [loading, setLoading] = useState(false); // Add loading state
    const [forgot, setForgot] = useState(false);
    const [verify, setVerify] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        const { userName, password } = formData;

        if (!userName || !password) {
            setResponseMessage("Both fields are required.");
            setIsError(true);
            setIsSuccess(false);
            return;
        }

        setLoading(true); // Start loading
        try {
            const response = await axios.post("/api/auth/login", formData);
            
            // Update localStorage with the new session
            localStorage.setItem('userSession', JSON.stringify({
                id: response.data.user.id,
                name: response.data.user.name,
                email: response.data.user.email,
                session_id: response.data.user.session_id,
            }));

            setResponseMessage(response.data.message || "Login successfully!");
            setIsSuccess(true);
            setIsError(false);
            if(response.data.user.status === "Pending"){
                setVerify(formData.userName);
            } else {
               router.push('/'); 
            }
            
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                setResponseMessage(error.response?.data.message || "Login failed due to server error.");
                setIsError(true);
                setIsSuccess(false);
            } else if (error instanceof Error) {
                setResponseMessage(error.message || "An unknown error occurred.");
                setIsError(true);
                setIsSuccess(false);
            } else {
                setResponseMessage("An unexpected error occurred.");
                setIsError(true);
                setIsSuccess(false);
            }
        } finally {
            setLoading(false); // Stop loading
        }

        // Clear message after a few seconds
        setTimeout(() => {
            setResponseMessage("");
        }, 5000);
    };
    const typ: any = isSuccess ? "success" : "error";
    return (
    <>
        {responseMessage && (<AlertNotification message={responseMessage} type={typ} /> )}
        <div className='flex items-center w-full sm:w-[42%] h-screen px-14 py-5'>
          <div className='w-full'>
            <h1 className='text-3xl font-semibold py-2'>Sign into your account</h1>
            <p className='text-sm text-slate-500 mb-8'>Enter your credintials to view all insights</p>
            <form className='my-2' method='post' onSubmit={handleLogin} autoComplete='off'>
                        {responseMessage && (
                            <div className={`text-sm px-5 py-3 my-1 rounded-md ${isSuccess ? 'text-green-500 bg-green-100' : 'text-red-500 bg-red-100'}`}>{responseMessage}</div>
                        )}
                        
                <div className='flex flex-col w-full'>
                    <label className='text-sm font-semibold' htmlFor="userName">Email address or phone</label>
                    <input type="text" name="userName" id="userName" placeholder='Enter your email or phone number' className='px-5 py-3 outline-none border-slate-300 text-sm border rounded-3xl my-1' onChange={handleChange} required/>
                </div>
                <div className='flex flex-col w-full'>
                    <label className='text-sm font-semibold' htmlFor="password">Password</label>
                    <input type="password" name="password" id="password" placeholder='Enter your password' className='px-5 py-3 outline-none border-slate-300 text-sm border rounded-3xl my-1'onChange={handleChange} required/>
                </div>
                <div className='flex flex-col w-full mt-4'>
                    <button 
                    type="submit"  
                    className='flex items-center justify-center font-bold text-sm py-3 rounded-3xl border w-full my-2 text-white bg-orange-400'
                    disabled={loading}
                    >{loading ? 'Logging in...' : <>Sign in <i className="bi bi-arrow-right ml-2"></i></>}</button>
                </div>
                <div className='flex justify-between text-sm px-3'>
                    <button type='button' className='text-sky-600' onClick={() => setForgot(true)}>Forgot password?</button>
                    <span>Not a member? <Link href="/auth/register" onClick={()=> window.location.assign("/auth/register")} className='text-orange-500 font-bold'>Create account</Link></span>
                </div>
            </form>
          </div>
        </div>
        <div className="authbg hidden sm:flex w-[50%] h-full justify-center items-center ">
          <div className="flex items-center justify-center w-full h-full">
          <div className='w-[200px] h-[200px] absolute'>
                <span className='text-5xl font-bold leading-normal'>biarwanda</span>
                <img src="/imgs/logo.ico" alt="" className='w-full h-full object-cover rounded-md '/>
            </div>
            <div className='w-full h-full'>
                <img src="/icons/e4.jpg" alt="" className="w-full h-full object-cover" />
            </div>
            
            
          </div>
        </div>
        {forgot && (<EmailVerifyModal onClose={() => setForgot(false)} event='forgot' emailOpt=''/>)}
        {verify && (<EmailVerifyModal onClose={() => setVerify(null)} event='account' emailOpt={verify}/>)}     
    </>
    );
};

export default LoginForm;
