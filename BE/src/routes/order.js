const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const zod = require("zod");
const prisma = require(".."); // Adjust based on your Prisma setup
const { authMiddleware } = require("./authMiddleware");

router.use(express.urlencoded({ extended: false }));

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, path.resolve(__dirname, "..", "uploads"));
  },
  filename: function (req, file, cb) {
    return cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

const docValidation = zod.object({
  title: zod.string().trim().nonempty(),
  description: zod.string().trim().nonempty(),
  DocType: zod.string().trim().nonempty(),
});

// Route to handle file upload
router.post(
  "/upload",
  authMiddleware,
  upload.array("orderFiles", 3),
  async (req, res) => {
    try {
      const {
        title,
        description,
        DocType,
        divisionId,
        createdDate,
        createdAt,
      } = req.body;

      const vari = docValidation.safeParse({
        title,
        description,
        DocType,
      });

      if (!vari.success) {
        return res.status(411).json({
          message: "invalid inputs",
        });
      }

      const primaryAttachment = req.body.primaryAttachment === "true";
      const secondaryAttachment = req.body.secondaryAttachment === "true";
      const orderFiles = req.files;
      var fileLink = "";

      if (!Array.isArray(orderFiles) || orderFiles.length === 0) {
        fileLink = "";
      } else {
        fileLink = orderFiles[0];
      }

      const order = await prisma.document.create({
        data: {
          title,
          description,
          DocType,
          DocLink: fileLink === "" ? "" : `src/uploads/${fileLink.filename}`, // Save the file path to the database
          primaryAttachment,
          secondaryAttachment,
          primaryAttachmentLink:
            primaryAttachment &&
            Array.isArray(orderFiles) &&
            orderFiles.length > 1
              ? `src/uploads/${orderFiles[1].filename}`
              : "",
          secondaryAttachmentLink:
            secondaryAttachment &&
            Array.isArray(orderFiles) &&
            orderFiles.length > 2
              ? `src/uploads/${orderFiles[2].filename}`
              : "",

          createdAt: createdAt,
          createdDate: createdDate || new Date().toISOString().slice(0, 10),
          divisionId: parseInt(divisionId),
          userId: req.userId,
        },
      });

      res.status(200).send({ message: "Order uploaded successfully!", order });
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: "Error uploading order." });
    }
  }
);

router.get("/bulk", async (req, res) => {
  const { filter, filterType, filterText, startDate, endDate } = req.query;

  const page = parseInt(req.query.page) || 1; // Default to page 1
  const limit = parseInt(req.query.limit) || 1000; // Default to 10 orders per page
  const skip = (page - 1) * limit;

  const whereClause = {};
  const titleClause = {};

  if (filterText) titleClause.contains = filterText;
  if (filterText) whereClause.title = titleClause;
  if (parseInt(filter)) whereClause.divisionId = parseInt(filter);
  if (filterType) whereClause.DocType = filterType;
  if (startDate && endDate) {
    whereClause.createdAt = {
      gte: new Date(`${startDate}-01T00:00:00.000Z`), // Greater than or equal to the start of the startDate
      lte: new Date(`${endDate}-31T23:59:59.999Z`), // Less than or equal to the end of the endDate (31st day of the month)
    };
  }

  const data = await prisma.document.findMany({
    where: whereClause,
    skip: skip,
    take: limit,
    orderBy: {
      createdAt: "desc",
    },
  });

  const totalOrders = await prisma.document.count({
    where: whereClause,
  });

  res.json({ data, totalOrders });
});

router.delete("/delete", authMiddleware, async (req, res) => {
  try {
    const { orderID } = req.body;
    if (!orderID) {
      return res.status(400).json({ message: "Order ID is required" });
    }
    const data = await prisma.document.delete({
      where: {
        id: orderID,
      },
    });

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting order." });
  }
});

/*
 Fetch a specific order by ID
 */
router.get("/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      return res.status(400).json({ message: "Order ID is required" });
    }

    const order = await prisma.document.findUnique({
      where: { id: parseInt(orderId) },
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching order." });
  }
});

/*
 Update an order by ID
 */
router.put(
  "/update/:orderId",
  authMiddleware,
  upload.array("orderFiles", 3),
  async (req, res) => {
    try {
      const { orderId } = req.params;
      const { title, description, DocType, divisionId } = req.body;

      if (!orderId) {
        return res.status(400).json({ message: "Order ID is required" });
      }

      // Validate inputs
      const validation = docValidation.safeParse({
        title,
        description,
        DocType,
      });

      if (!validation.success) {
        return res.status(400).json({ message: "Invalid inputs" });
      }

      const order = await prisma.document.findUnique({
        where: { id: parseInt(orderId) },
      });

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      const primaryAttachment =
        req.body.primaryAttachment === "true" ? true : order.primaryAttachment;
      const secondaryAttachment =
        req.body.secondaryAttachment === "true"
          ? true
          : order.secondaryAttachment;

      const bodyPrimaryAttachment =
        req.body.primaryAttachment === "true" ? true : false;
      const bodySecondaryAttachment =
        req.body.secondaryAttachment === "true" ? true : false;

      const orderFiles = req.files || [];

      // Save file paths correctly
      const filePaths = orderFiles.map(
        (file) => `src/uploads/${file.filename}`
      );
      // Determine if orderFile exists based on files length and attachment conditions
      const orderFileExists =
        orderFiles.length === 3
          ? true // If there are 3 files, orderFile must exist
          : orderFiles.length === 2
          ? !(bodyPrimaryAttachment && bodySecondaryAttachment) // If both attachments exist, orderFile doesn't
          : orderFiles.length === 1
          ? !bodyPrimaryAttachment && !bodySecondaryAttachment // If only 1 file, it must be orderFile if no attachments
          : false; // If no files, orderFile doesn't exist

      const primaryAttachmentLink = primaryAttachment
        ? orderFileExists
          ? filePaths?.[1] ?? order.primaryAttachmentLink // orderFile exists, so primary is at index 1
          : filePaths?.[0] ?? order.primaryAttachmentLink // orderFile does not exist, primary is at index 0
        : order.primaryAttachmentLink;

      const secondaryAttachmentLink = secondaryAttachment
        ? orderFileExists
          ? primaryAttachment
            ? filePaths?.[2] ?? order.secondaryAttachmentLink // Both orderFile & primaryAttachment exist
            : filePaths?.[1] ?? order.secondaryAttachmentLink // Only orderFile exists
          : primaryAttachment
          ? filePaths?.[1] ?? order.secondaryAttachmentLink // Only primaryAttachment exists
          : filePaths?.[0] ?? order.secondaryAttachmentLink // Neither exist
        : order.secondaryAttachmentLink;

      const updatedOrder = await prisma.document.update({
        where: { id: parseInt(orderId) },
        data: {
          title,
          description,
          DocType,
          DocLink: orderFileExists ? filePaths[0] : order.DocLink,
          primaryAttachment,
          secondaryAttachment,
          primaryAttachmentLink,
          secondaryAttachmentLink,
          // createdAt: createdAt || order.createdAt,
          // createdDate: createdDate || order.createdDate,
          // divisionId: divisionId ? parseInt(divisionId) : order.divisionId,
          divisionId: parseInt(divisionId),
          userId: req.userId,
        },
      });

      res
        .status(200)
        .json({ message: "Order updated successfully!", updatedOrder });
    } catch (error) {
      res.status(500).json({ message: "Error updating order." });
      console.log(error);
    }
  }
);
module.exports = router;
