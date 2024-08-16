/* eslint-disable react/prop-types */
import React, { useEffect, useState, useRef } from 'react';

const Dropdown = (props) => {
  const {
    dropWidth,
    dropHeight,
    dropFontSize,
    dropFontColor,
    dropTitle,
    dropClass,
    content,
    onChange,
    onClick,
    defaultValue,
    value,
    disabled,
    titleIcon,
    width,
  } = props;

  const dropdownRef = useRef(null);

  const dropdownStyle = {
    width: width || dropWidth,
    height: dropHeight,
    fontSize: dropFontSize,
    color: dropFontColor,
  };

  const [state, setState] = useState({
    isToggleOn: false,
    selected: defaultValue,
  });

  const { isToggleOn, selected } = state;

  const handleClick = () => {
    isToggleOn && onClick && onClick();
    setState((prevState) => ({
      ...prevState,
      isToggleOn: !prevState.isToggleOn,
    }));
  };

  const handleClick2 = (value) => {
    setState((prevState) => ({
      selected: value,
      isToggleOn: !prevState.isToggleOn,
    }));
    onChange && onChange(value);
    onClick && onClick();
  };

  const getLabel = (content.find((item) => item.id === selected) || {}).title;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setState((prevState) => ({
          ...prevState,
          isToggleOn: false,
        }));
      }
    };

    if (value)
      setState((prev) => ({
        ...prev,
        selected: value,
      }));

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [value, dropdownRef]);

  return (
    <div
      className={`dropdown ${dropClass}`}
      style={dropdownStyle}
      ref={dropdownRef}
    >
      <button
        type="button"
        className={isToggleOn ? 'dropdown__title active' : 'dropdown__title '}
        onClick={disabled ? () => {} : handleClick}
        style={dropdownStyle}
        disabled={disabled}
      >
        <div className="dropdown__title-box">
          {titleIcon === undefined ? null : (
            <div className="dropdown__title-icon">{titleIcon}</div>
          )}
          <span>{selected ? getLabel : dropTitle}</span>
        </div>
      </button>
      <div
        className={isToggleOn ? 'dropdown__list active' : 'dropdown__list'}
        style={{ width: width || dropWidth }}
      >
        {content &&
          content.map((items) => (
            <button
              type="button"
              className="dropdown__item"
              key={`${items.id}${items.title}`}
              onClick={() => handleClick2(items.id)}
            >
              <span>{items.title}</span>
            </button>
          ))}
      </div>
    </div>
  );
};

export default Dropdown;
