import styles from './WelcomePage.module.css';
import { Header } from '@/components/Header/Header';
import bgImage from '@/assets/images/graphiQL-bg.jpg';
import arrowImage from '@/assets/images/arrow.png';
import { Login } from '@/pages/Login/Login';
import { Info } from './Info';

export const WelcomePage = () => {
  return (
    <div className={styles.wrapper}>
      <img className={styles.bgImage} src={bgImage} alt="Image" draggable="false" />
      <img className={styles.arrowImage} src={arrowImage} alt="Arrow" draggable="false" />
      <Header />
      <Login />
      <Info />
    </div>
  );
};
