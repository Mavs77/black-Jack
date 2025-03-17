import PromptSync from 'prompt-sync';
import { betAssessment } from './modules/betAssessment';
import { shuffleArray } from './modules/shuffle';
import { deckOfCards } from './modules/cardArray';
import { drawTwoCards } from './modules/cardDraw';
import { aceLogic } from './modules/aceLogic';
import { dealerDrawCards } from './modules/dealerDraw';
import { playerTurn } from './modules/playerTurn';

const prompt = PromptSync();

// Player funds starting the game
let funds = 100;

console.log('Welcome to Blackjack!');

// Create spacing
console.log();

console.log(`Player's funds: $${funds}`);

// Ask for the user's name
let betAmt = parseInt(prompt('Enter your bet: '));

// Pass the bet amount and player funds to betAssessment
betAmt = betAssessment(betAmt, funds); // Capture the validated bet

//Card shuffle and render logic
let shuffledDeck = shuffleArray(deckOfCards);

//drawTwo
let twoCards = drawTwoCards(shuffledDeck);

let total = aceLogic(twoCards.drawnCards);

console.log(
  `Your hand: ${twoCards.drawnCards[0].name}${twoCards.drawnCards[0].suit},`,
  `${twoCards.drawnCards[1].name}${twoCards.drawnCards[1].suit}` + ' ',
  `(Total: ${total})`
);

//Dealer's hand
const { dealerHand, updatedDeck: newDeck } = dealerDrawCards(
  twoCards.updatedDeckBro
);
console.log(
  `Dealer's hand: ${dealerHand[0].name}${dealerHand[0].suit}, [hidden]`
);

let playerDecision = prompt('Your action (hit/stand): ');

playerTurn(newDeck, twoCards.drawnCards, dealerHand, playerDecision);
