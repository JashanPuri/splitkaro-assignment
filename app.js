require("dotenv").config();
const express = require("express");

const groupRoutes = require("./routes/groups");

const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

const app = express();

// json parsing
app.use(express.json());

app.get("/", (req, res, next) => {
  res.send("Spiltkaro Assignment API");
});

app.use("/api/v1/groups", groupRoutes);

// handles routes that are not found
app.use(notFoundMiddleware);

// error handling middleware
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = () => {
  try {
    app.listen(port, () => {
      console.log(`Server started listening at port ${port}`);
    });
  } catch (error) {
    console.log("Error occured", error);
  }
};

// starts the server
start();
