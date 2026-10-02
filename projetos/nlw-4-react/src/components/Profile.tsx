import { useContext } from 'react';
import { ChallengesContext } from '../contexts/ChallegengesContext';
import styles from '../styles/components/Profile.module.css';

export function Profile() {
    const { level } = useContext(ChallengesContext);

    return (
        <div className={styles.profileContainer}>
            <img src="https://github.com/naygo.png" alt="Nayla Gomes"/>
            <div>
                <strong>Nayla Gomes</strong>
                <p>
                    <img src="icons/level.svg" alt="Level"/>
                    Level { level }
                </p>
            </div>
        </div>
    );
}