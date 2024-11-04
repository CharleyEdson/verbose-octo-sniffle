import { google } from 'googleapis';

export default async function handler(req, res) {
  try {
    // Initialize auth
    const auth = new google.auth.GoogleAuth({
      credentials: {
        type: process.env.GOOGLE_TYPE,
        project_id: process.env.GOOGLE_PROJECT_ID,
        private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        client_id: process.env.GOOGLE_CLIENT_ID,
        auth_uri: process.env.GOOGLE_AUTH_URI,
        token_uri: process.env.GOOGLE_TOKEN_URI,
        auth_provider_x509_cert_url: process.env.GOOGLE_AUTH_PROVIDER_CERT_URL,
        client_x509_cert_url: process.env.GOOGLE_CLIENT_CERT_URL,
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.SPREADSHEET_ID;

    // Set CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET,PUT,POST,DELETE,OPTIONS'
    );
    res.setHeader(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    // Handle OPTIONS request
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }

    switch (req.method) {
      case 'GET':
        const response = await sheets.spreadsheets.values.get({
          spreadsheetId,
          range: 'Sheet1!A2:D', // Adjust range based on your sheet
        });

        const rows = response.data.values || [];
        const trades = rows.map((row) => ({
          spreadEntryExit: row[0] || '',
          total: row[1] || '',
          entrys: row[2] || '',
        }));

        res.status(200).json(trades);
        break;

      case 'POST':
        const { spreadEntryExit, total, entrys } = req.body;

        await sheets.spreadsheets.values.append({
          spreadsheetId,
          range: 'Sheet1!A2:D',
          valueInputOption: 'USER_ENTERED',
          resource: {
            values: [[spreadEntryExit, total, entrys]],
          },
        });

        res.status(201).json({ message: 'Trade added successfully' });
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST', 'OPTIONS']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: error.message });
  }
}
