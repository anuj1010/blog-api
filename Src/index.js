require("dotenv").config({ path: "./Src/.env" });
const express = require("express");
const cookieParser = require("cookie-parser");
const router = require(__dirname + "/router");
const connectdb = require(__dirname + "/connection");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors()); // Allow all origins
app.use(express.json());
app.use(cookieParser());
app.use("/api/blog", router);

connectdb().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
  });
});
