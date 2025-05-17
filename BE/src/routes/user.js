const express = require("express");
const router = express.Router();
const zod = require("zod");
const prisma = require("..");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { authMiddleware } = require("./authMiddleware");
const JWT_SECRET = "DRDE";
const JWT_REFRESH_SECRET = "DRDE_REFRESH"; // Separate secret for refresh token

const salt = 10;
const userValidation = zod.object({
  username: zod.string().email().trim(),
  firstName: zod.string().trim(),
  lastName: zod.string().trim(),
  password: zod.string().trim(),
  designation: zod.string().trim(),
});

const userUpdateValidation = zod.object({
  username: zod.string().email().trim(),
  firstName: zod.string().trim(),
  lastName: zod.string().trim(),
  designation: zod.string().trim(),
});

const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, JWT_SECRET, { expiresIn: "15m" });
  const refreshToken = jwt.sign({ userId }, JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
  return { accessToken, refreshToken };
};

router.get("/isSignIn", authMiddleware, (req, res) => {
  try {
    res.status(200).json({
      message: "Signed In",
      userId: req.userId,
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/signup", async (req, res) => {
  const vari = userValidation.safeParse(req.body);

  if (!vari.success) {
    return res.status(411).json({
      message: "invalid inputs",
    });
  }
  const existingUser = await prisma.user.findFirst({
    where: {
      username: req.body.username,
    },
  });

  if (existingUser) {
    return res.status(411).json({
      message: "user alerady exists",
    });
  }

  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  try {
    const newUser = await prisma.user.create({
      data: {
        ...req.body,
        password: hashedPassword,
      },
    });

    const { accessToken, refreshToken } = generateTokens(newUser.id);

    const response = await prisma.refreshToken.create({
      data: {
        userId: newUser.id,
        token: refreshToken,
      },
    });

    // res.cookie("refreshToken", refreshToken, {
    //   httpOnly: true,
    //   secure: true,
    //   maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    // });

    res.json({
      message: "User created successfully",
      // token: accessToken,
      // userId: newUser.id,
    });
  } catch (error) {
    res.status(411).json({
      message: "error",
      error: error,
    });
  }
});

const signinBody = zod.object({
  username: zod.string().email().trim(),
  password: zod.string().trim(),
});

router.post("/signin", async (req, res) => {
  const { success } = signinBody.safeParse(req.body);

  if (!success) {
    return res.status(411).json({
      message: "Incorrect inputs",
    });
  }

  if (!req.body.password || !req.body.username) {
    return res.status(411).json({
      message: "Incorrect inputs",
    });
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      username: req.body.username,
    },
  });

  if (!existingUser)
    return res.status(411).json({
      message: "User Doesnt Exist , invalid username",
    });

  const hash = await bcrypt.hash(req.body.password, salt);
  const existingUserPassword = existingUser.password;
  const val = await bcrypt.compare(req.body.password, existingUserPassword);
  if (!val) {
    res.status(411).json({
      message: "incorrect password",
    });
  } else {
    const { accessToken, refreshToken } = generateTokens(existingUser.id);

    await prisma.refreshToken.update({
      where: { userId: existingUser.id },
      data: { token: refreshToken },
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      token: accessToken,
      message: "login successful",
    });
  }
});

router.post("/refresh-token", async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken)
    return res.status(403).json({ message: "No refresh token provided" });

  const response = await prisma.refreshToken.findFirst({
    where: { token: refreshToken },
  });

  if (!response) {
    return res
      .status(403)
      .json({ message: "refresh Token doesnt match the db" });
  }

  try {
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    const newAccessToken = jwt.sign({ userId: decoded.userId }, JWT_SECRET, {
      expiresIn: "15m",
    });

    res.json({ token: newAccessToken });
  } catch (error) {
    res.status(403).json({ message: "Invalid refresh token" });
  }
});

router.post("/logout", async (req, res) => {
  if (!req.cookies.refreshToken)
    return res.status(403).json({ message: "No refresh token provided" });
  try {
    res.clearCookie("refreshToken");
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

router.get("/isAdmin", authMiddleware, async (req, res) => {
  try {
    const id = parseInt(req.userId);

    if (!id) {
      return res.status(400).json({ message: "user Id is required" });
    }
    const user = await prisma.user.findFirst({
      where: {
        id: id,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    res.json({
      data: user.isAdmin,
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/", async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      omit: {
        password: true,
      },
      orderBy: {
        firstName: "asc",
      },
    });
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "user ID is required" });
    }

    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      omit: { password: true },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching User." });
  }
});

router.put("/update/:userId", authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Validate inputs
    const validation = userUpdateValidation.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({ message: "Invalid inputs" });
    }

    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    var password = user.password;

    if (req.body.password) {
      password = await bcrypt.hash(req.body.password, salt);
    }

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(userId) },
      data: { ...req.body, password: password },
    });

    res.status(200).json({ message: "User updated successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error updating order." });
    console.log(error);
  }
});

router.delete("/delete", authMiddleware, async (req, res) => {
  const userId = req.query.id;
  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  const user = await prisma.user.findUnique({
    where: { id: parseInt(userId) },
  });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  if (user.username === "admin@drde.hqrdom") {
    return res.status(200).json({ message: "Permission Denied" });
  }

  try {
    const response1 = await prisma.document.updateMany({
      where: { userId: user.id },
      data: { userId: null },
    });

    const response2 = await prisma.refreshToken.delete({
      where: { userId: user.id },
    });

    const deleteUser = await prisma.user.delete({
      where: { id: user.id },
    });

    res.status(200).json({
      message: "user deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting user",
      error,
    });
  }
});
module.exports = router;
