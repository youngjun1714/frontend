import React from 'react';
import styles from '@/views/artist/components/artist-seeding/ArtistSeedCard.module.scss';

import Seeding from '@/components/ui/Icons/Seeding';
import { useRouter } from 'next/router';

function ArtistSeedCard({ user, isParticipate }) {
  const { nickname } = user || {};

  const router = useRouter();

  const handleGoSeeding = () => {
    router.push(`/seeding?q=${nickname}`);
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardTitle}>
        Seed to <span className={styles.nickname}>{nickname}</span>
      </div>

      <p className={styles.cardContent}>
        Patronize this artist and receive reward. The reward will be provided
        within the number of accumulated volume and Seeders to the artist. The
        reward will be allocated as the ratio that the artist configured after
        the Seeding episode (fee will be excluded)
      </p>

      <button
        className={styles.seddingButton}
        disabled={!isParticipate}
        onClick={handleGoSeeding}
      >
        <Seeding /> Go Seeding page
      </button>

      {/* <Tooltip
        title="This artist's account will be deleted soon. Please UNSEED every Seeds."
        placement="top"
        arrow
      >
        <button className={styles.seddingButton} onClick={handlOpenUnseed}>
          <Typography sx={{ color: '#FFFFFF' }} startDecorator={<Seeding />}>
            Unseeding
          </Typography>
        </button>
      </Tooltip>

      <div>
        This artist is not participating for the episode. Please stay tuned
        until the next episode!
      </div>

      <div>
        This artist can&apos;t participate in the Seeding program. Please UNSEED
        the Seeded volume.
      </div> */}
    </div>
  );
}

export default ArtistSeedCard;
