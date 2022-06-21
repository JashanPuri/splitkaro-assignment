const express = require("express");

const groupsController = require("../controllers/groups");
const groupExpensesController = require("../controllers/group-expenses");

const router = express.Router();

// POST - Create group
router.post("/", groupsController.createGroup);

// GET - Get the group balance
router.get("/:groupId/balance", groupsController.getBalance);

// POST - Add expense to group with id=groupId
router.post("/:groupId/expense", groupExpensesController.addExpenseInGroup);

// PATCH - Updates to group with id=groupId and expense having id=expenseId
router.patch(
  "/:groupId/expense/:expenseId",
  groupExpensesController.updateExpenseInGroup
);

// DELETE - Deletes the expense with id=expenseId
router.delete(
  "/:groupId/expense/:expenseId",
  groupExpensesController.deleteExpenseInGroup
);

module.exports = router;
