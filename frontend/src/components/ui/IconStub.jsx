import styles from './IconStub.module.css';

export default function IconStub({ name = '?', size = 20 }) {
    return (
        <span
            className={styles.stub}
            style={{ width: size, height: size, fontSize: size * 0.6 }}
            title={name}
            aria-hidden="true"
        >
      {name.slice(0, 1).toUpperCase()}
    </span>
    );
}