import { useEffect, useState } from 'react';
import styles from './sass/Game.module.scss';

/*
Winning Conditions

* * *
. . . -> 111 000 000 -> 0b111000000
. . . 

. . .
* * * -> 000 111 000 -> 0b000111000
. . .

. . .
. . . -> 000 000 111 -> 0b000000111
* * * 

* . . 
* . . -> 100 100 100 -> 0b100100100
* . . 

. * . 
. * . -> 010 010 010 -> 0b010010010
. * . 

. . *
. . * -> 001 001 001 -> 0b001001001
. . *

* . . 
. * . -> 100 010 001 -> 0b100010001 
. . *

. . * 
. * . -> 001 010 100 -> 0b001010100
* . .

*/

const winningPositions = [
  0b111000000, 0b000111000, 0b000000111, 0b100100100, 0b010010010, 0b001001001,
  0b100010001, 0b001010100,
];

enum FieldOwner {
  None,
  PlayerOne,
  PlayerTwo,
}

enum Players {
  PlayerOne,
  PlayerTwo,
}

type FieldState = {
  owner: FieldOwner;
  color: string;
};

const Game = () => {
  // Hooks
  const [gameState, setGameState] = useState<FieldState[]>(
    Array.from(
      { length: 9 },
      (): FieldState => ({
        owner: FieldOwner.None,
        color: styles.red,
      })
    )
  );

  const [currentTurn, setCurrentTurn] = useState<Players>(Players.PlayerOne);
  const [headingText, setHeadingText] = useState<string>('Player One Turn');
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const getGameField = (gameState: FieldState[]) => {
    const playerOneFields = gameState.map(
      (el) => el.owner === FieldOwner.PlayerOne
    );

    const playerTwoFields = gameState.map(
      (el) => el.owner === FieldOwner.PlayerTwo
    );

    const playerOneIndexes = playerOneFields
      .map((val, index) => (val ? index : undefined))
      .filter((el) => el !== undefined);

    const playerTwoIndexes = playerTwoFields
      .map((val, index) => (val ? index : undefined))
      .filter((el) => el !== undefined);

    const toBitField = (boolVector: boolean[]) => {
      let bitfield = 0;
      let shift = 0;

      [...boolVector].reverse().forEach((el) => {
        bitfield |= Number(el) << shift++;
      });

      return bitfield;
    };

    return {
      PlayerOne: {
        indexes: playerOneIndexes,
        bits: toBitField(playerOneFields),
      },
      PlayerTwo: {
        indexes: playerTwoIndexes,
        bits: toBitField(playerTwoFields),
      },
    };
  };

  useEffect(() => {
    //Checking for win
    if (isFinished) return;

    const fields = getGameField(gameState);
    const playerOneBitField = fields.PlayerOne.bits;
    const playerTwoBitField = fields.PlayerTwo.bits;

    //Check if someone is winning
    for (const winPosition of winningPositions) {
      //Check if player one has won
      if ((playerOneBitField & winPosition) === winPosition) {
        setIsFinished(true);
        setHeadingText('Player One has won');
        setGameState(
          gameState.map((el, index) => {
            if (fields.PlayerOne.indexes.includes(index))
              return { ...el, color: styles.green };

            return { ...el };
          })
        );
        break;
      }

      //Check if Player Two is winning
      if ((playerTwoBitField & winPosition) === winPosition) {
        setIsFinished(true);
        setHeadingText('Player Two has won');
        setGameState(
          gameState.map((el, index) => {
            if (fields.PlayerTwo.indexes.includes(index))
              return { ...el, color: styles.green };

            return { ...el };
          })
        );
        break;
      }
    }
  }, [gameState, isFinished]);

  //Check for tie
  useEffect(() => {
    for (const el of gameState) if (el.owner === FieldOwner.None) return;

    setHeadingText('Tie');
    setIsFinished(true);
  }, [gameState]);

  const changeTurn = () => {
    setCurrentTurn(
      currentTurn === Players.PlayerOne ? Players.PlayerTwo : Players.PlayerOne
    );

    setHeadingText(
      `${currentTurn === Players.PlayerOne ? 'Player-Two' : 'Player-One'} Turn`
    );
  };

  const getFieldContent = (fieldId: number): string => {
    switch (gameState[fieldId].owner) {
      case FieldOwner.None:
        return '';
      case FieldOwner.PlayerOne:
        return 'O';
      case FieldOwner.PlayerTwo:
        return 'X';
    }
  };

  const handleOnClick = (filedId: number) => {
    //Check if filed is already taken
    if (gameState[filedId].owner !== FieldOwner.None) return; //Do nothing

    //Check if game is over
    if (isFinished) return;

    const newState = gameState.map((el, index) => {
      if (index !== filedId) return el;
      switch (currentTurn) {
        case Players.PlayerOne:
          return {
            ...el,
            owner: FieldOwner.PlayerOne,
          };

        case Players.PlayerTwo:
          return {
            ...el,
            owner: FieldOwner.PlayerTwo,
          };

        default:
          return el;
      }
    });

    setGameState(newState);
    changeTurn();
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>{headingText}</h2>
      <div className={styles.gameGrid}>
        {Array.from({ length: 9 }, (_, i) => i).map((i) => (
          <button
            key={i}
            className={`${styles.gameButton} ${gameState[i].color}`}
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
