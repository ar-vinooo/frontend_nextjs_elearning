import { ChakraProvider } from '@chakra-ui/react'
import { AuthProvider } from '../context/auth_context'
import { KelasProvider } from '../context/kelas_context'
import { PostProvider } from '../context/post_context'


function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider >
      <AuthProvider>
        <KelasProvider>
          <PostProvider>
            <Component {...pageProps} />
          </PostProvider>
        </KelasProvider>
      </AuthProvider>
    </ChakraProvider>
  )
}

export default MyApp
