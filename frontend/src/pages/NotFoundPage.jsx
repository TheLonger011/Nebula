import { Link } from 'react-router-dom';
import styles from './NotFoundPage.module.css';

export default function NotFoundPage() {
    return (
        <div className={styles.page}>
            <h1>404</h1>
            <p>Страница не найдена</p>
            <Link to="/app">На главную</Link>
        </div>
    );
}