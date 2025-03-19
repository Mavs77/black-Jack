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

    betAmt = betAssessment(betAmt, funds);

    // Deduct bet immediately
    // funds -= betAmt;

    let shuffledDeck = shuffleArray(deckOfCards);
    let twoCards = drawTwoCards(shuffledDeck);
    let total = aceLogic(twoCards.drawnCards);

    console.log(
      `Your hand: ${twoCards.drawnCards[0].name}${twoCards.drawnCards[0].suit}, ` +
        `${twoCards.drawnCards[1].name}${twoCards.drawnCards[1].suit} (Total: ${total})`
    );

    let { dealerHand, updatedDeck: newDeck } = dealerDrawCards(
      twoCards.updatedDeckBro
    );
    console.log(
      `Dealer's hand: ${dealerHand[0].name}${dealerHand[0].suit}, [hidden]`
    );

    let dealerRevealedHand: [Card, Card] = [...dealerHand];

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
        let { newPlayerHand, updatedDeck } = playerTurn(
          newDeck,
          twoCards.drawnCards,
          dealerHand,
          playerDecision
        );

        twoCards.drawnCards = newPlayerHand;
        newDeck = updatedDeck;
        total = aceLogic(newPlayerHand);

        console.log(
          `Your hand: ${newPlayerHand
            .map((card) => `${card.name}${card.suit}`)
            .join(', ')} (Total: ${total})`
        );

        if (total > 21) {
          console.log('Player busts! Dealer wins.');
          playerBusted = true;
          gameOver = true;
        }
      } else {
        console.log("Player stands. Dealer's turn...");

        let dealerTotal = aceLogic(dealerRevealedHand);
        while (dealerTotal < 17) {
          const newCard = newDeck.shift()!;
          dealerRevealedHand.push(newCard);
          dealerTotal = aceLogic(dealerRevealedHand);
        }

        console.log(
          `Dealer's hand: ${dealerRevealedHand
            .map((card) => `${card.name}${card.suit}`)
            .join(', ')} (Total: ${dealerTotal})`
        );

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
      } else if (dealerBusted) {
        console.log(`You won $${betAmt}!`);
        funds += betAmt; // Player wins amount betted from dealer
        console.log(`Player's funds: $${funds}`);
      } else {
        const { result, updatedFunds } = determineWinner(
          twoCards.drawnCards,
          dealerRevealedHand,
          funds,
          betAmt
        );

        funds = updatedFunds; // Properly update funds

        console.log(result);
        if (result.includes('Player wins')) {
          funds += betAmt;
          console.log(`You win $${betAmt}.`);
          console.log(`Player's funds: $${funds}`);
        } else if (result.includes('Dealer wins')) {
          funds -= betAmt;
          console.log(`You lose $${funds}.`);
          console.log(`Player's funds: $${funds}`);
        } else if (result.includes('Dealer busts')) {
          console.log('You win');
          funds += betAmt;
          console.log(`You win $${betAmt}.`);
          console.log(`Player's funds: $${funds}`);
        } else {
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
    const restart = prompt(
      'Would you like to start a new game? (yes/no): '
    ).toLowerCase();
    if (restart === 'yes') {
      console.log();
      console.log('Starting a new game...');
      console.log();
    } else {
      console.log('Thanks for playing! Goodbye.');
      playAgain = false;
    }
  }
}
