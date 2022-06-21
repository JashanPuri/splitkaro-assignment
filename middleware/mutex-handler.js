const { StatusCodes } = require("http-status-codes");
const CustomAPIError = require("../models/custom-api-error");
const groupDb = require("../models/group-database");

const mutexMiddleware = async (req, res, next) => {
  try {
    const groupId = req.params.groupId;

    const groupMutex = groupDb.getLockByGroupId(groupId);

    if (!groupMutex) {
      throw new CustomAPIError("Group not found", StatusCodes.NOT_FOUND);
    }

    // waiting for the mutex to be available
    await groupMutex.waitForUnlock();

    // console.log("Acquiring");

    // acquiring the mutex lock
    // release function will release the lock
    const release = await groupMutex.acquire();

    res.store = {};
    res.store["lockRelease"] = release;

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = mutexMiddleware;
