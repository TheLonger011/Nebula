import { mockUsers } from './users';

export const mockFriends = mockUsers.map((u) => ({
    ...u,
    isFriend: true,
}));