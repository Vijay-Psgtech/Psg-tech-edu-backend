const mongoose = require("mongoose");

const ProgrammeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // e.g. "B.E. Computer Science and Engineering"
    level: { type: String, default: "UG" }, // UG / PG / PhD
    intake: { type: String, default: "" },
  },
  { _id: false }
);

const FacultySchema = new mongoose.Schema({
  name: { type: String, required: true },
  designation: { type: String, required: true },
  qualification: { type: String, default: "" },
  email: { type: String, default: "" },
});

const HighlightSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
});

const AssetSchema = new mongoose.Schema({
  url: { type: String, required: true },
  label: { type: String, default: "" },
}, { _id: false });

const ProfileSectionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, default: "" },
}, { _id: false });

const ReportSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: String, default: "" },
  organisedBy: { type: String, default: "" },
  content: { type: String, default: "" },
  images: { type: [AssetSchema], default: [] },
}, { timestamps: true });

const DepartmentSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true }, // e.g. "cse"
    name: { type: String, required: true }, // e.g. "Computer Science and Engineering"
    shortName: { type: String, default: "" }, // e.g. "CSE"
    establishedYear: { type: String, default: "" },
    heroTagline: { type: String, default: "" },
    aboutTitle: { type: String, default: "About the department" },
    aboutBody: { type: String, default: "" },

    hod: {
      name: { type: String, default: "" },
      designation: { type: String, default: "Head of the Department" },
      message: { type: String, default: "" },
      imageUrl: { type: String, default: "" },
    },

    gallery: { type: [AssetSchema], default: [] },
    announcements: { type: [AssetSchema], default: [] },
    profileSections: { type: [ProfileSectionSchema], default: [] },
    reports: { type: [ReportSchema], default: [] },
    vision: { type: String, default: "" },
    mission: { type: String, default: "" },

    programmes: { type: [ProgrammeSchema], default: [] },
    faculty: { type: [FacultySchema], default: [] },
    highlights: { type: [HighlightSchema], default: [] },

    contactEmail: { type: String, default: "" },
    contactPhone: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Department", DepartmentSchema);
