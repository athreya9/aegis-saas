"use client";

import React, { useState, useEffect } from 'react';
import { Play, Volume2, Maximize2 } from 'lucide-react';

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

export const DemoPlayer = ({ videoUrl, caption }: DemoPlayerProps) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentFrame, setCurrentFrame] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);

    useEffect(() => {
        let interval: any;
        if (isPlaying) {
            interval = setInterval(() => {
                setIsTransitioning(true);
                setTimeout(() => {
                    setCurrentFrame((prev) => (prev + 1) % DEMO_FRAMES.length);
                    setIsTransitioning(false);
                }, 500); // Cross-fade duration
            }, 5000); // Frame duration
        }
        return () => clearInterval(interval);
    }, [isPlaying]);

    return (
        <div className="relative aspect-video rounded-xl overflow-hidden border border-white/5 bg-zinc-950 group">
            {!isPlaying ? (
                <button
                    onClick={() => setIsPlaying(true)}
                    className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-sm group-hover:bg-black/20 transition-all duration-300"
                >
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform duration-500">
                            <Play className="text-white fill-white ml-1 w-6 h-6" />
                        </div>
                        <div className="mt-4 text-center">
                            <p className="text-white font-black text-xs uppercase tracking-[0.3em] mb-1">Initialize Simulation</p>
                            <p className="text-zinc-500 text-[10px] font-mono uppercase tracking-widest">{caption}</p>
                        </div>
                    </div>
                </button>
            ) : null}

            {/* Simulation Content */}
            <div className="absolute inset-0 bg-zinc-950 flex items-center justify-center">
                {isPlaying ? (
                    <div className={`relative w-full h-full transition-opacity duration-500 ${isTransitioning ? 'opacity-40' : 'opacity-100'}`}>
                        <img
                            src={DEMO_FRAMES[currentFrame].url}
                            alt="Simulation Frame"
                            className="w-full h-full object-cover"
                        />

                        {/* Scanner Effect Overlay */}
                        <div className="absolute inset-0 pointer-events-none overflow-hidden">
                            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/80 to-transparent" />
                        </div>

                        {/* Simulation Status Overlay */}
                        <div className="absolute inset-x-0 bottom-0 p-4 flex flex-col gap-2 z-10">
                            <div className="flex justify-between items-end border-b border-white/10 pb-2">
                                <div>
                                    <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-tighter">System Output</p>
                                    <p className="text-sm text-white font-medium uppercase tracking-widest">{DEMO_FRAMES[currentFrame].label}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] text-zinc-500 font-mono">FRAME_ID: {currentFrame.toString().padStart(2, '0')}</p>
                                    <p className="text-[10px] text-green-500 font-mono">LIVE_STREAM_ACTIVE</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1642790103517-18129f55c2bb?auto=format&fit=crop&q=80')] bg-cover opacity-20 grayscale" />
                )}
            </div>

            {/* Viewport Corners */}
            <div className="absolute top-4 left-4 w-4 h-[1px] bg-white/20" />
            <div className="absolute top-4 left-4 w-[1px] h-4 bg-white/20" />
            <div className="absolute top-4 right-4 w-4 h-[1px] bg-white/20" />
            <div className="absolute top-4 right-4 w-[1px] h-4 bg-white/20" />
        </div>
    );
};
