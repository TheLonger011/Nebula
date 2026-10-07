import { useState, useEffect } from 'react';
import { searchApi } from '../api/searchApi';
import { useDebounce } from '../hooks/useDebounce';
import Input from '../components/ui/Input';
import Skeleton from '../components/ui/Skeleton';
import styles from './SearchPage.module.css';

export default function SearchPage() {
    const [query, setQuery] = useState('');
    const debounced = useDebounce(query, 300);
    const [results, setResults] = useState({ spaces: [], users: [], messages: [] });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (debounced.length < 2) return setResults({ spaces: [], users: [], messages: [] });
        setLoading(true);
        searchApi.search(debounced).then((r) => {
            setResults(r);
            setLoading(false);
        });
    }, [debounced]);

    return (
        <div className={styles.page}>
            <h1 className={styles.title}>Поиск</h1>
            <Input
                placeholder="Пользователи, каналы, сообщения…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />

            {loading && (
                <div className={styles.skeletons}>
                    <Skeleton height={48} />
                    <Skeleton height={48} />
                </div>
            )}

            {!loading && results.spaces.length > 0 && (
                <section className={styles.section}>
                    <h3>Пространства</h3>
                    <ul>
                        {results.spaces.map((s) => (
                            <li key={s.id} className={styles.item}>
                                <span>{s.name}</span>
                                <span className={styles.meta}>{s.members} участников</span>
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            {!loading && debounced.length >= 2 && results.spaces.length === 0 && (
                <p className={styles.empty}>Ничего не найдено</p>
            )}
        </div>
    );
}