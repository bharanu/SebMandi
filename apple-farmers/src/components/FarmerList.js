import React from "react";
import "../styles/App.css";
const FarmerList = ({ farmers }) => {
  return (
    <div className="farmer-list">
      {farmers.map((farmer) => (
        <div key={farmer._id} className="farmer-item">
          <p className="farmer-detail">Farmer Name: {farmer.name}</p>
          <p className="farmer-detail">Price: {farmer.price}</p>
          <p className="farmer-detail">Quality: {farmer.quality}</p>
          <p className="farmer-detail">District: {farmer.district}</p>
          <p className="farmer-detail">Date: {farmer.date}</p> {/* Display the date */}
          <hr />
        </div>
      ))}
    </div>
  );
};

export default FarmerList;