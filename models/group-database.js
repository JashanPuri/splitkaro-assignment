const Mutex = require("async-mutex").Mutex;

const Group = require("./group");

// This handles a list of groups acting as an in-memory database
class GroupDatabase {
  constructor() {
    this.groups = [];
    this.locks = {};
  }

  // creates the group and adds it to the list
  // Creates a mutex lock for that group
  addGroup(name, members) {
    const group = new Group(name);

    for (var i = 0; i < members.length; i++) {
      group.members.add(members[i]);
    }

    this.groups.push(group);

    // creating the lock for this group
    this.locks[group.id] = new Mutex();

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

  getLockByGroupId(groupId) {
    return this.locks[groupId];
  }
}

const groupDb = new GroupDatabase();

module.exports = groupDb;
