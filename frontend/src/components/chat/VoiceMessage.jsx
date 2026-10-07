import { useState, useRef } from 'react';
import { formatTime } from '../../utils/formatTime';
import styles from './VoiceMessage.module.css';

export default function VoiceMessage({ voice }) {
    const [playing, setPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const audioRef = useRef(null);

    const toggle = () => {
        const audio = audioRef.current;
        if (!audio) {
            // Нет реального аудио — имитируем
            setPlaying((p) => !p);
            return;
        }
        if (playing) {
            audio.pause();
            setPlaying(false);
        } else {
            audio.play();
            setPlaying(true);
        }
    };

    const onTimeUpdate = () => {
        const a = audioRef.current;
        if (!a || !a.duration) return;
        setProgress((a.currentTime / a.duration) * 100);
    };

    const duration = voice.duration || 0;
    const currentTime = Math.round((progress / 100) * duration);

    return (
        <div className={styles.voice}>
            <button className={styles.playBtn} onClick={toggle} type="button">
                {playing ? '⏸' : '▶'}
            </button>

            <div className={styles.track}>
                <div className={styles.bar} style={{ width: `${progress}%` }} />
                <div className={styles.thumb} style={{ left: `${progress}%` }} />
            </div>

            <span className={styles.time}>
        {formatDuration(currentTime)} / {formatDuration(duration)}
      </span>

            {voice.url && (
                <audio
                    ref={audioRef}
                    src={voice.url}
                    onTimeUpdate={onTimeUpdate}
                    onEnded={() => {
                        setPlaying(false);
                        setProgress(0);
                    }}
                />
            )}
        </div>
    );
}

function formatDuration(sec) {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
}