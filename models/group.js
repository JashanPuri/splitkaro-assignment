const uuidv4 = require("uuid").v4;
const { StatusCodes } = require("http-status-codes");
const CustomAPIError = require("./custom-api-error");
const Expense = require("./expense");

module.exports = class Group {
  constructor(name, members = null, expenses = null) {
    this.id = uuidv4();
    this.name = name;
    this.members = members !== null ? members : new Set();
    this.expenses = expenses !== null ? expenses : [];
  }

  addMember(member) {
    this.members.add(member);
  }

  isMember(member) {
    return this.members.has(member);
  }

  addMembersFromItems(items) {
    items.forEach((item) => {
      item.paid_by.forEach((element) => {
        let currSum = 0;
        for (var member in element) {
          currSum += element[member];
          if (!this.isMember(member)) {
            this.addMember(member);
          }
        }
        if (currSum != item.value) {
          throw new CustomAPIError(
            "Total amount paid by members and value of item do not match",
            StatusCodes.CONFLICT
          );
        }
      });

      item.owed_by.forEach((element) => {
        let currSum = 0;
        for (var member in element) {
          currSum += element[member];
          if (!this.isMember(member)) {
            this.addMember(member);
          }
        }
        if (currSum != item.value) {
          throw new CustomAPIError(
            "Total amount owed by members and value of item do not match",
            StatusCodes.CONFLICT
          );
        }
      });
    });
  }

  addExpense(name, items) {
    this.addMembersFromItems(items);

    const expense = new Expense(name, items);

    this.expenses.push(expense);

    return expense;
  }

  updateExpense(expenseId, name, items) {
    const expenses = this.expenses.filter((expense) => expense.id == expenseId);

    if (expenses.length == 0) {
      throw new CustomAPIError("Expense not found", StatusCodes.NOT_FOUND);
    }

    if (items) {
      this.addMembersFromItems(items);
    }

    const expense = expenses[0];

    expense.update({ name: name, items: items });

    return expense;
  }

  deleteExpense(expenseId) {
    this.expenses = this.expenses.filter((expense) => expense.id != expenseId);
  }

  getBalance() {}
};
