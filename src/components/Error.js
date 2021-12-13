import React from "react";

export default function Error({ errors }) {
  return errors.length > 0 ? (
    <div className="error-block">
      <ul>
        {errors.map((error, index) => (
          <li key={index}>{error}</li>
        ))}
      </ul>
    </div>
  ) : (
    <div></div>
  );
}
