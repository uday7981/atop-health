import { User } from '@/types/user';
import {
  CardBody,
  CardFooter,
  CardHeader,
  Heading,
  Text,
  VStack,
} from '@chakra-ui/react';

function UserProfile({ user }: { user: User }) {
  return (
    <>
      <CardHeader>
        <Heading textAlign={'start'}>{user.fullName}</Heading>
      </CardHeader>
      <CardBody>
        <VStack spacing={8} align='start' w={{ base: '100%', md: '50%' }}>
          <Text as='b'>Age: {user.age}</Text>
          <Text as='b'>Blood_Group: {user.bloodGroup}</Text>
          <Text as='b'>Allergies: {user.allergies}</Text>
          <Text as='b'>Medications: {user.medication}</Text>
          <Text as='b'>About: {user.about}</Text>
        </VStack>
      </CardBody>
      <CardFooter>
        {/* <Button colorScheme="blue">Sign up</Button> */}
      </CardFooter>
    </>
  );
}
export default UserProfile;
