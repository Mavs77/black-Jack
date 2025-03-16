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
const prompt = (0, prompt_sync_1.default)();
// Player funds starting the game
let funds = 100;
console.log('Welcome to Blackjack!');
// Create spacing
console.log();
console.log(`Player's funds: $${funds}`);
// Ask for the user's name
let betAmt = parseInt(prompt('Enter your bet: '));
// Pass the bet amount and player funds to betAssessment
betAmt = (0, betAssessment_1.betAssessment)(betAmt, funds); // Capture the validated bet
//Card shuffle and render logic
let shuffledDeck = (0, shuffle_1.shuffleArray)(cardArray_1.deckOfCards);
//drawTwo
let twoCards = (0, cardDraw_1.drawTwoCards)(shuffledDeck);
let total = twoCards[0].value + twoCards[1].value;
console.log(`Your hand: ${twoCards[0].name}${twoCards[0].suit},`, `${twoCards[1].name}${twoCards[1].suit}` + ' ', `(Total: ${total})`);
// console.log(`Your hand: `);
