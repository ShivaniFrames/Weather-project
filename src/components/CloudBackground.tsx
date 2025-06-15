
import React from "react";

// Simple, layered blurry SVG clouds as background
const CloudBackground = () => (
  <div className="pointer-events-none fixed inset-0 -z-30 w-full h-full">
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 1440 700"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute top-0 left-0 w-full h-full"
      style={{ filter: "blur(22px)" }}
    >
      {/* Main big cloud */}
      <ellipse
        cx="350"
        cy="180"
        rx="260"
        ry="85"
        fill="#AAC9E6"
        opacity="0.30"
      />
      {/* Small cloud right */}
      <ellipse
        cx="1200"
        cy="140"
        rx="180"
        ry="60"
        fill="#C6E0F7"
        opacity="0.24"
      />
      {/* Middle cloud */}
      <ellipse
        cx="820"
        cy="300"
        rx="240"
        ry="70"
        fill="#E0F2FE"
        opacity="0.17"
      />
      {/* Lower left blur cloud */}
      <ellipse
        cx="290"
        cy="540"
        rx="220"
        ry="55"
        fill="#B5D4F2"
        opacity="0.25"
      />
      {/* Lower right thin cloud */}
      <ellipse
        cx="1160"
        cy="560"
        rx="180"
        ry="38"
        fill="#F0F6FB"
        opacity="0.19"
      />
      {/* Faint tiny cloud */}
      <ellipse
        cx="620"
        cy="620"
        rx="80"
        ry="18"
        fill="#CDE3F5"
        opacity="0.13"
      />
    </svg>
  </div>
);

export default CloudBackground;
