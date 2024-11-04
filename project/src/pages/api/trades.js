import { google } from 'googleapis';

// Configure Google Sheets API with Vercel environment variables
const getGoogleAuth = () => {
  // Parse the credentials from Vercel environment variable
  const credentials = {
    type: process.env.GOOGLE_TYPE,
    project_id: process.env.GOOGLE_PROJECT_ID,
    private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'), // Fix escaped newlines
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    client_id: process.env.GOOGLE_CLIENT_ID,
    auth_uri: process.env.GOOGLE_AUTH_URI,
    token_uri: process.env.GOOGLE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.GOOGLE_AUTH_PROVIDER_CERT_URL,
    client_x509_cert_url: process.env.GOOGLE_CLIENT_CERT_URL,
  };

  return new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
};

const sheets = google.sheets({ version: 'v4', auth: getGoogleAuth() });
const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
const RANGE = 'Sheet1!A2:D'; // Start from A2 to skip headers

export default async function handler(req, res) {
  try {
    // Verify environment variables are set
    if (!process.env.SPREADSHEET_ID || !process.env.GOOGLE_PRIVATE_KEY) {
      throw new Error('Required environment variables are not set');
    }

    switch (req.method) {
      case 'GET':
        const {
          data: { values },
        } = await sheets.spreadsheets.values.get({
          spreadsheetId: SPREADSHEET_ID,
          range: RANGE,
        });

        const trades =
          values?.map((row) => ({
            spreadEntryExit: row[0] || '',
            total: row[1] || '',
            entrys: row[2] || '',
          })) || [];

        return res.status(200).json(trades);

      case 'POST':
        const { spreadEntryExit, total, entrys } = req.body;

        await sheets.spreadsheets.values.append({
          spreadsheetId: SPREADSHEET_ID,
          range: RANGE,
          valueInputOption: 'USER_ENTERED',
          resource: {
            values: [[spreadEntryExit, total, entrys]],
          },
        });

        return res.status(201).json({ message: 'Trade added successfully' });

      case 'PUT':
        const { id } = req.query;
        const rowNumber = parseInt(id) + 2; // Add 2 to account for headers and 0-based index

        await sheets.spreadsheets.values.update({
          spreadsheetId: SPREADSHEET_ID,
          range: `Sheet1!A${rowNumber}:D${rowNumber}`,
          valueInputOption: 'USER_ENTERED',
          resource: {
            values: [
              [
                req.body.spreadEntryExit || '',
                req.body.total || '',
                req.body.entrys || '',
              ],
            ],
          },
        });

        return res.status(200).json({ message: 'Trade updated successfully' });

      case 'DELETE':
        const deleteId = parseInt(req.query.id) + 2;

        await sheets.spreadsheets.batchUpdate({
          spreadsheetId: SPREADSHEET_ID,
          resource: {
            requests: [
              {
                deleteDimension: {
                  range: {
                    sheetId: 0,
                    dimension: 'ROWS',
                    startIndex: deleteId - 1,
                    endIndex: deleteId,
                  },
                },
              },
            ],
          },
        });

        return res.status(200).json({ message: 'Trade deleted successfully' });

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('API Error:', error);

    // Provide more specific error messages based on the error type
    if (error.message === 'Required environment variables are not set') {
      return res.status(500).json({ error: 'Server configuration error' });
    }

    if (error.code === 403) {
      return res
        .status(403)
        .json({ error: 'Permission denied to access Google Sheets' });
    }

    return res.status(500).json({ error: 'Internal server error' });
  }
}
