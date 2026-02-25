#!/usr/bin/env python3
"""
Bulk compress and optimize gallery images
Generates multiple sizes: 400w, 800w, 1200w, 1920w
Converts to WebP for 60-80% size reduction

Usage:
    pip install Pillow supabase requests tqdm python-dotenv
    python scripts/compress_gallery_images.py
"""

import os
import io
import sys
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed

try:
    from PIL import Image
    from supabase import create_client, Client
    import requests
    from tqdm import tqdm
    from dotenv import load_dotenv
except ImportError as e:
    print(f"Missing dependency: {e}")
    print("Install with: pip install Pillow supabase requests tqdm python-dotenv")
    sys.exit(1)

# Load environment variables
load_dotenv()

# Configuration
SUPABASE_URL = os.getenv('SUPABASE_URL') or os.getenv('VITE_SUPABASE_URL')
SUPABASE_SERVICE_KEY = os.getenv('SUPABASE_SERVICE_ROLE_KEY')
SIZES = [400, 800, 1200, 1920]
QUALITY = 85
MAX_WORKERS = 4


def compress_image(image_bytes: bytes, target_width: int, quality: int = 85) -> bytes:
    """Compress and resize image to target width"""
    img = Image.open(io.BytesIO(image_bytes))
    
    # Convert to RGB if needed
    if img.mode in ('RGBA', 'LA', 'P'):
        background = Image.new('RGB', img.size, (255, 255, 255))
        if img.mode == 'P':
            img = img.convert('RGBA')
        if img.mode == 'RGBA':
            background.paste(img, mask=img.split()[-1])
        else:
            background.paste(img)
        img = background
    elif img.mode != 'RGB':
        img = img.convert('RGB')
    
    # Calculate proportional height
    if target_width < img.width:
        ratio = target_width / img.width
        target_height = int(img.height * ratio)
        img = img.resize((target_width, target_height), Image.Resampling.LANCZOS)
    
    # Save as WebP
    output = io.BytesIO()
    img.save(output, format='WEBP', quality=quality, method=6)
    output.seek(0)
    
    return output.getvalue()


def process_image(supabase: Client, image_record: dict) -> dict:
    """Process a single gallery image"""
    image_id = image_record.get('id', 'unknown')
    image_url = image_record.get('image_url') or image_record.get('cover_image_url')
    
    if not image_url:
        return {'id': image_id, 'status': 'error', 'message': 'No image URL'}
    
    try:
        # Download original
        response = requests.get(image_url, timeout=30)
        if response.status_code != 200:
            return {'id': image_id, 'status': 'error', 'message': f'Download failed: {response.status_code}'}
        
        original_bytes = response.content
        original_size = len(original_bytes)
        
        compressed_versions = {}
        total_compressed_size = 0
        
        # Generate multiple sizes
        for width in SIZES:
            try:
                compressed = compress_image(original_bytes, width, QUALITY)
                compressed_size = len(compressed)
                total_compressed_size += compressed_size
                
                # Upload to Supabase Storage
                file_name = f"optimized/{image_id}_{width}w.webp"
                
                supabase.storage.from_('gallery-images').upload(
                    file_name,
                    compressed,
                    {
                        'content-type': 'image/webp',
                        'cache-control': '31536000',
                        'upsert': 'true'
                    }
                )
                
                # Get public URL
                url_result = supabase.storage.from_('gallery-images').get_public_url(file_name)
                compressed_versions[f'{width}w'] = url_result
                
            except Exception as e:
                print(f"  Warning: Failed {width}w for {image_id}: {e}")
                continue
        
        if not compressed_versions:
            return {'id': image_id, 'status': 'error', 'message': 'All compressions failed'}
        
        # Generate srcset
        srcset = ', '.join([f"{url} {size}" for size, url in compressed_versions.items()])
        
        # Update database
        update_data = {
            'thumbnail_url': compressed_versions.get('400w', image_url),
            'srcset': srcset,
            'original_size': original_size,
            'compressed_size': total_compressed_size,
            'optimized_at': 'now()'
        }
        
        # Try gallery_images first, then gallery_designs
        try:
            supabase.table('gallery_images').update(update_data).eq('id', image_id).execute()
        except:
            try:
                supabase.table('gallery_designs').update(update_data).eq('id', image_id).execute()
            except Exception as e:
                print(f"  Warning: Could not update database for {image_id}: {e}")
        
        compression_ratio = ((original_size - total_compressed_size) / original_size) * 100 if original_size > 0 else 0
        
        return {
            'id': image_id,
            'status': 'success',
            'original_size': original_size,
            'compressed_size': total_compressed_size,
            'compression_ratio': f"{compression_ratio:.1f}%",
            'versions': len(compressed_versions)
        }
        
    except Exception as e:
        return {'id': image_id, 'status': 'error', 'message': str(e)}


