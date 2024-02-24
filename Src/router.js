const express = require("express");
const controllers = require(__dirname + "/controllers");
const router = express.Router();
const multer = require("multer");
// const storage = multer.memoryStorage();
// const upload = multer({ storage });

router.route("/").get(controllers.home);
router.route("/register").post(controllers.register);
router.route("/login").post(controllers.login);
router.route("/profile").get(controllers.profile);
router.route("/logout").get(controllers.logout);
// router.route("/post").post(upload.single("cover"), controllers.post);
router.route("/post").post(controllers.post);
router.route("/post").get(controllers.getPosts);
router.route("/post/:id").get(controllers.getPostsWithId);
// router
//   .route("/post/:id")
//   .put(upload.single("cover"), controllers.updatePostsWithId);
router.route("/post/:id").put(controllers.updatePostsWithId);

router.route("/post/:id").delete(controllers.deletePostWithId);

module.exports = router;
