const { StatusCodes } = require("http-status-codes");

const groupDb = require("../models/group-database");
const CustomAPIError = require("../models/custom-api-error");

// POST for creating a group
const createGroup = (req, res, next) => {
  try {
    const name = req.body.name;
    const members = req.body.members;

    const group = groupDb.addGroup(name, members);

    res.status(StatusCodes.CREATED).json({
      message: "Group created successfully",
      // group: { id: group.id, name: group.name },
      group,
    });
  } catch (error) {
    next(error);
  }
};

// GET for getting the balance of a group
const getBalance = (req, res, next) => {
  try {
    const groupId = req.params.groupId;

    const group = groupDb.getGroupById(groupId);

    if (!group) {
      throw new CustomAPIError("Group not found", StatusCodes.NOT_FOUND);
    }

    const balance = group.getBalance();

    res.status(StatusCodes.OK).json(balance);
  } catch (error) {
    next(error);
  }
};

module.exports = { createGroup, getBalance };
