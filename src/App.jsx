import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { flipCard, matchPairs, closeCards, setLockBoard, restartGame } from './gameSlice';

function App() {
  const dispatch = useDispatch();
  const { cards, score, flippedCards, isGameOver } = useSelector((state) => state.game);

  useEffect(() => {
    if (flippedCards.length === 2) {
      dispatch(setLockBoard(true)); // Tıklamayı kilitle
      
      const [id1, id2] = flippedCards;
      const card1 = cards.find(c => c.id === id1);
      const card2 = cards.find(c => c.id === id2);

      if (card1.emoji === card2.emoji) {
        dispatch(matchPairs());
        dispatch(setLockBoard(false));
      } else {
        setTimeout(() => {
          dispatch(closeCards());
        }, 1000); // 1 saniye bekle ve kapat
      }
    }
  }, [flippedCards, cards, dispatch]);

  return (
    <div className="container">
      <header>
        <h1>Hafıza Oyunu</h1>
        <div className="score-board">Puan: {score}</div>
      </header>
      
      <div className="game-grid">
        {cards.map((card) => (
          <div
            key={card.id}
            className={`card ${card.isFlipped ? 'flipped' : ''} ${card.isMatched ? 'matched' : ''}`}
            onClick={() => dispatch(flipCard(card.id))}
          >
            <div className="card-inner">
              <div className="card-front">❓</div>
              <div className="card-back">{card.emoji}</div>
            </div>
          </div>
        ))}
      </div>

      {isGameOver && (
        <div className="modal">
          <div className="modal-content">
            <h2>Oyun Bitti! 🏆</h2>
            <p>Toplam Puan: {score}</p>
            <button onClick={() => dispatch(restartGame())}>Yeniden Oyna</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;