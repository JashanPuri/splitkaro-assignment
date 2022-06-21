const express = require("express");

const groupsController = require("../controllers/groups");
const groupExpensesController = require("../controllers/group-expenses");

const router = express.Router();

router.post("/", groupsController.createGroup);

router.get("/:groupId/balance", groupsController.getBalance);

router.post("/:groupId/expense", groupExpensesController.addExpenseInGroup);

router.patch(
  "/:groupId/expense/:expenseId",
  groupExpensesController.updateExpenseInGroup
);

router.delete(
  "/:groupId/expense/:expenseId",
  groupExpensesController.deleteExpenseInGroup
);

module.exports = router;
