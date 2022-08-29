import { Box, Spacer, ButtonGroup, Button, Flex, Heading, Text, Container, Grid, GridItem, SimpleGrid, Avatar, Spinner, Skeleton, Tabs, TabList, Tab, TabPanels, TabPanel, Textarea, Select, Link, UnorderedList, ListItem, Divider } from '@chakra-ui/react'
import { MultiSelect, useMultiSelect } from 'chakra-multiselect'
import CardCreatePost from '../../components/card_create_post';
import CardListPost from '../../components/card_list_post';
import Header from '../../components/header'
import { useAuthContext } from '../../context/auth_context'
import { useKelasContext } from '../../context/kelas_context';

export default function Beranda() {
    const auth = useAuthContext();
    const kelas = useKelasContext();

    return (
        <Box>
            <Header />
            <Container maxW={'80vw'}>
                <Grid p={'20px'} templateAreas={`"profile body "`} gridTemplateColumns={'300px'} gap={'5'}>
                    <GridItem area={'profile'}>
                        <Box position={'fixed'} minW={'300px'}>
                            <Box p={'20px'} shadow={'md'} rounded={'base'} border='1px' borderColor='gray.200' display={'flex'} flexDirection={'column'} alignItems={'center'}>
                                <Avatar size={'xl'} name='Foto' src='https://bit.ly/dan-abramov' mb={'10px'} />
                                {
                                    auth.isLoading
                                        ?
                                        <Box>
                                            <Skeleton w={'100px'}><Text fontSize={'lg'}>&emsp;</Text></Skeleton>
                                            <Box h={'5px'} />

                                            <Skeleton w={'100px'}><Text fontSize={'sm'}>&emsp;</Text></Skeleton>
                                        </Box>
                                        :
                                        <Box textAlign={'center'}>
                                            <Text fontSize={'lg'}>{auth.user.name}</Text>
                                            <Box h={'5px'} />
                                            <Text fontSize={'sm'}>({auth.user.name})</Text>
                                        </Box>
                                }
                            </Box>
                            <Box h={'10px'}></Box>
                            <Box shadow={'md'} rounded={'base'} border='1px' borderColor='gray.200' >
                                <Text p={'10px 15px'}>Kelas Saya</Text>
                                <Divider />
                                <Flex direction={'column'} gap={2} p={'10px'}>
                                    {
                                        kelas.isLoading
                                            ?
                                            <>
                                                <Skeleton>
                                                    <Button colorScheme={'blue'} variant={'outline'}>&emsp;asd</Button>
                                                </Skeleton>
                                                <Skeleton>
                                                    <Button colorScheme={'blue'} variant={'outline'}>&emsp;asd</Button>
                                                </Skeleton>
                                                <Skeleton>
                                                    <Button colorScheme={'blue'} variant={'outline'}>&emsp;asd</Button>
                                                </Skeleton>
                                            </>
                                            :
                                            kelas.listKelas.map((item) => <Button colorScheme={'blue'} variant={'outline'}>{item.name}</Button>)
                                    }
                                </Flex>
                            </Box>
                        </Box>
                    </GridItem>
                    <GridItem colSpan={3} area={'body'}>
                        <CardCreatePost />
                        <CardListPost />
                    </GridItem>
                </Grid>
            </Container>
        </Box >
    )
}
