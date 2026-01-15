const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());


app.post("/ai-differential", (req, res) => {
  const { complaint, history, temperature, bp, diabetes } = req.body;

  let dx = [];
  const c = complaint?.toLowerCase() || "";
  const h = history?.toLowerCase() || "";

  /* =========================
     FEVER / INFECTION
     ========================= */
  if (c.includes("fever") || (temperature && temperature > 37.5)) {
    dx.push("Viral febrile illness (most likely)");

    if (temperature >= 38.7)
      dx.push("Bacterial infection (focus to be identified)");

    dx.push("Dengue fever (consider if thrombocytopenia, myalgia)");
    dx.push("Malaria (consider if chills, rigors, endemic area)");
    dx.push("Typhoid fever (if prolonged fever >5 days)");
    dx.push("Respiratory tract infection (if cough, breathlessness)");
    dx.push("Urinary tract infection (if dysuria, frequency)");

    if (h.includes("confusion") || h.includes("drowsy"))
      dx.push("Sepsis (rule out urgently)");
  }

  /* =========================
     CHEST PAIN / BREATHLESSNESS
     ========================= */
  if (c.includes("chest") || c.includes("breath")) {
    dx.push("Acute coronary syndrome (rule out if risk factors)");
    dx.push("Stable angina");
    dx.push("Gastroesophageal reflux disease");
    dx.push("Musculoskeletal chest pain");
    dx.push("Pneumonia");
    dx.push("Pulmonary embolism (rule out if sudden onset)");
  }

  /* =========================
     ABDOMINAL PAIN
     ========================= */
  if (c.includes("abdomen") || c.includes("stomach")) {
    dx.push("Acute gastritis / dyspepsia");
    dx.push("Acute gastroenteritis");
    dx.push("Appendicitis (rule out if localized RIF pain)");
    dx.push("Cholecystitis (if RUQ pain)");
    dx.push("Pancreatitis (if epigastric pain radiating to back)");
    dx.push("Renal colic");
    dx.push("Intestinal obstruction (rule out if distension, vomiting)");
  }

  /* =========================
     HEADACHE
     ========================= */
  if (c.includes("headache")) {
    dx.push("Tension-type headache");
    dx.push("Migraine");
    dx.push("Sinusitis");
    dx.push("Hypertensive headache");
    dx.push("Meningitis (rule out if fever + neck stiffness)");
    dx.push("Intracranial pathology (if red flags present)");
  }

  /* =========================
     COUGH / RESPIRATORY
     ========================= */
  if (c.includes("cough")) {
    dx.push("Upper respiratory tract infection");
    dx.push("Acute bronchitis");
    dx.push("Pneumonia");
    dx.push("Bronchial asthma exacerbation");
    dx.push("COPD exacerbation");
    dx.push("Pulmonary tuberculosis (if chronic cough, weight loss)");
  }

  /* =========================
     URINARY SYMPTOMS
     ========================= */
  if (c.includes("burning") || c.includes("urine") || c.includes("dysuria")) {
    dx.push("Urinary tract infection");
    dx.push("Acute pyelonephritis");
    dx.push("Renal calculi");
    dx.push("Prostatitis (in males)");
  }

  /* =========================
     VOMITING / GI
     ========================= */
  if (c.includes("vomit") || h.includes("vomit")) {
    dx.push("Acute gastroenteritis");
    dx.push("Gastritis");
    dx.push("Food poisoning");
    dx.push("Metabolic causes (DKA, uremia)");
    dx.push("Raised intracranial pressure (rule out if persistent)");
  }

  /* =========================
     WEAKNESS / FATIGUE
     ========================= */
  if (c.includes("weak") || c.includes("fatigue")) {
    dx.push("Anemia");
    dx.push("Hypothyroidism");
    dx.push("Electrolyte imbalance");
    dx.push("Chronic infection");
    dx.push("Depression / anxiety (diagnosis of exclusion)");
  }

  /* =========================
     EDEMA / SWELLING
     ========================= */
  if (c.includes("swelling") || c.includes("edema")) {
    dx.push("Congestive heart failure");
    dx.push("Renal disease");
    dx.push("Liver disease");
    dx.push("Hypoalbuminemia");
    dx.push("Drug-induced edema");
  }

  /* =========================
     HYPERTENSION
     ========================= */
  if (bp) {
    if (bp >= 140 && bp < 160)
      dx.push("Stage 1 essential hypertension");
    else if (bp >= 160) {
      dx.push("Stage 2 hypertension");
      dx.push("Hypertensive urgency/emergency (if symptoms present)");
    }
  }

  /* =========================
     DIABETES
     ========================= */
  if (diabetes === "yes") {
    dx.push("Type 2 diabetes mellitus");
    dx.push("Poor glycemic control");
    dx.push("Diabetic infection");

    if (h.includes("vomit") || h.includes("drowsy"))
      dx.push("Diabetic ketoacidosis (rule out)");
  }

  /* =========================
     FALLBACK
     ========================= */
  if (dx.length === 0)
    dx.push("Insufficient data — detailed clinical evaluation advised");

  res.json({
    differentials: [...new Set(dx)],
    disclaimer:
      "This is a clinical decision support tool. It does not provide diagnosis or treatment. Final decisions must be made by a registered medical practitioner."
  });
});
