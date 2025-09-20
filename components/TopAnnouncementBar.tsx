import React, { useEffect, useState } from "react";

const announcements = [
  "NEW DROP - NOW LIVE",
  "FREE SHIPPING ON ORDERS OVER 999",
  "LIMITED EDITION TEES",
];

export function TopAnnouncementBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % announcements.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="sticky top-0 z-[60] w-full bg-[#181818] text-white text-center font-semibold tracking-wide text-xs h-10 flex items-center justify-center overflow-hidden" style={{minHeight: 40, position: 'sticky'}}>
      <div
        key={index}
        className="w-full transition-transform duration-500"
        style={{position: 'absolute', animation: 'slideUp 0.5s'}}
      >
        {announcements[index]}
      </div>
      <style>
        {`
          @keyframes slideUp {
            0% { transform: translateY(100%); opacity: 0; }
            100% { transform: translateY(0); opacity: 1; }
          }
        `}
      </style>
    </div>
  );
}
