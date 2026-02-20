"use client";
import React, { useState } from "react";
import 'bootstrap-icons/font/bootstrap-icons.css';

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

const FIELDS: { key: keyof Location; label: string; placeholder: string; icon: string; required?: boolean }[] = [
  { key: 'country',  label: 'Country',          placeholder: 'e.g. Rwanda',        icon: 'bi-globe2',       required: true },
  { key: 'province', label: 'Province / State',  placeholder: 'e.g. Kigali',        icon: 'bi-map',          required: true },
  { key: 'district', label: 'District',          placeholder: 'e.g. Gasabo',        icon: 'bi-pin-map',      required: true },
  { key: 'sector',   label: 'Sector',            placeholder: 'e.g. Kimironko',     icon: 'bi-signpost',     required: true },
  { key: 'cell',     label: 'Cell',              placeholder: 'e.g. Bibare',        icon: 'bi-building',     required: true },
  { key: 'village',  label: 'Village',           placeholder: 'e.g. Inzovu',        icon: 'bi-house',        required: true },
  { key: 'street1',  label: 'Address line 1',    placeholder: 'Street or road name',icon: 'bi-geo-alt',      required: true },
  { key: 'street2',  label: 'Address line 2',    placeholder: 'Apt, floor, nearby landmark (optional)', icon: 'bi-geo' },
];

const AddLocation = ({ onClose }: AddLocationProps) => {
  const [location, setLocation] = useState<Location>({
    country: '', province: '', district: '', sector: '',
    cell: '', village: '', street1: '', street2: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);

  const update = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocation(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => { const n = { ...prev }; delete n[name]; return n; });
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    FIELDS.filter(f => f.required).forEach(f => {
      if (!location[f.key].trim()) errs[f.key] = `${f.label} is required`;
    });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setMessage(null);

    const userSession = JSON.parse(localStorage.getItem('userSession') || '{}');
    const userId = userSession.id;
    if (!userId) {
      setMessage({ text: 'You are not logged in.', ok: false });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/address', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...location, id: userId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error saving location');

      setMessage({ text: 'Location saved successfully!', ok: true });
      setLocation({ country: '', province: '', district: '', sector: '', cell: '', village: '', street1: '', street2: '' });
    } catch (err: any) {
      setMessage({ text: err.message, ok: false });
    } finally {
      setLoading(false);
    }
  };

  // Pair fields for 2-col grid rows: [country,province], [district,sector], [cell,village]
  const gridPairs = [
    [FIELDS[0], FIELDS[1]],
    [FIELDS[2], FIELDS[3]],
    [FIELDS[4], FIELDS[5]],
  ];
  const fullWidthFields = [FIELDS[6], FIELDS[7]];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-[2px]"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">

        {/* Dark header */}
        <div className="bg-gray-900 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
              <i className="bi bi-geo-alt-fill text-white text-[13px]"></i>
            </div>
            <div>
              <p className="text-white font-bold text-[15px] leading-tight">Add Delivery Location</p>
              <p className="text-gray-400 text-[11px]">Where should we deliver?</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-colors"
          >
            <i className="bi bi-x-lg text-[12px]"></i>
          </button>
        </div>

        {/* Scrollable form */}
        <div className="overflow-y-auto flex-1">
          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">

            {/* Status message */}
            {message && (
              <div className={`flex items-start gap-2 px-4 py-2.5 rounded-xl text-[13px] border ${
                message.ok
                  ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
                  : 'bg-red-50 border-red-100 text-red-600'
              }`}>
                <i className={`bi ${message.ok ? 'bi-check-circle-fill' : 'bi-exclamation-circle-fill'} flex-shrink-0 mt-0.5`}></i>
                <span>{message.text}</span>
              </div>
            )}

            {/* 2-col pairs */}
            {gridPairs.map((pair, pi) => (
              <div key={pi} className="grid grid-cols-2 gap-3">
                {pair.map(({ key, label, placeholder, icon, required }) => (
                  <div key={key}>
                    <label className="block text-[12px] font-medium text-gray-500 mb-1.5">
                      {label}{required && <span className="text-red-400 ml-0.5">*</span>}
                    </label>
                    <div className="relative">
                      <i className={`bi ${icon} absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[12px] pointer-events-none`}></i>
                      <input
                        type="text"
                        name={key}
                        value={location[key]}
                        onChange={update}
                        placeholder={placeholder}
                        className={`w-full pl-8 pr-3 py-2.5 border rounded-xl text-[13px] outline-none transition-all ${
                          errors[key]
                            ? 'border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100'
                            : 'border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-100'
                        }`}
                      />
                    </div>
                    {errors[key] && (
                      <p className="text-[11px] text-red-500 mt-1">{errors[key]}</p>
                    )}
                  </div>
                ))}
              </div>
            ))}

            {/* Full-width address lines */}
            {fullWidthFields.map(({ key, label, placeholder, icon, required }) => (
              <div key={key}>
                <label className="block text-[12px] font-medium text-gray-500 mb-1.5">
                  {label}{required && <span className="text-red-400 ml-0.5">*</span>}
                </label>
                <div className="relative">
                  <i className={`bi ${icon} absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-[13px] pointer-events-none`}></i>
                  <input
                    type="text"
                    name={key}
                    value={location[key]}
                    onChange={update}
                    placeholder={placeholder}
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl text-[14px] outline-none transition-all ${
                      errors[key]
                        ? 'border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100'
                        : 'border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-100'
                    }`}
                  />
                </div>
                {errors[key] && (
                  <p className="text-[11px] text-red-500 mt-1">{errors[key]}</p>
                )}
              </div>
            ))}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white font-bold py-4 rounded-2xl text-[15px] transition-all flex items-center justify-center gap-2 shadow-lg shadow-gray-900/20 active:scale-[0.98] mt-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
              ) : (
                <><i className="bi bi-check-circle"></i> Save Location</>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddLocation;
