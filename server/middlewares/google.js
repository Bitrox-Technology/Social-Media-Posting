import { google } from 'googleapis';
import fs from 'fs';

const OAuth2Client = () => {
    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
    );
    return oauth2Client
}



// Scopes for Google Business Profile
const SCOPES = ['https://www.googleapis.com/auth/business.manage'];

// Generate OAuth URL
const getAuthUrl = () => {
    const oauth2Client = OAuth2Client();
    return oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
        prompt: 'consent',
    });
}

// Exchange code for tokens
const getTokens = async (code) => {
    const { tokens } = await oauth2Client.getToken(code);
    const oauth2Client = OAuth2Client();
    oauth2Client.setCredentials(tokens);
    // Save tokens to a file or database for reuse
    fs.writeFileSync('tokens.json', JSON.stringify(tokens));
    return tokens;
}

// Load saved tokens
const loadTokens = () => {
    const oauth2Client = OAuth2Client();
    if (fs.existsSync('tokens.json')) {
        const tokens = JSON.parse(fs.readFileSync('tokens.json'));
        oauth2Client.setCredentials(tokens);
        return tokens;
    }
    return null;
}

export {
    OAuth2Client,
    getAuthUrl,
    getTokens,
    loadTokens
}