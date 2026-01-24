from PIL import Image
import numpy as np
import os

def process_logo(input_path, output_path):
    print(f"Processing {input_path}...")
    try:
        img = Image.open(input_path).convert("RGBA")
        data = np.array(img)

        # 1. Threshold for "White" background
        # Pixels with R,G,B > 220 are considered background
        r, g, b, a = data.T
        white_areas = (r > 200) & (g > 200) & (b > 200)
        
        # Make white areas transparent
        data[..., 3][white_areas.T] = 0
        
        # 2. Check remaining content (Foreground)
        # If the foreground is mostly dark (for a white paper logo), we need to invert it or make it white
        # to show up on the dark website.
        
        # Mask for non-transparent pixels
        non_transparent = data[..., 3] > 0
        
        if np.any(non_transparent):
            # Calculate average brightness of foreground
            fg_r = data[..., 0][non_transparent]
            fg_g = data[..., 1][non_transparent]
            fg_b = data[..., 2][non_transparent]
            
            avg_brightness = (np.mean(fg_r) + np.mean(fg_g) + np.mean(fg_b)) / 3
            print(f"Foreground Average Brightness: {avg_brightness}")
            
            # If brightness is low (dark logo), brighten it up
            if avg_brightness < 100:
                print("Dark logo detected. Inverting/Brightening for Dark Mode...")
                # Simple strategy: Turn dark pixels to White, preserve Alpha
                # Or Invert RGB? Let's just make it White to be safe and "Institutional"
                data[..., 0][non_transparent] = 255
                data[..., 1][non_transparent] = 255
                data[..., 2][non_transparent] = 255
                
        # Save
        result = Image.fromarray(data)
        result.save(output_path)
        print(f"Saved processed logo to {output_path}")
        
    except Exception as e:
        print(f"Error processing logo: {e}")

if __name__ == "__main__":
    process_logo("frontend/public/logo.png", "frontend/public/logo-processed.png")
