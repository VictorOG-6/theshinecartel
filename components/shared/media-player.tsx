"use client";

import { SquarePlay, Tv, Volume2, VolumeX, X } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { AiFillInstagram } from "react-icons/ai";
import { FaXTwitter } from "react-icons/fa6";
import { FaTiktok } from "react-icons/fa";
import Link from "next/link";

const VIDEO_SOURCES = [
  "/videos/video-1.mp4",
  "/videos/video-2.mp4",
  "/videos/video-3.mp4",
  "/videos/video-4.mp4",
  "/videos/video-5.mp4",
  "/videos/video-6.mp4",
  "/videos/video-7.mp4",
  "/videos/video-8.mp4",
  "/videos/video-9.mp4",
] as const;

const MediaPlayer = () => {
  const [isOpen, setIsOpen] = useState(true);
  /** Browsers block unmuted autoplay; start muted so playback reliably begins on load. */
  const [isMuted, setIsMuted] = useState(true);
  const [videoIndex, setVideoIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleVideoEnded = useCallback(() => {
    setVideoIndex((i) => (i + 1) % VIDEO_SOURCES.length);
  }, []);

  const toggleMuted = useCallback(() => {
    setIsMuted((m) => {
      const next = !m;
      if (!next) void videoRef.current?.play().catch(() => {});
      return next;
    });
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    void videoRef.current?.play().catch(() => {});
  }, [videoIndex, isOpen]);

  return (
    <div className="fixed z-50 bottom-5 right-8">
      {isOpen ? (
        <div className="relative w-58.75 bg-black shadow-2xl rounded-lg">
          <div className="flex items-center justify-center gap-2.5 p-2.5 text-white">
            <button
              type="button"
              aria-label={isMuted ? "Unmute video" : "Mute video"}
              className="cursor-pointer hover:text-primary"
              onClick={toggleMuted}
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            <h2 className="text-sm font-semibold font-roboto-mono">
              Shine Cartel TV
            </h2>
          </div>
          <video
            ref={videoRef}
            key={videoIndex}
            src={VIDEO_SOURCES[videoIndex]}
            className="h-67.25 w-full object-cover"
            autoPlay
            muted={isMuted}
            playsInline
            preload="auto"
            onEnded={handleVideoEnded}
          />
          <div className="flex items-center justify-center gap-3 p-2.5 text-white">
            <Link
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X (Twitter)"
            >
              <FaXTwitter
                size={20}
                className="cursor-pointer hover:text-primary"
              />
            </Link>

            <Link
              href="https://instagram.com/The Shine Cartelr.beauty/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <AiFillInstagram
                size={20}
                className="cursor-pointer hover:text-primary"
              />
            </Link>

            <Link
              href="https://tiktok.com/@The Shine Cartel.beauty/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
            >
              <FaTiktok
                size={20}
                className="cursor-pointer hover:text-primary"
              />
            </Link>
          </div>
          <div
            className="absolute -top-2.5 -right-2.5 w-7 h-7 rounded-full flex items-center justify-center text-white cursor-pointer transition-all duration-300 bg-black hover:text-primary"
            onClick={() => setIsOpen(false)}
          >
            <X size={20} />
          </div>
        </div>
      ) : (
        <div
          className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white cursor-pointer border transition-all duration-300 hover:bg-white hover:text-primary hover:border-primary shadow-2xl"
          onClick={() => setIsOpen(true)}
        >
          <SquarePlay size={20} />
        </div>
      )}
    </div>
  );
};

export default MediaPlayer;
