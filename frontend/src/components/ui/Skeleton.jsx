import styles from './Skeleton.module.css';

export default function Skeleton({ width = '100%', height = 16, radius = 6 }) {
    return (
        <div
            className={styles.skeleton}
            style={{ width, height, borderRadius: radius }}
        />
    );
}