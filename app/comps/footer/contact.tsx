"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import 'bootstrap-icons/font/bootstrap-icons.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const isValid =
      formData.name.length >= 3 &&
      formData.message.length >= 10 &&
      /^[0-9]{10}$/.test(formData.phone) &&
      /\S+@\S+\.\S+/.test(formData.email);
    setIsFormValid(isValid);
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    switch (name) {
      case "name":
        setErrors((prev) => ({
          ...prev,
          name: value.length < 3 ? "Name must be at least 3 characters." : "",
        }));
        break;
      case "phone":
        setErrors((prev) => ({
          ...prev,
          phone: !/^[0-9]{10}$/.test(value) ? "Phone number must be exactly 10 digits." : "",
        }));
        break;
      case "email":
        setErrors((prev) => ({
          ...prev,
          email: !/\S+@\S+\.\S+/.test(value) ? "Enter a valid email address." : "",
        }));
        break;
      case "message":
        setErrors((prev) => ({
          ...prev,
          message: value.length < 10 ? "Message must be at least 10 characters." : "",
        }));
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsSubmitting(true);
    setIsError(false);
    try {
      await axios.post("/api/contact", formData);
      setIsSuccess(true);
    } catch {
      setIsError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = (error: string) =>
    `w-full px-4 py-3 rounded-xl border text-[14px] text-gray-800 placeholder:text-gray-400 outline-none transition-all duration-200 bg-white ${
      error
        ? "border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-100"
        : "border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
    }`;

  const contactInfo = [
    { icon: "bi-telephone-fill", label: "Phone", value: "+250 788 282 252", color: "text-orange-500" },
    { icon: "bi-envelope-fill", label: "Email", value: "info@biafricantouch.com", color: "text-orange-500" },
    { icon: "bi-geo-alt-fill", label: "Location", value: "Kigali, Rwanda", color: "text-orange-500" },
    { icon: "bi-clock-fill", label: "Hours", value: "Mon – Sat, 8am – 6pm", color: "text-orange-500" },
  ];

  return (
    <section className="bg-slate-50 py-16 px-4 sm:px-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-600 text-[13px] font-medium px-4 py-1.5 rounded-full mb-4">
            <i className="bi bi-chat-dots-fill"></i>
            Get in Touch
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3">
            Talk to our team
          </h2>
          <p className="text-gray-500 text-[15px] max-w-xl mx-auto">
            The BIA African Touch team is here for you 24/7. Share your feedback, questions, or ideas — we'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Left: Contact info */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-[16px] font-semibold text-gray-800 mb-5">Contact Information</h3>
              <ul className="space-y-4">
                {contactInfo.map((info) => (
                  <li key={info.label} className="flex items-start gap-3">
                    <div className="w-9 h-9 flex items-center justify-center rounded-full bg-orange-50 flex-shrink-0">
                      <i className={`bi ${info.icon} ${info.color} text-[15px]`}></i>
                    </div>
                    <div>
                      <p className="text-[11px] text-gray-400 uppercase tracking-wide font-medium">{info.label}</p>
                      <p className="text-[14px] text-gray-700 font-medium">{info.value}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-amber-400 rounded-2xl p-6 text-white">
              <i className="bi bi-stars text-2xl mb-3 block"></i>
              <h4 className="font-bold text-[18px] mb-1">Discover BIA</h4>
              <p className="text-white/80 text-[13px] leading-relaxed">
                Explore handcrafted African art, fashion, and more from talented artisans across Rwanda and beyond.
              </p>
              <a
                href="/products"
                className="inline-flex items-center gap-2 mt-4 bg-white text-orange-600 font-semibold text-[13px] px-4 py-2 rounded-full hover:bg-orange-50 transition-colors"
              >
                Browse Products <i className="bi bi-arrow-right"></i>
              </a>
            </div>
          </div>

          {/* Right: Form */}
          <div className="lg:col-span-3">
            {isSuccess ? (
              <div className="h-full min-h-[300px] flex flex-col items-center justify-center bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <i className="bi bi-check-circle-fill text-green-500 text-3xl"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Message sent!</h3>
                <p className="text-gray-500 text-[14px] mb-6">
                  Thanks for reaching out. Our team will get back to you within 24 hours.
                </p>
                <button
                  onClick={() => { setIsSuccess(false); setFormData({ name: "", lastName: "", email: "", phone: "", message: "" }); }}
                  className="text-orange-500 hover:text-orange-600 font-medium text-[14px] underline underline-offset-2 transition-colors"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
                <h3 className="text-[16px] font-semibold text-gray-800 mb-6">Send a message</h3>
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Name row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[12px] font-medium text-gray-600 mb-1.5">
                        First Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        placeholder="e.g. Jean"
                        value={formData.name}
                        onChange={handleChange}
                        className={inputClass(errors.name)}
                      />
                      {errors.name && (
                        <p className="text-red-500 text-[11px] mt-1 flex items-center gap-1">
                          <i className="bi bi-exclamation-circle-fill"></i> {errors.name}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-[12px] font-medium text-gray-600 mb-1.5">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        placeholder="e.g. Habimana"
                        value={formData.lastName}
                        onChange={handleChange}
                        className={inputClass("")}
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-[12px] font-medium text-gray-600 mb-1.5">
                      Email Address <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className={inputClass(errors.email)}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-[11px] mt-1 flex items-center gap-1">
                        <i className="bi bi-exclamation-circle-fill"></i> {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-[12px] font-medium text-gray-600 mb-1.5">
                      Phone Number <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="e.g. 0788282252"
                      value={formData.phone}
                      onChange={handleChange}
                      className={inputClass(errors.phone)}
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-[11px] mt-1 flex items-center gap-1">
                        <i className="bi bi-exclamation-circle-fill"></i> {errors.phone}
                      </p>
                    )}
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-[12px] font-medium text-gray-600 mb-1.5">
                      Message <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      name="message"
                      rows={4}
                      placeholder="Tell us how we can help you..."
                      value={formData.message}
                      onChange={handleChange}
                      className={`${inputClass(errors.message)} resize-none`}
                    />
                    {errors.message && (
                      <p className="text-red-500 text-[11px] mt-1 flex items-center gap-1">
                        <i className="bi bi-exclamation-circle-fill"></i> {errors.message}
                      </p>
                    )}
                  </div>

                  {/* Error banner */}
                  {isError && (
                    <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-[13px] px-4 py-3 rounded-xl">
                      <i className="bi bi-x-circle-fill"></i>
                      Something went wrong. Please try again.
                    </div>
                  )}

                  {/* Submit */}
                  <div className="flex items-center justify-between pt-1">
                    <p className="text-[11px] text-gray-400">
                      <i className="bi bi-lock-fill text-gray-300 mr-1"></i>
                      Your information is safe with us.
                    </p>
                    <button
                      type="submit"
                      disabled={!isFormValid || isSubmitting}
                      className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold px-7 py-3 rounded-full text-[14px] transition-all duration-200"
                    >
                      {isSubmitting ? (
                        <>
                          <i className="bi bi-arrow-repeat animate-spin"></i>
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message
                          <i className="bi bi-send-fill"></i>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
