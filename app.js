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
let total = (0, aceLogic_1.aceLogic)(twoCards.drawnCards);
console.log(`Your hand: ${twoCards.drawnCards[0].name}${twoCards.drawnCards[0].suit},`, `${twoCards.drawnCards[1].name}${twoCards.drawnCards[1].suit}` + ' ', `(Total: ${total})`);
//Dealer's hand
const { dealerHand, updatedDeck: newDeck } = (0, dealerDraw_1.dealerDrawCards)(twoCards.updatedDeckBro);
console.log(`Dealer's hand: ${dealerHand[0].name}${dealerHand[0].suit}, [hidden]`);
let playerDecision = prompt('Your action (hit/stand): ');
(0, playerTurn_1.playerTurn)(newDeck, twoCards.drawnCards, dealerHand, playerDecision);
