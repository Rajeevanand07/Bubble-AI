import React from 'react';

const Card = ({ text }) => {
  return (
    <div className="bg-gray-800 p-4 text-lg rounded-lg cursor-pointer hover:bg-gray-700">
      <p>{text}</p>
    </div>
  );
};

export default Card;
