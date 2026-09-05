import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

// Configure Cloudinary Node SDK
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// ---------------------------------------------------------------------------
// Security guards: MIME whitelisting + size caps + path-traversal protection
// ---------------------------------------------------------------------------
const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
  'video/mp4',
  'video/webm',
  'video/quicktime',
  'model/gltf-binary', // .glb
  'model/gltf+json', // .gltf
  'application/octet-stream', // Fallback for raw .glb / .stl binaries
]);

const ALLOWED_EXTENSIONS = /\.(jpe?g|png|webp|avif|mp4|webm|mov|glb|gltf|stl)$/i;
const MAX_FILE_SIZE = 35 * 1024 * 1024; // 35MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const rawFolder = (formData.get('folder') as string) || 'terkina_media';
    const resourceTypeOverride =
      (formData.get('resource_type') as 'auto' | 'image' | 'video' | 'raw') || 'auto';

    if (!file) {
      return NextResponse.json({ error: 'No file provided in form data' }, { status: 400 });
    }

    // 1. File Size Verification (prevents memory exhaustion / DoS)
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File size exceeds maximum limit (35MB)' },
        { status: 413 }
      );
    }

    // 2. MIME-Type Whitelisting (blocks .exe/.php/.sh and other executables)
    const extOk = ALLOWED_EXTENSIONS.test(file.name);
    const mimeOk = file.type ? ALLOWED_MIME_TYPES.has(file.type) : false;
    if (!mimeOk && !extOk) {
      return NextResponse.json(
        {
          error:
            'Forbidden file format. Only verified images, videos, and 3D models are permitted.',
        },
        { status: 415 }
      );
    }

    // 3. Sanitize folder name (prevents Cloudinary path traversal)
    const sanitizedFolder = rawFolder.replace(/[^a-zA-Z0-9_/-]/g, '');

    // Verify Cloudinary configuration
    const cloudName =
      process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      console.warn(
        '⚠️ Cloudinary environment variables (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET) not fully configured in environment.'
      );
      return NextResponse.json(
        {
          error:
            'Cloudinary credentials missing in .env (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET)',
          code: 'CLOUDINARY_CONFIG_MISSING',
        },
        { status: 500 }
      );
    }

    // Convert in-memory buffer to Data URI for atomic upload with extended timeout
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const mimeType = file.type || 'application/octet-stream';
    const fileDataUri = `data:${mimeType};base64,${buffer.toString('base64')}`;

    const uploadResult = await cloudinary.uploader.upload(fileDataUri, {
      folder: sanitizedFolder,
      resource_type: resourceTypeOverride,
      use_filename: true,
      unique_filename: true,
      filename_override: file.name.replace(/[^\w.\-]/g, '_'),
      timeout: 120000, // 120s timeout prevents 499 Request Timeout on large media
    });

    return NextResponse.json({
      success: true,
      url: uploadResult.secure_url,
      secure_url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
      resource_type: uploadResult.resource_type,
      format: uploadResult.format,
      bytes: uploadResult.bytes,
      width: uploadResult.width,
      height: uploadResult.height,
      duration: uploadResult.duration,
      original_filename: uploadResult.original_filename,
    });
  } catch (error: unknown) {
    const err = error as { message?: string };
    console.error('Cloudinary upload error:', err);
    return NextResponse.json(
      {
        error: err.message || 'Failed to upload asset to Cloudinary',
      },
      { status: 500 }
    );
  }
}
