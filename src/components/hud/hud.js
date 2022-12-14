class Hud {
    constructor(startGame, restartGame, runningSound) {
        this.gameStarted = false;
        this.isPaused = false;
        this.gameOver = false;
        this.runningSound = runningSound;

        const fadeScreen = document.createElement('div');
        fadeScreen.style.cssText = `
            position: absolute;
            width: 100%;
            height: 100%;
            opacity: 0;
            background: black;
            transition-property: opacity;
            transition-duration: 1s;
            z-index: 5;
        `;
        document.body.appendChild(fadeScreen);

        const score = document.createElement('p');
        score.setAttribute('id', 'score');
        document.body.appendChild(score);
        score.innerHTML = '0';
        score.style.position = 'absolute';
        score.style.left = '20px';
        score.style.top = '20px';
        score.style.visibility = 'hidden';
        score.style['font-size'] = '20px';
        score.style['font-weight'] = 'bold';
        this.score = score;

        const pauseButton = document.createElement('button');
        pauseButton.setAttribute('id', 'pause');
        document.body.appendChild(pauseButton);
        pauseButton.innerHTML = '||';
        pauseButton.style.position = 'absolute';
        pauseButton.style.right = '20px';
        pauseButton.style.top = '20px';
        const pauseOnClick = () => {
            pausedText.style.visibility = this.isPaused ? 'hidden' : 'visible';
            console.log(runningSound);
            this.isPaused ? this.runningSound.play() : this.runningSound.stop();
            this.isPaused = !this.isPaused;
        };
        pauseOnClick.bind(this);
        pauseButton.onclick = pauseOnClick;
        pauseButton.style.visibility = 'hidden';
        pauseButton.style.zIndex = '6';
        this.pauseButton = pauseButton;

        const pausedText = document.createElement('p');
        pausedText.setAttribute('id', 'pause-text');
        document.body.appendChild(pausedText);
        pausedText.innerHTML = 'PAUSED';
        pausedText.style.cssText = `
            position: absolute;
            right: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            visibility: hidden;
        `;

        const startMenu = document.createElement('div');
        document.body.appendChild(startMenu);
        const startText = document.createElement('p');
        startText.innerHTML = '3-REX';
        startText.style.cssText = `
            font-size: 5em;
            color: red;
        `;
        startMenu.appendChild(startText);
        const startButton = document.createElement('button');
        startButton.innerHTML = 'START';
        startMenu.appendChild(startButton);
        startMenu.style.cssText = `
            display: flex;
            flex-direction: column;
            position: absolute;
            left: 50%;
            top: 30%;
            transform: translate(-50%, -50%);
            z-index: 6;
        `;
        const startOnClick = () => {
            startMenu.style.visibility = 'hidden';
            fadeScreen.style.opacity = '100';
            setTimeout(() => {
                fadeScreen.style.opacity = '0';
                score.style.visibility = 'visible';
                pauseButton.style.visibility = 'visible';
                setTimeout(() => {
                    this.gameStarted = true;
                    startGame();
                }, 200);
            }, 1000);
        };
        startButton.onclick = startOnClick;

        const gameOverScreen = document.createElement('div');
        const reportElement = document.createElement('p');
        // const restartButton = document.createElement('button');
        const returnButton = document.createElement('button');
        returnButton.innerHTML = 'Return to start';
        const returnFunc = () => {
            this.gameStarted = false;
            this.gameOver = false;
            this.isPaused = false;
            fadeScreen.style.opacity = '100';
            score.style.visibility = 'hidden';
            gameOverScreen.style.visibility = 'hidden';
            setTimeout(() => {
                restartGame();
                fadeScreen.style.opacity = '0';
                startMenu.style.visibility = 'visible';
            }, 1000);
        };
        returnFunc.bind(this);
        returnButton.onclick = returnFunc;
        gameOverScreen.appendChild(reportElement);
        // gameOverScreen.appendChild(restartButton);
        gameOverScreen.appendChild(returnButton);
        document.body.appendChild(gameOverScreen);
        document.body.style.cssText = `
            display: flex;
            justify-content: center;
            align-items: center;
        `;
        gameOverScreen.style.cssText = `
            display: flex;
            flex-direction: column;
            visibility: hidden;
            position: absolute;
            z-index: 6;
            background-color: pink;
            padding: 10px;
            font-size: 25px;
            font-weight: bold;
        `;
        this.gameOverScreen = gameOverScreen;
        this.reportElement = reportElement;
        this.returnButton = returnButton;

        const speedingMessage = document.createElement('p');
        document.body.appendChild(speedingMessage);
        speedingMessage.innerHTML = 'Speeding Up!';
        speedingMessage.style.visibility = 'hidden';
        speedingMessage.style.cssText = `
            visibility: hidden;
            position: absolute;
            right: 50%;
            top: 10%;
        `;

        this.showSpeedingMessage = () => {
            speedingMessage.style.visibility = 'visible';
            setTimeout(() => {
                speedingMessage.style.visibility = 'hidden';
            }, 1500);
        };
    }
    updateScore(position) {
        const roundedScore = Math.floor(position.z * 10) / 10;
        this.score.innerHTML = `${roundedScore}`;
    }
    showGameOver() {
        this.gameOver = true;
        this.pauseButton.style.visibility = 'hidden';
        this.gameOverScreen.style.visibility = 'visible';
        this.score.style.visibility = 'hidden';
        this.reportElement.innerHTML = `You managed to run ${this.score.innerHTML} meters!`;
    }
}

export default Hud;
