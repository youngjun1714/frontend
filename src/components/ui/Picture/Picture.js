import { useState } from 'react';
import classNames from 'classnames';
import styles from './Picture.module.scss';
import Image from 'next/image';
import { CircularProgress } from '@mui/material';

// must wrap with position: 'relative'
const Picture = ({ objectFit = 'cover', url, alt, ...imageProps }) => {
  const [isReady, setIsReady] = useState(false);
  const [isError, setIsError] = useState(false);

  if (!url) {
    return;
  }

  const convertIpfs = url?.includes('ipfs://')
    ? `${process.env.NEXT_PUBLIC_GATEWAY_URL}${url.split('ipfs://')[1]}`
    : url;

  return (
    <>
      <Image
        src={convertIpfs}
        className={classNames(styles.picture, isReady && styles.isReady)}
        style={{
          objectFit,
        }}
        fill={true}
        alt={alt || ''}
        onLoad={() => setIsReady(true)}
        onError={() => {
          setIsReady(true);
          setIsError(true);
        }}
        {...imageProps}
      />
      {isError && <>Error Image</>}
      {!isReady && (
        <CircularProgress
          style={{ position: 'absolute', color: '#FFFFFF', zIndex: 1 }}
          thickness={5}
        />
      )}
    </>
  );
};

export default Picture;
