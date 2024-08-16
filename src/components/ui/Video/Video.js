import { useState } from 'react';
import classNames from 'classnames';
import VideoIcon from '../Icons/Video';
import styles from './Video.module.scss';
import { CircularProgress } from '@mui/material';

// must wrap with position: 'relative'
const Video = ({
  objectFit = 'cover',
  url,
  overlaySize = 'normal',
  overlayStyle = {},
  borderRadius = '5px',
  onLoadedMetadata,
  thumbnailUrl,
}) => {
  const [canPlay, setCanplay] = useState(false);

  if (!url) {
    return;
  }

  const convertIpfs = url?.includes('ipfs://')
    ? `${process.env.NEXT_PUBLIC_GATEWAY_URL}${url.split('ipfs://')[1]}`
    : url;

  const convertIpfsThumbnail = thumbnailUrl?.includes('ipfs://')
    ? `${process.env.NEXT_PUBLIC_GATEWAY_URL}${
        thumbnailUrl.split('ipfs://')[1]
      }`
    : thumbnailUrl;

  return (
    <>
      <video
        className={classNames(
          styles.video,
          objectFit === 'cover' ? styles.cover : styles.contain,
          canPlay && styles.isReady
        )}
        style={{
          borderRadius,
        }}
        autoPlay
        loop
        controls={objectFit !== 'cover'}
        controlsList="nodownload"
        muted
        playsInline
        onLoadedMetadata={onLoadedMetadata}
        onCanPlayThrough={() => {
          setCanplay(true);
        }}
        poster={convertIpfsThumbnail}
      >
        <source src={convertIpfs} />
        <p>Your browser doesn`t support mp4 or webm html5 videos.</p>
      </video>
      {!canPlay && (
        <CircularProgress
          style={{
            position: 'absolute',
            color: '#FFFFFF',
          }}
          thickness={5}
        />
      )}
      {objectFit === 'cover' && overlaySize !== 'none' && (
        <div
          className={classNames(
            styles.icon,
            overlaySize === 'small' && styles.small
          )}
          style={overlayStyle}
        >
          <VideoIcon />
        </div>
      )}
    </>
  );
};

export default Video;
