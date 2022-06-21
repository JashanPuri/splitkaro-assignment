const Mutex = require("async-mutex").Mutex;

const expenseUpdateMutex = new Mutex();

module.exports = expenseUpdateMutex;
