import { CloseIcon, HamburgerIcon } from '@chakra-ui/icons';
import {
  Box,
  HStack,
  IconButton,
  Link,
  Show,
  Stack,
  Text,
  useColorMode,
  useColorModeValue as mode,
  useDisclosure,
  useMediaQuery,
  VStack,
} from '@chakra-ui/react';
import Logo from '../logo';
import ThemeButton from '../theme-button';
import WalletConnect from '../wallet-button';
const Header = () => {
  const { colorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isDesktop] = useMediaQuery('(min-width: 800px)', {
    ssr: true,
    fallback: false, // return false on the server, and re-evaluate on the client side
  });
  return (
    <HStack
      backgroundColor={mode('brand.light', 'brand.dark')}
      as='header'
      position='fixed'
      top='0'
      px={6}
      py={4}
      zIndex='sticky'
      justify='space-between'
      align='center'
      w='100%'
      borderBottom={mode('3px solid #000000', '3px solid #fff')}
    >
      <HStack
        spacing={{ base: 8, md: 2 }}
        borderRight={mode('3px solid #000000', '3px solid #fff')}
      >
        <Logo width={isDesktop ? 16 : 10} height={isDesktop ? 16 : 10} />
        <Text
          textAlign={'left'}
          fontSize={{ base: '2xl', sm: 'large' }}
          marginRight='1.5'
          fontWeight='bold'
        >
          Arogya
        </Text>
        <Text> </Text>
      </HStack>
      <Show above='md'>
        <HStack spacing={12}>
          <Link href='#features'>Features</Link>
          <Link href='./assets/images/How it works.jpeg' isExternal>How it works</Link>
          <Link href='#about_us'>About Us</Link>
        </HStack>
      </Show>
      <Show below='md'>
        <VStack>
          <IconButton
            size={'md'}
            icon={
              isOpen ? (
                <CloseIcon color={mode('brand.dark', 'brand.light')} />
              ) : (
                <HamburgerIcon color={mode('brand.dark', 'brand.light')} />
              )
            }
            aria-label={'open menu'}
            onClick={isOpen ? onClose : onOpen}
          />
          {isOpen ? (
            <Box pb={4} display={{ md: 'none' }}>
              <Stack as={'nav'} spacing={4}>
                <Link href='#features'>Features</Link>
                <Link href='./assets/images/How it works.jpeg' isExternal>How it works</Link>
                <Link href='#about_us'>About Us</Link>
              </Stack>
            </Box>
          ) : null}
        </VStack>
      </Show>

      <HStack
        spacing={6}
        borderLeft={
          colorMode == 'light' ? '3px solid #000000' : '3px solid #fff'
        }
        marginLeft={'2'}
      >
        <Text></Text>
        <ThemeButton />
        <Box>
          <WalletConnect marginInline={'auto'} />
        </Box>
      </HStack>
    </HStack>
  );
};

export default Header;
