import { useEffect, useState } from 'react';

enum Players {
  PlayerOne = 'X',
  PlayerTwo = 'O',
}

type PlayingField = {
  id: number;
  owner: Players | null;
  color: 'tileDefault' | 'tileWon';
};

const winningConditions = [
  //Horizontal

  // * * *
  // . . .
  // . . .
  [0, 1, 2],

  // . . .
  // * * *
  // . . .
  [3, 4, 5],

  // . . .
  // . . .
  // * * *
  [6, 7, 8],

  //Vertical

  // * . .
  // * . .
  // * . .
  [0, 3, 6],

  // . * .
  // . * .
  // . * .
  [1, 4, 7],

  // . . *
  // . . *
  // . . *
  [2, 5, 8],

  //Diagonal

  // * . .
  // . * .
  // . . *
  [0, 4, 8],

  // . . *
  // . * .
  // * . .
  [2, 4, 6],
];

//Initial value of playingField state, used for initialization and reset
const initialFieldsState = Array.from(
  { length: 9 },
  (_, index): PlayingField => ({
    id: index,
    owner: null,
    color: 'tileDefault',
  }),
);

const initialPlayerState = Players.PlayerOne;
const initialBannerMessage = 'Player One Turn';

/**
 * Custom hook that implements TicTacToe game logic
 *
 * Each playing field is stored as on object like:
 *  {id:0, owner:  PlayerOne, color: "red"}
 *  All playing fields (total of 9) makes up the playingFields state
 *
 *  bannerMessage is the heading of the game that informs which player should take turn
 */
export const useTicTacToe = () => {
  const [playingFields, setPlayingFields] = useState(structuredClone(initialFieldsState));
  const [currentTurn, setCurrentTurn] = useState(initialPlayerState);

  //Yea I know this can be implemented in the component itself but I choose this way
  const [bannerMessage, setBannerMessage] = useState(initialBannerMessage);
  const [isGameOver, setIsGameOver] = useState(false);

  useEffect(() => {
    const checkIfPlayerIsWinning = (player: Players) => {
      const wherePlayerStands = playingFields.map((field) => field.owner === player);
      for (const winningPlacement of winningConditions) {
        if (winningPlacement.every((winningIndex) => wherePlayerStands[winningIndex]))
          return winningPlacement;
      }
      return null;
    };
    if (isGameOver) return;

    const playerOneWon = checkIfPlayerIsWinning(Players.PlayerOne);
    const playerTwoWon = checkIfPlayerIsWinning(Players.PlayerTwo);

    const winner = playerOneWon ? playerOneWon : playerTwoWon;

    if (winner) {
      setPlayingFields(
        playingFields.map((val) => {
          if (winner.includes(val.id)) return { ...val, color: 'tileWon' };
          return { ...val };
        }),
      );
      setIsGameOver(true);
      if (playerOneWon) setBannerMessage('Player One Won');
      else setBannerMessage('Player Two Won');
    } else if (playingFields.every(({ owner }) => owner)) {
      setBannerMessage('No one won!');
      setIsGameOver(true);
    }
  }, [playingFields, isGameOver]);

  const resetState = () => {
    setPlayingFields(structuredClone(initialFieldsState));
    setCurrentTurn(initialPlayerState);
    setBannerMessage(initialBannerMessage);
    setIsGameOver(false);
  };

  const handleUserClick = (index: number) => {
    if (isGameOver) {
      resetState();
      return;
    }

    const clickedField = playingFields.find((el) => el.id === index);
    if (clickedField === undefined || clickedField.owner !== null) return;

    setPlayingFields((prevState) =>
      prevState.map((field) => {
        if (field.id === index && field.owner === null)
          return {
            ...field,
            owner: currentTurn === Players.PlayerOne ? Players.PlayerOne : Players.PlayerTwo,
          };
        return { ...field };
      }),
    );

    setBannerMessage(currentTurn === Players.PlayerTwo ? 'Player One Turn' : 'Player Two Turn');
    setCurrentTurn((prevState) =>
      prevState === Players.PlayerOne ? Players.PlayerTwo : Players.PlayerOne,
    );
  };

  return { bannerMessage, playingFields, handleUserClick, resetState };
};
