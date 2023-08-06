import React, { useState, useEffect } from "react";
import FarmerForm from "./components/FarmerForm";
import FarmerList from "./components/FarmerList";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles/App.css";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  RedirectToSignIn,
  useUser,
} from "@clerk/clerk-react"; // Import Clerk components

const App = () => {
  const [farmers, setFarmers] = useState([]);
  const [qualityFilter, setQualityFilter] = useState("");
  const [districtFilter, setDistrictFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [isFormsVisible, setIsFormsVisible] = useState(false);
  const { isSignedIn } = useUser(); // Get the user's sign-in status

  const handleQualityFilterChange = (event) => {
    setQualityFilter(event.target.value);
  };

  const handleDistrictFilterChange = (event) => {
    setDistrictFilter(event.target.value);
  };

  const handleDateFilterChange = (event) => {
    setDateFilter(event.target.value);
  };

  const handleFilterButtonClick = async () => {
    try {
      const queryParams = new URLSearchParams({
        quality: qualityFilter,
        district: districtFilter,
        date: dateFilter,
      }).toString();

      const response = await fetch(`https://seb-mandi.vercel.app/farmers?${queryParams}`);
      const data = await response.json();
      setFarmers(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const storedQualityFilter = localStorage.getItem("qualityFilter");
    const storedDistrictFilter = localStorage.getItem("districtFilter");
    const storedDateFilter = localStorage.getItem("dateFilter");

    if (storedQualityFilter) {
      setQualityFilter(storedQualityFilter);
    }

    if (storedDistrictFilter) {
      setDistrictFilter(storedDistrictFilter);
    }

    if (storedDateFilter) {
      setDateFilter(storedDateFilter);
    }

    if (storedQualityFilter && storedDistrictFilter && storedDateFilter) {
      handleFilterButtonClick();
    }

    setTimeout(() => {
      setIsFormsVisible(true);
    }, 2000);
  }, []);

  const handleFarmerSubmit = async (newFarmer) => {
    // Check if the user is signed in
    if (!isSignedIn) {
      // If not signed in, redirect to the sign-in page
      window.location.href = "/sign-in";
      return;
    }
  
    // Get the current date in the format "YYYY-MM-DD"
    const currentDate = new Date().toISOString().split("T")[0];
  
    // Check if the form has already been submitted on the current date
    const submittedDate = localStorage.getItem("submittedDate");
    if (submittedDate === currentDate) {
      toast.error("You have already submitted the form for today.");
      return;
    }
  
    try {
      const response = await fetch("https://seb-mandi.vercel.app/farmers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newFarmer),
      });
  
      if (!response.ok) {
        throw new Error("Failed to submit farmer form.");
      }
  
      const data = await response.json();
  
      // Fetch all farmers' data again to get the updated data from the server
      const updatedDataResponse = await fetch("https://seb-mandi.vercel.app/farmers");
      const updatedData = await updatedDataResponse.json();
      updatedData.sort((a, b) => b.price - a.price); // Sort in descending order of prices
  
      // Find the position of the newly submitted data in the sorted array
      const farmerPosition = updatedData.findIndex(
        (apple) => apple._id.toString() === data._id.toString()
      );
  
      // Display the notification on the screen
      if (farmerPosition >= 0) {
        const positionNumber = farmerPosition + 1;
        toast.success(
          `Wow! You have sold the ${positionNumber} most costly apple in the market today.`,
          {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000, // 5 seconds
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          }
        );
      } else {
        toast.success(
          "Your apple price is the highest among apples with the same quality in the market today.",
          {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000, // 5 seconds
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          }
        );
      }
  
      // Clear the filter inputs after form submission
      setQualityFilter("");
      setDistrictFilter("");
      setDateFilter("");
      localStorage.removeItem("qualityFilter");
      localStorage.removeItem("districtFilter");
      localStorage.removeItem("dateFilter");
  
      // Save the current date to local storage after successful form submission
      localStorage.setItem("submittedDate", currentDate);
    } catch (error) {
      console.error("Error submitting farmer form:", error);
    }
  };

  
  return (
    //<ClerkProvider publishableKey="pk_test_dmVyaWZpZWQtb2N0b3B1cy05Ni5jbGVyay5hY2NvdW50cy5kZXYk">
      <div>
        <div className={`heading-container ${isFormsVisible ? "show" : ""}`}>
          <h1 className="heading">SebMandi</h1>
        </div>

        <div className={`container ${isFormsVisible ? "is-form-visible" : "is-form-hidden"}`}>
          {/* Show FarmerForm only when signed in */}
          <SignedIn>
            <FarmerForm onSubmit={handleFarmerSubmit} />
          </SignedIn>

          {/* Show sign-in link when signed out */}
          <SignedOut>
            <h2>Login / Register</h2>
            <RedirectToSignIn />
          </SignedOut>
          </div>

<h1 className={`heading-container ${isFormsVisible ? "show" : ""}`}>Farmers List</h1>
<div className={`filter-container ${isFormsVisible ? "show" : ""}`}>
  <input
    type="text"
    placeholder="Filter by Quality of Apple"
    value={qualityFilter}
    onChange={handleQualityFilterChange}
    className="filter-input"
  />
  <input
    type="text"
    placeholder="Filter by District Name"
    value={districtFilter}
    onChange={handleDistrictFilterChange}
    className="filter-input"
  />
  <input
    type="date"
    placeholder="Select a date"
    value={dateFilter}
    onChange={handleDateFilterChange}
    className="filter-input"
  />
  <button onClick={handleFilterButtonClick} className="filter-button">
    Filter
  </button>
</div>

<FarmerList farmers={farmers} applyFilter={handleFilterButtonClick} />

<ToastContainer />
</div>
//</ClerkProvider>
);
};

export default App;






