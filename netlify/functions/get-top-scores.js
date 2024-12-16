const { google } = require('googleapis');

exports.handler = async () => {
  try {
    // Настройка авторизации
    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS);
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    const spreadsheetId = process.env.SPREADSHEET_ID;
    
    const range = 'Sheet1!A2:C';
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = response.data.values;

    if (!rows || rows.length === 0) {
      return {
        statusCode: 200,
        body: JSON.stringify([]),
      };
    }

    // Преобразуем строки в массив объектов и сортируем по убыванию счета
    const scores = rows.map(([name, score, date]) => ({
      name,
      score: Number(score),
      date,
    }));

    const topScores = scores.sort((a, b) => b.score - a.score).slice(0, 10);

    return {
      statusCode: 200,
      body: JSON.stringify(topScores),
      
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch scores', details: error.message }),
    };
  }
};
