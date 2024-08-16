import { useState } from 'react';
import { Modal } from '@mui/material';
import Close from '../Icons/Close';
import styles from './ImageDetail.module.scss';
import Media from '../Media/Media';

function ImageDetail(props) {
  const { open, onClose, imageUrl, title, mediaType = 'IMAGE' } = props;
  const [size, setSize] = useState({ width: '90%', height: '90%' });

  // TODO useLayoutEffect if responsive required
  const handleImgLoad = (width, height) => {
    if (height === 0 || width === 0) {
      return;
    }
    const ratio = height / width;
    const screenRatio = window.innerHeight / window.innerWidth;

    if (ratio > screenRatio) {
      setSize({
        width: `${(90 * screenRatio) / ratio}%`,
        height: '90%',
      });
    } else {
      setSize({
        width: '90%',
        height: `${(90 * ratio) / screenRatio}%`,
      });
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        backdropFilter: 'blur(5px)',
        zIndex: 1560,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      className={styles.modalRoot}
    >
      <>
        <div
          className={styles.imageWrapper}
          style={{
            ...size,
          }}
        >
          <Media
            url={imageUrl}
            mediaType={mediaType}
            objectFit="contain"
            alt={title || ''}
            sizes="(max-width: 768px) 100vw, 50vw"
            onLoadingComplete={(img) =>
              handleImgLoad(img.naturalWidth, img.naturalHeight)
            }
            onLoadedMetadata={(e) =>
              mediaType === 'VIDEO' &&
              handleImgLoad(e.target.videoWidth, e.target.videoHeight)
            }
          />
        </div>
        <button
          type="button"
          className={styles.close}
          onClick={onClose}
          aria-label="close"
        >
          <Close color="#fff" />
        </button>
      </>
    </Modal>
  );
}
export default ImageDetail;
