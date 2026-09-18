const express = require("express");
const Homepage = require("../models/Homepage");
const { requireAdmin } = require("../middleware/auth");

const router = express.Router();

// GET /api/homepage  (public - consumed by the React site)
router.get("/", async (req, res) => {
  try {
    let doc = await Homepage.findOne();
    if (!doc) {
      doc = await Homepage.create({}); // create with schema defaults on first run
    }
    res.json(doc);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// PUT /api/homepage  (protected - consumed by the CMS)
router.put("/", requireAdmin, async (req, res) => {
  try {
    let doc = await Homepage.findOne();
    if (!doc) {
      doc = new Homepage();
    }
    Object.assign(doc, req.body);
    await doc.save();
    res.json(doc);
  } catch (err) {
    res.status(400).json({ message: "Update failed", error: err.message });
  }
});

module.exports = router;
