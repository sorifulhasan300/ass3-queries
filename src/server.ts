import express from "express";
import initDB from "./config/database";
import config from "./config/config";
import { userRouter } from "./modules/auth/auth.route";

const app = express();
const port = config.port || 5000;

initDB();
app.use(express.json());

app.use("/api/v1/auth", userRouter);

app.listen(port, () => {
  console.log(`Server is running on post ${port}`);
});
