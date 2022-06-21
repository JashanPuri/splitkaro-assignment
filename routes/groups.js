const express = require("express");

const groupsController = require("../controllers/groups");
const groupExpensesController = require("../controllers/group-expenses");
const mutexMiddleware = require("../middleware/mutex-handler");

const router = express.Router();

// POST - Create group
router.post("/", groupsController.createGroup);

// GET - Get the group balance
router.get("/:groupId/balance", mutexMiddleware, groupsController.getBalance);

// POST - Add expense to group with id=groupId
router.post(
  "/:groupId/expense",
  mutexMiddleware,
  groupExpensesController.addExpenseInGroup
);

// PATCH - Updates to group with id=groupId and expense having id=expenseId
router.patch(
  "/:groupId/expense/:expenseId",
  mutexMiddleware,
  groupExpensesController.updateExpenseInGroup
);

// DELETE - Deletes the expense with id=expenseId
router.delete(
  "/:groupId/expense/:expenseId",
  mutexMiddleware,
  groupExpensesController.deleteExpenseInGroup
);

module.exports = router;
