import { Request, Response } from "express";
import Thumbnail from "../models/Thumbnail.model.js";

export const getUserThumbnails = async (req: Request, res: Response) => {
  try {
    const { userId } = req.session;

    const thumbnails = await Thumbnail.find({ userId }).sort({ createdAt: -1 });
    res
      .status(200)
      .json({ message: "User thumbnails fetched successfully", thumbnails });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: "User thumbnails fetch failed" });
  }
};

export const getSingleThumbnail = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userId } = req.session;
    const thumbnail = await Thumbnail.findOne({ _id: id, userId });

    if (!thumbnail) {
      return res.status(404).json({ message: "Thumbnail not found" });
    }

    res
      .status(200)
      .json({ message: "User thumbnail fetched successfully", thumbnail });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: "User thumbnails fetch failed" });
  }
};
