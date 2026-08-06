#!/usr/bin/env node
import { google } from 'googleapis';
import { getAuth } from './lib/auth.mjs';

const propertyId = process.argv[2];

if (!propertyId) {
  console.error('Usage: node delete-property.mjs PROPERTY_ID');
  process.exit(1);
}

const auth = getAuth('ga4');
const admin = google.analyticsadmin({ version: 'v1beta', auth });

await admin.properties.delete({ name: `properties/${propertyId}` });
console.log(`✓ Deleted (moved to trash) property ${propertyId}`);
console.log(`  Restore within 30 days via GA4 → Admin → Bin, or leave to auto-delete.`);
