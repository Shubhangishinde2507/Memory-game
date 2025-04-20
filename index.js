const gridContainer = document.querySelector(".grid-container");
let cards = [];
let originalCards = [];
let firstCard, secondCard;
let lockBoard = false;
let player1Score = 0;
let player2Score = 0;
let currentPlayer = 1; // 1 for Player 1, 2 for Player 2
let matchedPairs = 0;

document.querySelector(".score").textContent = `Player 1: ${player1Score} | Player 2: ${player2Score}`;
document.querySelector(".current-player").textContent = "Player 1's Turn";

fetch("./data/cards.json")
  .then((res) => res.json())
  .then((data) => {
    originalCards = data;
    cards = [...originalCards, ...originalCards];
    shuffleCards();
    generateCards();
  });

function shuffleCards() {
  let currentIndex = cards.length,
    randomIndex,
    temporaryValue;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = cards[currentIndex];
    cards[currentIndex] = cards[randomIndex];
    cards[randomIndex] = temporaryValue;
  }
}

function generateCards() {
  for (let card of cards) {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.setAttribute("data-name", card.name);
    cardElement.innerHTML = `
      <div class="front">
        <img class="front-image" src=${card.image} />
      </div>
      <div class="back"></div>
    `;
    gridContainer.appendChild(cardElement);
    cardElement.addEventListener("click", flipCard);
  }
}

function flipCard() {
  if (lockBoard || this === firstCard) return;

  this.classList.add("flipped");

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;

  lockBoard = true;

  checkForMatch();
}

function checkForMatch() {
  let isMatch = firstCard.dataset.name === secondCard.dataset.name;

  isMatch ? disableCards() : unflipCards();
}

function disableCards() {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);

  if (currentPlayer === 1) {
    player1Score++;
  } else {
    player2Score++;
  }

  matchedPairs++;
  updateScoreDisplay();

  if (matchedPairs === originalCards.length) {
    setTimeout(() => {
      alert(getWinnerMessage());
    }, 500);
  }

  resetBoard();
}

function unflipCards() {
  setTimeout(() => {
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");
    resetBoard();
  }, 1000);
}

function resetBoard() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
  currentPlayer = currentPlayer === 1 ? 2 : 1;
  document.querySelector(".current-player").textContent = `Player ${currentPlayer}'s Turn`;
}

function updateScoreDisplay() {
  document.querySelector(".score").textContent = `Player 1: ${player1Score} | Player 2: ${player2Score}`;
}

function getWinnerMessage() {
  if (player1Score > player2Score) {
    return "🎉 Player 1 wins!";
  } else if (player2Score > player1Score) {
    return "🎉 Player 2 wins!";
  } else {
    return "It's a tie!";
  }
}

function restart() {
  resetBoard();
  player1Score = 0;
  player2Score = 0;
  matchedPairs = 0;
  document.querySelector(".score").textContent = `Player 1: ${player1Score} | Player 2: ${player2Score}`;
  document.querySelector(".current-player").textContent = "Player 1's Turn";
  gridContainer.innerHTML = "";

  cards = [...originalCards, ...originalCards];
  shuffleCards();
  generateCards();
}

function disableCards() {
  
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);

  
  firstCard.classList.add("matched");
  secondCard.classList.add("matched");

  
  setTimeout(() => {
    firstCard.style.visibility = "hidden";
    secondCard.style.visibility = "hidden";

    
    if (currentPlayer === 1) {
      player1Score++;
    } else {
      player2Score++;
    }
    matchedPairs++;
    updateScoreDisplay();

  
    if (matchedPairs === originalCards.length) {
      setTimeout(() => {
        alert(getWinnerMessage());
      }, 500);
    }

    
    resetBoard();
  }, 500); 
}
