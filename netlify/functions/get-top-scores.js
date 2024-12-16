const fs = require('fs');
const path = require('path');

exports.handler = async () => {
  const filePath = path.resolve('/tmp', 'scores.json');

  try {
    let scores = [];

    if (fs.existsSync(filePath)) {
      scores = JSON.parse(fs.readFileSync(filePath));
    }

    const topScores = scores
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    return {
      statusCode: 200,
      body: JSON.stringify(topScores),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to retrieve scores', details: error.message }),
    };
  }
};
