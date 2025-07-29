import React from 'react';

const DarkMode = ({ isDark, toggleTheme }) => {
  return (
    <div className="form-check form-switch">
      <input
        className="form-check-input"
        type="checkbox"
        id="darkModeToggle"
        checked={isDark}
        onChange={toggleTheme}
      />
      <label className="form-check-label" htmlFor="darkModeToggle">
        🌙 Dark Mode
      </label>
    </div>
  );
};

export default DarkMode; 