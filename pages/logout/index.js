import { useEffect } from "react";
import { useAuthContext } from "../../context/auth_context";
import { Spinner, Box, Flex } from "@chakra-ui/react"

export default function Logout() {
    const auth = useAuthContext();

    useEffect(() => {
        onLogout();
    }, [])

    async function onLogout() {
        await auth.onLogout()
    }

    return (
        <Flex justifyContent={'center'} alignItems={'center'} w={'100vw'} h={'100vh'}>
            <Spinner />
        </Flex>
    )
}