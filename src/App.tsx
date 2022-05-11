import { TicTacToe } from './components/TicTacToe';
import styles from './App.module.scss';

export const App = () => {
  return (
    <main className={styles.App}>
      <TicTacToe />
    </main>
  );
};
