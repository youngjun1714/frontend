import FirstCreationBanner from './FirstCreationBanner';
import SecondCreationBanner from './SecondCreationBanner';
import styles from './CreationBanner.module.scss';
import { CircularProgress } from '@mui/material';
import { gql, useQuery } from '@apollo/client';

const GET_CREATION_BANNER = gql`
  query getBanners($bannerTab: BannerTab) {
    getBanners(bannerTab: $bannerTab) {
      bannerArea1 {
        bannerId
        bannerTab
        bannerArea
        title
        link
        imageUrl
        isVisible
        createdAt
      }
      bannerArea2 {
        bannerId
        bannerTab
        bannerArea
        title
        link
        imageUrl
        isVisible
        createdAt
      }
    }
  }
`;

const CreationBanner = () => {
  const { loading, data } = useQuery(GET_CREATION_BANNER, {
    variables: {
      bannerTab: 'CREATION',
    },
    fetchPolicy: 'cache-and-network',
  });
  const { getBanners } = data || {};
  const { bannerArea1, bannerArea2 } = getBanners || {};

  if (!bannerArea1?.length || !bannerArea2?.length) return null;

  if (loading)
    return (
      <div className={styles.banner}>
        <div className={`${styles.firstBanner} ${styles.loadingDiv}`}>
          <CircularProgress
            sx={{
              color: 'var(--primary-color)',
            }}
          />
        </div>
        <div className={`${styles.secondBanner} ${styles.loadingDiv}`}>
          <CircularProgress
            sx={{
              color: 'var(--primary-color)',
            }}
          />
        </div>
      </div>
    );

  return (
    <div className={styles.banner}>
      <FirstCreationBanner banners={bannerArea1} />
      <SecondCreationBanner banners={bannerArea2} />
    </div>
  );
};

export default CreationBanner;
