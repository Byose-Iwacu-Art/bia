"use client";
import axios from "axios";
import { useEffect, useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    phone: "",
    message: ""
});
const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
});
const [responseMessage, setResponseMessage] = useState("");
const [isSuccess, setIsSuccess] = useState(false);
const [isFormValid, setIsFormValid] = useState(false);
const [isSubmitting, setIsSubmitting] = useState(false);

// Form validation
useEffect(() => {
    const isValid =
        formData.name.length >= 3 &&
        formData.message.length >= 10 &&
        /^[0-9]{10}$/.test(formData.phone) &&
        /\S+@\S+\.\S+/.test(formData.email)
    setIsFormValid(isValid);
}, [formData]);

// Handle form input changes
const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Input validation
    switch (name) {
        case "name":
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
        case "message":
          setErrors({
            ...errors,
                message: value.length < 10 ? `${name} must be at least 10 characters.` : "",
          })
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
        const res = await axios.post("/api/contact", formData);
        setIsSuccess(true);
        setResponseMessage("Sent!");
        
    } catch (error: any) {
        setIsSuccess(false);
        setResponseMessage("Failed try again!");
    } finally {
        setIsSubmitting(false);
    }
};

  return(
    <>
    <div className="p-7">
      <div className="flex w-full flex-wrap text-center sm:text-left my-4 sm:my-1 sm:flex-nowrap sm:justify-between">
      <div className="flex flex-col w-full sm:w-[40%]">
          <h4 className="text-3xl font-medium text-slate-700 mb-3">Do You Have Something To Share?</h4>
          <p className="py-3 text-slate-700">
            BIA The African Touch Team is glad to hear from, if you have anything to share for better performance
            and best services now that our team is always there for you 24/7. Feel free to reach to us and ask! 
            
          </p>
        </div>
        <div className="form -full sm:w-[40vw]">
          <form onSubmit={handleSubmit} method="post" className="w-full">
            <div className="field flex w-full my-2">
              <input type="text" name="name" id="name" placeholder="Name" onChange={handleChange} className="py-2 px-2 border-l border-b border-slate-600 text-sm outline-none w-full bg-transparent text-slate-950 placeholder:text-black "/>
              <input type="email" name="email" id="email" placeholder="Email" onChange={handleChange} className="py-2 px-2 border-l border-b border-slate-600 text-sm outline-none w-full bg-transparent text-slate-950 placeholder:text-black "/>
            </div>
           
            
            <div className="field w-full my-2">
              <input type="text" name="phone" id="phone" placeholder="Phone number" onChange={handleChange} className="py-2 px-2 border-l border-b border-slate-600 text-sm outline-none w-full bg-transparent text-slate-950 placeholder:text-black "/>
            </div>
            
            <div className="w-full my-2">
              <textarea name="message" id="message" placeholder="Anything from you !"  onChange={handleChange}className="py-2 px-2 border-l border-b border-slate-600 text-sm outline-none w-full bg-transparent text-slate-950 placeholder:text-black resize-none" ></textarea>
            </div> 
            <span className="text-red-500 text-xs">{errors.name+"  "+errors.phone+"  "+errors.email+"  "+errors.message}</span>
            <div className="w-full flex justify-end">
               <button disabled={!isFormValid || isSubmitting}  type="submit" className="py-2 px-4 rounded-md bg-black text-white text-sm">{isSubmitting ? 'Sending ...' : isSuccess ? 'Sent ✅' : 'Submit'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
    </>
  )
}
export default Contact;