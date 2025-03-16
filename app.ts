import PromptSync from 'prompt-sync';
import { betAssessment } from './modules/betAssessment';
import { shuffleArray } from './modules/shuffle';
import { deckOfCards } from './modules/cardArray';
import { drawTwoCards } from './modules/cardDraw';

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

let total = twoCards[0].value + twoCards[1].value;

console.log(
  `Your hand: ${twoCards[0].name}${twoCards[0].suit},`,
  `${twoCards[1].name}${twoCards[1].suit}` + ' ',
  `(Total: ${total})`
);

// console.log(`Your hand: `);
