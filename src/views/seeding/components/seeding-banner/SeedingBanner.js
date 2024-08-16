import { gql, useQuery } from '@apollo/client';
import FirstSeedingBanner from './FirstSeedingBanner';
import SecondSeedingBanner from './SecondSeedingBanner';
import styles from './SeedingBanner.module.scss';
import ThirdSeedingBanner from './ThirdSeedingBanner';

const GET_SEEDING_BANNER = gql`
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
      bannerArea3 {
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

const SeedingBanner = () => {
  const { loading, data } = useQuery(GET_SEEDING_BANNER, {
    variables: {
      bannerTab: 'SEEDING',
    },
    fetchPolicy: 'cache-and-network',
  });
  const { getBanners } = data || {};
  const { bannerArea1, bannerArea2, bannerArea3 } = getBanners || {};

  if (!bannerArea1?.length || !bannerArea2?.length || !bannerArea3?.length)
    return null;

  return (
    <div className={styles.banner}>
      <FirstSeedingBanner loading={loading} banners={bannerArea1} />
      <SecondSeedingBanner loading={loading} banners={bannerArea2} />
      <ThirdSeedingBanner loading={loading} banners={bannerArea3} />
    </div>
  );
};

export default SeedingBanner;
