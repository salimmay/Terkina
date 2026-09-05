// src/lib/crmService.ts
import { createClient } from '@/lib/supabase/client';

export interface PhotoProjectData {
  id: string;
  title: string;
  description: string;
  platform?: 'MED_ART' | 'TERKINA_PROD';
  category?: string;
  status: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED';
  sort_order: number;
  cover_image_url: string;
  created_at: string;
  frames_count?: number;
}

export interface ThreeDProductData {
  id: string;
  title: string;
  description: string;
  category: string;
  price: string;
  show_price: boolean;
  is_in_stock: boolean;
  available_colors: string[];
  cover_image_url: string;
  model_file_url?: string;
  print_specs: {
    material?: string;
    dimensions?: string;
    layerHeight?: string;
    printTime?: string;
    weight?: string;
    [key: string]: unknown;
  };
}

export interface MessageData {
  id: string;
  sender_name: string;
  sender_email?: string;
  service?: string;
  content: string;
  file_url?: string;
  status: 'UNREAD' | 'READ' | 'CONTACTED' | 'ARCHIVED';
  created_at: string;
}

// 1. Fetch Overview Live Counts from PostgreSQL
export async function getLiveStats() {
  const supabase = createClient();

  try {
    const [allPhotos, products, messages] = await Promise.all([
      supabase
        .from('photo_project')
        .select('id, description')
        .is('deleted_at', null),
      supabase
        .from('three_d_project')
        .select('id', { count: 'exact', head: true })
        .is('deleted_at', null),
      supabase
        .from('message')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'UNREAD'),
    ]);

    const photoRows = allPhotos.data || [];
    const weddingsCount = photoRows.filter((r) =>
      r.description?.includes('MED_ART') || !r.description?.includes('TERKINA_PROD')
    ).length;
    const commercialCount = photoRows.filter((r) =>
      r.description?.includes('TERKINA_PROD')
    ).length;

    return {
      weddingsCount,
      commercialCount,
      productsCount: products.count || 0,
      unreadMessages: messages.count || 0,
    };
  } catch (err) {
    console.error('getLiveStats error:', err);
    return {
      weddingsCount: 0,
      commercialCount: 0,
      productsCount: 0,
      unreadMessages: 0,
    };
  }
}

// 2. Fetch Photo Albums by Platform
export async function getPhotoProjects(platform: 'MED_ART' | 'TERKINA_PROD') {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('photo_project')
    .select('*, photo_gallery(id, image_url, sort_order)')
    .is('deleted_at', null)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('getPhotoProjects error:', error.message);
    return [];
  }

  type Row = Record<string, unknown> & {
    id: string;
    title: string;
    description: string | null;
    status: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED';
    sort_order: number;
    cover_image_url: string | null;
    created_at: string;
    photo_gallery?: Array<{ id: string }>;
  };

  const rows = (data || []) as unknown as Row[];

  return rows
    .filter((row) => {
      const desc = row.description || '';
      if (platform === 'MED_ART') {
        return desc.includes('MED_ART') || !desc.includes('TERKINA_PROD');
      }
      return desc.includes('TERKINA_PROD');
    })
    .map((row) => {
      const match = row.description?.match(/\[Platform:[^\]]*Category:\s*([^\]]+)\]/);
      return {
        id: row.id,
        title: row.title,
        description: (row.description || '').replace(/^\[[^\]]+\]\s*/, ''),
        platform,
        category: match ? match[1].trim() : 'Portfolio',
        status: row.status || 'PUBLISHED',
        sort_order: row.sort_order || 0,
        cover_image_url: row.cover_image_url || '',
        created_at: row.created_at,
        frames_count: row.photo_gallery?.length || 0,
      };
    }) as PhotoProjectData[];
}

// 3. Fetch 3D Products
export async function get3DProducts() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('three_d_project')
    .select('*')
    .is('deleted_at', null)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('get3DProducts error:', error.message);
    return [];
  }

  return (data || []).map((row: Record<string, unknown>) => {
    const specs = (row.print_specs || {}) as Record<string, unknown>;
    return {
      id: row.id as string,
      title: row.title as string,
      description: (row.description as string) || '',
      category: (specs.category as string) || 'decor',
      price: (specs.price as string) || '180 TND',
      show_price: (row.show_price as boolean) ?? (specs.show_price as boolean) ?? true,
      is_in_stock: (row.is_in_stock as boolean) ?? (specs.is_in_stock as boolean) ?? true,
      available_colors:
        (row.available_colors as string[]) ??
        (specs.available_colors as string[]) ??
        ['Default / Natural'],
      cover_image_url: (row.cover_image_url as string) || '',
      model_file_url: (row.model_file_url as string) || undefined,
      print_specs: {
        material: (specs.material as string) || 'Matte PLA',
        dimensions: (specs.dimensions as string) || '18 × 18 × 24 cm',
        layerHeight: (specs.layerHeight as string) || '0.12 mm',
        printTime: (specs.printTime as string) || '22 Hours',
        weight: (specs.weight as string) || '520g',
      },
    };
  }) as ThreeDProductData[];
}

// 4. Fetch Client Leads
export async function getMessages(filterStatus?: string) {
  const supabase = createClient();
  let query = supabase.from('message').select('*').order('created_at', { ascending: false });

  if (filterStatus && filterStatus !== 'ALL') {
    query = query.eq('status', filterStatus);
  }

  const { data, error } = await query;
  if (error) {
    if (error.code === 'PGRST205') {
      console.warn('Supabase table `message` not yet created. Run `supabase/complete_setup.sql`.');
    } else {
      console.error('getMessages error:', error.message);
    }
    return [];
  }

  return (data || []).map((row: Record<string, unknown>) => {
    const content = (row.content as string) || '';
    const match = content.match(/^\[Service: ([^\]]+)\]\s*/);
    return {
      id: row.id as string,
      sender_name: (row.sender_name as string) || 'Anonymous',
      sender_email: (row.sender_email as string) || '',
      service: match ? match[1] : 'General Inquiry',
      content: match ? content.slice(match[0].length) : content,
      file_url: (row.file_url as string) || undefined,
      status: (row.status as MessageData['status']) || 'UNREAD',
      created_at: (row.created_at as string) || new Date().toISOString(),
    };
  }) as MessageData[];
}
