import ArtworkCard from '@/components/ui/Card/ArtworkCard/ArtworkCard';
import styles from './cardWrapperSkeleton.module.scss';

import { Unstable_Grid2 as Grid } from '@mui/material';
import MobileCardSkeleton from '@/views/artist/mobile/MobileArtistFavorites/MobileCardSkeleton';

const CardWrapperSkeleton = (props) => {
  const { type } = props;
  const iter = [1, 2, 3, 4, 5, 6, 7, 8];

  if (type === 'inspiration') {
    return (
      <>
        <Grid
          container
          spacing={3}
          sx={{ '@media (max-width: 768px)': { display: 'none' } }}
        >
          {iter.map((item, i) => (
            <Grid xs={6} md={6} lg={4} xl={3} key={i} marginBottom={4}>
              <div className={styles.card}>
                <div className={styles.top} />
                <div className={styles.bottom}>
                  <div className={styles.title} />
                  <div className={styles.contentWrapper}>
                    <div className={styles.content} />
                    <div className={styles.content} />
                  </div>
                </div>
              </div>
            </Grid>
          ))}
        </Grid>
        <div className={styles.mobile}>
          <MobileCardSkeleton type="inspiration" />
        </div>
      </>
    );
  }

  return (
    <>
      {iter.map((item, i) => (
        <Grid xs={12} md={6} lg={4} xl={3} key={i} marginBottom={4}>
          <div className={styles.card}>
            <div className={styles.top} />
            <div className={styles.bottom}>
              <div className={styles.title} />
              <div className={styles.contentWrapper}>
                <div className={styles.content} />
                <div className={styles.content} />
              </div>
            </div>
          </div>
        </Grid>
      ))}
    </>
  );
};

export default CardWrapperSkeleton;