def main():
    """Main compression pipeline"""
    print("=" * 60)
    print("HOUSPIRE GALLERY IMAGE COMPRESSION")
    print("=" * 60)
    
    if not SUPABASE_URL or not SUPABASE_SERVICE_KEY:
        print("\nError: Missing environment variables!")
        print("Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY")
        sys.exit(1)
    
    # Initialize Supabase
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)
    
    # Fetch all gallery images
    print("\nFetching gallery images...")
    
    images = []
    
    # Try gallery_images table
    try:
        result = supabase.table('gallery_images').select('id, image_url, title').execute()
        images.extend(result.data or [])
    except Exception as e:
        print(f"Note: gallery_images table: {e}")
    
    # Try gallery_designs table
    try:
        result = supabase.table('gallery_designs').select('id, cover_image_url, design_title').execute()
        for item in (result.data or []):
            images.append({
                'id': item['id'],
                'image_url': item.get('cover_image_url'),
                'title': item.get('design_title')
            })
    except Exception as e:
        print(f"Note: gallery_designs table: {e}")
    
    if not images:
        print("No images found to process.")
        return
    
    print(f"Found {len(images)} images to compress")
    print(f"Target sizes: {SIZES}")
    print(f"Quality: {QUALITY}%")
    print(f"Workers: {MAX_WORKERS}")
    print()
    
    # Process images in parallel
    results = []
    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
        futures = {executor.submit(process_image, supabase, img): img for img in images}
        
        with tqdm(total=len(images), desc="Compressing") as pbar:
            for future in as_completed(futures):
                result = future.result()
                results.append(result)
                
                if result['status'] == 'success':
                    pbar.set_postfix({
                        'ratio': result.get('compression_ratio', 'N/A'),
                        'versions': result.get('versions', 0)
                    })
                
                pbar.update(1)
    
    # Summary
    print("\n" + "=" * 60)
    print("COMPRESSION SUMMARY")
    print("=" * 60)
    
    successful = [r for r in results if r['status'] == 'success']
    failed = [r for r in results if r['status'] == 'error']
    
    print(f"✓ Successful: {len(successful)}")
    print(f"✗ Failed: {len(failed)}")
    
    if successful:
        total_original = sum(r.get('original_size', 0) for r in successful)
        total_compressed = sum(r.get('compressed_size', 0) for r in successful)
        total_saved = total_original - total_compressed
        avg_ratio = (total_saved / total_original * 100) if total_original > 0 else 0
        
        print(f"\nOriginal Size: {total_original / 1024 / 1024:.1f} MB")
        print(f"Compressed Size: {total_compressed / 1024 / 1024:.1f} MB")
        print(f"Space Saved: {total_saved / 1024 / 1024:.1f} MB ({avg_ratio:.1f}%)")
    
    if failed:
        print("\nFailed images (first 10):")
        for r in failed[:10]:
            print(f"  • {r['id']}: {r.get('message', 'Unknown error')}")
    
    print("\n✓ Compression complete!")


if __name__ == '__main__':
    main()
