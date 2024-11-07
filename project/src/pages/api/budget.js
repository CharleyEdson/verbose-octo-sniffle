import { google } from 'googleapis';
import path from 'path';
import fs from 'fs';

export default async function handler(req, res) {
  // Load service account credentials
  const credentials = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'config/your-credentials.json'))
  );

  // Set up authentication
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  const sheets = google.sheets({ version: 'v4', auth });

  const spreadsheetId = '1gVuVuOMLMbk_x3x0kf5Vy7-bpdRZK35-x0ZnwliSymg';

  if (req.method === 'POST') {
    // Adding a new entry to the Google Sheet
    const { type, category, name, dollarAmount, frequency } = req.body;

    try {
      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: 'Sheet1!A:E', // Adjust range as needed
        valueInputOption: 'RAW',
        requestBody: {
          values: [[type, category, name, dollarAmount, frequency]],
        },
      });
      res.status(200).json({ message: 'Entry added successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Error adding entry', details: error });
    }
  } else if (req.method === 'GET') {
    // Retrieving entries from the Google Sheet
    try {
      const result = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'Sheet1!A:E', // Adjust range as needed
      });
      const rows = result.data.values;
      res.status(200).json(rows);
    } catch (error) {
      res
        .status(500)
        .json({ error: 'Error retrieving entries', details: error });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
