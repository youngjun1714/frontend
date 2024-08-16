import React, { useState } from 'react';

import styles from '@/views/artist/components/artist-info-card/ArtistInfoCard.module.scss';

import ArtistInfoCardAvatarWrapper from '@/views/artist/components/artist-info-card/artist-info-card-avatar-wrapper/ArtistInfoCardAvatarWrapper';
import ArtistInfoCardInfoWrapper from '@/views/artist/components/artist-info-card/artist-info-card-info-wrapper/ArtistInfoCardInfoWrapper';

function ArtistInfoCard(props) {
  const { isMe, isPartner, data, userLoading, userId } = props;

  return (
    <article
      className={styles.card}
      style={{
        height: isPartner ? '365px' : '272px',
      }}
    >
      <ArtistInfoCardAvatarWrapper
        isMe={isMe}
        isPartner={isPartner}
        data={data}
        userId={userId}
      />
      <ArtistInfoCardInfoWrapper
        isMe={isMe}
        isPartner={isPartner}
        data={data}
        userLoading={userLoading}
        userId={userId}
      />
    </article>
  );
}

export default ArtistInfoCard;
