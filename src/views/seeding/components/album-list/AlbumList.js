import { CircularProgress, Stack } from '@mui/material';
import { useRecoilValue } from 'recoil';

import stores from '@/store';
import AlbumCard from '../album-card/AlbumCard';
import ImageDetail from '@/components/ui/ImageDetail/ImageDetail';
import { useState } from 'react';

const AlbumList = (props) => {
  const {
    items,
    loading,
    onOpenSeederModal,
    onOpenSeedingModal,
    onCheckConnected,
    onChangePartnerToSeed,
    disableSeeding,
    liveEpisodeEndTimeAt,
  } = props;

  // me
  const {
    common: { meState },
  } = stores;
  const me = useRecoilValue(meState);

  // View image detail
  const [open, setOpen] = useState(false);
  const [selectedArtwork, setSelectedArtwork] = useState(null);

  const handleSelectPicture = (artwork) => {
    if (!artwork) return;
    setSelectedArtwork(artwork);
    setOpen(true);
  };

  return (
    <Stack direction="row" flexWrap="wrap" gap="120px 100px" mt="40px">
      {loading && !items?.length ? (
        <Stack
          width="100%"
          height="300px"
          alignItems="center"
          justifyContent="center"
        >
          <CircularProgress
            sx={{
              color: 'var(--primary-color)',
            }}
          />
        </Stack>
      ) : (
        items?.map((item, idx) => (
          <AlbumCard
            artist={item}
            key={idx}
            onOpenSeederModal={onOpenSeederModal}
            onOpenSeedingModal={onOpenSeedingModal}
            me={me}
            onCheckConnected={onCheckConnected}
            onChangePartnerToSeed={onChangePartnerToSeed}
            disableSeeding={disableSeeding}
            onSelectPicture={handleSelectPicture}
            liveEpisodeEndTimeAt={liveEpisodeEndTimeAt}
          />
        ))
      )}
      <ImageDetail
        open={open}
        onClose={() => {
          setOpen(false);
        }}
        title={selectedArtwork?.title}
        imageUrl={selectedArtwork?.artworkUrl}
        mediaType={selectedArtwork?.mediaType}
      />
    </Stack>
  );
};

export default AlbumList;
