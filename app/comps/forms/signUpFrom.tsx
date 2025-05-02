"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { redirect, useRouter } from "next/navigation";
import { EmailVerifyModal } from "./verify";

const SignupForm = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        nationality: "",
        password: "",
    });
    const [errors, setErrors] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        nationality: "",
        password: "",
    });
    const [responseMessage, setResponseMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [verify, setVerify] = useState<string | null> (null);

    const router = useRouter();
    // Form validation
    useEffect(() => {
        const isValid =
            formData.firstName.length >= 3 &&
            formData.lastName.length >= 3 &&
            /^[0-9]{10}$/.test(formData.phone) &&
            /\S+@\S+\.\S+/.test(formData.email) &&
            formData.password.length >= 6;

        setIsFormValid(isValid);
    }, [formData]);

    // Handle form input changes
    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Input validation
        switch (name) {
            case "firstName":
            case "lastName":
                setErrors({
                    ...errors,
                    [name]: value.length < 3 ? `${name} must be at least 3 characters.` : "",
                });
                break;
            case "phone":
                setErrors({
                    ...errors,
                    phone: !/^[0-9]{10}$/.test(value) ? "Phone number must be 10 digits." : "",
                });
                break;
            case "email":
                setErrors({
                    ...errors,
                    email: !/\S+@\S+\.\S+/.test(value) ? "Enter a valid email address." : "",
                });
                break;
            case "password":
                setErrors({
                    ...errors,
                    password: value.length < 6 ? "Password must be at least 6 characters long." : "",
                });
                break;
            default:
                break;
        }
    };

    // Handle form submission
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (!isFormValid) return;

        setIsSubmitting(true);
        try {
            const res = await axios.post("/api/auth/register", formData);
            setIsSuccess(true);
            setResponseMessage(res.data.message || "Registered successfully!");
            setVerify(formData.email);
        } catch (error: any) {
            setIsSuccess(false);
            setResponseMessage(error.response?.data.message || "Registration failed due to server error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <div className="authbg hidden sm:flex w-[45%] h-full justify-center items-center">
                <div className="flex items-center flex-col-reverse w-full h-full">
                    <div className="w-full h-full backdrop-blur-sm">
                        <img src="/icons/e3.png" alt="" className="w-full h-full object-cover rounded-md"/>
                    </div>
                    <span className="text-5xl font-bold text-orange-300 mb-16 leading-normal absolute backdrop-blur-sm">
                        byose iwacu art
                    </span>
                </div>
            </div>

            <div className="flex items-center w-full sm:w-[50%] h-full sm:h-screen mx-10 py-5">
                <div className="w-full h-full">
                    <h1 className="text-3xl font-semibold py-2">Create account</h1>
                    <p className="text-sm text-slate-500 mb-4">Access the most Made In Rwanda Products</p>
                    
                    <form onSubmit={handleSubmit} className="my-2 space-y-3" autoComplete="off">
                        {responseMessage && (
                            <div className={`text-sm px-5 py-3 my-1 rounded-md ${isSuccess ? 'text-green-500 bg-green-100' : 'text-red-500 bg-red-100'}`}>{responseMessage}</div>
                        )}
                        
                        <div className="flex flex-col  sm:flex-row w-full sm:justify-between">
                            <div className="flex flex-col w-full sm:w-[50%] sm:mr-1">
                                <label className="text-sm font-semibold" htmlFor="firstName">First name</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    placeholder="Enter your first name"
                                    className="px-5 py-3 outline-none border-slate-300 text-sm border rounded-3xl my-1"
                                    onChange={handleChange}
                                    required
                                />
                                <span className="text-red-500 text-sm">{errors.firstName}</span>
                            </div>

                            <div className="flex flex-col w-full sm:w-[50%]">
                                <label className="text-sm font-semibold" htmlFor="lastName">Last name</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    placeholder="Enter your last name"
                                    className="px-5 py-3 outline-none border-slate-300 text-sm border rounded-3xl my-1"
                                    onChange={handleChange}
                                    required
                                />
                                <span className="text-red-500 text-sm">{errors.lastName}</span>
                            </div>
                        </div>

                        <div className="flex flex-col w-full">
                            <label className="text-sm font-semibold" htmlFor="email">Email</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                className="px-5 py-3 outline-none border-slate-300 text-sm border rounded-3xl my-1"
                                onChange={handleChange}
                                required
                            />
                            <span className="text-red-500 text-sm">{errors.email}</span>
                        </div>

                        <div className="flex  flex-col sm:flex-row w-full sm:justify-between">
                            <div className="flex flex-col w-full sm:w-[50%] sm:mr-1">
                                <label className="text-sm font-semibold" htmlFor="phone">Phone number</label>
                                <input
                                    type="text"
                                    name="phone"
                                    placeholder="Enter your phone"
                                    className="px-5 py-3 outline-none border-slate-300 text-sm border rounded-3xl my-1"
                                    onChange={handleChange}
                                    required
                                />
                                <span className="text-red-500 text-sm">{errors.phone}</span>
                            </div>

                            <div className="flex flex-col w-full sm:w-[50%] sm:mr-1">
                                <label className="text-sm font-semibold" htmlFor="nationality">Nationality</label>
                                <input
                                    type="text"
                                    name="nationality"
                                    placeholder="Enter your nationality"
                                    className="px-5 py-3 outline-none border-slate-300 text-sm border rounded-3xl my-1"
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex flex-col w-full">
                            <label className="text-sm font-semibold" htmlFor="password">Password</label>
                            <input
                                type="password"
                                name="password"
                                placeholder="Enter your password"
                                className="px-5 py-3 outline-none border-slate-300 text-sm border rounded-3xl my-1"
                                onChange={handleChange}
                                required
                            />
                            <span className="text-red-500 text-sm">{errors.password}</span>
                        </div>

                        <div className="flex flex-col w-full mt-4">
                            <button
                                type="submit"
                                className={`flex items-center justify-center font-bold text-sm py-3 rounded-3xl border w-full my-2 text-white ${
                                    !isFormValid ? "bg-slate-400 cursor-no-drop" : "bg-orange-400"
                                }`}
                                disabled={!isFormValid || isSubmitting}
                            >
                                {isSubmitting ? 'Registering...' : <> Submit <i className="bi bi-arrow-right ml-2"></i></>}
                            </button>
                        </div>

                        <p className="text-sm mt-3 text-center">
                            Already have an account? 
                            <a href="login" className="text-orange-400 ml-2 font-bold">Sign in</a>
                        </p>
                    </form>
                </div>
            </div>
            {verify && (<EmailVerifyModal onClose={() => setVerify(null)} event="account" emailOpt={verify} />)}
        </>
    );
};

export default SignupForm;
