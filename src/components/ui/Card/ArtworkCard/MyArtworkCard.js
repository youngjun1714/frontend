import styles from './ArtworkCard.module.scss';
import PropTypes from 'prop-types';

import Avatar from '../../Avatar/Avatar';
import ArtworkCardHoverPanel from './ArtworkCardHoverPanel';
import formatNumberToShortScale from '@/utils/formatNumberToShortScale';
import { Tooltip } from '@mui/material';
import ArtistInfoTooltip from '../../ArtistInfoTooltip/ArtistInfoTooltip';
import ArtworkBadge from '@/components/ui/Icons/ArtworkBadge';
import ArtworkCardHidden from './ArtworkCardHidden';
import ViewFilled from '../../Icons/ViewFilled';
import ClapFilled from '../../Icons/ClapFilled';
import IsArtist from '../../Icons/IsArtist';
import Boosted from '../../Icons/Boosted';
import AuthRequiredButtonWrapper from '../../Button/AuthRequiredButtonWrapper';
import MobileClapIcon from '@/components/mobile-ui/MobileIcons/MobileClapIcon';
import useLikeArtwork from '@/hooks/useLikeArtwork';
import Media from '../../Media/Media';

function MyArtworkCard(props) {
  const { data, toast } = props;

  const [artworkLike, { loading }] = useLikeArtwork(data?.artworkId);
  const handleLike = (e) => {
    artworkLike();
    e.preventDefault();
    e.stopPropagation();
  };

  const { name, creator } = data || {};

  return (
    <div className={styles.card}>
      <div className={styles.image}>
        {!data?.isArtisideVisible && (
          <ArtworkCardHidden hiddenAt={data?.artisideHiddenAt} />
        )}
        <Media
          url={data.artworkUrl}
          mediaType={data.mediaType}
          objectFit="cover"
          alt={name}
          blurDataURL="data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFklEQVR42mN8//HLfwYiAOOoQvoqBABbWyZJf74GZgAAAABJRU5ErkJggg=="
          quality={100}
          sizes="(max-width: 768px) 100vw, 25vw"
        />
        <div className={styles.panel}>
          <ArtworkCardHoverPanel data={data} toast={toast} />
        </div>
        {/* <div className={styles.badge}>
          <ArtworkBadge />
        </div> */}
      </div>
      <div className={styles.contents}>
        <div className={styles.title}>
          <h1>{data?.name}</h1>
          <AuthRequiredButtonWrapper onClick={(e) => handleLike(e)}>
            <button
              className={
                data?.isLiked
                  ? `${styles.mobileLikeButton} ${styles.isLiked}`
                  : styles.mobileLikeButton
              }
              aria-label="like"
            >
              <MobileClapIcon fill={data?.isLiked} />
            </button>
          </AuthRequiredButtonWrapper>
        </div>
        <div className={styles.footer}>
          <Tooltip
            title={
              <ArtistInfoTooltip
                userId={creator.id}
                isPartner={creator.isPartner}
              />
            }
            placement="top"
            arrow
          >
            <div className={styles.user}>
              <Avatar
                username={creator?.nickname}
                image={creator?.profileImgUrl}
              />
              <div className={styles.name}>
                <h1>
                  <span>{creator?.nickname}</span>
                  {creator?.isPartner && <IsArtist />}
                </h1>
                <h2>
                  <span>@{creator?.artistName}</span>
                </h2>
              </div>
            </div>
          </Tooltip>
          <div className={styles.count}>
            {/* {data?.boostedCount > 0 && (
              <p>
                <Boosted />
                {formatNumberToShortScale(Number(data?.boostedCount))}
              </p>
            )} */}
            <p>
              <ClapFilled />
              {formatNumberToShortScale(Number(data?.likeCount))}
            </p>
            <p>
              <ViewFilled />
              {formatNumberToShortScale(Number(data?.viewCount))}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyArtworkCard;

MyArtworkCard.propTypes = {
  /**
   * Artwork title
   */
  name: PropTypes.string,

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
};

MyArtworkCard.defaultProps = {};
