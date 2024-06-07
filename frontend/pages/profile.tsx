import ClientOnly from '@/components/layout/clientOnly';
import PageLayout from '@/components/page-layout';
import UserRecords from '@/components/User_Record-Page/UserRecords';

import { useTranslation } from 'react-i18next';

const IndexPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageLayout
        title='user_record'
        description='Discover a starter kit which includes Next.js, Chakra-UI, Framer-Motion in Typescript. You have few components, Internationalization, SEO and more in this template ! Enjoy coding.'
      >
        <ClientOnly>
          {/* <EventFetcher /> */}
          <UserRecords />
        </ClientOnly>
      </PageLayout>
    </>
  );
};

export default IndexPage;
