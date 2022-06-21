module.exports = class Item {
  constructor(name, value, paid_by, owed_by) {
    this.name = name;
    this.value = value;
    this.paid_by = paid_by != null ? paid_by : [];
    this.owed_by = owed_by != null ? owed_by : [];
  }
};
