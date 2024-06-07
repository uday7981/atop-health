import { useToast } from '@chakra-ui/react';

export default function useToastCustom() {
  const toast = useToast();

  const errorToast = (error: string) => {
    toast({
      status: 'error',
      title: 'Error',
      description: error,
      duration: 1000,
    });
  };
  const successToast = (success: string) => {
    toast({
      status: 'success',
      title: 'Success',
      description: success,
      duration: 1000,
    });
  };
  return {
    successToast,
    errorToast,
  };
}
