import { Doc_User, MintParams, TokenAccessDetail, User } from '@/types/user';
import {
  deserialiseTokenAccessDetail,
  deserialiseUser,
} from '@/utils/deserialise';

import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Center,
  Checkbox,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Stack,
  Tag,
  Text,
  useClipboard,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';

import lighthouse from '@lighthouse-web3/sdk';

import { ChangeEvent, useContext, useEffect, useState } from 'react';

import { SpinnerContext } from '@/providers/SpinnerProvider';
import {
  fileToBlob,
  getCidFromFileUrl,
  getFileUrl,
  getMetaDataUrl,
  getViewUrlFromCid,
  safeIntToBigNumber,
} from '@/utils/converter';
import {
  encryptionSignatureForLighthouse,
  getAccessControlConditions,
} from '@/utils/fetcher';
import { DeleteIcon, DownloadIcon } from '@chakra-ui/icons';
import { BigNumber } from 'ethers';
import { useRouter } from 'next/router';
import { NFTStorage } from 'nft.storage';
import { CarReader } from 'nft.storage/dist/src/lib/interface';
import { BsPlusLg } from 'react-icons/bs';
import { HiShare } from 'react-icons/hi';
import { IoCopySharp } from 'react-icons/io5';
import { MdOutlinePriceChange } from 'react-icons/md';
import { EMPTY_BYTES } from 'src/data';
import useDocument from 'src/hooks/useDocument';
import useGetTokenAddress from 'src/hooks/useGetTokenAddress';
import useLightHouse from 'src/hooks/useLightHouse';
import useToastCustom from 'src/hooks/useToastCustom';
import useWriteIsPublic from 'src/hooks/useWriteIsPublic';
import useWritePrice from 'src/hooks/useWritePrice';
import {
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useSigner,
  useWaitForTransaction,
} from 'wagmi';
import { TokenFactoryAbi } from '../../abi/index';
import UserProfile from './UserProfile';
interface DocumentCar {
  fileCar: CarReader;
  metadataCar: CarReader;
}
const VALID_FILE_TYPES = [
  'image/gif',
  'image/jpeg',
  'image/png',
  'application/pdf',
];
function Document({ document }: { document: Doc_User }) {
  const [enableFile, setEnableFile] = useState(false);

  const { tokenAddress } = useGetTokenAddress();
  const { data: accessDetailData } = useContractRead({
    address: tokenAddress as `0x${string}`,
    abi: TokenFactoryAbi,
    functionName: 'id_TokenAccessDetailMapping',
    args: [safeIntToBigNumber(document.id)],
    watch: true,
  });
  useEffect(() => {
    if (accessDetailData) {
      console.log('Token access detail data', { accessDetailData });
      const tokenDetailWithoutAddresses =
        deserialiseTokenAccessDetail(accessDetailData);
      setPrice(tokenDetailWithoutAddresses.price);
      setTokenAccessDetail({
        allowedAddresses: [],
        is_public: tokenDetailWithoutAddresses.is_public,
        price: tokenDetailWithoutAddresses.price,
      });
    }
  }, [accessDetailData]);

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
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isPriceModalOpen,
    onOpen: onPriceModalOpen,
    onClose: onPriceClose,
  } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [newAddress, setNewAddress] = useState('');
  const [refetchAddress, setRetchAddress] = useState(false);
  useEffect(() => {
    if (refetchAddress) {
      const fetchInEffect = async () => {
        const cid = getCidFromFileUrl(document.fileUrl);
        const addressesResponse = await lighthouse.getAccessConditions(cid);
        console.log({ addressesResponse });
        setTokenAccessDetail({
          ...tokenAccessDetail,
          allowedAddresses: addressesResponse.data['sharedTo'] as string[],
        });
      };
      fetchInEffect().then(() => {
        setRetchAddress(false);
      });
    }
  }, [refetchAddress]);
  const {
    isLoading: isPublicWriteLoading,
    changeIsPublic,
    isSuccess: isPublicWriteSuccess,
    write: isPublicWrite,
  } = useWriteIsPublic(document.id);
  const {
    isLoading: priceWriteLoading,
    changePrice,
    isSuccess: priceWriteSuccess,
    write: writePrice,
  } = useWritePrice(document.id);
  const { setSpinner, spinner, setSpinnerText } = useContext(SpinnerContext);
  const [price, setPrice] = useState(0);
  useEffect(() => {
    if (priceWriteLoading) {
      if (!spinner) {
        setSpinner(true);
      }
      setSpinnerText(
        'Waiting for Transaction Confirmation,Chill  it takes some time '
      );
    }
    if (!priceWriteLoading && priceWriteSuccess) {
      setSpinnerText('Done  ');
      successToast('Done Price has been set ');
      setSpinner(false);
    }
  }, [priceWriteLoading]);
  useEffect(() => {
    if (isPublicWriteLoading) {
      if (!spinner) {
        setSpinner(true);
      }
      setSpinnerText(
        'Waiting for Transaction Confirmation,Chill  it takes some time '
      );
    }
    if (!isPublicWriteLoading && isPublicWriteSuccess) {
      setSpinnerText('Uploading image to ipfs using Filecoin');
      setSpinner(false);
    }
  }, [isPublicWriteLoading]);
  const [tokenAccessDetail, setTokenAccessDetail] =
    useState<TokenAccessDetail>();
  const onShare = async () => {
    onOpen();
    setLoading(true);
    const cid = getCidFromFileUrl(document.fileUrl);
    const addressesResponse = await lighthouse.getAccessConditions(cid);
    console.log({ addressesResponse });
    setTokenAccessDetail({
      ...tokenAccessDetail,
      allowedAddresses: addressesResponse.data['sharedTo'] as string[],
    });

    setLoading(false);
  };
  const { successToast } = useToastCustom();
  const { hasCopied, onCopy, setValue, value } = useClipboard('');
  useEffect(() => {
    if (hasCopied) {
      successToast('Link as been Copied');
    }
  }, [hasCopied]);
  const shareToAddress = async () => {
    const cid = getCidFromFileUrl(document.fileUrl);
    const { publicKey, signedMessage } =
      await encryptionSignatureForLighthouse();
    const resShareFile = await lighthouse.shareFile(
      publicKey,
      [newAddress],
      cid,
      signedMessage
    );
    setRetchAddress(true);
    console.log({ resShareFile });
  };
  const revokeAccess = async (address: string) => {
    const cid = getCidFromFileUrl(document.fileUrl);
    const { publicKey, signedMessage } =
      await encryptionSignatureForLighthouse();
    const revokeResponse = await lighthouse.revokeFileAccess(
      publicKey,
      [address],
      cid,
      signedMessage
    );
    console.log({ revokeResponse });
    setRetchAddress(true);
  };
  const makeFilePublic = async () => {
    setSpinner(true);
    changeIsPublic(!tokenAccessDetail.is_public);
    onClose();
    if (!isPublicWrite) {
      setSpinner(false);
      alert('An error happen , click the button again ');
    }
    isPublicWrite?.();
  };
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

  const onClipBoardClick = () => {
    setValue(getViewUrlFromCid(getCidFromFileUrl(document.fileUrl)));
    onCopy();
    onCopy();
  };

  const onOpenWrite = () => {
    onPriceModalOpen();
  };

  const confirmPrice = () => {
    setSpinner(true);
    changePrice(price);
    onPriceClose();
    if (!writePrice) {
      setSpinner(false);
      alert('An error happen , click confirm button again ');
    }
    writePrice?.();
  };
  return (
    <>
      <Card bgColor={'#EBECF0'} color={'black'} padding={30}>
        <CardHeader>
          <HStack width={'100%'} justifyContent='space-between'>
            <HStack>
              <IconButton
                aria-label='share button'
                colorScheme={'orange'}
                color='red.700'
                icon={<MdOutlinePriceChange />}
                onClick={onOpenWrite}
                size='sm'
                borderRadius='md'
              />
              <Heading textAlign={'start'}>{document?.title}</Heading>
            </HStack>

            <VStack spacing={4} position='absolute' right={'3%'} top='3%'>
              <IconButton
                aria-label='share button'
                colorScheme={'orange'}
                variant='solid'
                backgroundColor={'brand.500'}
                icon={<HiShare />}
                onClick={onShare}
                borderRadius='3xl'
              />
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
                  {tokenAccessDetail?.is_public
                    ? 'This file is Public '
                    : 'This file is Private'}
                </Text>
                <Text
                  textAlign={'center'}
                  fontSize='medium'
                  width='100%'
                  fontWeight={'black'}
                  color='black'
                >
                  {tokenAccessDetail?.price !== 0
                    ? `This file is set at price ${tokenAccessDetail.price} tFIL`
                    : null}
                </Text>
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
      <Modal onClose={onClose} isOpen={isOpen}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Add Wallet Address of User you wanna allow, Or make file public
          </ModalHeader>
          <ModalBody>
            {!loading ? (
              <>
                <HStack>
                  <Input
                    placeholder='Type User Wallet Here'
                    value={newAddress}
                    onChange={(e) => {
                      setNewAddress(e.target.value);
                    }}
                  />
                  <IconButton
                    aria-label='plus address'
                    borderRadius={'full'}
                    variant='outline'
                    backgroundColor={'brand.500'}
                    icon={<BsPlusLg />}
                    onClick={shareToAddress}
                  />
                </HStack>
                <VStack
                  marginTop={'4'}
                  maxH={'200px'}
                  overflow='auto'
                  width={'100%'}
                  spacing={'2'}
                >
                  {tokenAccessDetail &&
                  tokenAccessDetail.allowedAddresses &&
                  tokenAccessDetail.allowedAddresses.length != 0 ? (
                    tokenAccessDetail.allowedAddresses.map((address) => {
                      return (
                        <HStack>
                          <Tag>{address}</Tag>
                          <IconButton
                            onClick={() => {
                              revokeAccess(address);
                            }}
                            aria-label='delete'
                            icon={<DeleteIcon />}
                            colorScheme={'red'}
                            size='sm'
                            borderRadius={'3xl'}
                          />
                        </HStack>
                      );
                    })
                  ) : (
                    <Text>No one is allowed for now</Text>
                  )}
                </VStack>

                <Button
                  marginTop={'3.5'}
                  borderRadius={'xl'}
                  onClick={makeFilePublic}
                  isLoading={isPublicWriteLoading}
                >
                  {tokenAccessDetail?.is_public
                    ? 'Make Private'
                    : 'Make Public'}
                </Button>
              </>
            ) : (
              <Center width='100%'>
                <Spinner colorScheme='cyan' size={'lg'} />
              </Center>
            )}
          </ModalBody>
          <ModalFooter>
            <HStack spacing={8}>
              <Button colorScheme={'red'} onClick={onClose}>
                Close
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal onClose={onPriceClose} isOpen={isPriceModalOpen}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Set your Price in FIL</ModalHeader>
          <ModalBody>
            <>
              <HStack>
                <Input
                  placeholder='Enter price here'
                  value={price}
                  type='number'
                  onChange={(e) => {
                    setPrice(parseInt(e.target.value));
                  }}
                />
              </HStack>
            </>
          </ModalBody>
          <ModalFooter>
            <HStack spacing={8}>
              <Button colorScheme={'green'} onClick={confirmPrice}>
                Confirm
              </Button>
              <Button colorScheme={'red'} onClick={onPriceClose}>
                Close
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
const emptyDoc = {
  Date_of_Issued: new Date(),
  Tag: '',
  title: 'title',
  Issued_By_Doctor: 'kdsf',
  Issued_By_Hospital: '',
} as Doc_User;
function UserRecords() {
  const router = useRouter();
  const [fileEvent, setFileEvent] = useState<ChangeEvent<HTMLInputElement>>();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const { data: signer } = useSigner();
  console.log({ signer });
  const OverlayOne = () => (
    <ModalOverlay bg='none' backdropFilter='auto' backdropBlur='5px' />
  );
  const [overlay, setOverlay] = useState(<OverlayOne />);
  const [doc_user, setDoc_user] = useState<Doc_User>({} as Doc_User);
  const [user, setUser] = useState<User>({} as User);
  const { tokenAddress } = useGetTokenAddress();
  const [blob, setBlob] = useState<Blob>();

  const { spinner, setSpinnerText, setSpinner } = useContext(SpinnerContext);
  useEffect(() => {
    if (!tokenAddress) {
      router.push('/');
    }
  }, []);
  console.log({ tokenAddress });
  const { data } = useContractRead({
    address: tokenAddress as `0x${string}`,
    abi: TokenFactoryAbi,
    functionName: 'getOwnerDetails',
  });

  console.log({ data });
  useEffect(() => {
    if (data) {
      setUser(deserialiseUser(data));
    }
  }, [data]);
  const { errorToast, successToast } = useToastCustom();
  const [mintData, setMintData] = useState<MintParams>();
  const encryptionSignature = async () => {
    const address = await signer.getAddress();
    const messageRequested = (await lighthouse.getAuthMessage(address)).data
      .message;
    const signedMessage = await signer.signMessage(messageRequested);
    return {
      signedMessage: signedMessage,
      publicKey: address,
    };
  };
  const { config, refetch } = usePrepareContractWrite({
    address: tokenAddress as `0x${string}`,
    abi: TokenFactoryAbi,
    functionName: 'mint',
    args: [mintData?.dataDescription, mintData?.dataUrl],
    enabled: !!mintData,
    signer: signer,
    onSuccess() {},
  });

  const {
    data: mintContractData,
    writeAsync,
    reset,
    write,
  } = useContractWrite({ ...config, request: config.request });
  console.log({ mintContractData });
  const nftStorageClient = new NFTStorage({
    token: process.env.NEXT_PUBLIC_NFT_STORAGE_API,
  });
  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: mintContractData?.hash,
  });

  // useEffect(() => {
  //   if (isSuccess) {
  //     setSpinnerText('Uploading image to ipfs using Filecoin');
  //     setSpinner(false);
  //     successToast('Document Uploaded !');
  //     location.reload();
  //   }
  // }, [isSuccess]);

  const {
    isLoading: lighthouseLoading,
    signedMessage,
    signInLighthouse,
    publicKey,
  } = useLightHouse();
  console.log({ signedMessage });
  console.log({ publicKey });
  const onOpenModal = async () => {
    onOpen();
  };
  const onDoucmentSubmit = async () => {
    setSpinner(true);
    onClose();
    setSpinnerText('Preparing File Upload...., Chill it takes time');
    const { publicKey, signedMessage } = await encryptionSignature();
    console.log('This is the signed message>>', signedMessage);
    const fileMetaData = {
      name: `${doc_user.title} `,
      description: doc_user.title,
      image: new File(['none'], doc_user.file.name, {
        type: 'text/plain',
      }),
      properties: {
        issuerName: user.fullName,
        date: new Date().toISOString(),
        date_issued: doc_user.Date_of_Issued,
        doctor_issued_by: doc_user.Issued_By_Doctor,
        hospital_issued_by: doc_user.Issued_By_Hospital,
        tags: doc_user.Tag,
      },
    };
    const metaDataStorageInfo = await nftStorageClient.store(fileMetaData);
    const fileDescriptionUrl = getMetaDataUrl(metaDataStorageInfo.ipnft);

    const response = await lighthouse.uploadEncrypted(
      //@ts-ignore
      fileEvent,
      publicKey,
      process.env.NEXT_PUBLIC_LIGHTHOUSE_API,
      signedMessage
    );

    const fileUrl = getFileUrl(response.data.Hash);
    const conditions = getAccessControlConditions(
      tokenAddress,
      parseInt((tokenIds as BigNumber).toString()) + 1
    );
    const aggregator = '([1])';
    setSpinnerText('Setting up Encryption , Sign in once more');
    const { publicKey: secondPulickey, signedMessage: secondSingedMessage } =
      await encryptionSignature();
    const accessResponse = await lighthouse.accessCondition(
      secondPulickey,
      response.data.Hash,
      secondSingedMessage,
      conditions,
      aggregator,
      'EVM'
    );
    console.log({ accessResponse });
    // const { encryptedData, encryptedKey } = await medusa.encrypt(
    //   new Uint8Array([]),
    //   tokenAddress as string
    // );
    console.log({ fileUrl });

    setMintData({
      dataUrl: fileUrl,
      dataDescription: fileDescriptionUrl,
    });

    write?.();
    if (!write) {
      setSpinner(false);
      alert('Transaction Failed please click submit button again');
    }
  };
  async function onFileHandle(
    event: ChangeEvent<HTMLInputElement>
  ): Promise<void> {
    if (event.target.files.length > 1) {
      onClose();
      errorToast('Only Select One File');
      return;
    }
    let selectedFile = event.target.files[0];
    if (!VALID_FILE_TYPES.includes(selectedFile.type)) {
      onClose();
      errorToast('Only Images and PDF allowed');
      return;
    }

    setBlob(await fileToBlob(selectedFile));
    setFileEvent(event);
    setDoc_user({
      ...doc_user,
      file: selectedFile,
    });
  }
  const { tokenIds, tokenData, docs, loading: docLoading } = useDocument();
  console.log({ tokenIds });
  console.log({ tokenData });
  console.log({ docs });
  const { onCopy, setValue } = useClipboard('');
  const copyProfileLink = () => {
    setValue(`${window.location.origin}/user/${tokenAddress}`);
    onCopy();
    onCopy();
    successToast('Profile Link Copied');
  };
  if (!tokenAddress || tokenAddress == EMPTY_BYTES || tokenAddress == '') {
    return (
      <Center width={'100%'} height='100%'>
        <Spinner size='xl' color='red' />
      </Center>
    );
  }
  return (
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
                Latest Document
              </Text>
              {docs ? (
                docs[docs.length - 1] ? (
                  <Document document={docs[docs.length - 1]} />
                ) : null
              ) : (
                <Spinner size={'xl'} color='blue' />
              )}
            </VStack>
          </Stack>
          <Center>
            <Button
              size='md'
              // border='2px'
              boxShadow={'dark-lg'}
              borderColor='black'
              marginBottom={'15'}
              colorScheme={'whatsapp'}
              onClick={() => {
                setOverlay(<OverlayOne />);
                onOpenModal();
              }}
            >
              Upload New Document Here
            </Button>
          </Center>
          <Modal size={'md'} isCentered isOpen={isOpen} onClose={onClose}>
            {overlay}
            <ModalContent marginTop={'64'}>
              <ModalHeader>Please Fill The Be Details</ModalHeader>
              <ModalCloseButton />

              <ModalBody>
                {/* <Text>Custom backdrop filters!</Text> */}
                <Stack spacing={'5'}>
                  <FormControl id='Title' isRequired>
                    <FormLabel>Title</FormLabel>
                    <Input
                      placeholder='title'
                      _placeholder={{ color: 'gray.500' }}
                      type='text'
                      value={doc_user.title}
                      onChange={(e) => {
                        setDoc_user({
                          ...doc_user,
                          title: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                  <FormControl id='hospital_name' isRequired>
                    <FormLabel>Issued By (Hospital)</FormLabel>
                    <Input
                      type='text'
                      placeholder='hospital name here'
                      _placeholder={{ color: 'gray.500' }}
                      value={doc_user.Issued_By_Hospital}
                      onChange={(e) => {
                        setDoc_user({
                          ...doc_user,
                          Issued_By_Hospital: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                  <FormControl id='doctor_name' isRequired>
                    <FormLabel>Issued By (Doctor)</FormLabel>
                    <Input
                      type='text'
                      placeholder='doctor name here'
                      _placeholder={{ color: 'gray.500' }}
                      value={doc_user.Issued_By_Doctor}
                      onChange={(e) => {
                        setDoc_user({
                          ...doc_user,
                          Issued_By_Doctor: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                  <FormControl id='tag' isRequired>
                    <FormLabel>Tag</FormLabel>
                    <Input
                      type='text'
                      placeholder='tag here'
                      _placeholder={{ color: 'gray.500' }}
                      value={doc_user.Tag}
                      onChange={(e) => {
                        setDoc_user({
                          ...doc_user,
                          Tag: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                  <FormControl id='issued_date' isRequired>
                    <FormLabel>Date of Issued</FormLabel>
                    <Input
                      type='Date'
                      placeholder='Issued date here'
                      _placeholder={{ color: 'gray.500' }}
                      // value={doc_user.Date_of_Issued}
                    />
                  </FormControl>
                  <FormControl id='document_upload' isRequired>
                    <FormLabel>
                      {doc_user.file
                        ? `${doc_user.file.name}`
                        : 'Upload Document Here'}
                    </FormLabel>
                    <Input
                      type='file'
                      onChange={onFileHandle}
                      accept={VALID_FILE_TYPES.join(',')}
                      placeholder='upload recent document'
                      _placeholder={{ color: 'gray.500' }}
                    />
                  </FormControl>
                  <Checkbox isRequired>
                    I am sure that I have submitted my valid document
                  </Checkbox>
                </Stack>
              </ModalBody>
              <ModalFooter>
                <HStack spacing={'6'}>
                  <Button onClick={onClose}>Close</Button>
                  <Button onClick={onDoucmentSubmit} isLoading={isLoading}>
                    Submit
                  </Button>
                </HStack>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Card>
        <Center width={'100%'}>
          <Button
            colorScheme={'whatsapp'}
            boxShadow={'dark-lg'}
            marginBottom={'15'}
            size='md'
            onClick={copyProfileLink}
          >
            Copy Profile Link
          </Button>
        </Center>
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
                docs.map((doc) => <Document document={doc} />)
              ) : (
                <Spinner size={'xl'} color='blue' />
              )}
            </Stack>
          </Stack>
        </Card>
      </Box>
    </>
  );
}

export default UserRecords;
