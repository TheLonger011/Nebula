import { useApp } from '../../store/AppContext';
import Avatar from '../ui/Avatar';
import IconStub from '../ui/IconStub';
import styles from './SpaceList.module.css';

export default function SpaceList() {
    const { spaces, activeSpaceId, setActiveSpaceId } = useApp();

    return (
        <aside className={styles.sidebar}>
            <div className={styles.logo}>
                <IconStub name="N" size={36} />
            </div>

            <button
                className={[styles.item, styles.home].join(' ')}
                onClick={() => setActiveSpaceId(null)}
                title="Главная"
            >
                <IconStub name="H" size={24} />
            </button>

            <div className={styles.divider} />

            <div className={styles.list}>
                {spaces.map((s) => (
                    <button
                        key={s.id}
                        className={[styles.item, activeSpaceId === s.id ? styles.active : ''].join(' ')}
                        onClick={() => setActiveSpaceId(s.id)}
                        title={s.name}
                    >
                        {s.short}
                    </button>
                ))}
            </div>

            <button className={styles.add} title="Создать пространство">
                +
            </button>
        </aside>
    );
}