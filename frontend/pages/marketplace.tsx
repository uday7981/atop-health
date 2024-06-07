import { deserialiseUser } from '@/utils/deserialise';
import { Search2Icon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Card,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Spinner,
  Stack,
  Text,
  VStack,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { readContract, readContracts } from '@wagmi/core';
import { useState } from 'react';
import { ParentStorageAbi, TokenFactoryAbi } from 'src/abi';
import { PARENTCONTRACT } from 'src/data';
import User from './user/[tokenAddress]';
const Item = ({ user }: { user: User }) => {
  return (
    <WrapItem key={JSON.stringify(user)}>
      <Card bgColor={'grey.900'} boxShadow={'lg'} padding={4}>
        <VStack spacing={4} align={'start'}>
          <Text>{user.fullName}</Text>
          <Text>Uploaded Date: {'date here'}</Text>
          <Button>Open File</Button>
        </VStack>
      </Card>
    </WrapItem>
  );
};
interface MarketPlaceUser {
  [key: string]: User;
}
// import {CUIAutoComplete} from '@chakra-ui/pin-input';
function index() {
  const [users, setUsers] = useState<MarketPlaceUser>();
  const set = (newUsers: MarketPlaceUser) => setUsers(newUsers);
  readContract({
    address: PARENTCONTRACT,
    abi: ParentStorageAbi,
    functionName: 'getAddresses',
    args: [],
    // chainId: 3141,
  }).then((values) => {
    const _values = values as string[];
    console.log({ values });
    const ownerDetailsContract = {
      abi: TokenFactoryAbi,
      functionName: 'getOwnerDetails',
      // chainId: 3141,
    };
    const usersDataContracts = _values.map((value) => ({
      ...ownerDetailsContract,
      address: value as `0x${string}`,
    }));
    const newUsers: MarketPlaceUser = {};
    readContracts({
      contracts: usersDataContracts,
    }).then((userDatas) => {
      console.log({ userDatas });
      userDatas.forEach((data, index) => {
        newUsers[_values[index]] = deserialiseUser(data);
      });
    });
    console.log({ newUsers });
    set({ ...newUsers });
  });
  // const users = useRef<MarketPlaceUser>({});
  // useEffect(() => {
  //   const a = () => {};
  //   a();

  // }, []);
  const [search, setSearch] = useState('');
  if (!users) return <Spinner color='red' size={'xl'} />;
  return (
    <>
      <Heading textAlign={'center'} marginTop={'40'}>
        Welcome to the MarketPlace
      </Heading>

      <Stack spacing={4} marginTop={'28'} marginLeft={'10'} marginRight={'10'}>
        <InputGroup>
          <InputLeftElement
            // pointerEvents='none'
            color='gray.300'
          // fontSize='7xl'
          />
          <Input
            type='search'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder='Search Here'
            paddingBlock={'10'}
            size={'lg'}
          />
          <InputRightElement paddingBlock={'10'}>
            <Search2Icon
              marginRight={'10'}
              boxSize={'10'}
              color='green.500'
              onClick={() => {
                window.open(
                  `${window.location.origin}/buy/${search}`,
                  '_blank'
                );
              }}
            />
          </InputRightElement>
        </InputGroup>
      </Stack>

      <Box marginLeft={'10'} marginRight={'10'} marginTop={'20'}>
        <Wrap margin={'10'} spacing={10}>
          {Object.values(users).map((user) => {
            return <Item key={JSON.stringify(user)} user={user} />;
          })}
        </Wrap>
      </Box>
    </>
  );
}

export default index;
