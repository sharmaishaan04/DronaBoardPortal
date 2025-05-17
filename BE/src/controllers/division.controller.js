const divisions = async (req, res) => {
  try {
    const divisions = await prisma.division.findMany();
    res.status(200).json(divisions);
  } catch (error) {
    console.error("Error fetching divisions:", error);
    res.status(500).json({ error: "Failed to fetch divisions" });
  }
};
