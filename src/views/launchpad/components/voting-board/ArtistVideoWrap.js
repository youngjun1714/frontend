import Picture from '@/components/ui/Picture/Picture';
import styles from './index.module.scss';
import Play from '@/components/ui/Icons/Play';

const ArtistVideoWrap = ({ artwork, onSelectArtwork }) => {
  const { artworkUrl, mediaType, thumbnailUrl, title } = artwork || {};

  return (
    <div
      className={styles.artistVideoWrap}
      onClick={() => onSelectArtwork && onSelectArtwork(artwork)}
    >
      <Picture
        url={mediaType === 'IMAGE' ? artworkUrl : thumbnailUrl}
        objectFit="cover"
        loading="lazy"
        placeholder="blur"
        alt={title}
        blurDataURL="data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFklEQVR42mN8//HLfwYiAOOoQvoqBABbWyZJf74GZgAAAABJRU5ErkJggg=="
        sizes="504px"
        style={{ objectFit: 'cover' }}
        fill={true}
      />
      <div className={styles.masking} />
      {mediaType === 'VIDEO' ? (
        <div className={styles.play}>
          <Play />
        </div>
      ) : null}
    </div>
  );
};

export default ArtistVideoWrap;
