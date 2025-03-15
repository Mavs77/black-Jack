"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prompt_sync_1 = __importDefault(require("prompt-sync"));
const betAssessment_1 = require("./modules/betAssessment");
const prompt = (0, prompt_sync_1.default)();
// Player funds starting the game
let funds = 100;
console.log('Welcome to Blackjack!');
// Create spacing
console.log();
console.log();
console.log(`Player's funds: $${funds}`);
// Ask for the user's name
let betAmt = parseInt(prompt('Enter your bet: '));
// Pass the bet amount and player funds to betAssessment
betAmt = (0, betAssessment_1.betAssessment)(betAmt, funds); // Capture the validated bet
console.log(`You placed a bet of $${betAmt}.`);
