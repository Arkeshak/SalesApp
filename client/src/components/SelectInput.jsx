import React from 'react';

const SelectInput = ({ label, value, onChange, options, labelWidth = "w-32", displayField = "name", valueField = "id" }) => {
  return (
    <div className="flex items-center text-sm">
      <div className={labelWidth}>{label}</div>
      <select 
        className="border border-black flex-1 p-1"
        value={value}
        onChange={onChange}
      >
        <option value=""></option>
        {options.map((opt, i) => (
           <option key={i} value={opt[valueField]}>{opt[displayField]}</option>
        ))}
      </select>
    </div>
  );
};

export default SelectInput;
