import React from 'react';

const Button = ({ onClick, children, variant = "default", className = "" }) => {
  let baseStyle = "border border-black px-4 py-1 text-sm flex items-center gap-1";
  
  if (variant === "primary") {
    baseStyle += " bg-white hover:bg-gray-100";
  } else if (variant === "secondary") {
    baseStyle += " bg-gray-100 hover:bg-gray-200 border-2";
  }

  return (
    <button className={`${baseStyle} ${className}`} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
