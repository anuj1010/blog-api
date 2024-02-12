const UserModel = require(__dirname + "/Models/usermodel");
const PostModel = require(__dirname + "/Models/postmodel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;

const home = async (req, res) => {
  await res.send("router is ready");
};

const register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).send("Email already exists");
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserModel({
      username,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    // console.log("newUser", newUser);
    res.send(newUser);
  } catch (error) {
    res.status(400).send(error);
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user._id }, SECRET_KEY, {
      expiresIn: "1h",
    });

    // await res.cookie("token", token, { httpOnly: true });
    res
      .cookie("token", token, {
        sameSite: "None",
        secure: true,
      })
      .json({ username: user.username, id: user._id });
    // res.status(200).json({ message: "Login successful" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const profile = async (req, res) => {
  const token = await req.cookies.token;
  const tokenInfo = jwt.verify(token, SECRET_KEY);
  res.json(tokenInfo);
};

const logout = async (req, res) => {
  res
    .cookie("token", "", {
      sameSite: "None",
      secure: true,
    })
    .json("loggedout");
};

const post = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const file = await req.file;
    const { title, summary, content } = req.body;
    // console.log(file);

    // Extract user ID from JWT token
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    if (!decodedToken) {
      return res.status(401).json({ message: "your session has been expired" });
    }
    const userId = decodedToken.userId;

    const newPost = new PostModel({
      title,
      summary,
      content,
      cover: {
        data: file.buffer,
        contentType: file.mimetype,
      },
      author: userId,
    });

    await newPost.save();

    res.status(200).json({ message: "File uploaded successfully" });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getPosts = async (req, res) => {
  try {
    const posts = await PostModel.find()
      .populate("author", ["username"])
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getPostsWithId = async (req, res) => {
  const { id } = await req.params;
  const post = await PostModel.findOne({ _id: id }).populate("author", [
    "username",
  ]);
  res.json(post);
};

const updatePostsWithId = async (req, res) => {
  try {
    const postId = req.params.id;
    const { title, summary, content } = req.body;

    // Extract user ID from JWT token
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    const userId = decodedToken.userId;

    // Find post by ID
    let updatedFields = {
      title,
      summary,
      content,
      author: userId,
    };

    // Check if file is uploaded
    if (req.file) {
      const file = req.file;
      updatedFields.cover = {
        data: file.buffer,
        contentType: file.mimetype,
      };
    }

    // Update post with the provided fields
    const updatedPost = await PostModel.findByIdAndUpdate(
      postId,
      updatedFields,
      { new: true } // Return the updated document
    );

    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    res
      .status(200)
      .json({ message: "Post updated successfully", post: updatedPost });
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deletePostWithId = async (req, res) => {
  const postId = req.params.id;
  // res.send(postId);
  // console.log(postId);
  try {
    const deletedPost = await PostModel.findByIdAndDelete(postId);

    if (!deletedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  home,
  register,
  login,
  profile,
  logout,
  post,
  getPosts,
  getPostsWithId,
  updatePostsWithId,
  deletePostWithId,
};
