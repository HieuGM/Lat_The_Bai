document.getElementById('start-form').addEventListener('submit', startGame);
let playerName, difficulty, timer, timeLeft, cardArray, firstCard, secondCard, lockBoard, matchedPairs, totalTime;

function startGame(e) {
    e.preventDefault();
    playerName = document.getElementById('player-name').value;
    difficulty = document.getElementById('difficulty').value;
    lockBoard = false;
    matchedPairs = 0;

    document.getElementById('game-setup').classList.add('hidden');
    document.getElementById('game-board').classList.remove('hidden');
    
    let numberOfCards;
    switch (difficulty) {
        case 'easy':
            numberOfCards = 24;
            timeLeft = 80;
            break;
        case 'medium':
            numberOfCards = 48;
            timeLeft = 180;
            break;
        case 'hard':
            numberOfCards = 72;
            timeLeft = 240;
            break;
    }
    
    totalTime = timeLeft; // Lưu tổng thời gian ban đầu

    generateCards(numberOfCards);
    startTimer(timeLeft);
}

function generateCards(number) {
    const cardsContainer = document.getElementById('cards-container');
    cardsContainer.className = 'cards-container ' + difficulty;
    
    const numberOfImages = 4;
    cardArray = [];
    for (let i = 0; i < number; i++) {
        cardArray.push(i % numberOfImages);
    }
    cardArray.sort(() => 0.5 - Math.random());

    cardArray.forEach(cardValue => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.value = cardValue;
        card.style.backgroundImage = "url('images/back.jpg')"; // Hình ảnh mặc định phía sau của thẻ
        card.addEventListener('click', flipCard);
        cardsContainer.appendChild(card);
    });
}

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add('flipped');
    this.style.backgroundImage = `url('images/img${this.dataset.value}.jpg')`;

    if (!firstCard) {
        firstCard = this;
        return;
    }

    secondCard = this;
    checkForMatch();
}

function checkForMatch() {
    if (firstCard.dataset.value === secondCard.dataset.value) {
        disableCards();
        matchedPairs += 2;
        if (matchedPairs === cardArray.length) {
            gameOver(true);
        }
    } else {
        unflipCards();
    }
}

function disableCards() {
    setTimeout(() => {
        firstCard.style.visibility = 'hidden';
        secondCard.style.visibility = 'hidden';
        resetBoard();
    }, 500);
}

function unflipCards() {
    lockBoard = true;
    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        firstCard.style.backgroundImage = "url('images/back.jpg')";
        secondCard.style.backgroundImage = "url('images/back.jpg')";
        resetBoard();
    }, 1000);
}

function resetBoard() {
    [firstCard, secondCard, lockBoard] = [null, null, false];
}

function startTimer(seconds) {
    const timerDisplay = document.getElementById('time');
    timeLeft = seconds;
    timer = setInterval(() => {
        timeLeft--;
        let minutes = Math.floor(timeLeft / 60);
        let seconds = timeLeft % 60;
        timerDisplay.innerText = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

        if (timeLeft <= 0) {
            clearInterval(timer);
            gameOver(false);
        }
    }, 1000);
}

function gameOver(completed) {
    clearInterval(timer);
    document.getElementById('game-board').classList.add('hidden');
    document.getElementById('game-over').classList.remove('hidden');
    
    const timeUsed = totalTime - timeLeft; // Tính thời gian đã sử dụng
    const minutesUsed = Math.floor(timeUsed / 60);
    const secondsUsed = timeUsed % 60;
    const timeUsedString = `${minutesUsed < 10 ? '0' : ''}${minutesUsed}:${secondsUsed < 10 ? '0' : ''}${secondsUsed}`;

    const resultText = completed 
        ? `Chúc mừng ${playerName}, bạn đã hoàn thành trò chơi! Thời gian bạn đã sử dụng là: ${timeUsedString}.`
        : `Rất tiếc cho ${playerName}, bạn đã thua.`;

    document.getElementById('game-result').innerText = resultText;
}

function restartGame() {
    document.getElementById('game-over').classList.add('hidden');
    document.getElementById('game-setup').classList.remove('hidden');
    document.getElementById('cards-container').innerHTML = '';  // Xóa tất cả các thẻ cũ
}
