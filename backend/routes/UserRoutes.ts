import express from "express";
import {} from "../controllers/Thumbnail.controllers.js";
import protect from "../middlewares/auth.js";
import {
  getSingleThumbnail,
  getUserThumbnails,
} from "../controllers/User.controllers.js";

const UserRouter = express.Router();

UserRouter.get("/thumbnails", protect, getUserThumbnails);
UserRouter.get("/thumbnail/:id", protect, getSingleThumbnail);

export default UserRouter;
