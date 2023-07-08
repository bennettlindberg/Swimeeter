import type { User } from '../../App.tsx';
import axios from 'axios';
import { NavigateFunction } from "react-router-dom";

export default async function handleLogOut(
    currentUser: User | null,
    setCurrentUser: React.Dispatch<React.SetStateAction<User | null>> | null,
    navigate: NavigateFunction
) {
    // ? already logged out
    if (currentUser == null || setCurrentUser == null) {
        console.error('already logged out (front-end catch)')
        return;
    }
    
    try {
        const response = await axios.post('/auth/log_out/');
        
        setCurrentUser(null);
    } catch (error) {
        // ? log out failed on the back-end
        if (axios.isAxiosError(error)) {
            console.error(error.response?.data.reason);
        } else {
            console.error(error);
        }
    }
}