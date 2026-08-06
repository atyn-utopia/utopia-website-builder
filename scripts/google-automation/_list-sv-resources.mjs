import { google } from 'googleapis';
import { getAuth } from './lib/auth.mjs';

const auth = getAuth('gsc');
const sv = google.siteVerification({ version: 'v1', auth });

const list = await sv.webResource.list();
console.log(JSON.stringify(list.data, null, 2));
