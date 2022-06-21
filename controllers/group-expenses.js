const { StatusCodes } = require("http-status-codes");

const CustomAPIError = require("../models/custom-api-error");
const groupDb = require("../models/group-database");

// POST for creating expense in group
const addExpenseInGroup = (req, res, next) => {
  const release = res.store["lockRelease"];
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
  } finally {
    release();
  }
};

// PATCH for updateing expense in group
const updateExpenseInGroup = (req, res, next) => {
  const release = res.store["lockRelease"];
  try {
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
  } catch (error) {
    next(error);
  } finally {
    release();
  }
};

// DELETE for deleting expense in group
const deleteExpenseInGroup = (req, res, next) => {
  const release = res.store["lockRelease"];
  try {
    const groupId = req.params.groupId;
    const expenseId = req.params.expenseId;

    const group = groupDb.getGroupById(groupId);

    if (!group) {
      throw new CustomAPIError("Group not found", StatusCodes.NOT_FOUND);
    }

    group.deleteExpense(expenseId);

    res.status(StatusCodes.OK).json({ message: "Expense deleted succesfully" });
  } catch (error) {
    next(error);
  } finally {
    release();
  }
};

module.exports = {
  addExpenseInGroup,
  updateExpenseInGroup,
  deleteExpenseInGroup,
};
