import { useState } from 'react';
import styles from './ImportArtworkCardHoverPanel.module.scss';

import WideningIcon from '@/components/ui/Icons/WideningIcon';
import ImageDetail from '@/components/ui/ImageDetail/ImageDetail';

function ImportArtworkCardHoverPanel(props) {
  const { title, image, mediaType } = props;
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className={styles.panel}>
      <h1>{title}</h1>
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen(true);
        }}
        aria-label="open image detail"
      >
        <WideningIcon />
      </button>
      <ImageDetail
        open={open}
        onClose={handleClose}
        imageUrl={image}
        mediaType={mediaType}
        title={title}
      />
    </div>
  );
}

export default ImportArtworkCardHoverPanel;
