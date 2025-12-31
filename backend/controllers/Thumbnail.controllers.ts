import { Request, Response } from "express";
import Thumbnail from "../models/Thumbnail.model.js";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

const stylePrompts = {
  "Bold & Graphic":
    "High-contrast bold design, strong shapes, vibrant colors, dramatic lighting, viral YouTube thumbnail style",
  "Tech/Futuristic":
    "Futuristic neon lighting, cyberpunk style, holographic UI, glowing tech elements",
  Minimalist:
    "Minimalist clean design, simple background, soft lighting, modern composition",
  Photorealistic:
    "Ultra realistic photography, cinematic lighting, high detail, professional camera look",
  Illustrated:
    "Digital illustration style, vibrant colors, smooth shading, artistic look",
};

const colorSchemeDescriptions = {
  vibrant: "high saturation vibrant colors",
  sunset: "warm sunset orange pink purple tones",
  forest: "natural green earthy tones",
  neon: "neon cyberpunk glow colors",
  purple: "purple and magenta color palette",
  monochrome: "black and white high contrast",
  ocean: "cool blue teal colors",
  pastel: "soft pastel color palette",
};

export const generateThumbnail = async (req: Request, res: Response) => {
  try {
    const userId = req.session?.userId || "test_user_123";

    const {
      title,
      prompt: user_prompt,
      style,
      aspect_ratio,
      color_scheme,
      text_overlay,
    } = req.body;

    const aspectMap: Record<string, { w: number; h: number }> = {
      "16:9": { w: 1280, h: 720 },
      "1:1": { w: 1024, h: 1024 },
      "9:16": { w: 720, h: 1280 },
    };

    const { w, h } = aspectMap[aspect_ratio || "16:9"];

    const thumbnail = await Thumbnail.create({
      userId,
      title,
      prompt_used: user_prompt,
      user_prompt,
      style,
      aspect_ratio,
      color_scheme,
      text_overlay,
      isGenerating: true,
    });

    let finalPrompt = `${
      stylePrompts[style as keyof typeof stylePrompts] || ""
    } thumbnail for "${title}"`;
    if (color_scheme)
      finalPrompt += ` with ${
        colorSchemeDescriptions[
          color_scheme as keyof typeof colorSchemeDescriptions
        ]
      }`;
    if (user_prompt) finalPrompt += `. ${user_prompt}`;
    finalPrompt += `. professional YouTube thumbnail, high quality, 4k`;

    const seed = Math.floor(Math.random() * 1000000);
    const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(
      finalPrompt
    )}?width=${w}&height=${h}&seed=${seed}&nologo=true&model=flux`;

    const uploadResult = await cloudinary.uploader.upload(pollinationsUrl, {
      folder: "thumbnails",
      resource_type: "image",
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    thumbnail.image_url = uploadResult.secure_url;
    thumbnail.isGenerating = false;
    await thumbnail.save();

    console.log("Success! Image URL:", uploadResult.secure_url);

    res.status(201).json({
      message: "Thumbnail generated successfully",
      thumbnail,
    });
  } catch (error: any) {
    console.error("Error details:", error);
    res.status(500).json({
      message: "Thumbnail generation failed",
      error: error.message,
    });
  }
};

export const deleteThumbnail = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userId } = req.session;

    const thumbnail = await Thumbnail.findOneAndDelete({ _id: id, userId });
    if (!thumbnail) {
      return res.status(404).json({ message: "Thumbnail not found" });
    }

    res.status(200).json({ message: "Thumbnail deleted successfully" });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: "Thumbnail deletion failed" });
  }
};
