
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("AI Clinical Backend is running");
});

app.post("/ai-differential", (req, res) => {
  const { complaint, diabetes } = req.body;

  let differentials = [];
  let investigations = [];

  if (complaint?.toLowerCase().includes("fever")) {
    differentials.push(
      "Viral fever",
      "Enteric fever",
      "Malaria",
      "Dengue",
      "Tuberculosis",
      "Urinary tract infection",
      "Sepsis"
    );

    investigations.push(
      "CBC",
      "Peripheral smear for malaria",
      "Dengue NS1/IgM",
      "Blood culture",
      "Urine routine",
      "Chest X-ray"
    );
  }

  if (complaint?.toLowerCase().includes("chest")) {
    differentials.push(
      "Acute coronary syndrome",
      "Pneumonia",
      "Pulmonary embolism",
      "GERD"
    );

    investigations.push(
      "ECG",
      "Troponin",
      "Chest X-ray"
    );
  }

  if (diabetes === "yes") {
    differentials.push(
      "Diabetic ketoacidosis",
      "Hypoglycemia",
      "Diabetic infection"
    );

    investigations.push(
      "Random blood sugar",
      "HbA1c",
      "Urine ketones"
    );
  }

  res.json({
    differentials: [...new Set(differentials)],
    investigations: [...new Set(investigations)],
    disclaimer:
      "Educational use only. Does not replace clinical judgment."
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
