class Hud {
    constructor(pauseFunc = null) {
        const score = document.createElement('p');
        score.setAttribute('id', 'score');
        document.body.appendChild(score);
        score.innerHTML = '0';
        score.style.position = 'absolute';
        score.style.left = '20px';
        score.style.top = '20px';
        this.score = score;

        this.isPaused = false;
        const pauseButton = document.createElement('button');
        pauseButton.setAttribute('id', 'pause');
        document.body.appendChild(pauseButton);
        pauseButton.innerHTML = '||';
        pauseButton.style.position = 'absolute';
        pauseButton.style.right = '20px';
        pauseButton.style.top = '20px';
        const onClick = () => {
            pauseFunc();
            pausedText.style.visibility = this.isPaused ? 'hidden' : 'visible';
            this.isPaused = !this.isPaused;
        };
        onClick.bind(this);
        pauseButton.onclick = onClick;

        const pausedText = document.createElement('p');
        pausedText.setAttribute('id', 'pause-text');
        document.body.appendChild(pausedText);
        pausedText.innerHTML = 'PAUSED';
        pausedText.style.position = 'absolute';
        pausedText.style.right = '50%';
        pausedText.style.top = '50%';
        pausedText.style.transform = 'translate(-50%, -50%)';
        pausedText.style.visibility = 'hidden';
    }
    updateScore(position) {
        this.score.innerHTML = `${position.z}`;
    }
}

export default Hud;
