let deck = [];
let playerHand = [];
let dealerHand = [];
let gameOver = false;
let playerStands = false;

window.onload = function () {
  setupEventListeners();
  resetGame();
};

function setupEventListeners() {
  const dealBtn = document.getElementById("dealBtn");
  const hitBtn = document.getElementById("hitBtn");
  const standBtn = document.getElementById("standBtn");

  dealBtn.onclick = function () {
    startNewRound();
  };

  hitBtn.onclick = function () {
    hitPlayer();
  };

  standBtn.onclick = function () {
    standPlayer();
  };
}

function resetGame() {
  playerHand = [];
  dealerHand = [];
  gameOver = false;
  playerStands = false;

  clearTable();
  showMessage("Welcome to Blackjack! Click \"Deal\" to start.");
  setButtonStates({ deal: true, hit: false, stand: false });
}

function Card(suit, rank, value, imagePath) {
  this.suit = suit;
  this.rank = rank;
  this.value = value;
  this.imagePath = imagePath;
}

function rankToWord(rank) {
  switch (rank) {
    case "A": return "ace";
    case "J": return "jack";
    case "Q": return "queen";
    case "K": return "king";
    default: return rank;
  }
}

function createDeck() {
  const suits = ["hearts", "diamonds", "clubs", "spades"];
  const ranks = ["A","2","3","4","5","6","7","8","9","10","J","Q","K"];
  const newDeck = [];

  for (let s = 0; s < suits.length; s++) {
    for (let r = 0; r < ranks.length; r++) {
      const rank = ranks[r];
      const suit = suits[s];

      let value;
      if (rank === "A") value = 11;
      else if (["J","Q","K"].includes(rank)) value = 10;
      else value = Number(rank);

      const rankWord = rankToWord(rank);
      const imagePath = `images/${rankWord}_of_${suit}.svg`;

      newDeck.push(new Card(suit, rank, value, imagePath));
    }
  }
  return newDeck;
}

function shuffleDeck(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

function startNewRound() {
  gameOver = false;
  playerStands = false;

  if (deck.length < 15) {
    deck = createDeck();
    shuffleDeck(deck);
  }

  playerHand = [];
  dealerHand = [];

  clearTable();
  showMessage("Good luck!");

  dealInitialCards();

  setButtonStates({ deal: false, hit: true, stand: true });
}

function dealInitialCards() {
  playerHand.push(deck.pop());
  dealerHand.push(deck.pop());
  playerHand.push(deck.pop());
  dealerHand.push(deck.pop());

  renderHands(true);
  updateTotals(true);
}

function hitPlayer() {
  if (gameOver || playerStands) return;

  playerHand.push(deck.pop());
  renderHands(true);
  updateTotals(true);

  const playerTotal = calculateHandValue(playerHand);
  if (playerTotal > 21) {
    gameOver = true;
    showMessage("Player busts! Dealer wins.");
    setButtonStates({ deal: true, hit: false, stand: false });
  }
}

function standPlayer() {
  if (gameOver) return;

  playerStands = true;
  showMessage("Dealer's turn...");
  setButtonStates({ deal: false, hit: false, stand: false });
  dealerTurn();
}

function dealerTurn() {
  renderHands(false);
  updateTotals(false);

  let dealerTotal = calculateHandValue(dealerHand);
  let playerTotal = calculateHandValue(playerHand);

  while (dealerTotal < 17) {
    dealerHand.push(deck.pop());
    renderHands(false);
    updateTotals(false);
    dealerTotal = calculateHandValue(dealerHand);
  }

  if (dealerTotal > 21) {
    showMessage("Dealer busts! You win!");
  } else if (dealerTotal > playerTotal) {
    showMessage("Dealer wins!");
  } else if (dealerTotal < playerTotal) {
    showMessage("You win!");
  } else {
    showMessage("Push (tie).");
  }

  gameOver = true;
  setButtonStates({ deal: true, hit: false, stand: false });
}

function renderHands(hideDealerHoleCard) {
  const dealerDiv = document.getElementById("dealer-cards");
  const playerDiv = document.getElementById("player-cards");

  dealerDiv.innerHTML = "";
  playerDiv.innerHTML = "";

  dealerHand.forEach((card, index) => {
    const img = document.createElement("img");
    img.className = "card";
    if (hideDealerHoleCard && index === 1) {
      img.src = "images/back.png";
      img.alt = "Hidden card";
    } else {
      img.src = card.imagePath;
      img.alt = `${card.rank} of ${card.suit}`;
    }
    dealerDiv.appendChild(img);
  });

  playerHand.forEach(card => {
    const img = document.createElement("img");
    img.className = "card";
    img.src = card.imagePath;
    img.alt = `${card.rank} of ${card.suit}`;
    playerDiv.appendChild(img);
  });
}

function calculateHandValue(hand) {
  let total = 0;
  let aces = 0;

  for (let i = 0; i < hand.length; i++) {
    total += hand[i].value;
    if (hand[i].rank === "A") aces++;
  }

  while (total > 21 && aces > 0) {
    total -= 10;
    aces--;
  }
  return total;
}

function updateTotals(hideDealerHoleCard) {
  const dealerTotalDiv = document.getElementById("dealer-total");
  const playerTotalDiv = document.getElementById("player-total");

  const playerTotal = calculateHandValue(playerHand);
  const dealerTotal = calculateHandValue(dealerHand);

  playerTotalDiv.textContent = `Total: ${playerTotal}`;
  dealerTotalDiv.textContent = hideDealerHoleCard ? "Total: ??" : `Total: ${dealerTotal}`;
}

function clearTable() {
  document.getElementById("dealer-cards").innerHTML = "";
  document.getElementById("player-cards").innerHTML = "";
  document.getElementById("dealer-total").textContent = "";
  document.getElementById("player-total").textContent = "";
}

function showMessage(text) {
  document.getElementById("message").textContent = text;
}

function setButtonStates({ deal, hit, stand }) {
  document.getElementById("dealBtn").disabled = !deal;
  document.getElementById("hitBtn").disabled = !hit;
  document.getElementById("standBtn").disabled = !stand;
}
