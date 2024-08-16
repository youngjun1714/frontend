import React from 'react';
import styles from './InspirationCard.module.scss';
import PropTypes from 'prop-types';

import Avatar from '../../Avatar/Avatar';
import ArtworkCardHoverPanel from './ArtworkCardHoverPanel';
import { Tooltip } from '@mui/material';
import ArtistInfoTooltip from '../../ArtistInfoTooltip/ArtistInfoTooltip';
import ViewFilled from '../../Icons/ViewFilled';
import ClapFilled from '../../Icons/ClapFilled';
import IsArtist from '../../Icons/IsArtist';
import Picture from '../../Picture/Picture';

function InspirationCard(props) {
  const { data, toast } = props;
  const { user } = data;

  return (
    <div className={styles.card}>
      <div className={styles.image}>
        <Picture
          url={data?.mainImage}
          objectFit="cover"
          loading="lazy"
          placeholder="blur"
          blurDataURL="data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFklEQVR42mN8//HLfwYiAOOoQvoqBABbWyZJf74GZgAAAABJRU5ErkJggg=="
          alt={data?.title}
          sizes="(max-width: 768px) 80vw, (max-width: 900px) 40vw, (max-width: 1200px) 30vw, 20vw"
        />
        <div className={styles.panel}>
          <ArtworkCardHoverPanel data={data} toast={toast} type="inspiration" />
        </div>
      </div>
      <div className={styles.contents}>
        <div className={styles.simpleFooter}>
          <Tooltip
            title={
              <ArtistInfoTooltip userId={user.id} isPartner={user.isPartner} />
            }
            placement="top"
            arrow
          >
            <div className={styles.user}>
              <Avatar
                type="mobile-md"
                image={user?.profileImgUrl}
                username={user?.nickname}
              />

              <div className={styles.name}>
                <h1>
                  <span>{user?.nickname}</span>
                  {user?.isPartner && <IsArtist />}
                </h1>
              </div>
            </div>
          </Tooltip>
          <div className={styles.count}>
            <p>
              <ClapFilled />
              {Number(data.likeCount).toLocaleString()}
            </p>
            <p>
              <ViewFilled />
              {Number(data.viewCount).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InspirationCard;

InspirationCard.propTypes = {
  /**
   * Artwork title
   */
  title: PropTypes.string,

  /**
   * Fetching data now?
   */
  isDataReady: PropTypes.bool,

  /**
   * Artist badge
   */
  isArtist: PropTypes.bool,

  /**
   * User data
   */
  user: PropTypes.shape({
    username: PropTypes.string,
    nickname: PropTypes.string,
  }),

  /**
   * Artwork data
   */
  artworkInfo: PropTypes.shape({
    like: PropTypes.number,
    view: PropTypes.number,
  }),
};

InspirationCard.defaultProps = {
  title: '',
  isDataReady: true,
  user: {
    username: '',
    nickname: '',
  },
  artworkInfo: {
    like: 0,
    view: 0,
  },
  isArtist: true,
};
