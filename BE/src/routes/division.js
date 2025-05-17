const express = require("express");
const router = express.Router();
const prisma = require(".."); // Adjust based on your Prisma setup
const { authMiddleware } = require("./authMiddleware");

router.get("/", async (req, res) => {
  try {
    const divisions = await prisma.division.findMany();
    res.status(200).json(divisions);
  } catch (error) {
    console.error("Error fetching divisions:", error);
    res.status(500).json({ error: "Failed to fetch divisions" });
  }
});

router.post("/create", authMiddleware, async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Division name is required" });
    }

    const existingDivision = await prisma.division.findUnique({
      where: { name },
    });

    if (existingDivision) {
      return res.status(400).json({ error: "Division already exists" });
    }

    const newDivision = await prisma.division.create({
      data: { name },
    });

    res.status(201).json({
      data: newDivision,
      message: "Division created SuccessFully",
    });
  } catch (error) {
    console.error("Error creating division:", error);
    res.status(500).json({ error: "Failed to create division" });
  }
});

router.put("/edit", authMiddleware, async (req, res) => {
  try {
    const id = req.query.id;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "New division name is required" });
    }

    // Check if division exists
    const existingDivision = await prisma.division.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingDivision) {
      return res.status(404).json({ error: "Division not found" });
    }

    // Update division
    const updatedDivision = await prisma.division.update({
      where: { id: parseInt(id) },
      data: { name: name },
    });

    res.status(200).json(updatedDivision);
  } catch (error) {
    console.error("Error updating division:", error);
    res.status(500).json({ error: "Failed to update division" });
  }
});

router.delete("/delete", authMiddleware, async (req, res) => {
  const id = req.query.id;

  // Check if division exists
  const existingDivision = await prisma.division.findUnique({
    where: { id: parseInt(id) },
  });

  if (!existingDivision) {
    return res.status(404).json({ message: "Division not found" });
  }

  try {
    const deletedDiv = await prisma.division.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({
      message: "order deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "error deleting order" });
  }
});

module.exports = router;
