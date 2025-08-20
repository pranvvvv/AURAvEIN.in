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
    <div style={{
      background: "#181818",
      color: "#fff",
      textAlign: "center",
      fontWeight: 600,
      letterSpacing: 1,
  fontSize: "0.75rem",
      height: "40px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      position: "relative"
    }}>
      <div
        key={index}
        style={{
          position: "absolute",
          width: "100%",
          transition: "transform 0.5s cubic-bezier(.4,2,.6,1)",
          transform: "translateY(0)",
          animation: "slideUp 0.5s"
        }}
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
