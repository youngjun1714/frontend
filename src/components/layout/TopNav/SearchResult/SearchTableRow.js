import Link from 'next/link';
import styles from './SearchTableRow.module.scss';

import Avatar from '@/components/ui/Avatar/Avatar';

import IsArtist from '@/components/ui/Icons/IsArtist';
import NoResult from '@/components/ui/Icons/NoResult';
import Media from '@/components/ui/Media/Media';
import Picture from '@/components/ui/Picture/Picture';

function SearchTableRow(props) {
  const { data, type, nodata } = props;
  const { user } = data || {};
  const { creator } = data || {};

  if (nodata) {
    return (
      <div className={styles.nodata}>
        <NoResult />
        <h1>No results found</h1>
      </div>
    );
  }

  if (type === 'Artist') {
    return (
      <Link
        href={
          data?.isPartner
            ? `/artist/${data?.id}?list=artworks`
            : `/artist/${data?.id}?list=inspiration`
        }
      >
        <div className={styles.row}>
          <Avatar image={data?.profileImgUrl} username={data?.nickname} />
          <div className={styles.artist}>
            <h1>
              {data?.nickname} {data?.artistName && <IsArtist />}
            </h1>
            {data?.isPartner ? <h2>@{data?.artistName}</h2> : <></>}
          </div>
        </div>
      </Link>
    );
  }

  if (type === 'artwork') {
    return (
      <Link href={`/${type}/${data?.artworkId}`}>
        <div className={styles.row}>
          <div className={styles.picture}>
            <Media
              url={data.artworkUrl}
              mediaType={data.mediaType}
              objectFit="cover"
              overlaySize="small"
              alt={data.name}
              blurDataURL="data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFklEQVR42mN8//HLfwYiAOOoQvoqBABbWyZJf74GZgAAAABJRU5ErkJggg=="
              quality={100}
              sizes="(max-width: 768px) 10vw, 5vw"
            />
          </div>
          <div className={styles.artist}>
            <h1>{data?.name}</h1>
            <h2>Created by : {creator?.nickname}</h2>
          </div>
        </div>
      </Link>
    );
  }

  if (type === 'inspiration') {
    return (
      <Link href={`/${type}/${data?.id}`}>
        <div className={styles.row}>
          <div className={styles.picture}>
            <Picture
              url={data?.mainImage}
              alt={data.title}
              objectFit="cover"
              quality={100}
              sizes="(max-width: 768px) 10vw, 5vw"
            />
          </div>
          <div className={styles.artist}>
            <h1>{data?.title}</h1>
            <h2>Created by : {user?.nickname}</h2>
          </div>
        </div>
      </Link>
    );
  }

  // return (
  //   <Link href={`user/${data?.id}`}>
  //     <div className={styles.row}>
  //       <Avatar type="md" />
  //       <div className={styles.artist}>
  //         <h1>{data?.id}</h1>
  //         <h2>{data?.nickname}</h2>
  //       </div>
  //     </div>
  //   </Link>
  // );
}

export default SearchTableRow;
