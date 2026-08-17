import { google } from 'googleapis';
import { getAuth } from './lib/auth.mjs';

const auth = getAuth('gsc');
const sc = google.searchconsole({ version: 'v1', auth });
const res = await sc.sites.list();
console.log(JSON.stringify(res.data, null, 2));
