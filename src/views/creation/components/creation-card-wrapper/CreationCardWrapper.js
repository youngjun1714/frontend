import { Unstable_Grid2 as Grid } from '@mui/material';

import ArtworkCardWrapper from './artwork-card-wrapper/ArtworkCardWrapper';
import InspirationCardWrapper from './inspiration-card-wrapper/InspirationCardWrapper';
import { customToast } from '@/utils/customToast';

function CreationCardWrapper(props) {
  const { q, onChangeSort, sort, tab } = props;

  const bookmarkToast = () => {
    customToast({
      msg: <>Saved</>,
    });
  };

  return (
    <Grid
      container
      spacing={3}
      sx={{
        padding: '0 20px',
        '@media (max-width: 480px)': {
          gap: '8px !important',
        },
      }}
    >
      {tab === 'artworks' && (
        <ArtworkCardWrapper
          onChangeSort={onChangeSort}
          q={q}
          sort={sort}
          toast={bookmarkToast}
        />
      )}
      {tab === 'inspiration' && (
        <InspirationCardWrapper
          onChangeSort={onChangeSort}
          q={q}
          sort={sort}
          toast={bookmarkToast}
        />
      )}
    </Grid>
  );
}

export default CreationCardWrapper;
