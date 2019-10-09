/***************** Global Variables *****************/

const deck = [];
// const shuffledDeck = [];
// Deck image source: https://opengameart.org/content/playing-cards-vector-png
let playerCards = [];
let dealerCards = [];
let playerTotal = 0;
let dealerTotal = 0;


// Bet globals
let playerBank = 1000;
let betTotal = 0;

// Winner message set to let to be overwritten
let winnerMsg = "";

// Payout sound
const chipSounds = new Audio('sounds/poker-chips.mp3');

// NOTE Disable hit and stand onload
document.getElementById('hit').disabled = true;
document.getElementById('stand').disabled = true;

/***************** Functions *****************/
// Function to create Deck 
const createDeck = () => {
    let suit = ['hearts', 'diamonds', 'clubs', 'spades'];
    let values = ['A', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K'];
    for(let i = 0; i < suit.length; i++) {
        for (let j = 0; j < values.length; j++) {
            let card = {value: values[j],
            suit: `${suit[i]}`,
            img: `cardimages/${values[j]}${suit[i][0]}.png`}
            deck.push(card);
        }
    }
}
createDeck();
// console.log(deck)

// Reset game board
const resetTable = () => {
    // Reset player and dealer hand
    playerCards = [];
    $('.playerCards').empty();
    dealerCards = [];
    $('.dealerCards').empty();
    // Reset buttons
    document.getElementById('hit').disabled = false;
    document.getElementById('stand').disabled = false;
    document.getElementById('deal').disabled = true;
    // Reset 
    $('#winnerMessage h2').text('')
}

// Function to deal cards
const dealCards = () => {
    resetTable();
    // Functionality to redeal deck
    if(deck.length < 15) {
        deck.splice(0,(deck.length-1));
        createDeck();
    }
    // NOTE Disabled this function for testing and because I felt like it was annoying for the gameplay.
    // Check to see if there is an active bet
    // if (betTotal === 0) {
    //     // Didn't want to use inline CSS but seemed more efficient than putting it in a class.
    //     $('#betTotal').html(`<span style="color:red;">Please place your bets</span>`);
    //     document.getElementById('deal').disabled = false;
    //     document.getElementById('hit').disabled = true;
    //     document.getElementById('stand').disabled = true;
    //     return;
    // }
    disableBetButtons();
    for(let i = 0; i < 2; i++) {
        let randomNumber = Math.floor(Math.random()* deck.length);
        // console.log(randomNumber);
        playerCards.push(deck[randomNumber]);
        deck.splice(randomNumber,1);
        $('.playerCards').append(`<div class="card"><img src="${playerCards[i].img}"></div>`);
        //Dealing dealer cards
        randomNumber = Math.floor(Math.random()* deck.length);
        // console.log(randomNumber);
        dealerCards.push(deck[randomNumber]);
        deck.splice(randomNumber,1);
        if (i === 0) {
            // $('.dealerCards').append(`<div class="card"><img src="${dealerCards[i].img}"></div>`)
            // console.log('true')
            $('.dealerCards').append(`<div class="back"><img src="cardimages/back.png"></div>`)
        } else {
        $('.dealerCards').append(`<div class="card"><img src="${dealerCards[i].img}"></div>`);
        }
    }
    placeBet();
}

// dealCards();
// console.log(playerCards)
// console.log(dealerCards)
// console.log(deck)

// Function to convert facecard values
const faceCardValue = (cardValue) => {
    if (cardValue === "A") {
        // cardValue = 11;
        return 11;
    // } else if (cardValue === ('K' || 'Q'|| 'J')) {
    } else if ((cardValue === 'K') || (cardValue === 'Q')|| (cardValue === 'J')) {
        return 10;
    } else {
        return cardValue;
    }
}
// console.log(faceCardValue(deck[0].value))

const dealerTurn = () => {
    dealerTotal = 0;
    $('.back img').attr('src', `${dealerCards[0].img}`)
    // $('.back img').hide().attr('src', `${dealerCards[0].img}`)
    // $('.back img').slideDown();
    for (let i = 0; i < dealerCards.length; i++) {
        dealerCards[i].value = faceCardValue(dealerCards[i].value)
        dealerTotal += dealerCards[i].value 
    }
    // Testing new dealer logic 
    while (dealerTotal <= 16) {
        let randomNumber = Math.floor(Math.random()* deck.length);
        dealerCards.push(deck[randomNumber]);
        dealerCards[dealerCards.length-1].value = faceCardValue(dealerCards[dealerCards.length-1].value)
        dealerTotal += dealerCards[dealerCards.length-1].value
        // Update Aces value when over 21
        // I tried to write this as a separate function and input it in but there were issues with the faceCard value being reset to a string. 
        for(let z = 0; z < dealerCards.length; z++) {
            if(dealerCards[z].value === 11 && dealerTotal > 21){
                dealerCards[z].value -= 10;
                dealerTotal -= 10;
            }
        }
        deck.splice(randomNumber,1);
        $('.dealerCards').append(`<div class="card"><img src="${dealerCards[dealerCards.length-1].img}"></div>`);
        // checkDealerAces();
        // checkDealerTotal();
    }
}

// const checkDealerTotal = () => {
//     for (let k = 0; k < dealerCards.length; k++) {
//         dealerTotal = 0;
//         dealerTotal += dealerCards[k].value;
//     }
// }

// const checkDealerAces = () => {
//     for(let i = 0; i < dealerCards.length; i++) {
//         if(dealerCards[i].value === 11 && dealerTotal > 21){
//             dealerCards[i].value -= 10;
//         }
// }
// }

    // Original dealer logic
    // while (dealerTotal <= 16) {
    //     let randomNumber = Math.floor(Math.random()* deck.length);
    //     dealerCards.push(deck[randomNumber]);
    //     dealerCards[dealerCards.length-1].value = faceCardValue(dealerCards[dealerCards.length-1].value)
    //     dealerTotal += dealerCards[dealerCards.length-1].value
    //     deck.splice(randomNumber,1);
    //     $('.dealerCards').append(`<div class="card"><img src="${dealerCards[dealerCards.length-1].img}"></div>`);
    //     // Dealer check aces logic
    //     for(let j = 0; j < dealerCards.length; j++) {
    //         if(dealerCards[j].value === 11 && dealerTotal > 21){
    //             dealerCards[j].value -= 10;
    //             for (let k = 0; k < dealerCards.length; k++) {
    //                 dealerTotal = 0;
    //                 dealerTotal += dealerCards[k].value;
    //             }
    //         }
    //     }
    // }
// }

// Function to check player total
const checkPlayerTotal = () => {
    playerTotal = 0;
    for (let i = 0; i < playerCards.length; i++) {
        playerCards[i].value = faceCardValue(playerCards[i].value)
        console.log
    }
    // NOTE May need to update this for game loop
    // if ((playerCards[0].value + playerCards[1].value) === 21){
    //     stand();
    //     return "Player Wins! Blackjack!";
    // } else {
        for (let i = 0; i < playerCards.length; i++) {
            playerTotal += playerCards[i].value;
            checkPlayerAces(playerTotal);
            if(playerTotal > 21) {
                document.getElementById('hit').disabled = true;
                document.getElementById('stand').disabled = true;
                document.getElementById('deal').disabled = false;
                enableBetButtons();
                resetBetTotal();
                $('#winnerMessage h2').text(`Bust! Dealer Wins`);
                $('#winnerMessage').delay(100).fadeToggle(800);
                $('#winnerMessage').delay(500).fadeToggle(800);
            return "Player Busts!";
            }
        // }
        // return playerTotal;
    }
}
// console.log(checkPlayerTotal())
// NOTE Need to add logic to change Ace value to 1 if player has an Ace

// NOTE  Check "Aces logic"
const checkPlayerAces = (total) => {
        for(let i = 0; i < playerCards.length; i++) {
            if(playerCards[i].value === 11 && playerTotal > 21){
                playerCards[i].value -= 10;
                checkPlayerTotal();
            }
    }
}


        // playerCards[playerCards.length-1].value = 1;
        // playerTotal = 0;
        // for (let i = 0; i < playerCards.length; i++) {
        //     playerTotal += playerCards[i].value;
        // }
    // }
// }

// Hit Function
const hit = () => {
    let randomNumber = Math.floor(Math.random()* deck.length);
    // console.log(randomNumber);
    playerCards.push(deck[randomNumber]);
    deck.splice(randomNumber,1);
    $('.playerCards').append(`<div class="card"><img src="${playerCards[playerCards.length-1].img}"></div>`);
    checkPlayerTotal();
    // playerCards.push()
}

// Function to append Winner Message
const displayWinner = () => {
    console.log('testing winner message')
    //Testing functionality with .hide
    document.getElementById('deal').disabled = false;
    enableBetButtons();
    $('#winnerMessage h2').text(`${winnerMsg}`);
    // $('#winnerMessage').delay(100).fadeIn(800);
    // $('#winnerMessage').delay(500).fadeOut(800);
    
    //Changing to fadeToggle per Matt's suggestion
    $('#winnerMessage').delay(100).fadeToggle(800);
    $('#winnerMessage').delay(500).fadeToggle(800);

    // NOTE Check functionality of Set timeout
}

// Check winner
const checkWinner = () => {
    if ((dealerCards[0].value + dealerCards[1].value === 21) & (playerCards[0].value + playerCards[1].value === 21)) {
        winnerMsg = 'Push';
        displayWinner();
        resetBetTotal();
        return 'Push'
    } else if (dealerCards[0].value + dealerCards[1].value === 21) {
        winnerMsg = 'Dealer Wins! Blackjack!';
        displayWinner();
        resetBetTotal();
        return 'Dealer Wins';
    } else if (playerCards[0].value + playerCards[1].value === 21) {
        winnerMsg = 'Player Wins! Blackjack!';
        chipSounds.play();
        playerBank += (betTotal + (betTotal * 1.5));
        $('#playerBank').text(`${playerBank}`);
        displayWinner();
        resetBetTotal();
        return 'Player Wins';
    } else if(playerTotal > 21) {
        winnerMsg = 'Dealer Wins';
        displayWinner();
        resetBetTotal();
        return 'Dealer Wins';
    } else if (dealerTotal > 21) {
        winnerMsg = 'Player Wins';
        betPayout();
        displayWinner();
        resetBetTotal();
        return 'Player Wins';
    } else if (playerTotal > dealerTotal) {
        winnerMsg = 'Player Wins';
        betPayout();
        displayWinner();
        resetBetTotal();
        return;
    } else if (playerTotal < dealerTotal) {
        winnerMsg = 'Dealer Wins';
        resetBetTotal();
        displayWinner();
        return 'Dealer Wins';
    } else {
        winnerMsg = 'Push';
        playerBank += (betTotal);
        $('#playerBank').text(`${playerBank}`);
        resetBetTotal();
        displayWinner();
        return 'Push';
    }
}

// Stay
const stand = () => {
    document.getElementById('hit').disabled = true;
    document.getElementById('stand').disabled = true;
    checkPlayerTotal();
    dealerTurn();
    // checkDealerTotal();
    console.log(checkWinner());
    
    // NOTE Need to remove console.log later
}

// Function to cap out be to max player bet
const betCap = () => {
    if(betTotal > playerBank) {
        betTotal = playerBank
    }
}

// new function test to update bet values
const placeBet = () => {
    playerBank -= betTotal;
    $('#playerBank').text(`${playerBank}`);
}

// Function to reset value to be added to checkWinner
const resetBetTotal = () => {
    betTotal = 0;
    $('#betTotal').text(`$${betTotal}`);
}

// Function for payouts
const betPayout = () => {
        chipSounds.play();
        playerBank += (betTotal * 2);
        $('#playerBank').text(`${playerBank}`);
}

// Disable bet buttons
const disableBetButtons = () => {
    document.getElementById('resetBet').disabled = true;
    document.getElementById('bet10').disabled = true;
    document.getElementById('bet25').disabled = true;
    document.getElementById('bet50').disabled = true;
    document.getElementById('bet100').disabled = true;
    document.getElementById('allIn').disabled = true;
}

const enableBetButtons = () => {
    document.getElementById('resetBet').disabled = false;
    document.getElementById('bet10').disabled = false;
    document.getElementById('bet25').disabled = false;
    document.getElementById('bet50').disabled = false;
    document.getElementById('bet100').disabled = false;
    document.getElementById('allIn').disabled = false;
}

/***************** Event Listeners *****************/
// Deal event listener
$('#deal').on('click', dealCards);

// Hit event listener
$('#hit').on('click', hit);

// Stand event listener
$('#stand').on('click', stand);

// Betting event listeners

$('#bet10').on('click', ()=> {
    betTotal += 10;
    betCap();
    // betPlaceholder();
    $('#betTotal').text(`$${betTotal}`);
})

$('#bet25').on('click', ()=> {
    betTotal += 25;
    betCap();
    $('#betTotal').text(`$${betTotal}`);
})

$('#bet50').on('click', ()=> {
    betTotal += 50;
    betCap();
    $('#betTotal').text(`$${betTotal}`);
})

$('#bet100').on('click', ()=> {
    betTotal += 100;
    betCap();
    // betPlaceholder();
    $('#betTotal').text(`$${betTotal}`);
})

$('#resetBet').on('click', ()=> {
    betTotal = 0;
    $('#betTotal').text(`$${betTotal}`);
})

$('#allIn').on('click', ()=> {
    betTotal = playerBank;
    $('#betTotal').text(`$${betTotal}`);
})