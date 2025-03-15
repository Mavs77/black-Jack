import PromptSync from 'prompt-sync';
import { betAssessment } from './modules/betAssessment';

const prompt = PromptSync();

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
betAmt = betAssessment(betAmt, funds); // Capture the validated bet

console.log(`You placed a bet of $${betAmt}.`);
