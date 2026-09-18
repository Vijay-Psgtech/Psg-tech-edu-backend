const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    passwordHash: { type: String, required: true },
    departmentSlugs: { type: [String], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Admin", AdminSchema);
