"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prompt_sync_1 = __importDefault(require("prompt-sync"));
const betAssessment_1 = require("./modules/betAssessment");
const shuffle_1 = require("./modules/shuffle");
const cardArray_1 = require("./modules/cardArray");
const cardDraw_1 = require("./modules/cardDraw");
const aceLogic_1 = require("./modules/aceLogic");
const dealerDraw_1 = require("./modules/dealerDraw");
const playerTurn_1 = require("./modules/playerTurn");
const determineWinner_1 = require("./modules/determineWinner");
const prompt = (0, prompt_sync_1.default)();
// Main game loop
let playAgain = true;
while (playAgain) {
    let funds = 100;
    console.log('Welcome to Blackjack!');
    while (funds > 0) {
        console.log(`\nPlayer's funds: $${funds}`);
        let betAmt = parseInt(prompt('Enter your bet (or 0 to quit): '));
        if (betAmt === 0) {
            console.log('Thanks for playing! Goodbye.');
            playAgain = false;
            break;
        }
        betAmt = (0, betAssessment_1.betAssessment)(betAmt, funds);
        // Deduct bet immediately
        // funds -= betAmt;
        let shuffledDeck = (0, shuffle_1.shuffleArray)(cardArray_1.deckOfCards);
        let twoCards = (0, cardDraw_1.drawTwoCards)(shuffledDeck);
        let total = (0, aceLogic_1.aceLogic)(twoCards.drawnCards);
        console.log(`Your hand: ${twoCards.drawnCards[0].name}${twoCards.drawnCards[0].suit}, ` +
            `${twoCards.drawnCards[1].name}${twoCards.drawnCards[1].suit} (Total: ${total})`);
        let { dealerHand, updatedDeck: newDeck } = (0, dealerDraw_1.dealerDrawCards)(twoCards.updatedDeckBro);
        console.log(`Dealer's hand: ${dealerHand[0].name}${dealerHand[0].suit}, [hidden]`);
        let dealerRevealedHand = [...dealerHand];
        let gameOver = false;
        let playerBusted = false;
        let dealerBusted = false;
        while (!gameOver) {
            let playerDecision = prompt('Your action (hit/stand): ').toLowerCase();
            while (playerDecision !== 'hit' && playerDecision !== 'stand') {
                console.log('Invalid input. Please enter "hit" or "stand".');
                playerDecision = prompt('Your action (hit/stand): ').toLowerCase();
            }
            if (playerDecision === 'hit') {
                let { newPlayerHand, updatedDeck } = (0, playerTurn_1.playerTurn)(newDeck, twoCards.drawnCards, dealerHand, playerDecision);
                twoCards.drawnCards = newPlayerHand;
                newDeck = updatedDeck;
                total = (0, aceLogic_1.aceLogic)(newPlayerHand);
                console.log(`Your hand: ${newPlayerHand
                    .map((card) => `${card.name}${card.suit}`)
                    .join(', ')} (Total: ${total})`);
                if (total > 21) {
                    console.log('Player busts! Dealer wins.');
                    playerBusted = true;
                    gameOver = true;
                }
            }
            else {
                console.log("Player stands. Dealer's turn...");
                let dealerTotal = (0, aceLogic_1.aceLogic)(dealerRevealedHand);
                while (dealerTotal < 17) {
                    const newCard = newDeck.shift();
                    dealerRevealedHand.push(newCard);
                    dealerTotal = (0, aceLogic_1.aceLogic)(dealerRevealedHand);
                }
                console.log(`Dealer's hand: ${dealerRevealedHand
                    .map((card) => `${card.name}${card.suit}`)
                    .join(', ')} (Total: ${dealerTotal})`);
                if (dealerTotal > 21) {
                    console.log('Dealer busts! Player wins.');
                    dealerBusted = true;
                }
                gameOver = true;
            }
        }
        if (gameOver) {
            if (playerBusted) {
                console.log(`You lost $${betAmt}.`);
                funds -= betAmt; // Player loses amount betted to dealer
                console.log(`Player's funds: $${funds}`);
            }
            else if (dealerBusted) {
                console.log(`You won $${betAmt}!`);
                funds += betAmt; // Player wins amount betted from dealer
                console.log(`Player's funds: $${funds}`);
            }
            else {
                const { result, updatedFunds } = (0, determineWinner_1.determineWinner)(twoCards.drawnCards, dealerRevealedHand, funds, betAmt);
                funds = updatedFunds; // Properly update funds
                console.log(result);
                if (result.includes('Player wins')) {
                    funds += betAmt;
                    console.log(`You win $${betAmt}.`);
                    console.log(`Player's funds: $${funds}`);
                }
                else if (result.includes('Dealer wins')) {
                    funds -= betAmt;
                    console.log(`You lose $${funds}.`);
                    console.log(`Player's funds: $${funds}`);
                }
                else if (result.includes('Dealer busts')) {
                    console.log('You win');
                    funds += betAmt;
                    console.log(`You win $${betAmt}.`);
                    console.log(`Player's funds: $${funds}`);
                }
                else {
                    console.log("It's a draw. Bet refunded.");
                    // funds += betAmt; // Refund bet on draw
                    console.log(`Player's funds: $${funds}`);
                }
            }
            // console.log(`Player's funds: $${funds}`);
        }
        if (funds <= 0) {
            console.log('Game over! You have no funds left.');
            break;
        }
    }
    if (funds <= 0) {
        const restart = prompt('Would you like to start a new game? (yes/no): ').toLowerCase();
        if (restart === 'yes') {
            console.log();
            console.log('Starting a new game...');
            console.log();
        }
        else {
            console.log('Thanks for playing! Goodbye.');
            playAgain = false;
        }
    }
}
