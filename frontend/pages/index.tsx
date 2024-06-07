import FeaturesPage from '@/components/index-page/features_page';
import StartingPage from '@/components/index-page/starting_page';
import PageLayout from '@/components/page-layout';
import { VStack } from '@chakra-ui/react';

import { useTranslation } from 'react-i18next';

const IndexPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageLayout
        title='Home'
        description='Discover a starter kit which includes Next.js, Chakra-UI, Framer-Motion in Typescript. You have few components, Internationalization, SEO and more in this template ! Enjoy coding.'
      >
        <VStack width={'100%'} minH='fit-content'>
          <StartingPage />
          <FeaturesPage />
        </VStack>
      </PageLayout>
    </>
  );
};

export default IndexPage;
