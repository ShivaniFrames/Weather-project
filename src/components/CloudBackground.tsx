
import React from "react";

// Animated moving clouds background
const CloudBackground = () => (
  <div className="pointer-events-none fixed inset-0 -z-30 w-full h-full overflow-hidden">
    {/* Sky gradient background */}
    <div className="absolute inset-0 bg-gradient-to-b from-sky-200 to-sky-100" />
    
    {/* Animated SVG clouds */}
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 1440 700"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute top-0 left-0 w-full h-full"
    >
      {/* Cloud 1 - Large, slow moving */}
      <g className="animate-[float_20s_ease-in-out_infinite]">
        <ellipse
          cx="200"
          cy="150"
          rx="120"
          ry="40"
          fill="white"
          opacity="0.7"
        />
        <ellipse
          cx="240"
          cy="140"
          rx="80"
          ry="30"
          fill="white"
          opacity="0.8"
        />
        <ellipse
          cx="160"
          cy="160"
          rx="60"
          ry="25"
          fill="white"
          opacity="0.6"
        />
      </g>
      
      {/* Cloud 2 - Medium, moderate speed */}
      <g className="animate-[float_25s_ease-in-out_infinite_reverse] transform translate-x-[300px]">
        <ellipse
          cx="100"
          cy="200"
          rx="100"
          ry="35"
          fill="white"
          opacity="0.6"
        />
        <ellipse
          cx="130"
          cy="190"
          rx="70"
          ry="25"
          fill="white"
          opacity="0.7"
        />
      </g>
      
      {/* Cloud 3 - Small, faster */}
      <g className="animate-[float_15s_ease-in-out_infinite] transform translate-x-[600px]">
        <ellipse
          cx="50"
          cy="100"
          rx="60"
          ry="20"
          fill="white"
          opacity="0.5"
        />
        <ellipse
          cx="70"
          cy="95"
          rx="40"
          ry="15"
          fill="white"
          opacity="0.6"
        />
      </g>
      
      {/* Cloud 4 - Large background cloud */}
      <g className="animate-[float_30s_ease-in-out_infinite] transform translate-x-[800px]">
        <ellipse
          cx="150"
          cy="250"
          rx="140"
          ry="45"
          fill="white"
          opacity="0.4"
        />
        <ellipse
          cx="190"
          cy="240"
          rx="90"
          ry="35"
          fill="white"
          opacity="0.5"
        />
      </g>
      
      {/* Cloud 5 - High altitude */}
      <g className="animate-[float_18s_ease-in-out_infinite_reverse] transform translate-x-[1000px]">
        <ellipse
          cx="80"
          cy="80"
          rx="80"
          ry="25"
          fill="white"
          opacity="0.3"
        />
        <ellipse
          cx="100"
          cy="75"
          rx="50"
          ry="18"
          fill="white"
          opacity="0.4"
        />
      </g>
    </svg>
    
    <style jsx>{`
      @keyframes float {
        0%, 100% {
          transform: translateX(0px) translateY(0px);
        }
        25% {
          transform: translateX(10px) translateY(-5px);
        }
        50% {
          transform: translateX(-5px) translateY(-10px);
        }
        75% {
          transform: translateX(-10px) translateY(-5px);
        }
      }
    `}</style>
  </div>
);

export default CloudBackground;
