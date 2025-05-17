const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = new PrismaClient();

const Departments = [
  "Director's Office",
  "TC",
  "TM",
  "Account Section",
  "Administration",
  "Audit Cell",
  "Biotechnology",
  "BDTE Div",
  "BioMedical Verification Div",
  "BPT-Div",
  "Electron Microscope Div",
  "HCF",
  "Hindi Cell",
  "IDP Group",
  "IT Division",
  "MES",
  "MI Room",
  "Microbiology Div",
  "Miscellaneous",
  "MM Division",
  "M T Section",
  "P&T Div",
  "Protective Device Div",
  "PTD Div",
  "Security Section",
  "Sensor Dev Div",
  "Syn-Chemistry Div",
  "Test & Evaluation Div",
  "Tel. Exchange (EPABX)",
  "TIRC Div",
  "Virology Div",
  "Works Section",
  "Workshop",
];

async function main() {
  // Insert default divisions
  for (const name of Departments) {
    await prisma.division.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  console.log("Default divisions added successfully!");

  // Hash password
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash("drde-123", saltRounds);

  // Create default user
  const adminUser = await prisma.user.upsert({
    where: { username: "admin@drde.hqrdom" },
    update: {},
    create: {
      username: "admin@drde.hqrdom",
      firstName: "ADMIN",
      lastName: "DRDE",
      password: hashedPassword,
      designation: "CREATOR",
      isAdmin: true,
    },
  });

  console.log("Default admin user added successfully!");

  const refreshToken = jwt.sign(
    { userId: adminUser.id },
    "refresh-secret", // Use a secure key in production
    { expiresIn: "7d" }
  );

  // Store the refresh token in the RefreshToken table
  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: adminUser.id,
    },
  });

  console.log("Refresh token stored successfully for admin.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
