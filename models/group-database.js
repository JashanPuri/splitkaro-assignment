const Group = require("./group");

// This handles a list of groups acting as an in-memory database
class GroupDatabase {
  constructor() {
    this.groups = [];
  }

  // creates the group and adds it to the list
  addGroup(name, members) {
    const group = new Group(name);

    for (var i = 0; i < members.length; i++) {
      group.members.add(members[i]);
    }

    this.groups.push(group);

    return group;
  }

  // finds the group with the given id
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
