import styles from './IndexNodata.module.scss';

import { Unstable_Grid2 as Grid } from '@mui/material';

import BackgroundVector from '@/components/ui/Icons/BackgroundVector';
import NodataImage from '@/components/ui/Icons/NodataImage';

const IndexNodata = () => (
  <Grid
    xs={12}
    marginBottom={4}
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: 'calc(100vh - 81px - 198px - 230px)',
    }}
  >
    <div className={styles.section}>
      <div style={{ position: 'absolute', top: '50px' }}>
        <NodataImage />
        <h1>Show me your great artworks or inspiration!</h1>
      </div>
      <div
        style={{
          width: '100vw',
          minWidth: 1560,
          position: 'absolute',
          top: '-50px',
          pointerEvents: 'none',
        }}
      >
        <BackgroundVector />
      </div>
    </div>
  </Grid>
);

export default IndexNodata;
