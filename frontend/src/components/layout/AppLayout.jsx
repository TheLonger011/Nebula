import { Outlet } from 'react-router-dom';
import styles from './AppLayout.module.css';
import SpaceList from '../navigation/SpaceList';
import ChannelList from '../navigation/ChannelList';
import MembersPanel from '../navigation/MembersPanel';
import UserPanel from '../navigation/UserPanel';

export default function AppLayout() {
    return (
        <div className={styles.layout}>
            <SpaceList />
            <div className={styles.middle}>
                <ChannelList />
            </div>
            <div className={styles.center}>
                <Outlet />
            </div>
            <MembersPanel />
        </div>
    );
}