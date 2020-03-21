let blackjackGame = {
    'you' : {'scorespan' : '#your-result', 'div' : '#your-box', 'score' : 0},
    'dealer' : {'scorespan' : '#dealer-result', 'div' : '#dealer-box', 'score' : 0},
    'cards' : ['2','3','4','5','6','7','8','9','10','K','Q','J','A'],
    'cardsMap' : {'2' : 2, '3' : 3, '4' : 4, '5' : 5, '6' : 6, '7' : 7, '8' : 8, '9' : 9, '10' : 10, 'J' : 10, 'K' : 10, 'Q' : 10, 'A' : [1,11]},
    'wins' : 0,
    'losses' : 0,
    'draws' : 0,
    'isStand' : false,
    'isTurnOver' : false,
};

const YOU = blackjackGame['you'];
const DEALER = blackjackGame['dealer'];

let hitSound = new Audio('assets/sounds/swish.m4a');
let winSound = new Audio('assets/sounds/cash.mp3');
let looseSound = new Audio('assets/sounds/aww.mp3');

document.querySelector('#hit').addEventListener('click',blackJackHit);
document.querySelector('#deal').addEventListener('click',blackJackDeal);
document.querySelector('#stand').addEventListener('click',dealerLogic);

function blackJackHit() {
 if(blackjackGame['isStand']  === false) {
   let card = randomCard();
   console.log(card);
   showCard(YOU,card);
   updateScore(card,YOU);
   showScore(YOU);
 }
}

function  showCard(activePlayer,card) {
    if(activePlayer['score'] <= 21) {
    let cardImage = document.createElement('img');
    cardImage.src = `assets/images/${card}.png`;
    document.querySelector(activePlayer['div']).appendChild(cardImage);
    hitSound.play();
    }
}

function blackJackDeal() {
    if(blackjackGame['isTurnOver'] === true) {
    blackjackGame['isStand'] = false;
    let yourImages = document.querySelector(YOU['div']).querySelectorAll('img');
    let dealerImages = document.querySelector(DEALER['div']).querySelectorAll('img');
    for(let i = 0; i < yourImages.length; i++) {
        yourImages[i].remove();
    }
    for(let j = 0; j < dealerImages.length; j++) {
        dealerImages[j].remove();
    }

    YOU['score'] = 0;
    DEALER['score'] = 0;

    document.querySelector(YOU['scorespan']).textContent = 0;
    document.querySelector(YOU['scorespan']).style.color = 'white';
    document.querySelector(DEALER['scorespan']).textContent = 0;
    document.querySelector(DEALER['scorespan']).style.color = 'white';
    document.querySelector('#blackjack-result').textContent = 'Play Again!';
    document.querySelector('#blackjack-result').style.color = 'black';
    blackjackGame['isTurnOver'] = false;
    }
}

function randomCard() {
    let randomIndex = Math.floor(Math.random() * 13);
    return blackjackGame['cards'][randomIndex];
}

function updateScore(card, activePlayer) {
    if(card === 'A') {
        if( activePlayer['score'] += blackjackGame['cardsMap'][card][1] <= 21) {
            activePlayer['score'] += blackjackGame['cardsMap'][card][1];
        }
        else {
            activePlayer['score'] += blackjackGame['cardsMap'][card][0];
        }
    }
    else {
        activePlayer['score'] += blackjackGame['cardsMap'][card];
    }
    
}

function showScore(activePlayer) {
    if(activePlayer['score'] >= 21) {
        document.querySelector(activePlayer['scorespan']).textContent = 'BUST!';
        document.querySelector(activePlayer['scorespan']).style.color = 'red';
    }
    else {
        document.querySelector(activePlayer['scorespan']).textContent = activePlayer['score'];
        }
}


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve,ms));
}

async function dealerLogic() {
    blackjackGame['isStand'] = true;
    while(DEALER['score'] < 16 && blackjackGame['isStand'] === true) {
    let card = randomCard();
    console.log(card);
    showCard(DEALER,card);
    updateScore(card,DEALER);
    showScore(DEALER);
    await sleep(1000);
    }
    blackjackGame['isTurnOver'] = true;
    let winner = computeWinner();
    showResult(winner); 
}

function computeWinner() {
    let winner;

    if(YOU['score'] <= 21) {
        if(YOU['score']  > DEALER['score']  || DEALER['score']  > 21) {
            console.log("you won!");
            blackjackGame['wins']++;
            winner = YOU;
        } 
        else if (YOU['score'] < DEALER['score']) {
            console.log("you lost!");
            blackjackGame['losses']++;
            winner = DEALER;
        }
        else if (YOU['score'] === DEALER['score']) {
            console.log("you drew!");
            blackjackGame['draws']++;
        }
    }
    else if (YOU['score'] > 21 && DEALER['score'] <=21) {
        console.log("you lost!");
        blackjackGame['losses']++;
         winner = DEALER;
    }
    else if (YOU['score'] > 21 && DEALER['score'] <=21) {
        console.log("you drew!");
        blackjackGame['draws']++;
    }
    console.log(blackjackGame['draws']);
    return winner;
}
    
function showResult(winner) {
    let message, messageColor;
    if(blackjackGame['isTurnOver'] === true) {
    if(winner === YOU) {
        document.querySelector('#wins').textContent = blackjackGame['wins'];
        message = "You Won!";
        messageColor = 'green';
        winSound.play();
    }
    else if(winner === DEALER) {
        document.querySelector('#losses').textContent = blackjackGame['losses'];
        message = "You Lost!";
        messageColor = 'red';
        looseSound.play();
    }
    else {
        document.querySelector('#draws').textContent = blackjackGame['draws'];
        message = "You Drew!";
        messageColor = 'yellow';
    }

    document.querySelector('#blackjack-result').textContent = message;
    document.querySelector('#blackjack-result').style.color = messageColor;
   }
}