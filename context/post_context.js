import { createContext, useContext, useEffect, useState } from "react";
import { React } from '@chakra-ui/react'

import { useRouter } from 'next/router'
import { setCookie, getCookie, deleteCookie } from 'cookies-next';
import axios from 'axios'

const Context = createContext();

export function PostProvider({ children }) {

    const [isLoading, setIsLoading] = useState(true);
    const [listPost, setListPost] = useState([]);

    async function getPost() {
        let response = await axios.get('http://127.0.0.1:8080/api/guru/post', { headers: { 'Content-Type': 'multipart/form-data', Authorization: getCookie('token') } });
        if (response.data.success) {
            setListPost(response.data.data);
        }
        setIsLoading(false)
    }

    async function createPost(form) {
        let response = await axios.post('http://127.0.0.1:8080/api/guru/post', form, { headers: { 'Content-Type': 'multipart/form-data', Authorization: getCookie('token') } });
        if (response.data.success) {
            await getPost()
        }
    }

    async function deletePost(form) {
        let response = await axios.delete('http://127.0.0.1:8080/api/guru/post?post_id=' + form.post_id + '&discussion_id=' + form.discussion_id, { headers: { 'Content-Type': 'multipart/form-data', Authorization: getCookie('token') } });
        if (response.data.success) {
            await getPost()
        }
    }

    const state = {
        isLoading,
        listPost,
        getPost,
        createPost,
        deletePost
    };

    return (
        <Context.Provider value={state}>{children}</Context.Provider>
    );
}

export function usePostContext() {
    return useContext(Context);
}