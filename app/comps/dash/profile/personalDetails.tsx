"use client";

import { useEffect, useState } from "react";
import { PasswordChangeModal } from "../../forms/change_password";

const PersonalDetails = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    nationality: "",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [changePassword, setChangePassword] = useState(false);

  const getUserIdFromSession = (): string | null => {
    try {
      const session = JSON.parse(localStorage.getItem("userSession") || "null");
      return session?.id || null;
    } catch {
      return null;
    }
  };

  const [userId] = useState<string | null>(getUserIdFromSession());

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`/api/auth/user/${userId}`);
        if (!response.ok) throw new Error("Failed to fetch user details");
        const data = await response.json();
        setFormData({
          firstName: data.first_name || "",
          lastName: data.last_name || "",
          email: data.email || "",
          phone: data.phone || "",
          nationality: data.nationality || "",
        });
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (userId) fetchUserDetails();
  }, [userId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/auth/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, userId }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error("Failed to update profile.");
      alert(result.message);
    } catch (error: any) {
      console.error(error);
      alert(error.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "w-full py-3 px-4 border border-gray-200 rounded-xl text-[13px] text-gray-700 bg-white outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all placeholder:text-gray-300";

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h2 className="text-[18px] font-bold text-gray-900">Personal Information</h2>
      <p className="text-[12px] text-gray-400 mt-1">Manage your personal details</p>

      {/* Avatar + actions */}
      <div className="flex flex-wrap items-center gap-4 mt-6 pb-6 border-b border-gray-100">
        <div className="w-16 h-16 rounded-full border-2 border-gray-200 overflow-hidden flex-shrink-0">
          <img
            src="/profile_avatar.jpg"
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex gap-2">
          <button
            className="py-2 px-4 bg-gray-100 text-gray-400 text-[12px] font-medium rounded-xl cursor-not-allowed"
            disabled
          >
            <i className="bi bi-trash mr-1.5"></i>Delete
          </button>
          <button
            onClick={() => setChangePassword(true)}
            className="py-2 px-4 bg-gray-50 border border-gray-200 text-gray-600 text-[12px] font-medium rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <i className="bi bi-key mr-1.5"></i>Change Password
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="py-8 space-y-4 animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-3 bg-gray-100 rounded w-24"></div>
                <div className="h-11 bg-gray-100 rounded-xl"></div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="pt-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="text-[12px] font-medium text-gray-500 mb-1.5 block">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                id="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="First name"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="lastName" className="text-[12px] font-medium text-gray-500 mb-1.5 block">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                id="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Last name"
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="email" className="text-[12px] font-medium text-gray-500 mb-1.5 block">
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email address"
                className={`${inputClass} bg-gray-50 text-gray-400 cursor-not-allowed`}
                disabled
              />
            </div>
            <div>
              <label htmlFor="phone" className="text-[12px] font-medium text-gray-500 mb-1.5 block">
                Phone Number
              </label>
              <input
                type="number"
                name="phone"
                id="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Phone number"
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="nationality" className="text-[12px] font-medium text-gray-500 mb-1.5 block">
                Nationality
              </label>
              <input
                type="text"
                name="nationality"
                id="nationality"
                value={formData.nationality}
                onChange={handleInputChange}
                placeholder="Nationality"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="profilePicture" className="text-[12px] font-medium text-gray-500 mb-1.5 block">
                Profile Picture
              </label>
              <input
                type="file"
                name="profilePicture"
                id="profilePicture"
                accept=".jpg,.svg,.png,.gif,.jpeg"
                className={inputClass}
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`py-3 px-6 bg-gray-900 hover:bg-gray-800 text-white text-[13px] font-bold rounded-xl transition-colors ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      )}

      {changePassword && <PasswordChangeModal onClose={() => setChangePassword(false)} />}
    </div>
  );
};

export default PersonalDetails;
