const uuidv4 = require("uuid").v4;
const { StatusCodes } = require("http-status-codes");
const CustomAPIError = require("./custom-api-error");
const Expense = require("./expense");

module.exports = class Group {
  constructor(name, members = null, expenses = null) {
    this.id = uuidv4();
    this.name = name;
    this.members = members !== null ? members : new Set(); // Set of members;
    this.expenses = expenses !== null ? expenses : []; // List of Expense;
  }

  // adds the member to the set of members of the group
  addMember(member) {
    this.members.add(member);
  }

  // check if the person is the member of the group
  isMember(member) {
    return this.members.has(member);
  }

  // checks for consistency of the expense items
  // also adds people part of the expense but not a member of the group already
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
    // add members not in group already
    this.addMembersFromItems(items);

    const expense = new Expense(name, items);

    // add new expenses to the group
    this.expenses.push(expense);

    return expense;
  }

  // updates the expenses
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

  // delete the expense with the given expenseId
  deleteExpense(expenseId) {
    this.expenses = this.expenses.filter((expense) => expense.id != expenseId);
  }

  // utility function for calculating cash flow
  // gives the minimum balance and the member having it
  #getMin(map) {
    var minMemb;
    var minBal = 0;

    for (var membr in map) {
      if (!minMemb) {
        minMemb = membr;
        minBal = map[membr];
      }

      if (map[membr] <= minBal) {
        minBal = map[membr];
        minMemb = membr;
      }
    }

    return { minMember: minMemb, minBalance: minBal };
  }

  // utility function for calculating cash flow
  // gives the maximum balance and the member having it
  #getMax(map) {
    var maxMemb;
    var maxBal;

    for (var membr in map) {
      if (!maxMemb) {
        maxMemb = membr;
        maxBal = map[membr];
      }

      if (map[membr] >= maxBal) {
        maxBal = map[membr];
        maxMemb = membr;
      }
    }

    return { maxMember: maxMemb, maxBalance: maxBal };
  }

  // caclucates the cash flow
  // calculates who owes how much
  #calCashFlow(memberBalance, balance) {
    // calculating the maximum balance
    var { maxMember, maxBalance } = this.#getMax(memberBalance);

    // calculating the minimum balance
    var { minMember, minBalance } = this.#getMin(memberBalance);

    // base condition for our recusion
    if (maxBalance === 0 && minBalance === 0) return;

    // Finding the minimum of the two balances
    // because the minimum will be paid by the minMember to the maxMember
    var balanceToBePaid = 0;
    if (Math.abs(minBalance) < Math.abs(maxBalance)) {
      balanceToBePaid = Math.abs(minBalance);
    } else {
      balanceToBePaid = Math.abs(maxBalance);
    }

    // minMember as to pay maxMember balanceToBePaid
    memberBalance[maxMember] -= balanceToBePaid;
    memberBalance[minMember] += balanceToBePaid;

    const owed_by = {};
    const owes_to = {};

    // maxMember is owed money by minMember
    owed_by[minMember] = balanceToBePaid;
    balance[maxMember]["owed_by"].push(owed_by);

    // minMember owes money to maxMember
    owes_to[maxMember] = balanceToBePaid;
    balance[minMember]["owes_to"].push(owes_to);

    this.#calCashFlow(memberBalance, balance);
  }

  // function to calculate the balance for each member of the group
  getBalance() {
    const balance = {};
    const memberArray = Array.from(this.members);

    const memberBalance = {};

    // Calculating the total net balance from all the expenses
    // paid_by means that the member is owed money
    // owed_by means that the member has to pay the money

    for (var i = 0; i < memberArray.length; i++) {
      balance[memberArray[i]] = { total_balance: 0, owes_to: [], owed_by: [] };
      memberBalance[memberArray[i]] = 0;
    }

    this.expenses.forEach((expense) => {
      expense.items.forEach((item) => {
        item.paid_by.forEach((map) => {
          for (var membr in map) {
            balance[membr]["total_balance"] += map[membr];
            memberBalance[membr] += map[membr];
          }
        });

        item.owed_by.forEach((map) => {
          for (var membr in map) {
            balance[membr]["total_balance"] -= map[membr];
            memberBalance[membr] -= map[membr];
          }
        });
      });
    });

    // this function will calculate who owes how much money
    // follows the algorithm of minimizing the cash flow
    this.#calCashFlow(memberBalance, balance);

    return { name: this.name, balances: balance };
  }
};
