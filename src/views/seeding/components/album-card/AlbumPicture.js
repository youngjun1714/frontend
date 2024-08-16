import Picture from '@/components/ui/Picture/Picture';
import styles from './AlbumCard.module.scss';
import Smile from '@/components/ui/Icons/Smile';

const AlbumPicture = ({ artwork, onSelectPicture }) => {
  const { artworkUrl, mediaType, thumbnailUrl, title } = artwork || {};

  if (!artwork || (mediaType === 'VIDEO' && !thumbnailUrl))
    return (
      <div className={styles.noArt}>
        <Smile />
      </div>
    );

  return (
    <div
      className={styles.albumPicture}
      onClick={() => onSelectPicture(artwork)}
    >
      <Picture
        url={mediaType === 'IMAGE' ? artworkUrl : thumbnailUrl}
        objectFit="cover"
        loading="lazy"
        placeholder="blur"
        alt={title}
        blurDataURL="data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFklEQVR42mN8//HLfwYiAOOoQvoqBABbWyZJf74GZgAAAABJRU5ErkJggg=="
        sizes="200px"
        style={{ objectFit: 'cover' }}
        fill={true}
      />
    </div>
  );
};

export default AlbumPicture;
