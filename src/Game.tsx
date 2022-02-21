import { useRef, useState } from 'react';
import styles from './sass/Game.module.scss';

enum FieldState {
  Empty,
  PlayerOne,
  PlayerTwo,
}

enum Players {
  PlayerOne,
  PlayerTwo,
}

const Game = () => {
  const [gameState, setGameState] = useState<Array<FieldState>>(
    Array(9).fill(FieldState.Empty)
  );
  const [currentTurn, setCurrentTurn] = useState<Players>(Players.PlayerOne);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const changeTurn = () => {
    setCurrentTurn(
      currentTurn === Players.PlayerOne ? Players.PlayerTwo : Players.PlayerOne
    );
    headingRef.current!.innerText = `${
      currentTurn === Players.PlayerOne ? 'Player Two' : 'Player One'
    } Turn`;
  };

  const getFieldContent = (fieldId: number): string => {
    const state = gameState[fieldId - 1];

    switch (state) {
      case FieldState.Empty:
        return '';
      case FieldState.PlayerOne:
        return 'O';
      case FieldState.PlayerTwo:
        return 'X';
    }
  };

  const handleOnClick = (filedId: number) => {
    console.log(`Called`, { filedId }, { currentTurn });

    //Check if filed is already taken

    const newState = [...gameState];
    const index = filedId - 1;

    switch (currentTurn) {
      case Players.PlayerOne:
        newState[index] = FieldState.PlayerOne;
        break;
      case Players.PlayerTwo:
        newState[index] = FieldState.PlayerTwo;
        break;
      default:
        newState[index] = FieldState.Empty;
    }

    changeTurn();
    console.log(newState);
    setGameState(newState);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading} ref={headingRef}>
        Player One Turn
      </h2>
      <div className={styles.gameGrid}>
        {Array.from({ length: 9 }, (_, i) => i + 1).map((i) => (
          <button
            key={i}
            className={`${styles.gameButton}`}
            onClick={() => handleOnClick(i)}
          >
            {getFieldContent(i)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Game;
