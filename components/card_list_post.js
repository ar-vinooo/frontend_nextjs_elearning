import {
    Avatar, Box, Flex, Spinner, Text, Badge, Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuItemOption,
    MenuGroup,
    MenuOptionGroup,
    MenuDivider,
    Button,
    Input,
    Skeleton,
    FormControl
} from "@chakra-ui/react"
import { ChevronDownIcon, HamburgerIcon, ChatIcon } from "@chakra-ui/icons"
import { useEffect, useState } from "react"
import { usePostContext } from "../context/post_context"
import moment from "moment"
import { useKelasContext } from "../context/kelas_context"
import axios from "axios"
import { getCookie } from "cookies-next"
import { useAuthContext } from "../context/auth_context"

export default function CardListPost() {
    const post = usePostContext()

    useEffect(() => {
        getPost()
    }, [])

    async function getPost() {
        await post.getPost()
    }

    return (
        <Box>
            <Box h={'20px'}></Box>
            <Flex direction={'column'} gap={5}>
                {
                    post.isLoading
                        ?
                        <>
                            <Skeleton>
                                <CardPost />
                            </Skeleton>
                            <Skeleton>
                                <CardPost />
                            </Skeleton>
                        </>
                        :
                        post.listPost.map((item) => <CardPost key={item.post_id + item.discussion_id} item={item} />)
                }
            </Flex>
        </Box>
    )
}

const CardPost = ({ item }) => {
    const post = usePostContext()

    function formatDateTimeFromNow(date) {
        return moment(date).fromNow()
    }

    function formatDateTime(date) {
        return moment(date).format('DD/MM/YYYY hh:mm')
    }

    async function deletePost(post_id, discussion_id) {
        await post.deletePost({ post_id, discussion_id })
    }

    return (
        <Box shadow={'md'} rounded={'base'}>
            <Box border='1px' borderColor='gray.200' p={'20px'}>
                <Flex justifyContent={'space-between'}>
                    <Flex>
                        <Avatar></Avatar>
                        <Box w={'10px'}></Box>
                        <Flex direction={'column'}>
                            <Text>{item?.guru_name} ({item?.guru_nip})</Text>
                            <Text fontSize={'xs'}>{item?.kelas_name}</Text>
                            <Text fontSize={'xs'}>{formatDateTime(item?.created_at)} &bull; {formatDateTimeFromNow(item?.created_at)} </Text>
                        </Flex>
                    </Flex>
                    <Box>
                        <Badge mr={'2'} colorScheme='green'>
                            {item?.type}
                        </Badge>
                        <Menu placement={'bottom-end'}>
                            <MenuButton>
                                <HamburgerIcon />
                            </MenuButton>
                            <MenuList>
                                <MenuItem>Edit</MenuItem>
                                <MenuItem onClick={() => deletePost(item?.post_id, item?.discussion_id)}>Hapus</MenuItem>
                            </MenuList>
                        </Menu>
                    </Box>
                </Flex>
                <Box h={'10px'}></Box>
                <Text>{item?.content}</Text>
                <Box h={'10px'}></Box>
            </Box >
            <CommentPost post_id={item?.post_id} />

        </Box >)
}

const CommentPost = ({ post_id }) => {
    const auth = useAuthContext()

    const [isLoading, setIsLoading] = useState(true);
    const [listComment, setListComment] = useState([]);
    const [validateComment, setValidateComment] = useState('');

    const [comment, setComment] = useState([]);

    function formatDateTimeFromNow(date) {
        return moment(date).fromNow()
    }

    function formatDateTime(date) {
        return moment(date).format('DD/MM/YYYY hh:mm')
    }

    useEffect(() => {
        post_id && getCommentPost(post_id)
    }, [post_id])

    async function getCommentPost(post_id) {
        let response = await axios.get('http://127.0.0.1:8080/api/guru/post/comment?post_id=' + post_id, { headers: { 'Content-Type': 'multipart/form-data', Authorization: getCookie('token') } })
        if (response.data.success) {
            setListComment(response.data.data)
        }
        setIsLoading(false)
    }

    async function createCommentPost() {
        let validateData = ''

        if (comment == '') {
            validateData = 'Komenar tidak boleh kosong'
        }

        setValidateComment(validateData);

        if (validateData == '') {
            let response = await axios.post('http://127.0.0.1:8080/api/guru/post/comment', { post_id: post_id, comment: comment }, { headers: { 'Content-Type': 'multipart/form-data', Authorization: getCookie('token') } })
            if (response.data.success) {
                getCommentPost(post_id)
                setComment('');
            }
        }


    }

    return (
        <>
            <Flex p={'10px 15px'} border={'1px'} borderColor={'gray.200'} justifyContent={'right'} alignItems={'center'}> <ChatIcon /><Text ml={'5px'}>{listComment.length} Komentar</Text></Flex>

            <Flex direction={'column'} border={'1px'} borderColor={'gray.200'}>
                {
                    isLoading
                        ?
                        <Skeleton>
                            <Flex p={'10px'}>
                                <Avatar />
                                <Box w={'10px'} />
                                <Box>
                                    <Text>&emsp;</Text>
                                    <Text>&emsp;</Text>
                                </Box>
                            </Flex>
                        </Skeleton>
                        :
                        listComment.map((item, index) =>
                            <Flex key={item.user_id + item.user_name} p={'10px'}>
                                <Avatar />
                                <Box w={'10px'} />
                                <Box>
                                    <Text>{item.user_name} ({item.user_number}) {item.user_type == 'guru' ? <Badge colorScheme='green'>Guru</Badge> : <></>} &bull; {formatDateTimeFromNow(item.created_at)}</Text>
                                    <Text>{item.comment}</Text>
                                </Box>
                            </Flex>
                        )
                }
            </Flex>

            <Flex p={'10px'} border={'1px'} borderColor={'gray.200'}>
                <FormControl isInvalid={validateComment != ''}>
                    <Input placeholder='Komentar' value={comment} borderRadius={'none'} onChange={(e) => setComment(e.target.value)} />
                </FormControl>
                <Button colorScheme='blue' borderRadius={'none'} onClick={createCommentPost}>Kirim</Button>
            </Flex>
        </>
    )
}