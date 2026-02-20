import React from "react";

interface ProfileStatusProps {
  completionPercentage: number;
}

const ProfileStatus: React.FC<ProfileStatusProps> = ({ completionPercentage }) => {
  const circleRadius = 36;
  const circleCircumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset =
    circleCircumference - (completionPercentage / 100) * circleCircumference;

  return (
    <div className="bg-gray-900 rounded-2xl p-5 flex items-center gap-4">
      <div className="relative flex items-center justify-center flex-shrink-0">
        <svg width="80" height="80" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r={circleRadius}
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="7"
            fill="none"
          />
          <circle
            cx="50"
            cy="50"
            r={circleRadius}
            stroke="#10B981"
            strokeWidth="7"
            fill="none"
            strokeDasharray={circleCircumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-500"
            transform="rotate(-90 50 50)"
          />
        </svg>
        <p className="absolute text-[14px] font-bold text-white">{completionPercentage}%</p>
      </div>
      <div>
        <p className="text-[14px] font-bold text-white">Profile Complete</p>
        <p className="text-[12px] text-gray-400 mt-1">Complete your profile to unlock all features</p>
      </div>
    </div>
  );
};

export default ProfileStatus;
