import { ChallengesProvider } from '../contexts/ChallegengesContext';
import '../styles/global.css';


function MyApp({ Component, pageProps }) {
  return (
    <ChallengesProvider>
      <Component {...pageProps} />
    </ChallengesProvider>
  );
}

export default MyApp
