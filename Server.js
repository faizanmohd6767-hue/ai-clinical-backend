import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/ai-differential", (req, res) => {
  const { complaint, temperature, bp, diabetes } = req.body;

  let differentials = [];

  if (complaint?.toLowerCase().includes("fever") || temperature >= 38.7) {
    differentials.push("Acute febrile illness (viral > bacterial)");
    differentials.push("Dengue / malaria (seasonal consideration)");
  }

  if (bp >= 120) {
    differentials.push("Primary hypertension");
  }

  if (diabetes === "Yes") {
    differentials.push("Poor glycaemic control–related complications");
  }

  if (differentials.length === 0) {
    differentials.push("Non-specific symptoms — clinical correlation required");
  }

  res.json({
    differentials,
    disclaimer:
      "AI-assisted differential suggestions only. Final diagnosis rests with the clinician."
  });
});

app.get("/", (req, res) => {
  res.send("AI Clinical Backend is running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
