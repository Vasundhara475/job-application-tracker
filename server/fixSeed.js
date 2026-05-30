// server/fixSeed.js
const mongoose = require("mongoose");
const User = require("./models/User");
const Application = require("./models/Application");
require("dotenv").config();

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  
  const user = await User.findOne(); // grab your existing user
  if (!user) return console.log("No user found — register first!");

  await Application.deleteMany({ userId: user._id }); // clear old data

  const apps = [
    { company: "Google", position: "SWE Intern", status: "Applied", appliedDate: new Date("2024-03-01") },
    { company: "Microsoft", position: "Frontend Dev", status: "Interview", appliedDate: new Date("2024-03-05") },
    { company: "Amazon", position: "Backend Eng", status: "Rejected", appliedDate: new Date("2024-03-10") },
    { company: "Meta", position: "React Dev", status: "Offer", appliedDate: new Date("2024-03-12") },
    { company: "Netflix", position: "Full Stack", status: "Applied", appliedDate: new Date("2024-03-20") },
  ];

  await Application.insertMany(apps.map(a => ({ ...a, userId: user._id })));
  console.log("✅ Seeded", apps.length, "applications for", user.email);
  mongoose.disconnect();
}

seed();