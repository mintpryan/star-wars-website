export function createGame() {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");

    const restartButton = document.getElementById("restartButton");
    const closeButton = document.getElementById("close");

    canvas.width = window.innerWidth / 2;
    canvas.height = window.innerHeight;

    const shipImage = new Image();
    shipImage.src = "/game/player_ship.png";

    const stone_1 = new Image();
    stone_1.src = "/game/stone_1.png";

    const stone_2 = new Image();
    stone_2.src = "/game/stone_2.png";

    const stone_3 = new Image();
    stone_3.src = "/game/stone_3.png";

    const stones = [stone_1, stone_2, stone_3]

    window.addEventListener("resize", () => {
        canvas.width = window.innerWidth / 2;
        canvas.height = window.innerHeight;
    });

    const shipWidth = 80
    const shipHeight = 120
    let shipX = canvas.width / 2 - shipWidth;
    let shipY = canvas.height / 2 - shipHeight + 10;
    let shipSpeed = 5;

    let obstacles = [];
    let obstacleSpeed = 3;
    const obstacleFrequency = 60;

    let lives = 3;
    let score = 0;
    let gameOver = false;

    let keys = {};

    document.addEventListener("keydown", (e) => {
        keys[e.key] = true;
    });
    document.addEventListener("keyup", (e) => {
        keys[e.key] = false;
    });

    function drawShip() {
        ctx.drawImage(shipImage, shipX, shipY, shipWidth, shipHeight);
    }


    function drawObstacles() {


        obstacles.forEach((obstacle) => {
            ctx.drawImage(stones[Math.floor(Math.random() * stones.length)], obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        });
    }

    function updateObstacles() {
        obstacles.forEach((obstacle) => {
            obstacle.y += obstacleSpeed;
        });

        obstacles = obstacles.filter((obstacle) => obstacle.y < canvas.height);
    }


    function createObstacle() {
        const width = Math.random() * (50 - 20) + 20
        const height = Math.random() * (50 - 20) + 20
        const x = Math.random() * (canvas.width - width);
        obstacles.push({ x, y: -height, width, height });
    }

    function checkCollisions() {
        obstacles.forEach((obstacle, index) => {
            if (
                shipX < obstacle.x + obstacle.width &&
                shipX + shipWidth > obstacle.x &&
                shipY < obstacle.y + obstacle.height &&
                shipY + shipHeight > obstacle.y
            ) {
                obstacles.splice(index, 1);
                lives -= 1;
                if (lives === 0) {
                    gameOver = true;
                    restartButton.style.display = "block";
                    closeButton.style.display = "block";
                }
            }
        });
    }

    function increaseDifficulty() {
        if (score % 5 === 0 && obstacleSpeed < 10) {
            obstacleSpeed += 0.5;
        }
    }

    function drawHUD() {
        ctx.fillStyle = "#fff";
        ctx.font = "1rem Arial";
        ctx.fillText(`Lives: ${lives}`, 10, 30);
        ctx.fillText(`Score: ${score}`, canvas.width - 100, 30);
    }

    function gameLoop() {
        if (gameOver) {
            ctx.fillStyle = "#fff";
            ctx.font = "2rem Arial";
            ctx.fillText(`GAME OVER`, canvas.width / 4, canvas.height / 2);
            ctx.fillText(`Your score: ${score}`, canvas.width / 4, canvas.height * 0.3);
            submitScoreAndUpdateLeaderboard('Player1', score);
            return;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (keys["ArrowLeft"] && shipX > 0) shipX -= shipSpeed;
        if (keys["ArrowRight"] && shipX < canvas.width - shipWidth) shipX += shipSpeed;
        if (keys["ArrowUp"] && shipY > 0) shipY -= shipSpeed;
        if (keys["ArrowDown"] && shipY < canvas.height - shipHeight) shipY += shipSpeed;

        drawShip();
        drawObstacles();
        updateObstacles();
        checkCollisions();
        drawHUD();

        if (score % obstacleFrequency === 0)
            createObstacle();

        score += 1;
        increaseDifficulty();
        requestAnimationFrame(gameLoop);
    }

    function restartGame() {
        shipX = canvas.width / 2 - shipWidth / 2;
        shipY = canvas.height - shipHeight - 10;
        obstacles = [];
        lives = 3;
        score = 0;
        gameOver = false;
        restartButton.style.display = "none";
        gameLoop();
    }

    function destroyGame() {
        gameOver = true;
        restartButton.style.display = "none";
        closeButton.style.display = "none";

        obstacles = [];

        shipX = canvas.width / 2 - shipWidth / 2;
        shipY = canvas.height - shipHeight - 10;
        lives = 0;
        score = 0;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        document.removeEventListener("keydown", handleKeyDown);
        document.removeEventListener("keyup", handleKeyUp);

        if (scene) {
            while (scene.children.length > 0) {
                scene.remove(scene.children[0]);
            }
        }



    }


    restartButton.addEventListener("click", restartGame);

    shipImage.onload = () => {
        gameLoop();
    };

    closeButton.addEventListener("click", () => {
        document
            .getElementById("close").style.display = 'none'
        document
            .getElementById("game-container").style.display = 'none'
        document
            .getElementById("gameCanvas").style.display = 'none'
        document.getElementById('header').style.display = 'flex'
        document.getElementById("header-image").style.transform = 'none'
        document.getElementById("header-image").classList.add('animation-ship-2');
        document.getElementById("logo-image").classList.add('animation-2');
        document.getElementById("main-nav-links").classList.add('animation-2')
        document.getElementById('header').style.pointerEvents = 'auto'
        destroyGame()
    });
}

async function submitScore(name, score) {
    const formData = new FormData();
    formData.append('form-name', 'score-form');
    formData.append('name', name);
    formData.append('score', score);

    try {
        const response = await fetch('/', {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            console.log('Score submitted successfully!');
        } else {
            console.error('Error submitting score');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

document.addEventListener('DOMContentLoaded', fetchTopScores);

async function submitScoreAndUpdateLeaderboard(name, score) {
    try {
        const response = await fetch('/.netlify/functions/save-score', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, score }),
        });

        const result = await response.json();
        console.log(result.message);

        await fetchTopScores();
    } catch (error) {
        console.error('Error submitting score:', error);
    }
}


async function fetchTopScores() {
    try {
      const response = await fetch('/.netlify/functions/get-top-scores');
      const topScores = await response.json();
  
      const leaderboard = document.getElementById('leaderboard');
      leaderboard.innerHTML = '';
  
      topScores.forEach((entry, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${index + 1}. ${entry.name} - ${entry.score}`;
        leaderboard.appendChild(listItem);
      });
    } catch (error) {
      console.error('Error fetching top scores:', error);
    }
  }
  