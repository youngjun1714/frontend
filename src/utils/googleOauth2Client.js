import { google } from 'googleapis';

// must use server-side only
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_ID,
  process.env.GOOGLE_SECRET,
  `${process.env.GOOGLE_CALLBACK_URL}/api/google-callback`
);

export default oauth2Client;
