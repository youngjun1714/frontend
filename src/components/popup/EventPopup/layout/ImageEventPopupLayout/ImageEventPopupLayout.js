import styles from './ImageEventPopupLayout.module.scss';
import Image from 'next/image';
import classNames from 'classnames';

import CloseIcon from '@/components/ui/Icons/CloseIcon';

const ImageEventPopupLayout = (props) => {
  const {
    popupId,
    type,
    title,
    description,
    onClick,
    image,
    alt = 'popup',
    setIsOpen,
    buttonText,
  } = props;

  const cardClassNames = classNames(styles.card, {
    [styles[type]]: type,
  });

  const handleClose = () => {
    sessionStorage.setItem(popupId, false);
    setIsOpen(false);
  };

  const handleClick = () => {
    if (onClick) onClick();
    handleClose();
  };

  return (
    <div className={cardClassNames}>
      <div className={styles.image}>
        {image && <Image src={image} alt={alt} fill sizes="500px" />}
        <CloseButton onClose={handleClose} />
      </div>
      <div className={styles.contents}>
        {(title || description) && (
          <div className={styles.textWrapper}>
            <p className={styles.title}>{title}</p>
            <p className={styles.description}>{description}</p>
          </div>
        )}
        <button className={styles.button} onClick={handleClick}>
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default ImageEventPopupLayout;

const CloseButton = ({ onClose }) => (
  <button className={styles.closeButton} onClick={onClose} aria-label="close">
    <CloseIcon />
  </button>
);
