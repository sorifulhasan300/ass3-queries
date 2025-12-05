import express from "express";
import config from "./config/config";
import initDB from "./config/database";

const app = express();
const port = config.port || 5000;

initDB();
app.listen(port, () => {
  console.log(`Server is running on post ${port}`);
});
