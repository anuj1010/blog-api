require("dotenv").config({ path: "./Src/.env" });
const express = require("express");
const cookieParser = require("cookie-parser");
const router = require(__dirname + "/router");
const connectdb = require(__dirname + "/connection");
const fileUpload = require("express-fileupload");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;
app.use(
  cors({
    origin: "https://anuj-blog-insight.netlify.app",
    // origin: "http://127.0.0.1:5173",

    credentials: true,
  })
);
app.use(fileUpload({ useTempFiles: true }));
app.use(express.json());
app.use(cookieParser());
app.use("/api/blog", router);

connectdb().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
  });
});
