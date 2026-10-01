const express = require("express");
const Department = require("../models/Department");
const { requireDepartmentEditor } = require("../middleware/auth");
const multer = require("multer");
const path = require("path");

const uploadDirectory = path.join(__dirname, "..", "uploads");
const storage = multer.diskStorage({
  destination: uploadDirectory,
  filename: (req, file, callback) => callback(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname).toLowerCase()}`),
});
const upload = multer({
  storage,
  // Do not impose a per-file size limit here. File count and type are still restricted.
  limits: { files: 20 },
  fileFilter: (req, file, callback) => {
    const isImage = file.fieldname === "images" && /^image\/(jpeg|png|webp)$/.test(file.mimetype);
    const isDocument = file.fieldname === "documents" && /^(application\/pdf|application\/msword|application\/vnd\.openxmlformats-officedocument\.wordprocessingml\.document)$/.test(file.mimetype);
    callback(isImage || isDocument ? null : new Error("Only JPG, PNG, WEBP, PDF, DOC, and DOCX files are allowed"), isImage || isDocument);
  },
});

const router = express.Router();

// GET /api/departments  (public - list, used for nav/directory)
router.get("/", async (req, res) => {
  try {
    const depts = await Department.find({}, "slug name shortName");
    res.json(depts);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.get("/:slug/reports", async (req, res) => {
  try {
    const department = await Department.findOne({ slug: req.params.slug.toLowerCase() }, "name reports");
    if (!department) return res.status(404).json({ message: "Department not found" });
    res.json({ department: department.name, reports: department.reports });
  } catch (err) { res.status(500).json({ message: "Server error", error: err.message }); }
});

router.get("/:slug/reports/:reportId", async (req, res) => {
  try {
    const department = await Department.findOne({ slug: req.params.slug.toLowerCase() }, "name reports");
    const report = department?.reports.id(req.params.reportId);
    if (!report) return res.status(404).json({ message: "Report not found" });
    res.json({ department: department.name, report });
  } catch (err) { res.status(500).json({ message: "Server error", error: err.message }); }
});

// GET /api/departments/:slug  (public - single department page)
router.get("/:slug", async (req, res) => {
  try {
    const dept = await Department.findOne({ slug: req.params.slug.toLowerCase() });
    if (!dept) return res.status(404).json({ message: "Department not found" });
    res.json(dept);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// POST /api/departments/:slug/uploads  (protected - CMS asset upload)
// This endpoint is intentionally generic: it just stores whatever files
// arrive under the "images" / "documents" fields and hands back their
// URLs. It doesn't know or care whether the frontend is about to put a
// URL on the gallery, the HOD photo, a report, or a single item inside
// Programmes / Faculty / Highlights / Profile tabs — that decision is
// made client-side in EditDepartment.jsx (uploadItemAsset). So no
// changes were needed here to support per-item image/PDF attachments.
router.post("/:slug/uploads", requireDepartmentEditor, upload.fields([{ name: "images", maxCount: 20 }, { name: "documents", maxCount: 20 }]), (req, res) => {
  const files = Object.values(req.files || {}).flat().map((file) => ({
    url: `/uploads/${file.filename}`,
    label: file.originalname,
    type: file.mimetype,
  }));
  res.status(201).json(files);
});

router.put("/:slug", requireDepartmentEditor, async (req, res) => {
  try {
    const slug = req.params.slug.toLowerCase();
    const update = { ...req.body, slug };
    const dept = await Department.findOneAndUpdate(
      { slug },
      update,
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    res.json(dept);
  } catch (err) {
    res.status(400).json({ message: "Update failed", error: err.message });
  }
});

module.exports = router;