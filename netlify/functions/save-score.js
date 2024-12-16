const fs = require('fs');
const path = require('path');

exports.handler = async (event) => {
  const { name, score } = JSON.parse(event.body);
  const filePath = path.resolve(__dirname, 'scores.json');

  try {
    let scores = [];
    if (fs.existsSync(filePath)) {
      scores = JSON.parse(fs.readFileSync(filePath));
    }

    scores.push({ name, score, date: new Date().toISOString() });
    fs.writeFileSync(filePath, JSON.stringify(scores, null, 2));

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Score saved successfully!' }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to save score' }),
    };
  }
};
