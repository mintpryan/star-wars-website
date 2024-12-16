const fs = require('fs');
const path = require('path');

exports.handler = async (event) => {
  try {
    const { name, score } = JSON.parse(event.body);
    const filePath = path.resolve(__dirname, 'scores.json');

    let scores = [];


    if (fs.existsSync(filePath)) {
      scores = JSON.parse(fs.readFileSync(filePath));
    }

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
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to save score', details: error.message }),
    };
  }
};
