import {
  Box,
  Center,
  chakra,
  Divider,
  Heading,
  HStack,
  Stack,
  Text,
  useColorModeValue as mode,
  VStack,
} from '@chakra-ui/react';
import NextImage from 'next/image';

import { Trans } from 'react-i18next';
import WalletConnect from '../wallet-button';
const CustomImage = chakra(NextImage, {
  baseStyle: {
    borderRadius: 'lg',
    boxShadow:
      '#69D3FA 0px 0px 0px 2px, #69D3FA 0px 2px 3px -1px, rgba(255, 255, 255, 0.08) 0px 1px 0px inset',
  },
  shouldForwardProp: (prop) => ['src', 'alt', 'width', 'height'].includes(prop),
});
function StartingPage(props) {
  return (
    <>
      <Stack
        spacing={10}
        marginInline={'auto'}
        py={12}
        align='center'
        minW={'100%'}
        marginTop='16'
        direction={{ base: 'column', md: 'row' }}
        borderBottom={mode('3px solid #000000', '3px solid #fff')}
      >
        <VStack spacing={1} align='start' w={{ base: '100%', md: '50%' }}>
          <Heading as='h1' textAlign='left'>
            Medical Records stored using...
          </Heading>

          <Heading as='h2' width='100%' textAlign='left'>

            <HStack spacing={'5'}>
              <Text color={'blue'} fontFamily={'cursive'} fontStyle={'italic'}>{`FILECOIN `}</Text>
              <Text>With{' '}</Text>
            </HStack>
            <Text color={'orange'} width='100%' textAlign='left'>
              {'   User Ownership '}
            </Text>

          </Heading>


          {/* <Divider backgroundColor={'brand.500'} /> */}

          <Text color='gray.500' align='justify'>
            <Trans i18nKey='excerpt'>
              Arogya is a software that leverages the decentralized storage network
              provided by Filecoin to securely store medical records.
              By utilizing Filecoin's unique features, we aim to create a tamper-proof
              and transparent storage solution for sensitive medical data.
              Our system will allow authorized parties to access and update
              patient records while maintaining strict privacy and security measures.
              With the use of Filecoin, we hope to revolutionize the way medical records
              are stored and managed.
            </Trans>
          </Text>
          <Box alignSelf={'center'} marginTop='519px'>
            <WalletConnect />
          </Box>
        </VStack>
        <Center w={{ base: '100%', md: '50%' }}>
          <CustomImage
            src='/assets/images/safe.gif'
            width={400}
            height={500}
            alt='Cover Image'
          />
        </Center>
      </Stack>
      {/*  */}
    </>
  );
}

export default StartingPage;