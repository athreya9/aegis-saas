const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const path = require('path');
const fs = require('fs');

ffmpeg.setFfmpegPath(ffmpegPath);

const EXTENSION = 'png';
const ASSETS_DIR = path.join(__dirname, '../public/demo');
const OUTPUT_FILE = path.join(ASSETS_DIR, 'aegis-demo.mp4');

// Define the sequence
const FRAMES = [
    { file: 'title.png', duration: 3 },
    { file: 'frame1.png', duration: 5 },
    { file: 'frame2.png', duration: 5 },
    { file: 'frame3.png', duration: 5 },
    { file: 'frame5.png', duration: 5 }, // Skip frame4 (Admin)
    { file: 'outro.png', duration: 4 }
];

console.log('Initializing Aegis Cinematic Engine...');

// Create a temporary complex filter complex string
// We need to chain input inputs
let command = ffmpeg();

// Add inputs
FRAMES.forEach(frame => {
    command.input(path.join(ASSETS_DIR, frame.file)).loop(frame.duration);
});

// Build complex filter for Ken Burns + Fade
// We zoom from 1.0 to 1.1 over duration
let filterComplex = [];
let layout = '';

FRAMES.forEach((frame, i) => {
    // Zoom Pan effect
    filterComplex.push(`[${i}:v]scale=1920:1080,setsar=1,zoompan=z='min(zoom+0.0015,1.5)':d=${frame.duration * 25}:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1920x1080[v${i}]`);
});

// Concatenate with crossfade
let concatStr = '';
for (let i = 0; i < FRAMES.length; i++) {
    concatStr += `[v${i}]`;
    if (i > 0) {
        // We are just concatenating for stability first, xfade is tricky with loop
        // Let's stick to simple concat for reliability on static ffmpeg
    }
}
// Using standard concat filter
filterComplex.push(`${concatStr}concat=n=${FRAMES.length}:v=1:a=0[v]`);

// Audio Generation (Sci-Fi Drone)
// Sine wave at 100Hz + Brown noise for texture
// We generate audio separately
// filterComplex.push(`aevalsrc=sin(100*2*PI*t)|sin(100*2*PI*t):d=27[a]`);

command
    .complexFilter(filterComplex)
    .outputOptions([
        '-map [v]',
        '-c:v libx264',
        '-pix_fmt yuv420p', // Important for browser compatibility
        '-t 27', // Total duration
        '-r 25'
    ])
    // Add synthesized audio track
    .input('anullsrc=channel_layout=stereo:sample_rate=44100')
    .inputOptions(['-f lavfi'])
    // We will just do video first to ensure it works, getting "complex audio synth" right in one go is risky
    .save(OUTPUT_FILE)
    .on('start', (cmd) => console.log('FFmpeg Command:', cmd))
    .on('error', (err) => console.error('Render Error:', err))
    .on('end', () => console.log('Rendering Complete: ' + OUTPUT_FILE));

