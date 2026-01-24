"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Play, Volume2, VolumeX, Maximize2, Radio } from 'lucide-react';

interface DemoPlayerProps {
    videoUrl?: string;
    title?: string;
    caption?: string;
}

const DEMO_FRAMES = [
    { url: '/demo/frame1.png', label: 'Inbound Perimeter Analysis' },
    { url: '/demo/frame2.png', label: 'Institutional Risk Engine' },
    { url: '/demo/frame3.png', label: 'User Provisioning Protocol' },
    { url: '/demo/frame5.png', label: 'Active Perimeter Dashboard' }
];

export const DemoPlayer = ({ videoUrl, title, caption }: DemoPlayerProps) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentFrame, setCurrentFrame] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [isMuted, setIsMuted] = useState(true);

    // Audio ref
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Initial audio setup
    useEffect(() => {
        audioRef.current = new Audio('https://cdn.pixabay.com/audio/2022/03/24/audio_34b6b66355.mp3'); // Ambient Tech Background
        audioRef.current.loop = true;
        audioRef.current.volume = 0.4;
    }, []);

    // Playback Logic
    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isPlaying) {
            // Start Audio if not muted
            if (audioRef.current) {
                if (!isMuted) audioRef.current.play().catch(() => { });
            }

            interval = setInterval(() => {
                setIsTransitioning(true);
                setTimeout(() => {
                    setCurrentFrame((prev) => (prev + 1) % DEMO_FRAMES.length);
                    setIsTransitioning(false);
                }, 800); // Slower cross-fade due to cinematic feel
            }, 6000); // 6s per frame for Ken Burns to breathe
        } else {
            if (audioRef.current) audioRef.current.pause();
        }
        return () => clearInterval(interval);
    }, [isPlaying, isMuted]);

    // Handle Mute Toggle
    const toggleMute = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (audioRef.current) {
            if (isMuted) {
                audioRef.current.play().catch(() => { });
                setIsMuted(false);
            } else {
                audioRef.current.pause();
                setIsMuted(true);
            }
        }
    };

    return (
        <div className="relative aspect-video rounded-xl overflow-hidden border border-white/5 bg-zinc-950 group shadow-2xl shadow-black/50">
            {!isPlaying ? (
                <button
                    onClick={() => setIsPlaying(true)}
                    className="absolute inset-0 z-30 flex items-center justify-center bg-black/60 backdrop-blur-sm group-hover:bg-black/40 transition-all duration-500"
                >
                    <div className="flex flex-col items-center group/btn">
                        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover/btn:scale-110 group-hover/btn:border-white/30 transition-all duration-500 backdrop-blur-md relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500" />
                            <Play className="text-white fill-white ml-2 w-8 h-8 relative z-10" />
                        </div>
                        <div className="mt-6 text-center">
                            <p className="text-white font-black text-xs uppercase tracking-[0.3em] mb-2 animate-pulse">Initialize Simulation</p>
                            <p className="text-zinc-500 text-[10px] font-mono uppercase tracking-widest">{caption}</p>
                        </div>
                    </div>
                </button>
            ) : null}

            {/* Simulation Content */}
            <div className="absolute inset-0 bg-zinc-950 flex items-center justify-center overflow-hidden">
                {isPlaying ? (
                    <div className={`relative w-full h-full transition-opacity duration-1000 ${isTransitioning ? 'opacity-80 blur-[2px]' : 'opacity-100 blur-0'}`}>
                        {/* Ken Burns Image */}
                        <img
                            key={currentFrame} // Force re-render for animation reset
                            src={DEMO_FRAMES[currentFrame].url}
                            alt="Simulation Frame"
                            className="w-full h-full object-cover animate-ken-burns origin-center"
                        />

                        {/* Institutional Overlay System */}
                        <div className="absolute inset-0 pointer-events-none">
                            {/* Scanline */}
                            <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] opacity-10" />
                            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent h-[20%] w-full animate-scan opacity-20 composite-screen" />

                            {/* Vignette */}
                            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/90 to-transparent" />
                            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/90 to-transparent" />

                            {/* Grid Overlay */}
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[length:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)]" />
                        </div>

                        {/* HUD Elements */}
                        <div className="absolute top-6 left-8 flex items-center gap-3 z-20">
                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                            <p className="text-[10px] font-mono text-red-500 tracking-widest uppercase">REC • {DEMO_FRAMES[currentFrame].label}</p>
                        </div>

                        <div className="absolute top-6 right-8 flex items-center gap-4 z-20">
                            <div className="flex flex-col items-end">
                                <p className="text-[10px] font-mono text-zinc-500">SYS_TIME</p>
                                <p className="text-xs font-mono text-white/80">{new Date().toISOString().split('T')[1].split('.')[0]}Z</p>
                            </div>
                        </div>

                        {/* Controls Bar */}
                        <div className="absolute inset-x-0 bottom-0 p-6 flex items-end justify-between z-20">
                            <div className="flex flex-col gap-1">
                                <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-tighter">Current View</p>
                                <div className="flex items-center gap-2">
                                    <div className="w-1 h-3 bg-indigo-500" />
                                    <p className="text-sm text-white font-bold uppercase tracking-widest">{title || 'System Overview'}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                {/* Audio Toggle */}
                                <button
                                    onClick={toggleMute}
                                    className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors group/audio"
                                >
                                    {isMuted ? (
                                        <VolumeX size={16} className="text-zinc-400 group-hover/audio:text-white" />
                                    ) : (
                                        <Volume2 size={16} className="text-indigo-400" />
                                    )}
                                </button>

                                <div className="h-8 w-[1px] bg-white/10" />

                                <div className="text-right">
                                    <p className="text-[10px] text-zinc-600 font-mono">Sim_Connect_v2.4</p>
                                    <div className="flex items-center justify-end gap-1.5 mt-1">
                                        <Radio size={10} className="text-green-500 animate-pulse" />
                                        <p className="text-[10px] text-green-500 font-mono tracking-widest">ONLINE</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1642790103517-18129f55c2bb?auto=format&fit=crop&q=80')] bg-cover opacity-20 grayscale mix-blend-overlay" />
                )}
            </div>

            {/* Cinematic Corners */}
            <div className="absolute top-6 left-6 w-8 h-[1px] bg-white/20 z-20" />
            <div className="absolute top-6 left-6 w-[1px] h-8 bg-white/20 z-20" />
            <div className="absolute bottom-6 right-6 w-8 h-[1px] bg-white/20 z-20" />
            <div className="absolute bottom-6 right-6 w-[1px] h-8 bg-white/20 z-20" />
        </div>
    );
};
