// src/components/ui/Card.js
import React from 'react';

// Card component
export const Card = ({ children, className }) => {
  return <div className={`bg-white shadow-md rounded-lg p-4 ${className}`}>{children}</div>;
};

// CardHeader component
export const CardHeader = ({ children, className }) => {
  return <div className={`border-b pb-2 mb-4 ${className}`}>{children}</div>;
};

// CardTitle component
export const CardTitle = ({ children, className }) => {
  return <h2 className={`text-lg font-bold ${className}`}>{children}</h2>;
};

// CardContent component
export const CardContent = ({ children, className }) => {
  return <div className={className}>{children}</div>;
};
