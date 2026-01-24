"use client";

import React, { useRef, useState, useEffect } from 'react';
import { Play, Volume2, VolumeX, Maximize2 } from 'lucide-react';

interface DemoPlayerProps {
    videoUrl?: string; // Kept for compatibility, but we default to generated
    title?: string;
    caption?: string;
}

export const DemoPlayer = ({ videoUrl, title, caption }: DemoPlayerProps) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(true);

    const togglePlay = () => {
        if (!videoRef.current) return;
        if (isPlaying) {
            videoRef.current.pause();
            setIsPlaying(false);
        } else {
            videoRef.current.play();
            setIsPlaying(true);
        }
    };

    const toggleMute = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!videoRef.current) return;
        videoRef.current.muted = !videoRef.current.muted;
        setIsMuted(videoRef.current.muted);
    };

    const toggleFullscreen = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!videoRef.current) return;
        if (videoRef.current.requestFullscreen) {
            videoRef.current.requestFullscreen();
        }
    };

    return (
        <div className="relative aspect-video rounded-xl overflow-hidden border border-white/5 bg-zinc-950 group shadow-2xl shadow-indigo-500/10">
            {/* The Cinematic Video File */}
            <video
                ref={videoRef}
                src="/demo/aegis-demo.mp4"
                className="w-full h-full object-cover"
                loop
                muted={isMuted}
                playsInline
                poster="/demo/title.png"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
            />

            {/* Play/Pause Overlay */}
            {!isPlaying && (
                <button
                    onClick={togglePlay}
                    className="absolute inset-0 z-30 flex items-center justify-center bg-black/60 backdrop-blur-sm group-hover:bg-black/40 transition-all duration-500"
                >
                    <div className="flex flex-col items-center group/btn">
                        <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover/btn:scale-110 group-hover/btn:border-indigo-500/50 transition-all duration-500 backdrop-blur-md relative overflow-hidden shadow-[0_0_40px_-10px_rgba(99,102,241,0.3)]">
                            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500" />
                            <Play className="text-white fill-white ml-2 w-10 h-10 relative z-10" />
                        </div>
                        <div className="mt-8 text-center">
                            <p className="text-white font-black text-sm uppercase tracking-[0.3em] mb-2">Watch Product Tour</p>
                            <p className="text-zinc-500 text-[10px] font-mono uppercase tracking-widest">Cinematic 4K • 0:27</p>
                        </div>
                    </div>
                </button>
            )}

            {/* Controls Bar (Visible on Hover) */}
            <div className={`absolute inset-x-0 bottom-0 p-6 flex items-end justify-between z-40 transition-opacity duration-300 ${isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>
                <div className="flex flex-col gap-1">
                    <p className="text-[10px] text-indigo-400 font-mono uppercase tracking-widest animate-pulse">Live Playback</p>
                    <p className="text-sm text-white font-bold tracking-wider">{title || 'Aegis Platform Overview'}</p>
                </div>

                <div className="flex items-center gap-4">
                    {/* Mute Toggle */}
                    <button
                        onClick={toggleMute}
                        className="p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition-colors"
                        title={isMuted ? "Unmute" : "Mute"}
                    >
                        {isMuted ? <VolumeX size={18} className="text-white" /> : <Volume2 size={18} className="text-indigo-400" />}
                    </button>

                    {/* Download/Fullscreen */}
                    <a
                        href="/demo/aegis-demo.mp4"
                        download="Aegis_Product_Tour.mp4"
                        className="p-2 rounded-full bg-indigo-600/80 hover:bg-indigo-500 backdrop-blur-md transition-colors text-white text-[10px] font-bold px-4 tracking-wider flex items-center gap-2"
                        onClick={(e) => e.stopPropagation()}
                    >
                        DOWNLOAD MP4
                    </a>

                    <button
                        onClick={toggleFullscreen}
                        className="p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition-colors"
                    >
                        <Maximize2 size={18} className="text-white" />
                    </button>
                </div>
            </div>

            {/* Vignette Overlay (always subtle) */}
            <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.6)]" />
        </div>
    );
};
