import PickedBadge from '@/components/ui/Icons/PickedBadge';
import ImportArtworkCardHoverPanel from './ImportArtworkCardHoverPanel';
import styles from './ImportArtworks.module.scss';
import Media from '@/components/ui/Media/Media';

function ImportArtworkCard(props) {
  const { data, onClick, pickedId } = props;

  return (
    <div
      className={
        data?.artworkId === pickedId
          ? `${styles.clicked} ${styles.card}`
          : styles.card
      }
      onClick={() => onClick(data?.artworkId)}
    >
      {data?.artworkId === pickedId && (
        <div className={styles.badge}>
          <PickedBadge />
          <p>Pick</p>
        </div>
      )}
      <Media
        url={data.artworkUrl}
        mediaType={data.mediaType}
        objectFit="cover"
        alt={data?.name}
        blurDataURL="data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFklEQVR42mN8//HLfwYiAOOoQvoqBABbWyZJf74GZgAAAABJRU5ErkJggg=="
        quality={100}
        className={styles.image}
        sizes="(max-width: 768px) 33vw, 10vw"
      />

      <div className={styles.panel}>
        <ImportArtworkCardHoverPanel
          title={data?.name}
          image={data.artworkUrl}
          mediaType={data.mediaType}
        />
      </div>
    </div>
  );
}

export default ImportArtworkCard;
