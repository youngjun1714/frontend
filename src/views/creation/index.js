import { useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { gql, useQuery } from '@apollo/client';
import { Container } from '@mui/material';
import moment from 'moment';

import CreationNavMenu from './components/creation-nav-menu/CreationNavMenu';
import CreationCardWrapper from './components/creation-card-wrapper/CreationCardWrapper';
// import EventPopup from '@/components/popup/EventPopup/EventPopup';
import CreationBanner from './components/creation-banner/CreationBanner';
import useOpen from '@/hooks/useOpen';
import dynamic from 'next/dynamic';

const LatestSelectedArtistModal = dynamic(() =>
  import('../launchpad/components/modals/LatestSelectedArtistModal')
);

const GET_LATEST_SELECTED_ARTIST = gql`
  query getLatestSelectedArtist {
    getLatestSelectedArtist {
      launchpadRoundInfo {
        endTimeAt
        noticeTimeAt
      }
      accumVp
      candidatePartnerInfo {
        promotionThumbnailUrl
      }
      nickname
      artistName
      profileImgUrl
    }
  }
`;

const Page = () => {
  const router = useRouter();
  const { query } = router;
  const { tab = 'artworks', sort = 'NEWEST', q = '' } = query;

  const { data } = useQuery(GET_LATEST_SELECTED_ARTIST, {
    fetchPolicy: 'cache-and-network',
    context: { clientName: 'launchpad' },
  });

  const { getLatestSelectedArtist } = data || {};
  const { launchpadRoundInfo } = getLatestSelectedArtist || {};
  const { endTimeAt, noticeTimeAt } = launchpadRoundInfo || {};

  const [
    selectedArtistModalOpen,
    handleOpenSelectedArtistModal,
    handleCloseModal,
  ] = useOpen();

  const handleCloseSelectedArtistModal = () => {
    sessionStorage.setItem('isClosedSelectedArtistModal', true);
    handleCloseModal();
  };

  useEffect(() => {
    if (
      moment().isAfter(endTimeAt) &&
      moment().isBefore(noticeTimeAt) &&
      sessionStorage.getItem('isClosedSelectedArtistModal') !== 'true'
    )
      handleOpenSelectedArtistModal();
  }, [endTimeAt]);

  // change tab
  const handleChangeTab = (value) => {
    router.push(
      {
        query: { tab: value, q },
      },
      undefined,
      { shallow: true }
    );
  };

  // change menu
  const handleChangeSort = (value) => {
    router.push({ query: { tab, sort: value, q } }, undefined, {
      shallow: true,
    });
  };

  return (
    <>
      <Head>
        <title>Artiside</title>
      </Head>
      <Container
        sx={{
          maxWidth: '1600px !important',
          padding: '10px 0 !important',
          '@media (max-width: 768px)': { padding: '0 !important' },
        }}
      >
        <CreationBanner />
        <CreationNavMenu
          tab={tab}
          sort={sort}
          onChangeTab={handleChangeTab}
          onChangeSort={(value) => handleChangeSort(value)}
        />
        <CreationCardWrapper
          tab={tab}
          q={q}
          onChangeSort={handleChangeSort}
          sort={sort}
        />
        {/* <EventPopup
          popupId="reward20240125"
          expiredAt="2024/02/01 00:00:00 GMT+0900"
          type="lg"
          title="A total of 1,657 users participated!"
          description="Thank you so much for your support"
          image="/assets/images/popup/0125survey.png"
          buttonText="Go to detail"
          onClick={() => {
            window.open(
              'https://docs.google.com/spreadsheets/d/15cL17L-285SGzgEM1LNTH8y7vXrj_NsHX_KjivHWmlE/edit#gid=0'
            );
          }}
        /> */}
        {selectedArtistModalOpen ? (
          <LatestSelectedArtistModal
            open={selectedArtistModalOpen}
            onClose={handleCloseSelectedArtistModal}
            data={getLatestSelectedArtist}
          />
        ) : null}
      </Container>
    </>
  );
};

export default Page;
