const express = require("express");
const app = express();

// custom middlewares
const loggerMiddleware = require("./middlewares/logger");

const PORT = process.env.PORT || 3000;

app.use(express.json());

if (process.env.NODE_ENV === "dev") {
  app.use(loggerMiddleware);
}

app.get("/", (req, res, next) => {
  res.json({ message: "welcome" });
});

app.listen(PORT, () => {
  console.log(`Server is running on PORT:${PORT}`);
});
