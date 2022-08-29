import { Box, Spacer, ButtonGroup, Button, Flex, Heading, Text } from '@chakra-ui/react'
import Header from '../components/header'

export default function Home() {
  return (
    <Box>
      <Header />
      <Flex h={'80vh'} alignItems={'center'} backgroundColor={'#364F6B'}>
        <Box flex={1} px={'200px'} color={'white'}>
          <Heading>e-Learning</Heading>
          <Text fontSize={'2xl'}>Selamat Datang Website e-Learning</Text>
          <Text >Dimana guru dan siswa dapat melakukan kegiatan belajar menggunakan digital atau secara online</Text>
        </Box>
        <Spacer />
      </Flex>
    </Box>
  )
}
