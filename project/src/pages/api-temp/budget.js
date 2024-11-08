// import { google } from 'googleapis';
// import path from 'path';
// import fs from 'fs';

// export default async function handler(req, res) {
//   console.log('Function handler invoked'); // Log when function is invoked

//   // Set CORS headers
//   res.setHeader('Access-Control-Allow-Origin', '*'); // Allow requests from any origin
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'); // Allow GET, POST, and OPTIONS methods
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

//   if (req.method === 'OPTIONS') {
//     console.log('OPTIONS request received');
//     return res.status(200).end(); // Respond to OPTIONS requests with 200 to end preflight check
//   }

//   // Attempt to load service account credentials
//   try {
//     const credentialsPath = path.join(
//       process.cwd(),
//       '../../../config/your-credentials.json'
//     );
//     console.log('Credentials path:', credentialsPath); // Log the resolved path
//     const credentials = JSON.parse(fs.readFileSync(credentialsPath));
//     console.log('Credentials loaded successfully:', credentials); // Confirm if credentials load
//   } catch (error) {
//     console.error('Error loading credentials:', error);
//     return res
//       .status(500)
//       .json({ error: 'Error loading credentials', details: error.message });
//   }

//   // Set up Google Sheets API authentication
//   let auth, sheets;
//   try {
//     auth = new google.auth.GoogleAuth({
//       credentials,
//       scopes: ['https://www.googleapis.com/auth/spreadsheets'],
//     });
//     sheets = google.sheets({ version: 'v4', auth });
//     console.log('Google Sheets API client initialized'); // Confirm API client setup
//   } catch (error) {
//     console.error('Error setting up Google Sheets API:', error);
//     return res
//       .status(500)
//       .json({
//         error: 'Error setting up Google Sheets API',
//         details: error.message,
//       });
//   }

//   const spreadsheetId = '1gVuVuOMLMbk_x3x0kf5Vy7-bpdRZK35-x0ZnwliSymg';

//   if (req.method === 'POST') {
//     console.log('POST request received with body:', req.body); // Log POST request body
//     const { type, category, name, dollarAmount, frequency } = req.body;

//     try {
//       await sheets.spreadsheets.values.append({
//         spreadsheetId,
//         range: 'Sheet1!A:E', // Adjust range as needed
//         valueInputOption: 'RAW',
//         requestBody: {
//           values: [[type, category, name, dollarAmount, frequency]],
//         },
//       });
//       console.log('Data appended to Google Sheets'); // Confirm data append
//       res.status(200).json({ message: 'Entry added successfully' });
//     } catch (error) {
//       console.error('Error appending data to Google Sheets:', error);
//       res
//         .status(500)
//         .json({ error: 'Error adding entry', details: error.message });
//     }
//   } else if (req.method === 'GET') {
//     console.log('GET request received'); // Log GET request

//     try {
//       const result = await sheets.spreadsheets.values.get({
//         spreadsheetId,
//         range: 'Sheet1!A:E', // Adjust range as needed
//       });
//       const rows = result.data.values;
//       console.log('Data retrieved from Google Sheets:', rows); // Log retrieved data
//       res.status(200).json(rows);
//     } catch (error) {
//       console.error('Error retrieving data from Google Sheets:', error);
//       res
//         .status(500)
//         .json({ error: 'Error retrieving entries', details: error.message });
//     }
//   } else {
//     console.warn('Unsupported request method:', req.method);
//     res.status(405).json({ message: `Method ${req.method} Not Allowed` });
//   }
// }

export default async function handler(req, res) {
  console.log('Function handler invoked'); // This should appear in logs
  res.status(200).json({ message: 'Function is reachable' });
}
