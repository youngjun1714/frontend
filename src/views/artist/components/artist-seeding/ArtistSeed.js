import { Unstable_Grid2 as Grid } from '@mui/material';
import { gql, useLazyQuery, useQuery } from '@apollo/client';

import ArtistSeedCard from './ArtistSeedCard';
import ArtistSeedingStat from './ArtistSeedStat';
import { useEffect } from 'react';

const GET_LIVE_EPISODE_INFO = gql`
  query getLiveEpisodeInfo {
    getLiveEpisodeInfo {
      episodeNo
      startTimeAt
      endTimeAt
    }
  }
`;

const GET_PARTNER_INFO_BY_SEEDER = gql`
  query getPartnerInfoBySeeder($episodeNo: Long, $partnerId: Long) {
    getPartnerInfoBySeeder(episodeNo: $episodeNo, partnerId: $partnerId) {
      episodeNo
      endTimeAt
      commission
      rewardPercentage
      seed
      seederAmt
      seeders
      userName
      artistName
      profileImgUrl
      isParticipate
    }
  }
`;

const ArtistSeed = ({ user }) => {
  const {
    partner: { partnerId },
  } = user || {};
  const { data: liveEpisodeData } = useQuery(GET_LIVE_EPISODE_INFO, {
    fetchPolicy: 'cache-and-network',
    context: { clientName: 'seed' },
  });

  const { getLiveEpisodeInfo } = liveEpisodeData || {};
  const { episodeNo } = getLiveEpisodeInfo || {};

  const [getPartnerInfoBySeederQuery, { data }] = useLazyQuery(
    GET_PARTNER_INFO_BY_SEEDER,
    {
      fetchPolicy: 'cache-and-network',
      context: { clientName: 'seed' },
    }
  );
  const { getPartnerInfoBySeeder } = data || {};

  const { isParticipate } = getPartnerInfoBySeeder || {};

  useEffect(() => {
    if (episodeNo && partnerId) {
      getPartnerInfoBySeederQuery({
        variables: {
          episodeNo,
          partnerId,
        },
      });
    }
  }, [episodeNo, partnerId]);

  return (
    <>
      <Grid sx={{ marginTop: '-50px', zIndex: '1' }} xs={12} sm={12} md={4}>
        <ArtistSeedCard user={user} isParticipate={isParticipate} />
      </Grid>

      <Grid sx={{ zIndex: '1' }} xs={12} sm={12} md={12}>
        <ArtistSeedingStat
          statData={getPartnerInfoBySeeder}
          partnerId={partnerId}
          isParticipate={isParticipate}
        />
      </Grid>
    </>
  );
};

export default ArtistSeed;
