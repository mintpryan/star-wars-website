const fs = require('fs');
const path = require('path');

exports.handler = async (event) => {
  try {
    console.log('Received event:', event.body);

    const { name, score } = JSON.parse(event.body);
    if (!name || score === undefined) {
      throw new Error('Name or score is missing');
    }

    const filePath = path.resolve(__dirname, 'scores.json');
    console.log('File path:', filePath);

    let scores = [];

    if (fs.existsSync(filePath)) {
      scores = JSON.parse(fs.readFileSync(filePath));
    }

    console.log('Existing scores:', scores);

    const existingScore = scores.find((entry) => entry.name === name);

    if (existingScore) {
      if (score > existingScore.score) {
        existingScore.score = score;
        existingScore.date = new Date().toISOString();
      } else {
        return {
          statusCode: 200,
          body: JSON.stringify({ message: 'New score is not higher. Score not updated.' }),
        };
      }
    } else {
      scores.push({ name, score, date: new Date().toISOString() });
    }

    fs.writeFileSync(filePath, JSON.stringify(scores, null, 2));

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Score saved successfully!' }),
    };

  } catch (error) {
    console.error('Error:', error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to save score', details: error.message }),
    };
  }
};
