import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

app.get("/soil", async (req, res) => {
  const { lat, lon } = req.query;
  const url = `https://rest.isric.org/soilgrids/v2.0/properties/query?latitude=${lat}&longitude=${lon}&property=phh2o,nitrogen,phosphorus,potassium&depth=0-5cm&value=mean`;
  const response = await fetch(url);
  const data = await response.json();
  res.json(data);
});

app.listen(5000, () => console.log("✅ Proxy running on port 5000"));

// // Instead of hitting SoilGrids directly, hit your backend
// const fetchSoilGrids = async (lat, lon) => {
//   const resp = await fetch(`http://localhost:5000/soil?lat=${lat}&lon=${lon}`);
//   return await resp.json();
// };

// // Same for Bhuvan
// const fetchBhuvan = async (lat, lon) => {
//   const resp = await fetch(`http://localhost:5000/bhuvan?lat=${lat}&lon=${lon}`);
//   return await resp.json();
// };
