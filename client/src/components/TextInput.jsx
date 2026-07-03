import React from 'react';

const TextInput = ({ label, value, onChange, labelWidth = "w-32", ...props }) => {
  return (
    <div className="flex items-center text-sm">
      <div className={labelWidth}>{label}</div>
      <input 
        type="text" 
        className="border border-black flex-1 p-1"
        value={value}
        onChange={onChange}
        {...props}
      />
    </div>
  );
};

export default TextInput;
