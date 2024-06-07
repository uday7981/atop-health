import PageLayout from '@/components/page-layout';
import UserProfile from '@/components/User_Record-Page/UserProfile';
import { SpinnerContext } from '@/providers/SpinnerProvider';
import { Doc_User, TokenAccessDetail, User } from '@/types/user';
import {
  getCidFromFileUrl,
  getViewUrlFromCid,
  safeIntToBigNumber,
} from '@/utils/converter';
import {
  deserialiseDoc,
  deserialiseTokenAccessDetail,
  deserialiseUser,
} from '@/utils/deserialise';
import { encryptionSignatureForLighthouse } from '@/utils/fetcher';
import { DownloadIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Center,
  Heading,
  HStack,
  IconButton,
  Spinner,
  Stack,
  Text,
  useClipboard,
  VStack,
} from '@chakra-ui/react';
import lighthouse from '@lighthouse-web3/sdk';

import { readContracts } from '@wagmi/core';
import { BigNumber } from 'ethers';

import { useRouter } from 'next/router';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { IoCopySharp } from 'react-icons/io5';
import { TokenFactoryAbi } from 'src/abi';
import useToastCustom from 'src/hooks/useToastCustom';
import { useContractRead } from 'wagmi';

function Document({
  document,
  tokenAccessDetail,
}: {
  document: Doc_User;
  tokenAccessDetail: TokenAccessDetail;
}) {
  const { hasCopied, onCopy, setValue, value } = useClipboard('');
  const router = useRouter();
  const { successToast } = useToastCustom();
  const onClipBoardClick = () => {
    setValue(getViewUrlFromCid(getCidFromFileUrl(document.fileUrl)));
    onCopy();
    onCopy();
    successToast('File Link Copied');
  };
  useEffect(() => {}, []);
  const onDownload = async () => {
    const fileCID = getCidFromFileUrl(document.fileUrl);
    const { publicKey, signedMessage } =
      await encryptionSignatureForLighthouse();
    const fileType = 'image/jpeg';
    const keyObject = await lighthouse.fetchEncryptionKey(
      fileCID,
      publicKey,
      signedMessage
    );
    const decrypted = await lighthouse.decryptFile(fileCID, keyObject.data.key);

    const aElement = window.document.createElement('a');
    aElement.setAttribute('download', `${document.title}.PNG`);
    const href = URL.createObjectURL(decrypted);
    aElement.href = href;
    aElement.setAttribute('target', '_blank');
    aElement.click();
    URL.revokeObjectURL(href);
  };
  const getFile = async () => {
    const fileCID = getCidFromFileUrl(document.fileUrl);
    const { publicKey, signedMessage } =
      await encryptionSignatureForLighthouse();
    const fileType = 'image/jpeg';
    const keyObject = await lighthouse.fetchEncryptionKey(
      fileCID,
      publicKey,
      signedMessage
    );
    const decrypted = await lighthouse.decryptFile(fileCID, keyObject.data.key);
    console.log(decrypted);
    window.open(URL.createObjectURL(decrypted), '_blank');
  };
  return (
    <>
      <Card bgColor={'#EBECF0'} color={'black'} padding={30}>
        <CardHeader>
          <HStack width={'100%'} justifyContent='space-between'>
            <Heading textAlign={'start'}>{document?.title}</Heading>
            <VStack spacing={4} position='absolute' right={'3%'} top='3%'>
              <IconButton
                aria-label='downlaod button'
                colorScheme={'c'}
                variant='ghost'
                backgroundColor={'brand.500'}
                icon={<DownloadIcon />}
                onClick={onDownload}
                borderRadius='3xl'
              />
              <IconButton
                aria-label='share button'
                colorScheme={'whatsapp'}
                variant='solid'
                icon={<IoCopySharp />}
                onClick={onClipBoardClick}
                borderRadius='3xl'
              />
            </VStack>
          </HStack>
        </CardHeader>
        <CardBody>
          <VStack align={'start'} spacing={8}>
            <Text as='b'>Issued By: {document?.Issued_By_Doctor} </Text>
            <Text as='b'>
              Hospital Reference: {document?.Issued_By_Hospital}
            </Text>
            <Text as='b'>Tags: {document?.Tag}</Text>
            <Text as='b'>
              Date of Issue: {document?.Date_of_Issued.toISOString()}
            </Text>
            {tokenAccessDetail && (
              <>
                {' '}
                <Text
                  textAlign={'center'}
                  color='black'
                  fontSize='large'
                  width='100%'
                >
                  'This file is Public '
                </Text>
                {/* <Text textAlign={'center'} fontSize='medium' width='100%'>
                  {tokenAccessDetail?.price !== 0
                    ? `This file is set at price ${tokenAccessDetail.price} `
                    : null}
                </Text> */}
              </>
            )}
          </VStack>
        </CardBody>
        <Center>
          <CardFooter>
            <Button colorScheme='teal' variant='solid' onClick={getFile}>
              Open File
            </Button>
          </CardFooter>
        </Center>
      </Card>
    </>
  );
}
interface IFileToAccessDetail {
  [key: number]: TokenAccessDetail;
}
const User = () => {
  const loading = useRef(false);
  const [fetchOther, setFetchOther] = useState(false);
  const router = useRouter();

  const [user, setUser] = useState<User>({} as User);
  const { tokenAddress } = router.query;
  const [docs, setDocs] = useState<Doc_User[]>();
  const { data } = useContractRead({
    address: tokenAddress as `0x${string}`,
    abi: TokenFactoryAbi,
    functionName: 'getOwnerDetails',
  });
  const { data: tokenIds, refetch } = useContractRead({
    address: tokenAddress as `0x${string}`,
    abi: TokenFactoryAbi,
    functionName: 'tokenIds',
    args: [],
    watch: true,
  });

  const [fileToAccessDetail, setFileToAccessDetail] =
    useState<IFileToAccessDetail>();
  // const loading = useMemo(() => {
  //   if (!fileToAccessDetail) {
  //     return true;
  //   }
  //   return false;
  // }, [fileToAccessDetail]);
  // useRef.lo
  const { setSpinner, setSpinnerText } = useContext(SpinnerContext);
  const updateFinal = useCallback(() => {
    if (tokenIds) {
      setSpinner(true);
      setSpinnerText('Getting Public Files ,Please wait');
      loading.current = true;
      const tokenIdsNum = parseInt((tokenIds as BigNumber).toString());
      const contract = {
        address: tokenAddress as `0x${string}`,
        abi: TokenFactoryAbi,
        functionName: 'id_TokenDetailMapping',
      };
      const contractAccess = {
        address: tokenAddress as `0x${string}`,
        abi: TokenFactoryAbi,
        functionName: 'id_TokenAccessDetailMapping',
      };
      const constractsForDetail = [];
      const constractsForAccess = [];
      for (let tokenId = 1; tokenId <= tokenIdsNum; tokenId++) {
        constractsForDetail.push({
          ...contract,
          args: [safeIntToBigNumber(tokenId)],
        });
        constractsForAccess.push({
          ...contractAccess,
          args: [safeIntToBigNumber(tokenId)],
        });
      }
      const newfileToAccessDetail: IFileToAccessDetail = {};
      const newDocs: Doc_User[] = [];
      readContracts({
        contracts: constractsForDetail,
      }).then((values) => {
        values.map((value) => {
          deserialiseDoc(value).then((newDoc) => {
            newDocs.push(newDoc);
          });
        });
      });
      readContracts({
        contracts: constractsForAccess,
      }).then((values) => {
        values.map((value, index) => {
          newfileToAccessDetail[index] = deserialiseTokenAccessDetail(value);
        });
      });
      loading.current = false;
      setFileToAccessDetail(newfileToAccessDetail);
      setDocs(newDocs);
      setSpinner(false);
    }
  }, [tokenIds]);
  useEffect(() => {
    updateFinal();
  }, [tokenIds]);

  useEffect(() => {
    console.log({ docs });
  }, [docs]);
  useEffect(() => {
    console.log({ fileToAccessDetail });
  }, [fileToAccessDetail]);
  useEffect(() => {
    if (data) {
      setUser(deserialiseUser(data));
    }
  }, [data]);

  return (
    <PageLayout title='User profile'>
      <>
        <Box h='100vh' p={12} marginTop={'40'}>
          {/* <Center> */}
          <Card
            bgColor={'teal'}
            color={'white'}
            w={'1000px'}
            letterSpacing={'normal'}
            marginBottom={'24'}
          >
            <Stack
              spacing={{ base: '', md: '200' }}
              marginInline={'auto'}
              py={12}
              align='center'
              direction={{ base: 'column', md: 'row' }}
            >
              <VStack>
                <UserProfile user={user} />
              </VStack>
              <VStack>
                <Text as='h1' textAlign={'start'}>
                  This will Only show the Public Files of this account
                </Text>
              </VStack>
            </Stack>
          </Card>

          <Heading as='u'>Previous Documents:</Heading>
          <br />
          <Card color={'white'} w={'1000px'} marginTop={'10'}>
            <Stack
              spacing={'15'}
              marginInline={'auto'}
              py={12}
              align='center'
              // h='100vh'
              // minW={'90%'}
              direction={{ base: 'column', md: 'row' }}
            >
              <Stack spacing={1} direction={'row'}>
                {/* <Document document={emptyDoc} /> */}
                {docs ? (
                  docs.map((doc) => {
                    if (fileToAccessDetail[doc.id - 1]?.is_public) {
                      return (
                        <Document
                          key={JSON.stringify(doc)}
                          document={doc}
                          tokenAccessDetail={fileToAccessDetail[doc.id - 1]}
                        />
                      );
                    }
                  })
                ) : (
                  <Text>No public Document</Text>
                )}
                {docs && docs.length > 0 ? null : <Spinner color='blue' />}
              </Stack>
            </Stack>
          </Card>
        </Box>
      </>
    </PageLayout>
  );
};
export default User;
