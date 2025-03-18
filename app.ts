import PromptSync from 'prompt-sync';
import { betAssessment } from './modules/betAssessment';
import { shuffleArray } from './modules/shuffle';
import { Card, deckOfCards } from './modules/cardArray';
import { drawTwoCards } from './modules/cardDraw';
import { aceLogic } from './modules/aceLogic';
import { dealerDrawCards } from './modules/dealerDraw';
import { playerTurn } from './modules/playerTurn';
import { determineWinner } from './modules/determineWinner';

const prompt = PromptSync();

// Main game loop
let playAgain = true;

while (playAgain) {
  // Player funds starting the game
  let funds = 100;

  console.log('Welcome to Blackjack!');

  while (funds > 0) {
    // Create spacing
    console.log();

    console.log(`Player's funds: $${funds}`);

    // Ask for the user's bet
    let betAmt = parseInt(prompt('Enter your bet (or 0 to quit): '));

    // Check if the player wants to quit
    if (betAmt === 0) {
      console.log('Thanks for playing! Goodbye.');
      playAgain = false;
      break;
    }

    // Pass the bet amount and player funds to betAssessment
    betAmt = betAssessment(betAmt, funds); // Capture the validated bet

    // Card shuffle and render logic
    let shuffledDeck = shuffleArray(deckOfCards);

    // Draw two cards for the player
    let twoCards = drawTwoCards(shuffledDeck);

    // Calculate the total value of the player's hand (adjusting for Aces)
    let total = aceLogic(twoCards.drawnCards);

    // Render the player's hand
    console.log(
      `Your hand: ${twoCards.drawnCards[0].name}${twoCards.drawnCards[0].suit},`,
      `${twoCards.drawnCards[1].name}${twoCards.drawnCards[1].suit}` + ' ',
      `(Total: ${total})`
    );

    // Dealer's hand
    let { dealerHand, updatedDeck: newDeck } = dealerDrawCards(
      twoCards.updatedDeckBro
    );
    console.log(
      `Dealer's hand: ${dealerHand[0].name}${dealerHand[0].suit}, [hidden]`
    );

    // Declare dealerRevealedHand outside the loop
    let dealerRevealedHand: [Card, Card] = [...dealerHand]; // Initialize with the dealer's initial hand

    // Game loop
    let gameOver = false;
    let playerBusted = false;
    let dealerBusted = false;

    while (!gameOver) {
      // Player's turn
      let playerDecision = prompt('Your action (hit/stand): ').toLowerCase();

      // Validate player input
      while (playerDecision !== 'hit' && playerDecision !== 'stand') {
        console.log('Invalid input. Please enter "hit" or "stand".');
        playerDecision = prompt('Your action (hit/stand): ').toLowerCase();
      }

      // Call playerTurn and capture the return values
      let { newPlayerHand, updatedDeck } = playerTurn(
        newDeck,
        twoCards.drawnCards,
        dealerHand,
        playerDecision
      );

      // Update the player's hand and deck
      twoCards.drawnCards = newPlayerHand;
      newDeck = updatedDeck;

      // Calculate the player's new total
      total = aceLogic(newPlayerHand);

      // Render the player's hand
      console.log(
        `Your hand: ${newPlayerHand
          .map((card) => `${card.name}${card.suit}`)
          .join(', ')} (Total: ${total})`
      );

      // Check if the player busts
      if (total > 21) {
        console.log('Player busts! Dealer wins.');
        playerBusted = true;
        gameOver = true;
        break;
      }

      // If the player stands, it's the dealer's turn
      if (playerDecision === 'stand') {
        console.log("Player stands. Dealer's turn...");

        // Dealer draws cards until their score is at least 17
        let dealerTotal = aceLogic(dealerRevealedHand);
        while (dealerTotal < 17) {
          const newCard = newDeck.shift()!;
          dealerRevealedHand.push(newCard);
          dealerTotal = aceLogic(dealerRevealedHand);
        }

        // Render the dealer's hand
        console.log(
          `Dealer's hand: ${dealerRevealedHand
            .map((card) => `${card.name}${card.suit}`)
            .join(', ')} (Total: ${dealerTotal})`
        );

        // Check if the dealer busts
        if (dealerTotal > 21) {
          console.log('Dealer busts! Player wins.');
          dealerBusted = true;
        }

        gameOver = true;
      }
    }

    // Determine the winner and update funds if the game is over
    if (gameOver && !playerBusted && !dealerBusted) {
      const { result, updatedFunds } = determineWinner(
        twoCards.drawnCards,
        dealerRevealedHand,
        funds,
        betAmt
      );

      // Update the player's funds
      funds = updatedFunds;

      // Display the result and updated funds
      console.log(result);
      if (result.includes('Player wins')) {
        console.log(`You win $${betAmt}.`);
      } else if (result.includes('Dealer wins')) {
        console.log(`You lose $${betAmt}.`);
      } else {
        console.log("It's a draw. Your funds remain unchanged.");
      }
      console.log(`Player's funds: $${funds}`);
    }

    // Check if the player has run out of funds
    if (funds <= 0) {
      console.log('Game over! You have no funds left.');
      break;
    }
  }

  // Ask the player if they want to play again
  if (funds <= 0) {
    const restart = prompt(
      'Would you like to start a new game? (yes/no): '
    ).toLowerCase();
    if (restart === 'yes') {
      console.log('Starting a new game...');
    } else {
      console.log('Thanks for playing! Goodbye.');
      playAgain = false;
    }
  }
}
