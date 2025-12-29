import { createSlice } from '@reduxjs/toolkit';

// 15 Çift Emoji = 30 Kart
const EMOJIS = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', 'dV', '🐷', '🐸', '🐵'];

const shuffleCards = () => {
  // Emojileri çiftle ve karıştır
  const pairs = [...EMOJIS, ...EMOJIS];
  return pairs
    .sort(() => Math.random() - 0.5)
    .map((emoji, index) => ({
      id: index,
      emoji,
      isFlipped: false,
      isMatched: false,
    }));
};

const initialState = {
  cards: shuffleCards(),
  score: 0,
  flippedCards: [],
  isGameOver: false,
  lockBoard: false,
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    restartGame: (state) => {
      state.cards = shuffleCards();
      state.score = 0;
      state.flippedCards = [];
      state.isGameOver = false;
      state.lockBoard = false;
    },
    flipCard: (state, action) => {
      const cardId = action.payload;
      const card = state.cards.find(c => c.id === cardId);
      
      if (state.lockBoard || card.isFlipped || card.isMatched) return;

      card.isFlipped = true;
      state.flippedCards.push(cardId);
    },
    matchPairs: (state) => {
      const [id1, id2] = state.flippedCards;
      const card1 = state.cards.find(c => c.id === id1);
      const card2 = state.cards.find(c => c.id === id2);

      if (card1.emoji === card2.emoji) {
        card1.isMatched = true;
        card2.isMatched = true;
        state.score += 50;
        state.flippedCards = [];
        
        // Hepsi eşleşti mi?
        if (state.cards.every(c => c.isMatched)) {
          state.isGameOver = true;
        }
      }
    },
    closeCards: (state) => {
      const [id1, id2] = state.flippedCards;
      state.cards.find(c => c.id === id1).isFlipped = false;
      state.cards.find(c => c.id === id2).isFlipped = false;
      
      state.score -= 10;
      state.flippedCards = [];
      state.lockBoard = false;
    },
    setLockBoard: (state, action) => {
      state.lockBoard = action.payload;
    }
  },
});

export const { restartGame, flipCard, matchPairs, closeCards, setLockBoard } = gameSlice.actions;
export default gameSlice.reducer;