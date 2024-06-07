import {
  Avatar,
  Box,
  Button,
  Flex,
  Heading,
  Image,
  Stack,
  Text,
  useColorModeValue as mode,
  VStack,
  Link
} from '@chakra-ui/react';
import WalletConnect from '../wallet-button';
function FeatureItemLeft() {
  return (
    <Flex
      justify='space-between'
      align='center'
      w='100%'
      bg={mode('white', '#2d3142')}
      borderBottom={'3px solid #000000'}
    // id='features'
    >
      <Box marginY={4} flex={'0.5'} height={'260px'} >
        <Box
          borderRightRadius={'full'}
          width={'80%'}
          height='100%'
          // bg={'black'}
          borderColor={'blue'}
          id='features'
        >
          <Image
            src='./assets/images/filecoin.jpg'
            flexDirection={{ base: 'column', md: 'row' }}
            width={'100%'}
            height={260}
            borderRightRadius={'full'}

          >

          </Image>
        </Box>
      </Box>
      <Box borderLeft={'2px solid #000000'} flex={'0.5'}>
        <VStack
          width={'100%'}
          height={'100%'}
          alignItems={'baseline'}
          justifyContent='left'
          paddingLeft={'8'}
          marginY={'8'}
        >
          <Text fontWeight={'bold'} fontSize={'2xl'} textAlign={'left'}>
            How Filecoin Helped Us
          </Text>
          <Text justifyContent={'left'} fontSize={'medium'} textOverflow='clip'>
            Filecoin offers strong encryption and data protection mechanisms,
            ensuring that medical records remain private and tamper-proof.
            This is especially important for medical records, which contain
            sensitive information that needs to be kept confidential.
          </Text>
          <WalletConnect />
        </VStack>
      </Box>
    </Flex>
  );
}
function FeatureItemRight() {
  return (
    <Flex
      justify='space-between'
      align='center'
      w='100%'
      flexDirection={'row-reverse'}
      bg={mode('white', '#2d3142')}
      borderBottom={'3px solid #000000'}
    >
      <Box marginY={4} flex={'0.5'} height={'260px'}>
        <Box
          borderLeftRadius={'full'}
          height='100%'
          bg={'blue'}
          marginLeft={'20%'}
        >
          <Image
            src='./assets/images/arogya.png'
            flexDirection={{ base: 'column', md: 'row' }}
            width={'100%'}
            height={260}
            borderLeftRadius={'full'}

          >

          </Image>
        </Box>
      </Box>
      <Box borderRight={'2px solid #000000'} flex={'0.5'}>
        <VStack
          width={'100%'}
          height={'100%'}
          alignItems={'baseline'}
          justifyContent='left'
          paddingLeft={'8'}
          marginY={'8'}
        >
          <Text fontWeight={'bold'} fontSize={'2xl'} textAlign={'left'}>
            Unique Features of Atop Health Vault
          </Text>
          <Text justifyContent={'left'} fontSize={'medium'} textOverflow='clip'>
            Giving Access to others is on User Hand.
            Users can sell their records in Atop Health Vault MarketPlace.
            Anyone can buy the records by paying amount which set by user.

          </Text>
          <WalletConnect />
        </VStack>
      </Box>
    </Flex>
  );
}
function FeaturesPage() {
  return (
    <VStack spacing={'150'}>
      <Box width={'90%'} bg='white' marginTop='16'></Box>
      <Box width={'90%'} bg='white' marginInline={'auto'} marginTop='16'>
        <FeatureItemLeft />
        <FeatureItemRight />
      </Box>

      <Box
        width={'90%'}
        height={'50%'}
        // bg='white'
        marginInline={'auto'}
        marginTop={'1'}
        padding={'10'}
        borderRadius={'20'}
        id='about_us'
      >
        <Stack
          spacing={40}
          marginInline={'auto'}
          py={12}
          align={'center'}
          minW={'90%'}
          direction={{ base: 'column', md: 'row' }}
        >
          <Box
            w={400}
            bg={mode('white', 'gray.800')}
            boxShadow={'2xl'}
            rounded={'md'}
            padding={5}
            overflow={'hidden'}
          >
            <Image
              h={'120px'}
              w={'full'}
              src={'/assets/images/chain.jpg'}
              objectFit={'cover'}
            />
            <Flex justify={'center'} mt={-12}>
              <Avatar
                size={'xl'}
                src={'/assets/images/blockchain.jpeg'}
                // alt={'Author'}
                css={{
                  border: '2px solid white',
                }}
              />
            </Flex>

            <Box p={10} m={1}>
              <Stack spacing={2} align={'center'} mb={5}>
                <Heading fontSize={'3xl'} fontWeight={500} fontFamily={'body'}>
                  Uday Kiran
                </Heading>
                <Text color={'gray.500'}>Blockchain Developer</Text>
              </Stack>
              <Link href='' isExternal>
                <Button
                  w={'full'}
                  mt={8}
                  bg={mode('#151f21', 'gray.900')}
                  color={'white'}
                  rounded={'md'}
                  _hover={{
                    transform: 'translateY(-2px)',
                    boxShadow: 'lg',
                  }}
                >
                  Know more {'>>'}
                </Button>
              </Link>
            </Box>
          </Box>
          <Box
            // maxW={'270px'}
            w={400}
            bg={mode('white', 'gray.800')}
            boxShadow={'2xl'}
            rounded={'md'}
            padding={5}
            overflow={'hidden'}
          >
            <Image
              h={'120px'}
              w={'full'}
              src={'/assets/images/chain.jpg'}
              objectFit={'cover'}
            />
            <Flex justify={'center'} mt={-12}>
              <Avatar
                size={'xl'}
                src={'/assets/images/fullstack.jpg'}
                // alt={'Author'}
                css={{
                  border: '2px solid white',
                }}
              />
            </Flex>

            <Box p={10} m={1}>
              <Stack spacing={2} align={'center'} mb={5}>
                <Heading fontSize={'3xl'} fontWeight={500} fontFamily={'body'}>
                  Ayush Sagar
                </Heading>
                <Text color={'gray.500'}>Full stack Developer</Text>
              </Stack>

              <Link href=''>
                <Button
                  w={'full'}
                  mt={8}
                  bg={mode('#151f21', 'gray.900')}
                  color={'white'}
                  rounded={'md'}
                  _hover={{
                    transform: 'translateY(-2px)',
                    boxShadow: 'lg',
                  }}
                >
                  Know more {'>>'}
                </Button>
              </Link>
            </Box>
          </Box>
          <Box
            // maxW={'270px'}
            w={400}
            bg={mode('white', 'gray.800')}
            boxShadow={'2xl'}
            rounded={'md'}
            padding={5}
            overflow={'hidden'}
          >
            <Image
              h={'120px'}
              w={'full'}
              src={'/assets/images/chain.jpg'}
              objectFit={'cover'}
            />
            <Flex justify={'center'} mt={-12}>
              <Avatar
                size={'xl'}
                src={'/assets/images/fullstack1.jpeg'}
                // alt={'Author'}
                css={{
                  border: '2px solid white',
                }}
              />
            </Flex>

            <Box p={10} m={1}>
              <Stack spacing={2} align={'center'} mb={5}>
                <Heading fontSize={'3xl'} fontWeight={500} fontFamily={'body'}>
                  Nitish
                </Heading>
                <Text color={'gray.500'}>Full stack Developer</Text>
              </Stack>
              <Link href='/'>
                <Button
                  w={'full'}
                  mt={8}
                  bg={mode('#151f21', 'gray.900')}
                  color={'white'}
                  rounded={'md'}
                  _hover={{
                    transform: 'translateY(-2px)',
                    boxShadow: 'lg',
                  }}
                >
                  Know more {'>>'}
                </Button>
              </Link>
            </Box>
          </Box>
        </Stack>
      </Box>
    </VStack>
  );
}

export default FeaturesPage;
