import styles from './ArtworkMoreBy.module.scss';
import { gql, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';

import ArrowIcon from '@/components/ui/Icons/ArrowIcon';
import MobileRightChevron from '@/components/mobile-ui/MobileIcons/MobileRightChevron';
import Media from '@/components/ui/Media/Media';

const GET_ARTWORKS = gql`
  query getArtworks($userId: ID, $take: Int, $excludeIds: [ID]) {
    getArtworks(userId: $userId, take: $take, excludeIds: $excludeIds) {
      artworks {
        artworkId
        name
        tokenId
        likeCount
        viewCount
        favoriteCount
        artworkUrl
        thumbnailUrl
        mediaType
        artworkInfo {
          title
          creationYear
          edition
          medium
          width
          height
          about
        }
        createdAt
        creator {
          id
          wallet
          nickname
          artistName
          isPartner
        }
      }
    }
  }
`;

const TAKE = 4;

function ArtworkMoreBy(props) {
  const { data } = props;
  const { creator } = data || {};
  const router = useRouter();

  const {
    loading: artworksLoading,
    data: artworksData,
    refetch,
  } = useQuery(GET_ARTWORKS, {
    variables: {
      userId: creator?.id,
      take: TAKE,
      excludeIds: [data?.artworkId],
    },
    fetchPolicy: 'cache-and-network',
  });
  const { getArtworks } = artworksData || {};
  const { artworks } = getArtworks || {};

  if (artworks?.length === 0) {
    return;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>
          More by <span>{creator?.nickname}</span>
        </h1>
        <button
          onClick={() => router.push(`/artist/${creator?.id}?list=artworks`)}
        >
          More <ArrowIcon direction="right" />
        </button>
      </div>
      <div
        className={styles.mobileHeader}
        onClick={() => router.push(`/artist/${creator?.id}?list=artworks`)}
      >
        <h1>
          More by&nbsp;<span> {creator?.nickname}</span>{' '}
          <button>
            <MobileRightChevron />
          </button>
        </h1>
      </div>

      <article className={styles.article}>
        {artworks?.map((artwork) => (
          <div
            key={artwork.artworkId}
            style={{
              borderRadius: '10px',
              position: 'relative',
              cursor: 'pointer',
            }}
            onClick={() => router.push(`/artwork/${artwork.artworkId}`)}
          >
            <Media
              url={artwork.artworkUrl}
              mediaType={artwork.mediaType}
              objectFit="cover"
              blurDataURL="data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFklEQVR42mN8//HLfwYiAOOoQvoqBABbWyZJf74GZgAAAABJRU5ErkJggg=="
              placeholder="blur"
              alt={artwork.name}
              quality={100}
            />
          </div>
        ))}
      </article>
    </div>
  );
}

export default ArtworkMoreBy;
