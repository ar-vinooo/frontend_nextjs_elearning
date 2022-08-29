import { createContext, useContext, useEffect, useState } from "react";
import { Box, Spacer, ButtonGroup, Button, Text, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, FormControl, FormLabel, Input, ModalFooter, React, Spinner, FormErrorMessage, Menu, MenuButton, MenuItem, MenuList, Checkbox } from '@chakra-ui/react'

import { useRouter } from 'next/router'
import { setCookie, getCookie, deleteCookie } from 'cookies-next';
import axios from 'axios'

const Context = createContext();

export function AuthProvider({ children }) {
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(true);
    const [isLoggedin, setIsLoggedin] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        fetchData();
    });

    const fetchData = async () => {
        const token = getCookie('token')
        if (token != null) {
            await getUser()
        }
        setIsLoading(false);
    }

    async function onLogin(form) {
        let response = await axios.post('http://127.0.0.1:8080/api/login', form, { headers: { 'Content-Type': 'multipart/form-data' } });
        if (response.data.success) {
            setCookie('token', response.data.token);
            await getUser();
            router.push('/beranda');
        }
        return response.data;
    }

    async function onLogout() {
        deleteCookie('token');
        setUser(null);
        setIsLoggedin(false);

        router.push('/');

    }

    async function getUser() {
        try {
            let response = await axios.get('http://127.0.0.1:8080/api/user', { headers: { 'Content-Type': 'multipart/form-data', Authorization: getCookie('token') } });
            if (response.data.success) {
                setUser(response.data.data);
                setIsLoggedin(true);
            }
        } catch (_) {

        }
        return;
    }

    const state = {
        isLoading,
        isLoggedin,
        user,
        onLogin,
        onLogout,
    };

    return (
        <Context.Provider value={state}>{children}</Context.Provider>
    );
}

export function useAuthContext() {
    return useContext(Context);
}