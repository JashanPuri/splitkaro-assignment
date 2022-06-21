const uuidv4 = require("uuid").v4;
const Item = require("./item");

// Class for Expense
module.exports = class Expense {
  constructor(name, items) {
    this.id = uuidv4();
    this.name = name;
    this.items = [];
    for (var i = 0; i < items.length; i++) {
      const name = items[i].name;
      const value = items[i].value;
      const paid_by = items[i].paid_by;
      const owed_by = items[i].owed_by;

      const item = new Item(name, value, paid_by, owed_by);

      this.items.push(item);
    }
  }

  // Updates the name,and items of an E
  update({ name, items }) {
    if (name) {
      this.name = name;
    }

    if (items) {
      this.items = [];

      for (var i = 0; i < items.length; i++) {
        const name = items[i].name;
        const value = items[i].value;
        const paid_by = items[i].paid_by;
        const owed_by = items[i].owed_by;

        const item = new Item(name, value, paid_by, owed_by);

        this.items.push(item);
      }
    }
  }
};
