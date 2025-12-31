import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  colorSchemes,
  type AspectRatio,
  type IThumbnail,
  type ThumbnailStyle,
} from "../assets/assets/assets";
import SoftBackdrop from "../components/SoftBackdrop";
import AspectRatioSelect from "../components/AspectRatioSelect";
import StyleSelector from "../components/StyleSelector";
import ColorSchemeSelector from "../components/ColorSchemeSelector";
import PreviewPanel from "../components/PreviewPanel";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import api from "../configs/api";
import { motion } from "motion/react";

const Generate = () => {
  const { id } = useParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [title, setTitle] = useState("");
  const [additinalDetails, setAdditinalDetails] = useState("");
  const [thumbnail, setThumbnail] = useState<IThumbnail | null>(null);
  const [loading, setLoading] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("16:9");
  const [colorSchemeId, setColorSchemeId] = useState<string>(
    colorSchemes[0].id
  );
  const [style, setStyle] = useState<ThumbnailStyle>("Bold & Graphic");
  const [styleDropdownOpen, setStyleDropdownOpen] = useState(false);

  const handleGenerate = async () => {
    if (!isLoggedIn) {
      toast.error("Please login to generate a thumbnail");
      navigate("/login");
      return;
    }

    if (!title.trim()) return toast.error("Please enter a title");
    setLoading(true);
    const api_payload = {
      title,
      color_scheme: colorSchemeId,
      aspect_ratio: aspectRatio,
      style,
      prompt: additinalDetails,
      text_overlay: true,
    };
    const { data } = await api.post("/api/thumbnail/generate", api_payload);

    if (data) {
      toast.success(data.message);
      navigate(`/generate/${data.thumbnail._id}`);
      setLoading(false);
    }
  };

  const fetchThumbnail = async () => {
    try {
      const { data } = await api.get(`/api/user/thumbnail/${id}`);
      setThumbnail(data.thumbnail as IThumbnail);
      setLoading(!data.thumbnail.image_url);
      setAdditinalDetails(data.thumbnail.user_prompt);
      setTitle(data.thumbnail.title);
      setAspectRatio(data.thumbnail.aspect_ratio);
      setColorSchemeId(data.thumbnail.color_scheme);
      setStyle(data.thumbnail.style);
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (isLoggedIn && id) {
      fetchThumbnail();
    }

    if (id && loading && isLoggedIn) {
      const interval = setInterval(() => {
        fetchThumbnail();
      }, 5000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [id, loading, isLoggedIn]);

  useEffect(() => {
    if (!id && thumbnail) {
      setThumbnail(null);
    }
  }, [pathname]);

  return (
    <>
      <SoftBackdrop />
      <div className="min-h-screen pt-24">
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-28 lg:pb-8">
          <div className="grid lg:grid-cols-[400px_1fr] gap-8">
            {/* Left Panel */}
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, ease: "easeInOut" }}
              className={`space-y-6 ${id && "pointer-events-none"}`}
            >
              <div className="p-6 rounded-2xl bg-white/8 border border-white/12 shadow-xl space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-zinc-100 mb-1">
                    Create your UI thumbnail
                  </h2>
                  <p className="text-sm text-zinc-400">
                    Describe your vision and let AI do the rest
                  </p>
                </div>
                <div className="space-y-3">
                  {/* Title input */}
                  <div>
                    <label className="block text-sm font-medium">
                      Title or Topic
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      maxLength={100}
                      placeholder="eg., Exploring Caves"
                      className="w-full px-4 py-3 rounded-lg border border-white/12 bg-black/20 text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:right-2 focus:ring-pink-500"
                    />
                    <div className="flex justify-end mt-2">
                      <span className="text-xs text-zinc-400">
                        {title.length}/100
                      </span>
                    </div>
                  </div>

                  {/* AspectRatio */}
                  <AspectRatioSelect
                    value={aspectRatio}
                    onChange={setAspectRatio}
                  />

                  {/* StyleSelector */}
                  <StyleSelector
                    value={style}
                    onChange={setStyle}
                    isOpen={styleDropdownOpen}
                    setIsOpen={setStyleDropdownOpen}
                  />

                  {/* ColorSchemeSelector */}
                  <ColorSchemeSelector
                    value={colorSchemeId}
                    onChange={setColorSchemeId}
                  />

                  {/* Details */}

                  <div className="space-y-2">
                    <label className="block text-sm font-medium">
                      Additional Prompts{" "}
                      <span className="text-zinc-400 text-xs">(optional)</span>
                    </label>
                    <textarea
                      value={additinalDetails}
                      onChange={(e) => setAdditinalDetails(e.target.value)}
                      rows={3}
                      placeholder="Add any specific elements, moof, or style preferences..."
                      className="w-full px-4 py-3 rounded-lg border border-white/10 bg-white/6 text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
                    ></textarea>
                  </div>
                </div>
                {/* Button */}
                {!id && (
                  <button
                    onClick={handleGenerate}
                    className="text-[15px] w-full py-3.5 rounded-xl font-medium bg-linear-to-b from-pink-500 to-pink-600 hover:from-pink-700 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? "Generating..." : "Generate"}
                  </button>
                )}
              </div>
            </motion.div>

            {/* Right Panel */}
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: "easeInOut" }}
            >
              <div className="p-6 rounded-2xl bg-white/8 border border-white/10 shadow-xl">
                <h2 className="text-lg font-semibold text-zinc-100 mb-4">
                  Preview
                </h2>
                <PreviewPanel
                  thumbnail={thumbnail}
                  isLoading={loading}
                  aspectRatio={aspectRatio}
                />
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Generate;
