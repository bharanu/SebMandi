import React, { useState } from "react";
import { useUser } from "@clerk/clerk-react";

const FarmerForm = ({ onSubmit }) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quality, setQuality] = useState("");
  const [district, setDistrict] = useState("");
  const [date, setDate] = useState("");

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handlePriceChange = (event) => {
    setPrice(event.target.value);
  };

  const handleQualityChange = (event) => {
    setQuality(event.target.value);
  };

  const handleDistrictChange = (event) => {
    setDistrict(event.target.value);
  };

  const handleDateChange = (event) => {
    setDate(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (
      name.trim() === "" ||
      price.trim() === "" ||
      quality.trim() === "" ||
      district.trim() === "" ||
      date.trim() === ""
    ) {
      alert("Please fill in all the fields.");
      return;
    }
    onSubmit({ name, price, quality, district, date });
    setName("");
    setPrice("");
    setQuality("");
    setDistrict("");
    setDate("");
  };

  const { isSignedIn } = useUser(); // Get the signed-in status from Clerk

  return (
    <form onSubmit={isSignedIn ? handleSubmit : () => alert("Please sign in or register first.")}>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={handleNameChange}
        required
      />
      <input
        type="number"
        placeholder="Price of Apple"
        value={price}
        onChange={handlePriceChange}
        required
      />
      <input
        type="text"
        placeholder="Quality of Apple"
        value={quality}
        onChange={handleQualityChange}
        required
      />
      <input
        type="text"
        placeholder="District Name"
        value={district}
        onChange={handleDistrictChange}
        required
      />
      <input
        type="date"
        value={date}
        onChange={handleDateChange}
        required
      />
      <button type="submit">Submit</button>
          <style jsx>{`
        form {
          display: flex;
          flex-direction: column;
          max-width: 100%;
          padding: 1rem;
        }
        input,
        button {
          margin: 0.5rem 0;
          padding: 0.5rem;
        }
      `}</style>
    </form>
  );
};

export default FarmerForm;

     

