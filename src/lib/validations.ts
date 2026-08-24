import { z } from 'zod';

/**
 * Strict input validation schemas (anti-SQLi / anti-XSS payload guards).
 * All public API routes MUST parse incoming payloads through these schemas
 * before touching the database.
 */

// 1. Message / Lead Form Validator
export const MessageSchema = z.object({
  sender_name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name is too long')
    // Allows Arabic, French, English letters, numbers and basic punctuation
    .regex(/^[\p{L}\p{N}\s\-_'.]+$/u, 'Name contains invalid characters'),
  service: z.string().trim().min(2).max(60),
  content: z
    .string()
    .trim()
    .min(5, 'Message must be at least 5 characters')
    .max(2000, 'Message cannot exceed 2000 characters'),
  sender_email: z.string().email().max(200).optional().nullable(),
  file_url: z
    .string()
    .url('Invalid URL format')
    .max(500)
    .optional()
    .nullable()
    .or(z.literal('')),
});

// 2. 3D Product Creation Validator
export const ProductSchema = z.object({
  title: z.string().trim().min(3).max(120),
  description: z.string().trim().min(10).max(1000),
  category: z.enum(['lighting', 'accessories', 'art', 'decor']),
  price: z.string().trim().min(1).max(30),
  cover_image_url: z.string().url(),
  model_file_url: z.string().url().optional().nullable().or(z.literal('')),
  print_specs: z.object({
    material: z.string().max(80),
    dimensions: z.string().max(80),
    layerHeight: z.string().max(50),
    printTime: z.string().max(50),
    weight: z.string().max(50),
    show_price: z.boolean().optional(),
    is_in_stock: z.boolean().optional(),
  }),
});

// 3. Photo Album Creation Validator
export const AlbumSchema = z.object({
  title: z.string().trim().min(3).max(150),
  description: z.string().trim().max(2000),
  cover_image_url: z.string().url(),
  status: z.enum(['PUBLISHED', 'DRAFT', 'ARCHIVED']).default('PUBLISHED'),
});
