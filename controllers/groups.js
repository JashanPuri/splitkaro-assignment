const { StatusCodes } = require("http-status-codes");

const groupDb = require("../models/group-database");

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

const getBalance = (req, res, next) => {
  console.log("Get balance");
};

module.exports = { createGroup, getBalance };
