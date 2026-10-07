import { useEffect, useState } from 'react';
import { spacesApi } from '../api/spacesApi';

export function useSpaces() {
    const [spaces, setSpaces] = useState([]);
    const [activeSpaceId, setActiveSpaceId] = useState(null);
    const [channels, setChannels] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        spacesApi
            .getSpaces()
            .then((data) => {
                setSpaces(data);
                if (data[0]) setActiveSpaceId(data[0].id);
            })
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (!activeSpaceId) return;
        spacesApi.getChannels(activeSpaceId).then(setChannels);
    }, [activeSpaceId]);

    return { spaces, activeSpaceId, setActiveSpaceId, channels, loading };
}