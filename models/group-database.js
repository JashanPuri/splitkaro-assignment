const Group = require("./group");

class GroupDatabase {
  constructor() {
    this.groups = [];
  }

  addGroup(name, members) {
    const group = new Group(name);

    for (var i = 0; i < members.length; i++) {
      group.members.add(members[i]);
    }

    this.groups.push(group);

    return group;
  }

  getGroupById(groupId) {
    for (var i = 0; i < this.groups.length; i++) {
      if (this.groups[i].id == groupId) {
        return this.groups[i];
      }
    }
    return null;
  }
}

const groupDb = new GroupDatabase();

module.exports = groupDb;
