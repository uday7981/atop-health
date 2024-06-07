import PageLayout from '@/components/page-layout';
import { SpinnerContext } from '@/providers/SpinnerProvider';
import { TokenAddressContext } from '@/providers/TokenAddressProvider';
import { BLOODGROUP, User } from '@/types/user';
import { safeIntToBigNumber, safeStringToBytes32 } from '@/utils/converter';
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Select as SelectDefault,
  Stack,
  Textarea,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { ParentStorageAbi } from 'src/abi';
import { BLOODGROUPS } from 'src/constants';
import { BASEURI, EMPTY_BYTES, PARENTCONTRACT } from 'src/data';
import useGetTokenAddress from 'src/hooks/useGetTokenAddress';
import useToastCustom from 'src/hooks/useToastCustom';
import { useDebounce } from 'usehooks-ts';
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi';

function index() {
  const [user, setUser] = useState<User>({} as User);
  const userDebounce = useDebounce(user, 600);

  const { tokenAddress } = useGetTokenAddress();
  console.log({ tokenAddress }, "add")
  const [enable, setEnable] = useState(false);
  const { setTokenAddress } = useContext(TokenAddressContext);
  const enableDebounce = useDebounce(enable, 600);

  const router = useRouter();
  useEffect(() => {
    if (tokenAddress !== EMPTY_BYTES) {
      router.push('/profile');
    }
  }, []);
  console.log({
    sending: [
      safeStringToBytes32(BASEURI) as `0x${string}`,
      safeStringToBytes32(userDebounce?.fullName) as `0x${string}`,
      safeIntToBigNumber(userDebounce?.age),
      safeStringToBytes32(userDebounce?.bloodGroup) as `0x${string}`,
      safeStringToBytes32(userDebounce?.allergies) as `0x${string}`,
      safeStringToBytes32(userDebounce?.medication) as `0x${string}`,
      safeStringToBytes32(userDebounce?.about) as `0x${string}`,
    ],
  });
  const { config } = usePrepareContractWrite({
    address: PARENTCONTRACT,
    abi: ParentStorageAbi,
    functionName: 'deployNFT',
    args: [
      safeStringToBytes32(BASEURI) as `0x${string}`,
      safeStringToBytes32(userDebounce?.fullName) as `0x${string}`,
      safeIntToBigNumber(userDebounce?.age),
      safeStringToBytes32(userDebounce?.bloodGroup) as `0x${string}`,
      safeStringToBytes32(userDebounce?.allergies) as `0x${string}`,
      safeStringToBytes32(userDebounce?.medication) as `0x${string}`,
      safeStringToBytes32(userDebounce?.about) as `0x${string}`,
    ],
    enabled: enableDebounce,
    // onSettled() {
    //   successToast('User data stored and NFT factory deployed');
    //   router.push('/profile');
    // },
  });
  const { spinner, setSpinnerText, setSpinner } = useContext(SpinnerContext);

  const { successToast } = useToastCustom();
  const { refetch: refetchTokenAddress } = useGetTokenAddress();
  const { data, write } = useContractWrite(config);
  const { isLoading, isSuccess, isFetching, isIdle } = useWaitForTransaction({
    hash: data?.hash,
  });

  useEffect(() => {
    if (isLoading) {
      if (!spinner) {
        setSpinner(true);
      }
      setSpinnerText(
        'Waiting for Transaction Confirmation,Chill  it takes some time '
      );
    }
  }, [isLoading]);
  useEffect(() => {
    if (isSuccess) {
      refetchTokenAddress().then((value) => {
        setSpinner(false);
        console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh")
        router.push('/profile');
      });
    }
  }, [isSuccess]);

  const submit = async (e) => {
    e.preventDefault();
    setEnable(!enable);
    write?.();

    alert("Click submit again if it doesn't work");
    console.log({ data });
  };

  return (
    <PageLayout title='Sign Up' description='Sign up page for medchain'>
      <>
        <Flex
          minW={'100%'}
          marginTop={'100'}
          align={'center'}
          justify={'center'}
        >
          <Stack
            spacing={8}
            w={'full'}
            maxW={'md'}
            boxShadow={
              '#69D3FA 0px 0px 0px 2px, #69D3FA 0px 2px 3px -1px, rgba(255, 255, 255, 0.08) 0px 1px 0px inset'
            }
            // bg={useColorModeValue('white', 'gray.700')}
            rounded={'xl'}
            p={6}
            my={12}
          >
            <Heading lineHeight={1.1} fontSize={{ base: '4xl', sm: '3xl' }}>
              Enter Your Details Here
            </Heading>
            <FormControl id='userName' isRequired>
              <FormLabel>User name</FormLabel>
              <Input
                placeholder='Full Name'
                _placeholder={{ color: 'gray.500' }}
                type='text'
                value={user.fullName}
                onChange={(e) => {
                  setUser({
                    ...user,
                    fullName: e.target.value,
                  });
                  console.log({ user });
                }}
              />
            </FormControl>
            <FormControl id='age' isRequired>
              <FormLabel fontSize={{ base: '4xl', sm: 'xl' }}>Age</FormLabel>
              <Input
                value={user.age}
                onChange={(e) => {
                  setUser({
                    ...user,
                    age: parseInt(e.target.value),
                  });
                }}
                placeholder='Age'
                _placeholder={{ color: 'gray.500' }}
                type='number'
                fontSize={{ base: '4xl', sm: 'xl' }}
                blockSize={{ base: '20', sm: '10' }}
              />
            </FormControl>
            <FormControl id='blood group' isRequired>
              <FormLabel>Blood Group</FormLabel>
              <SelectDefault
                required
                placeholder='Blood Group'
                value={user.bloodGroup}
                onChange={(e) => {
                  setUser({
                    ...user,
                    bloodGroup: e.target.value as BLOODGROUP,
                  });
                }}
              >
                {BLOODGROUPS.map((group) => (
                  <option value={group}>{group}</option>
                ))}
              </SelectDefault>
            </FormControl>
            <FormControl id='allergies'>
              <FormLabel>Allergies</FormLabel>
              <Input
                value={user.allergies}
                onChange={(e) => {
                  setUser({
                    ...user,
                    allergies: e.target.value,
                  });
                }}
                placeholder='Seperate By comma'
                _placeholder={{
                  color: 'gray.500',
                }}
              />
            </FormControl>
            <FormControl id='medications'>
              <FormLabel>Medications</FormLabel>
              <Input
                value={user.medication}
                onChange={(e) => {
                  setUser({
                    ...user,
                    medication: e.target.value,
                  });
                }}
                placeholder='Seperate By comma'
                _placeholder={{
                  color: 'gray.500',
                }}
              />
            </FormControl>
            <FormControl id='about'>
              <FormLabel>About me </FormLabel>
              <Textarea
                placeholder=' About Your self'
                size='sm'
                value={user.about}
                onChange={(e) => {
                  setUser({
                    ...user,
                    about: e.target.value,
                  });
                }}
                resize='none'
                colorScheme={'blackAlpha'}
                variant={'filled'}
              />
            </FormControl>
            <Stack spacing={6} direction={['column', 'row']}>
              <Button
                bg={'red.400'}
                color={'white'}
                w='full'
                _hover={{
                  bg: 'red.500',
                }}
                onClick={() => {
                  setUser({} as User);
                }}
              >
                Reset
              </Button>
              <Button
                bg={'blue.400'}
                color={'white'}
                w='full'
                _hover={{
                  bg: 'blue.500',
                }}
                onClick={submit}
                isLoading={isLoading}
              >
                Submit
              </Button>
            </Stack>
          </Stack>
        </Flex>
      </>
    </PageLayout>
  );
}

export default index;
