import styles from './TicTacToe.module.scss';
import { useTicTacToe } from '../hooks/useTicTacToe';

export const TicTacToe = () => {
  const { bannerMessage, handleUserClick, playingFields } = useTicTacToe();

  return (
    <div className={styles.gameContainer}>
      <h2 className={styles.heading}>{bannerMessage}</h2>
      <div className={styles.gameGrid}>
        {playingFields.map(({ id, color, owner }) => (
          <button
            key={id}
            className={`${styles.gameButton} ${color === 'green' ? styles.green : styles.red}`}
            onClick={() => handleUserClick(id)}
          >
            {owner}
          </button>
        ))}
      </div>
    </div>
  );
};
