"use client";
import React, { useState, useEffect } from "react";

interface Location {
  country: string;
  province: string;
  district: string;
  sector: string;
  cell: string;
  village: string;
  street1: string;
  street2: string;
}

interface AddLocationProps {
  onClose: () => void;
}

const AddLocation = ({ onClose }: AddLocationProps) => {
  const [newLocation, setNewLocation] = useState<Location>({
    country: "",
    province: "",
    district: "",
    sector: "",
    cell: "",
    village: "",
    street1: "",
    street2: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewLocation({ ...newLocation, [name]: value });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!newLocation.country) newErrors.country = "Country is required";
    if (!newLocation.province) newErrors.province = "Province is required";
    if (!newLocation.district) newErrors.district = "District is required";
    if (!newLocation.sector) newErrors.sector = "Sector is required";
    if (!newLocation.cell) newErrors.cell = "Cell is required";
    if (!newLocation.village) newErrors.village = "Village is required";
    if (!newLocation.street1) newErrors.street1 = "Address line 1 is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setMessage(null);

    // Get user ID from localStorage
    const userSession = JSON.parse(localStorage.getItem('userSession') || '{}');
    const userId = userSession.id;

    if (!userId) {
      setMessage("User is not logged in.");
      setLoading(false);
      return;
    }

    const locationData = { ...newLocation, id: userId };

    try {
      const response = await fetch("/api/auth/address", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(locationData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Error adding location");
      }

      setMessage("Location added successfully ✅");
      setNewLocation({
        country: "",
        province: "",
        district: "",
        sector: "",
        cell: "",
        village: "",
        street1: "",
        street2: "",
      });
    } catch (error:any) {
      console.error("Error adding location:", error);
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed flex justify-center items-center bg-slate-300 w-full h-full top-0 left-0 z-50 backdrop-blur-sm bg-opacity-40">
      <i
        className="bi bi-x absolute right-4 p-1 top-7 text-4xl font-bold cursor-pointer hover:bg-slate-50 hover:border rounded-full"
        onClick={onClose}
      ></i>
      <div className="max-w-2xl w-full rounded-xl px-6 py-3 bg-white border shadow-md">
        <h4 className="text-lg font-semibold text-slate-700 pb-3 pt-1 text-center">
          Add New Location
        </h4>
        {/* Success or Error Message */}
        {message && (
            <div
              className={`my-4 py-2 px-4 rounded-lg${
                message.includes("successfully") ? "bg-green-100 text-green-600" : "bg-red-200 text-red-500"
              }`}
            >
              {message}
            </div>
          )}
        <form className="flex justify-between" onSubmit={handleSubmit}>
          <div className="w-[48%]">
            {/* Country */}
            <div className="flex flex-col">
              <label className="text-sm text-slate-700">Country</label>
              <input
                type="text"
                name="country"
                value={newLocation.country}
                onChange={handleInputChange}
                placeholder="Country"
                className="border py-2 px-4 rounded-lg text-sm outline-none"
              />
              {errors.country && (
                <span className="text-red-500 text-xs">{errors.country}</span>
              )}
            </div>

            {/* Province */}
            <div className="flex flex-col">
              <label className="text-sm text-slate-700">Province / State</label>
              <input
                type="text"
                name="province"
                value={newLocation.province}
                onChange={handleInputChange}
                placeholder="Province or state"
                className="border py-2 px-4 rounded-lg text-sm outline-none"
              />
              {errors.province && (
                <span className="text-red-500 text-xs">{errors.province}</span>
              )}
            </div>

            {/* District */}
            <div className="flex flex-col">
              <label className="text-sm text-slate-700">District</label>
              <input
                type="text"
                name="district"
                value={newLocation.district}
                onChange={handleInputChange}
                placeholder="District"
                className="border py-2 px-4 rounded-lg text-sm outline-none"
              />
              {errors.district && (
                <span className="text-red-500 text-xs">{errors.district}</span>
              )}
            </div>

            {/* Sector */}
            <div className="flex flex-col">
              <label className="text-sm text-slate-700">Sector</label>
              <input
                type="text"
                name="sector"
                value={newLocation.sector}
                onChange={handleInputChange}
                placeholder="Sector"
                className="border py-2 px-4 rounded-lg text-sm outline-none"
              />
              {errors.sector && (
                <span className="text-red-500 text-xs">{errors.sector}</span>
              )}
            </div>
          </div>

          <div className="w-[48%]">
            {/* Cell */}
            <div className="flex flex-col">
              <label className="text-sm text-slate-700">Cell</label>
              <input
                type="text"
                name="cell"
                value={newLocation.cell}
                onChange={handleInputChange}
                placeholder="Cell"
                className="border py-2 px-4 rounded-lg text-sm outline-none"
              />
              {errors.cell && (
                <span className="text-red-500 text-xs">{errors.cell}</span>
              )}
            </div>

            {/* Village */}
            <div className="flex flex-col">
              <label className="text-sm text-slate-700">Village</label>
              <input
                type="text"
                name="village"
                value={newLocation.village}
                onChange={handleInputChange}
                placeholder="Village"
                className="border py-2 px-4 rounded-lg text-sm outline-none"
              />
              {errors.village && (
                <span className="text-red-500 text-xs">{errors.village}</span>
              )}
            </div>

            {/* Address line 1 */}
            <div className="flex flex-col">
              <label className="text-sm text-slate-700">Address line 1</label>
              <input
                type="text"
                name="street1"
                value={newLocation.street1}
                onChange={handleInputChange}
                placeholder="Address line 1"
                className="border py-2 px-4 rounded-lg text-sm outline-none"
              />
              {errors.street1 && (
                <span className="text-red-500 text-xs">{errors.street1}</span>
              )}
            </div>

            {/* Address line 2 */}
            <div className="flex flex-col">
              <label className="text-sm text-slate-700">Address line 2</label>
              <input
                type="text"
                name="street2"
                value={newLocation.street2}
                onChange={handleInputChange}
                placeholder="Address line 2"
                className="border py-2 px-4 rounded-lg text-sm outline-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full mt-3 bg-red-500 text-white py-2 rounded-lg hover:bg-red-400 text-sm flex justify-center items-center"
              disabled={loading}
            >
              {loading ? (
                <span className="loader border-t-2 border-r-2 border-white border-solid rounded-full h-5 w-5 animate-spin"></span>
              ) : (
                "Save Location"
              )}
            </button>
          </div>

          
        </form>
      </div>
    </div>
  );
};

export default AddLocation;
