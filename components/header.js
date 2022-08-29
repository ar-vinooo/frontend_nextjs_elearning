import { ChevronDownIcon } from '@chakra-ui/icons'
import { Box, Spacer, ButtonGroup, Button, Text, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, FormControl, FormLabel, Input, ModalFooter, React, Spinner, FormErrorMessage, Menu, MenuButton, MenuItem, MenuList, Checkbox } from '@chakra-ui/react'
import { useDisclosure } from '@chakra-ui/react'
import { collect } from 'collect.js'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useAuthContext } from '../context/auth_context';

const Header = () => {
    const router = useRouter();
    const auth = useAuthContext();

    return (
        <Box>
            <Box w={'100%'} backgroundColor={'#F5F5F5'} display={'flex'} alignItems={'center'} px={'30px'} py={'20px'} pos={'fixed'} shadow={'md'} zIndex='99'>
                <Box fontSize={'20px'} pl={'20px'}><a href={'/'} onClick={(e) => { e.preventDefault(); router.push('/') }}><Text fontWeight={'bold'} display={'inline'}>e</Text>-Learning</a></Box>
                <Spacer />
                <AuthHeader auth={auth} />
            </Box>
            <Box w={'100%'} backgroundColor={'#F5F5F5'} display={'flex'} alignItems={'center'} px={'30px'} py={'20px'}>
                <Box fontSize={'20px'} pl={'20px'} color={'white'}><b>e</b>-Learning</Box>
                <Spacer />
                <ButtonGroup gap='2'>
                    <Button backgroundColor={'white'} color={'white'}>Daftar</Button>
                    <Button backgroundColor={'white'} color={'white'}>Masuk</Button>
                </ButtonGroup>
            </Box>
        </Box >
    )
}

const AuthHeader = ({ auth }) => {
    if (auth.isLoading) {
        return < Spinner />
    }

    if (!auth.isLoggedin) {
        return <ButtonGroup gap='2'>
            <Button backgroundColor={'#FC5185'} color={'white'}>Daftar</Button>
            <LoginModal auth={auth} />
        </ButtonGroup>
    }

    if (auth.isLoggedin) {
        return <UserMenu auth={auth} />
    }
}

const UserMenu = ({ auth }) => {
    const router = useRouter();

    return <Menu>
        <MenuButton as={Button} bgColor={'#364F6B'} color={'white'} rightIcon={<ChevronDownIcon />}>
            {auth.user.name}
        </MenuButton>
        <MenuList>
            <MenuItem onClick={() => { router.push('/beranda') }}>Beranda</MenuItem>
            <MenuItem onClick={() => { router.push('/logout') }}>Logout</MenuItem>
        </MenuList>
    </Menu >
}

const LoginModal = ({ auth }) => {
    const router = useRouter();

    const { isOpen, onOpen, onClose } = useDisclosure()
    const [form, setForm] = useState({ email: '', password: '', remember: false });
    const [validateForm, setValidateForm] = useState({ email: '', password: '' });
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('');

    async function onLogin(form) {

        let validateData = { email: '', password: '' };

        if (form.email == '') {
            validateData.email = 'Email tidak boleh kosong!';
        } else if (!form.email.includes('@')) {
            validateData.email = 'Email invalid!';
        }

        if (form.password == '') {
            validateData.password = 'Password tidak boleh kosong!';
        }

        setValidateForm(validateData);

        if (collect(validateData).values().every((item) => item == '')) {
            setIsLoading(true);
            setErrorMessage('');
            let response = await auth.onLogin(form);
            if (!response.success) {
                setErrorMessage(response.message);
            }
            setIsLoading(false);
        }
        return;

    }

    return (
        <>
            <Button onClick={onOpen} bgColor={'#364F6B'} color={'white'}>Login</Button>

            <Modal
                isOpen={isOpen}
                onClose={onClose}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Login</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <Text color={'red'} fontSize={'sm'} mb="4" display={errorMessage == '' ? 'none' : 'block'}>{errorMessage}</Text>
                        <FormControl isInvalid={validateForm.email != ''}>
                            <FormLabel>Email</FormLabel>
                            <Input placeholder='Email' type={'email'} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                            <FormErrorMessage>{validateForm.email}</FormErrorMessage>
                        </FormControl>

                        <FormControl mt={4} isInvalid={validateForm.password != ''}>
                            <FormLabel>Password</FormLabel>
                            <Input placeholder='Password' type={'password'} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                            <FormErrorMessage>{validateForm.password}</FormErrorMessage>
                        </FormControl>
                        <FormControl mt={4} >
                            <Checkbox isChecked={form.remember} onChange={(e) => setForm({ ...form, remember: e.target.checked })}>Remember</Checkbox>
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        {
                            isLoading
                                ?
                                <Button colorScheme='blue' mr={3}>
                                    <Spinner />
                                </Button>
                                :
                                <Button colorScheme='blue' mr={3} onClick={() => onLogin(form)}>
                                    Login
                                </Button>

                        }
                        <Button onClick={onClose}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default Header;