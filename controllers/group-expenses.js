const { StatusCodes } = require("http-status-codes");
const CustomAPIError = require("../models/custom-api-error");
const groupDb = require("../models/group-database");

const addExpenseInGroup = (req, res, next) => {
  try {
    const groupId = req.params.groupId;

    const name = req.body.name;
    const items = req.body.items;

    const group = groupDb.getGroupById(groupId);

    if (!group) {
      throw new CustomAPIError("Group not found", StatusCodes.NOT_FOUND);
    }

    const expense = group.addExpense(name, items);

    res.status(StatusCodes.CREATED).json({
      message: "Expense added successfully",
      // expense: { id: expense.id, name: expense.name },
      expense,
    });
  } catch (error) {
    next(error);
  }
};

const updateExpenseInGroup = (req, res, next) => {
  const groupId = req.params.groupId;
  const expenseId = req.params.expenseId;

  const name = req.body.name;
  const items = req.body.items;

  const group = groupDb.getGroupById(groupId);

  if (!group) {
    throw new CustomAPIError("Group not found", StatusCodes.NOT_FOUND);
  }

  const expense = group.updateExpense(expenseId, name, items);

  res.status(StatusCodes.OK).json({
    message: "Expense updated successfully",
    expense,
  });
};

const deleteExpenseInGroup = (req, res, next) => {
  const groupId = req.params.groupId;
  const expenseId = req.params.expenseId;

  const group = groupDb.getGroupById(groupId);

  if (!group) {
    throw new CustomAPIError("Group not found", StatusCodes.NOT_FOUND);
  }

  group.deleteExpense(expenseId);

  res.status(StatusCodes.OK).json({ message: "Expense deleted succesfully" });
};

module.exports = {
  addExpenseInGroup,
  updateExpenseInGroup,
  deleteExpenseInGroup,
};
