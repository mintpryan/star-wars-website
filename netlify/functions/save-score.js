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
    const spreadsheetId = process.env.SPREADSHEET_ID;

    // Чтение всех данных из таблицы
    const range = 'Sheet1!A2:B'; // Столбцы A (Name) и B (Score)
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    let rows = response.data.values || [];

    // Поиск существующего игрока
    let playerFound = false;

    for (let i = 0; i < rows.length; i++) {
      if (rows[i][0] === name) {
        playerFound = true;
        const existingScore = Number(rows[i][1]);

        if (score > existingScore) {
          // Обновляем счет только если новый счет больше
          rows[i][1] = score.toString();
          await sheets.spreadsheets.values.update({
            spreadsheetId,
            range: `Sheet1!B${i + 2}`, // Обновляем соответствующую ячейку в столбце B
            valueInputOption: 'USER_ENTERED',
            requestBody: {
              values: [[score]],
            },
          });
          return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Score updated successfully!' }),
          };
        } else {
          return {
            statusCode: 200,
            body: JSON.stringify({ message: 'New score is not higher. Score not updated.' }),
          };
        }
      }
    }

    // Если игрок не найден, добавляем новую запись
    if (!playerFound) {
      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: 'Sheet1!A2:B2',
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [[name, score]],
        },
      });
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'New player score added successfully!' }),
      };
    }
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to save score', details: error.message }),
    };
  }
};
