import React, { useState, useEffect, useCallback } from "react";
import UserContext from "./UserContext";
import { useNavigate } from "react-router"
import DnDApi from '../api'
import useLocalStorage from '../hooks/useLocalStorage'
import jwt_decode from "jwt-decode"
import LoadingSpinner from '../components/common/LoadingSpinner'

export const TOKEN_STORAGE_ID = "dnd-token";

function UserContextProvider({ children }) {
    const [isLoading, setIsLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState('');
    const [token, setToken] = useLocalStorage(TOKEN_STORAGE_ID);
    const [userData, setUserData] = useState('');
    const [userFavIds, setUserFavIds] = useState(new Set());
    const [favorites, setFavorites] = useState('');

    const navigate = useNavigate();

    const saveToken = useCallback(() => {
        DnDApi.token = token;
        const { username } = jwt_decode(token);
        setCurrentUser(username);
    }, [token, setCurrentUser]);

    useEffect(() => {
        if (token) saveToken();
        setIsLoading(false);
    }, [token, saveToken]);

    async function registerUser(signUpData) {
        try {
            let token = await DnDApi.register(signUpData)
            setToken(token)
            navigate(`\`);
            return { success: true }
        } catch (err) {
            console.error('signup failed', err)
            return { success: false, err }
        }
    }

    async function loginUser(loginData) {
        try {
            let token = await DnDApi.login(loginData)
            setToken(token)
        } catch (err) {
            return { err }
        }
    }

    async function updateUser(formData, username) {
        try {
            const result = await DnDApi.updateUser(formData, username);
            const user = result.user;
            if (result.token) {
                setToken(result.token);
                navigate(`/profile/${username}`);
            }
            setUserData({ ...user });
        } catch (err) {
            return { msg: err };
        }
    }


    async function getCurrentUser(username) {
        try {
            const user = await DnDApi.getCurrentUser(username);
            setUserData(user);
        } catch (err) {
            console.error('Error: ', err);
            if (err[0] === 'Unauthorized') {
                return logout();
            }
        }
    }
    async function deleteUser() {
        try {
            const result = await DnDApi.deleteUser(currentUser);
            return result;
        } catch (err) {
            console.error('Error: ', err);
        }
    }

    const logout = () => {
        setCurrentUser('')
        setToken('')
        navigate('/')
    }

    // GET favorite ids for currentUser
    const getFavIds = useCallback(async () => {
        try {
            const results = await DnDApi.getFavorites(currentUser);
            setUserFavIds(new Set(results.favorites));
        } catch (err) {
            console.error('Error: ', err);
        }
    }, [currentUser, setUserFavIds]);

    useEffect(() => {
        if (currentUser) getFavIds();
    }, [currentUser, getFavIds]);

    /** Get spell data for each spell in favorites
     *
     * formats userFavIds to string
     */
    const getFavorites = useCallback(async () => {
        try {
            if (!favorites) {
                if (userFavIds.size) {
                    const ress = localStorage.getItem("spells");
                    const res = JSON.parse(ress)
                    const results = res.filter((s) => {
                        if (userFavIds.has(s.index)) {
                            return s
                        }
                    })
                    setFavorites(Array.isArray(results) ? results : [results]);
                } else {
                    setFavorites([]);
                }
            }
        } catch (err) {
            console.error('Error: ', err);
        }
    }, [favorites, setFavorites, userFavIds]);

    /** Add spell to currentUser favorites
     *
     * @param {*} spell
     *
     * will get favorites if not set
     *
     * then update favorites, userFavIds, and colValue
     *  with added spell
     */
    async function addFavorite(spell) {
        try {
            setIsLoading(true);
            const favId = spell.index;
            // POST request to server
            await DnDApi.addFavorite(currentUser, favId);
            // if favorites is not set yet, call getFavorites
            if (!favorites) {
                await getFavorites();
            }
            setFavorites((prev) => [...prev, spell]);
            setUserFavIds((prev) => new Set(prev).add(favId));
            setIsLoading(false);
        } catch (err) {
            console.error('Error: ', err);
        }
    }

    /** Remove spell from currentUser favorites
     *
     * @param {*} spell
     *
     * then update favorites, userFavIds, and colValue
     *  with removed spell
     */
    async function removeFavorite(spell) {
        try {
            const favId = spell.index;
            if (currentUser) {
                await DnDApi.RemoveFavorite(currentUser, favId);
                setFavorites((prev) => prev.filter((s) => s.index !== favId));
                setUserFavIds((prev) => {
                    const next = new Set(prev);
                    next.delete(favId);
                    return next;
                });
            }
        } catch (err) {
            console.error('Error: ', err);
        }
    }

    const onHomepage = window.location.pathname === '/'

    if (isLoading && !onHomepage) return <LoadingSpinner />

    return (
        <UserContext.Provider
            value={
                {
                    isLoading,
                    token,
                    currentUser,
                    getCurrentUser,
                    userData,
                    registerUser,
                    loginUser,
                    updateUser,
                    logout,
                    navigate,
                    deleteUser,
                    getFavorites,
                    getFavIds,
                    addFavorite,
                    removeFavorite,
                    setCurrentUser,
                    setIsLoading,
                    setUserFavIds,
                    favorites,
                    userFavIds,
                }
            }
        >
            {children}
        </UserContext.Provider>
    )
}
export default UserContextProvider
