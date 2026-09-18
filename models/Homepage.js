const mongoose = require("mongoose");

const StatSchema = new mongoose.Schema(
  {
    value: { type: String, required: true },
    label: { type: String, required: true },
  },
  { _id: false }
);

const HighlightSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, default: "building" }, // maps to a frontend icon key
});

const AnnouncementSchema = new mongoose.Schema({
  date: { type: String, required: true }, // e.g. "09 OCT" - kept as display string for CMS simplicity
  title: { type: String, required: true },
  link: { type: String, default: "#" },
});

const DownloadSchema = new mongoose.Schema({
  label: { type: String, required: true },
  link: { type: String, required: true },
});

const NewsTickerSchema = new mongoose.Schema({
  text: { type: String, default: "PSG Centenary Celebrations | Products of PSG Products Expo 2026 - Visit the Official Expo Website." },
  link: { type: String, default: "#announcements" },
}, { _id: false });

const HomepageSchema = new mongoose.Schema(
  {
    // Hero section
    badgeText: { type: String, default: "Platinum jubilee · 1926 — 2026" },
    heading: { type: String, default: "A century of PSG & Sons' Charities." },
    subheading: {
      type: String,
      default:
        "Founded to provide world-class engineering education and foster research, the college has moulded leaders for Indian industry since 1951.",
    },
    ctaPrimaryText: { type: String, default: "Explore admissions" },
    ctaPrimaryLink: { type: String, default: "/admissions" },
    ctaSecondaryText: { type: String, default: "About PSG Tech" },
    ctaSecondaryLink: { type: String, default: "/about" },
    stats: { type: [StatSchema], default: [
      { value: "1926", label: "TRUST FOUNDED" },
      { value: "1951", label: "COLLEGE ESTABLISHED" },
      { value: "1L+", label: "LIBRARY VOLUMES" },
    ] },

    // Campus highlights
    highlights: { type: [HighlightSchema], default: [] },

    // Sidebar content
    announcements: { type: [AnnouncementSchema], default: [] },
    downloads: { type: [DownloadSchema], default: [] },
    newsTicker: { type: NewsTickerSchema, default: () => ({}) },

    // Welcome / about blurb shown on homepage
    welcomeTitle: { type: String, default: "Welcome to PSG College of Technology" },
    welcomeBody: {
      type: String,
      default:
        "PSG College of Technology, an ISO 9001:2015 certified institution, is one of the foremost institutions founded by the PSG & Sons' Charities Trust (1926).",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Homepage", HomepageSchema);
