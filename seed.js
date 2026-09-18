require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const connectDB = require("./config/db");
const Admin = require("./models/Admin");
const Homepage = require("./models/Homepage");
const Department = require("./models/Department");

async function seed() {
  await connectDB();
  // 1. Development staff user. Override these with environment variables in production.
  const username = process.env.ADMIN_USERNAME || "staff";
  const password = process.env.ADMIN_PASSWORD || "PSGtech@2026"; // Removed duplicate line
  const existingAdmin = await Admin.findOne({ username });
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(password, 10);
    await Admin.create({ username, passwordHash, departmentSlugs: ["cse"] });
    console.log(`Staff user created: ${username}`);
  } else {
    await Admin.updateOne({ _id: existingAdmin._id }, { $set: { departmentSlugs: ["cse"] } });
    console.log(`Staff user already exists: ${username}`);
  }
  // 2. Homepage demo content
  await Homepage.findOneAndUpdate({}, {
    badgeText: "Platinum jubilee · 1926 — 2026",
    heading: "A century of PSG & Sons' Charities.",
    subheading: "Founded to provide world-class engineering education and foster research, PSG Tech has moulded leaders for Indian industry since 1951.",
    ctaPrimaryText: "Explore admissions",
    ctaPrimaryLink: "/admissions",
    ctaSecondaryText: "About PSG Tech",
    ctaSecondaryLink: "/about",
    newsTicker: {
      text: "PSG Centenary Celebrations | Products of PSG Products Expo 2026 - Visit the Official Expo Website.",
      link: "#announcements",
    },
    stats: [
      { value: "1926", label: "TRUST FOUNDED" },
      { value: "1951", label: "COLLEGE ESTABLISHED" },
      { value: "1L+", label: "LIBRARY VOLUMES" },
      { value: "40+", label: "PROGRAMMES" },
    ],
    welcomeTitle: "Welcome to PSG College of Technology",
    welcomeBody: "PSG College of Technology is an ISO 9001:2015 certified autonomous institution founded by the PSG & Sons' Charities Trust. Our campus brings together rigorous engineering education, applied research, and a community that serves society.",
    highlights: [
      { title: "Central Library", description: "A one lakh-plus collection, digital resources, and quiet spaces for focused learning.", icon: "building" },
      { title: "Residential life", description: "Comfortable hostels, student clubs, sports, and a campus community built around belonging.", icon: "home" },
      { title: "Career pathways", description: "Strong industry partnerships and placement support connecting students with meaningful work.", icon: "rocket" },
      { title: "Research culture", description: "Cross-disciplinary labs and faculty-led projects solving practical challenges.", icon: "research" },
    ],
    announcements: [
      { date: "09 OCT", title: "National workshop on design challenges in next-generation motors", link: "#" },
      { date: "11 FEB", title: "International conference on emerging trends in materials chemistry", link: "#" },
      { date: "24 MAR", title: "Applications open for undergraduate and postgraduate programmes", link: "#" },
      { date: "02 APR", title: "PSG Tech student innovation showcase and project exhibition", link: "#" },
    ],
    downloads: [
      { label: "Admissions prospectus 2026", link: "#" },
      { label: "Approvals and accreditations", link: "#" },
      { label: "UGC undertaking", link: "#" },
      { label: "NBA accreditation report", link: "#" },
    ],
  }, { upsert: true, new: true, setDefaultsOnInsert: true });
  console.log("Homepage demo content seeded");

  // 3. Department demo content
  const departments = [
    {
      slug: "cse",
      name: "Computer Science and Engineering",
      shortName: "CSE",
      establishedYear: "1987",
      aboutTitle: "Computing for a changing world",
      heroTagline: "Building software engineers and researchers since inception.",
      aboutBody: "The Department of Computer Science and Engineering combines core computing fundamentals with emerging technologies, human-centred design, and industry-aligned research. Students learn by building systems that are useful, responsible, and ready for the world beyond campus.",
      hod: {
        name: "Dr. A. Meenakshi",
        designation: "Professor and Head",
        message: "Our aim is to give every student the confidence to ask better questions, build with care, and contribute to the future of computing.",
      },
      profileSections: [
        { title: "About", content: "The Department of Computer Science and Engineering is committed to excellence in education, research, and innovation. Our students and faculty work across software systems, artificial intelligence, data science, and emerging computing technologies." },
        { title: "Former HODs", content: "Former Heads of Department information can be maintained here by the CSE HOD." },
        { title: "MOUs", content: "Industry and academic collaboration details can be maintained here." },
        { title: "Milestones", content: "Department milestones and notable achievements can be maintained here." },
        { title: "Awards", content: "Faculty and student awards can be maintained here." },
        { title: "News", content: "Department news can be maintained here." },
        { title: "Newsletter", content: "Newsletter details and links can be maintained here." },
      ],
      vision: "To become a global leader in computer science and engineering education and research for societal benefit.",
      mission: "Provide high-quality education, encourage innovative solutions to societal problems, and foster research, development, and leadership skills.",
      reports: [
        { title: "INFINITUM 2026 - Inter College Technical Symposium", date: "February 13 - 14, 2026", organisedBy: "The Department of Computer Science and Engineering", content: "The Department of Computer Science and Engineering, PSG College of Technology, successfully organized INFINITUM 2026, the flagship inter-college technical fest of the Computer Science and Engineering Association.\n\nObjectives of the Event\nINFINITUM created a competitive platform for students to demonstrate technical and problem-solving skills, collaborate, and explore emerging technologies.\n\nImpact and Outcomes\nThe event strengthened the technical culture within the institution and encouraged innovation, teamwork, and professional networking." },
      ],
      programmes: [
        { name: "B.E. Computer Science and Engineering", level: "UG", intake: "120" },
        { name: "M.E. Computer Science and Engineering", level: "PG", intake: "25" },
        { name: "M.E. Software Engineering", level: "PG", intake: "18" },
      ],
      faculty: [
        { name: "Dr. R. Karthik", designation: "Associate Professor", qualification: "Ph.D.", email: "rkarthik@psgtech.ac.in" },
        { name: "Dr. S. Priya", designation: "Assistant Professor", qualification: "Ph.D.", email: "spriya@psgtech.ac.in" },
        { name: "M. Aravind", designation: "Assistant Professor", qualification: "M.E.", email: "maravind@psgtech.ac.in" },
      ],
      highlights: [
        { title: "Research labs", description: "Dedicated labs for AI, data science, and systems research." },
        { title: "Industry projects", description: "Active collaborations with industry for live student projects." },
        { title: "Student community", description: "Technical clubs, hackathons, and peer learning led by students." },
      ],
      contactEmail: "cse@psgtech.ac.in",
      contactPhone: "+91 422 257 2177",
    },
    {
      slug: "ece",
      name: "Electronics and Communication Engineering",
      shortName: "ECE",
      heroTagline: "Designing intelligent systems for a connected future.",
      aboutTitle: "Signals, systems, and imagination",
      aboutBody: "The Department of Electronics and Communication Engineering prepares students to work across embedded systems, communication networks, VLSI, signal processing, and the fast-growing world of connected devices.",
      hod: { name: "Dr. P. Nandhini", designation: "Professor and Head", message: "We bring theory and making together so that every student can move from understanding a system to shaping one." },
      programmes: [
        { name: "B.E. Electronics and Communication Engineering", level: "UG", intake: "120" },
        { name: "M.E. Communication Systems", level: "PG", intake: "25" },
      ],
      faculty: [
        { name: "Dr. V. Suresh", designation: "Professor", qualification: "Ph.D.", email: "vsuresh@psgtech.ac.in" },
        { name: "K. Divya", designation: "Assistant Professor", qualification: "M.E.", email: "kdivya@psgtech.ac.in" },
      ],
      highlights: [
        { title: "Embedded systems lab", description: "Hands-on work with microcontrollers, robotics, and connected devices." },
        { title: "VLSI research", description: "Research and design practice across digital and mixed-signal systems." },
      ],
      contactEmail: "ece@psgtech.ac.in",
      contactPhone: "+91 422 257 2177",
    },
    {
      slug: "mech",
      name: "Mechanical Engineering",
      shortName: "MECH",
      heroTagline: "Making better things, from first principles.",
      aboutTitle: "Engineering the physical world",
      aboutBody: "Mechanical Engineering at PSG Tech brings design, manufacturing, thermal sciences, materials, and automation together through a strong studio and laboratory culture.",
      hod: { name: "Dr. R. Venkatesan", designation: "Professor and Head", message: "The best engineering education gives students the freedom to make, test, fail intelligently, and improve what comes next." },
      programmes: [
        { name: "B.E. Mechanical Engineering", level: "UG", intake: "120" },
        { name: "M.E. Manufacturing Engineering", level: "PG", intake: "18" },
        { name: "M.E. Thermal Engineering", level: "PG", intake: "18" },
      ],
      faculty: [
        { name: "Dr. P. Mohan", designation: "Professor", qualification: "Ph.D.", email: "pmohan@psgtech.ac.in" },
        { name: "S. Lakshmi", designation: "Assistant Professor", qualification: "M.E.", email: "slakshmi@psgtech.ac.in" },
      ],
      highlights: [
        { title: "Advanced manufacturing", description: "Modern tools and methods for design, fabrication, and production." },
        { title: "Mobility research", description: "Projects exploring efficient, safe, and sustainable transport systems." },
      ],
      contactEmail: "mech@psgtech.ac.in",
      contactPhone: "+91 422 257 2177",
    },
  ];

  for (const department of departments) {
    await Department.findOneAndUpdate({ slug: department.slug }, department, { upsert: true, new: true, setDefaultsOnInsert: true });
    console.log(`${department.shortName} department seeded`);
  }

  const directoryDepartments = [
    ["apparel-fashion-design", "Apparel & Fashion Design", "AFD"],
    ["applied-mathematics-computational-sciences", "Applied Mathematics & Computational Sciences", "AMCS"],
    ["applied-science", "Applied Science", "AS"],
    ["automobile-engineering", "Automobile Engineering", "AUTO"],
    ["biotechnology", "Biotechnology", "BT"],
    ["biomedical-engineering", "Biomedical Engineering", "BME"],
    ["chemistry", "Chemistry", "CHEM"],
    ["civil-engineering", "Civil Engineering", "CIVIL"],
    ["electrical-electronics-engineering", "Electrical & Electronics Engineering", "EEE"],
    ["english", "English", "ENG"],
    ["fashion-technology", "Fashion Technology", "FT"],
    ["humanities", "Humanities", "HUM"],
    ["instrumentation-control-systems", "Instrumentation & Control Systems Engineering", "ICSE"],
    ["information-technology", "Information Technology", "IT"],
    ["mathematics", "Mathematics", "MATH"],
    ["computer-applications", "Computer Applications", "MCA"],
    ["metallurgical-engineering", "Metallurgical Engineering", "MET"],
    ["physics", "Physics", "PHY"],
  ];

  for (const [slug, name, shortName] of directoryDepartments) {
    await Department.findOneAndUpdate(
      { slug },
      { $setOnInsert: { slug, name, shortName, heroTagline: `${name} at PSG College of Technology` } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }
  console.log("Academic department directory seeded");

  await mongoose.disconnect();
  console.log("Seed complete");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
