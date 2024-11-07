import { google } from 'googleapis';
import path from 'path';
import fs from 'fs';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*'); // Allow requests from any origin
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'); // Allow GET, POST, and OPTIONS methods
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end(); // Respond to OPTIONS requests with 200 to end preflight check
  }

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
    console.log('Received data:', req.body); // Log incoming data
    const parsedBody =
      typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    console.log('Parsed data:', parsedBody);

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
