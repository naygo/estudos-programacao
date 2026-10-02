import { useContext } from 'react';
import { CoutdownContext } from '../contexts/CountdownContext';
import styles from '../styles/components/Countdown.module.css';

export function Countdown() {
    
    const coutdownContext = useContext(CoutdownContext);

    const [minuteLeft, minuteRight] = String(coutdownContext.minutes).padStart(2, '0').split('');
    const [secondLeft, secondRight] = String(coutdownContext.seconds).padStart(2, '0').split('');

    return (
        <div>
            <div className={styles.countdownContainer}>
                <div>
                    <span>{minuteLeft}</span>
                    <span>{minuteRight}</span>
                </div>
                <span>:</span>
                <div>
                    <span>{secondLeft}</span>
                    <span>{secondRight}</span>
                </div>
            </div>

            { coutdownContext.hasFinished ? (
                <button
                    disabled
                    type="button"
                    className={styles.countdownButton}>
                    Ciclo encerrado
                </button>
            ) : (
                    <>
                        { coutdownContext.isActive ? (
                            <button
                                type="button"
                                className={`${styles.countdownButton} ${styles.countdownButtonActive}`}
                                onClick={coutdownContext.resetCountdown}>
                                Abandonar ciclo
                            </button>

                        ) : (

                                <button
                                    type="button"
                                    className={styles.countdownButton}
                                    onClick={coutdownContext.startCountdown}>
                                    Iniciar ciclo
                                </button>
                            )}
                    </>
                )}


        </div>

    );
}