class Hud {
    constructor() {
        const score = document.createElement('p');
        score.setAttribute('id', 'score');
        document.body.appendChild(score);
        score.innerHTML = '0';
        score.style.position = 'absolute';
        score.style.left = '20px';
        score.style.top = '20px';
        this.score = score;
    }
    updateScore(position) {
        this.score.innerHTML = `${position.x}`;
    }
}

export default Hud;
