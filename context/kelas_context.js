import { createContext, useContext, useEffect, useState } from "react";
import { React } from '@chakra-ui/react'

import { useRouter } from 'next/router'
import { setCookie, getCookie, deleteCookie } from 'cookies-next';
import axios from 'axios'
import { useAuthContext } from "./auth_context";

const Context = createContext();

export function KelasProvider({ children }) {
    const auth = useAuthContext();

    const [listKelas, setListKelas] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        auth.isLoggedin && getKelas()
    }, [auth.isLoggedin]);

    async function getKelas() {
        let response = await axios.get('http://127.0.0.1:8080/api/guru/kelas', { headers: { 'Content-Type': 'multipart/form-data', Authorization: getCookie('token') } });
        if (response.data.success) {
            setListKelas(response.data.data);
        }

        setIsLoading(false);
    }

    const state = {
        listKelas,
        isLoading,
        getKelas
    };

    return (
        <Context.Provider value={state}>{children}</Context.Provider>
    );
}

export function useKelasContext() {
    return useContext(Context);
}