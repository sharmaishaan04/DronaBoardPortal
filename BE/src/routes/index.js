const express = require("express");
const router = express.Router();
const userRouter = require("./user.js");
const orderRouter = require("./order.js");
const divisionRouter = require("./division.js");

router.use("/user", userRouter);
router.use("/order", orderRouter);
router.use("/division", divisionRouter);

module.exports = router;
