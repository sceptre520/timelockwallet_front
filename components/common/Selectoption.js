import React from "react";

import styles from './styles.module.css';

export const Selectoption = ({options, value, onChange}) => {
  const index = options.indexOf(value);
  const [selectedValue, setSelectedValue] = React.useState(options[index]);

  const setVale = (value) => {
    setSelectedValue(value);
    onChange(value);
  }

  return (
    <div className={`${styles.dropdown}`}>
      <div>{selectedValue}</div>

      <div className={`fixed ${styles.dropdown_content} bg-slate-800 p-2 -ml-3`}>
        {options.map((item, index) =>
          <div
            key={index}
            className="m-2 cursor-pointer hover:text-white"
            onClick={() => setVale(item)}
          >
            {item}
          </div>
        )}
      </div>
    </div>
  )
}