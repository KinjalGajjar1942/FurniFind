import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

// You must set these in your environment or replace with your values
const SHEET_ID = process.env.GOOGLE_SHEET_ID;
const CLIENT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const PRIVATE_KEY = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, '\n');

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, address, phone, interest, email, message } = body;

    if (!SHEET_ID || !CLIENT_EMAIL || !PRIVATE_KEY) {
      return NextResponse.json({ error: 'Google Sheets credentials not set.' }, { status: 500 });
    }

    const auth = new google.auth.JWT(
      CLIENT_EMAIL,
      undefined,
      PRIVATE_KEY,
      ['https://www.googleapis.com/auth/spreadsheets']
    );
    const sheets = google.sheets({ version: 'v4', auth });

    // Check if the sheet is empty (no header)
    const getRes = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: 'Sheet1!A1:G1',
    });
    const hasHeader = getRes.data.values && getRes.data.values.length > 0 && getRes.data.values[0].some(cell => cell && cell.trim() !== '');

    // If no header, insert header row first
    if (!hasHeader) {
      await sheets.spreadsheets.values.update({
        spreadsheetId: SHEET_ID,
        range: 'Sheet1!A1',
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [[
            'Name',
            'Email',
            'Address',
            'Phone',
            'Interest',
            'Message',
            'Submitted At'
          ]],
        },
      });
    }

    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: 'Sheet1!A1',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[name, email, address, phone, interest, message, new Date().toLocaleString()]],
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error?.toString() || 'Unknown error' }, { status: 500 });
  }
}
