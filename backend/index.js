const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();


const app = express();
app.use(cors({
  origin: "https://seb-mandi-habb.vercel.app", // Replace with the URL of your frontend
}));

const port = 5001;
const uri = "mongodb+srv://piyushsharmasml0:6RfvZnbwPWPI7V62@cluster0.4i7ogiu.mongodb.net/sebwale?retryWrites=true&w=majority"

console.log("MongoDB URI:", uri);
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const farmerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quality: { type: String, required: true },
  district: { type: String, required: true },
  date: { type: Date, required: true }, // New date field in the schema
});

const Farmer = mongoose.model("Farmer", farmerSchema);

app.use(cors());
app.use(express.json());

app.get("https://seb-mandi-habb.vercel.app/farmers", async (req, res) => {
  try {
    const { quality, district, date } = req.query; // Get date from the query parameters

    let query = {};
    if (quality) {
      query.quality = { $regex: new RegExp(quality, "i") };
    }
    if (district) {
      query.district = { $regex: new RegExp(district, "i") };
    }
    if (date) {
      // Use the date filter to search for records on the specific date
      query.date = { $eq: new Date(date) };
    }

    const farmers = await Farmer.find(query).sort({ price: -1 });
    res.json(farmers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("https://seb-mandi-habb.vercel.app/farmers", async (req, res) => {
  const { name, price, quality, district, date } = req.body; // Include date from the request body
  if (!name || !price || !quality || !district || !date) {
    return res.status(400).json({ message: "All fields are required." });
  }

  console.log("Received data from frontend:", req.body); // Log the received data

  const farmer = new Farmer({
    name,
    price,
    quality,
    district,
    date, // Include the date in the new farmer data
  });

  try {
    const newFarmer = await farmer.save();
    console.log("New farmer data saved to the database:", newFarmer); // Log the saved data
    res.status(201).json(newFarmer);
  } catch (err) {
    console.error("Error saving farmer data:", err); // Log any error that occurs during saving
    res.status(400).json({ message: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

     


