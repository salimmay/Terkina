'use client';

import React from 'react';
import { PageHeader } from '@/components/admin/ui';
import ProductForm, { DEFAULT_PRODUCT_FORM } from '@/components/admin/ProductForm';

export default function New3DProductPage() {
  return (
    <div>
      <PageHeader title="List new 3D item" description="Add a ready-made product with print specs and WhatsApp checkout." />
      <ProductForm mode="create" initial={DEFAULT_PRODUCT_FORM} />
    </div>
  );
}
