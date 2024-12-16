const { google } = require('googleapis');

exports.handler = async (event) => {
  try {
    // Получаем данные из запроса
    const { name, score } = JSON.parse(event.body);
    if (!name || score === undefined) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Name or score is missing' }),
      };
    }

    // Настройка авторизации
    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS);
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // ID вашей таблицы (скопируйте из URL)
    const spreadsheetId = process.env.SPREADSHEET_ID;

    // Добавление новой строки с результатом
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Sheet1!A1:C1', // Диапазон, куда добавлять (например, столбцы A, B, C)
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[name, score, new Date().toISOString()]],
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Score saved successfully!' }),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to save score', details: error.message }),
    };
  }
};
