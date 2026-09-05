import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

type ResourceType = 'image' | 'video' | 'raw';

// Our own upload route never applies transformations, so a Cloudinary URL we
// produced always looks like:
//   https://res.cloudinary.com/<cloud>/<resource_type>/upload/v<version>/<public_id>.<ext>
function parseCloudinaryUrl(url: string): { publicId: string; resourceType: ResourceType } | null {
  const match = url.match(/\/(image|video|raw)\/upload\/(.+)$/);
  if (!match) return null;

  const resourceType = match[1] as ResourceType;
  const rest = match[2].split('?')[0].replace(/^v\d+\//, '');
  const publicId = rest.replace(/\.[a-zA-Z0-9]+$/, '');
  if (!publicId) return null;

  return { publicId, resourceType };
}

export async function POST(request: NextRequest) {
  try {
    const { urls } = (await request.json()) as { urls?: unknown };
    if (!Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json({ error: 'No URLs provided' }, { status: 400 });
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    if (!cloudName || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return NextResponse.json({ error: 'Cloudinary credentials missing in .env' }, { status: 500 });
    }

    // Only ever touch assets that actually live on our own Cloudinary account.
    const ownUrls = urls.filter(
      (u): u is string => typeof u === 'string' && u.includes(`res.cloudinary.com/${cloudName}/`)
    );

    const results = await Promise.all(
      ownUrls.map(async (url) => {
        const parsed = parseCloudinaryUrl(url);
        if (!parsed) return { url, skipped: true as const };
        try {
          const result = await cloudinary.uploader.destroy(parsed.publicId, {
            resource_type: parsed.resourceType,
          });
          return { url, result };
        } catch (err) {
          return { url, error: (err as Error).message };
        }
      })
    );

    return NextResponse.json({ success: true, results });
  } catch (error: unknown) {
    const err = error as { message?: string };
    return NextResponse.json({ error: err.message || 'Failed to delete assets' }, { status: 500 });
  }
}
