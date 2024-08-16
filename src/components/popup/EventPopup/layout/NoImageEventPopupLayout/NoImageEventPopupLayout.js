import styles from './NoImageEventPopupLayout.module.scss';
import classNames from 'classnames';

import CloseIcon from '@/components/ui/Icons/CloseIcon';
import AdfTokenIcon from '@/components/ui/Icons/AdfTokenIcon';
import LargeEventPopupLayout from '../LargeEventPopupLayout/LargeEventPopupLayout';

const NoImageEventPopupLayout = (props) => {
  const { popupId, type, title, description, onClick, setIsOpen } = props;

  const cardClassNames = classNames(styles.card, {
    [styles[type]]: type,
  });

  const handleClose = () => {
    sessionStorage.setItem(popupId, false);
    setIsOpen(false);
    if (onClick) onClick();
  };

  const handleClick = () => {
    handleClose();
    if (onClick) onClick();
  };

  return (
    <div className={cardClassNames}>
      <div
        className={styles.tokenImage}
        style={{ height: type !== 'lg' ? '168px' : '40px' }}
      >
        <CloseButton onClose={handleClose} />
        {type !== 'lg' ? <AdfTokenIcon /> : <></>}
      </div>
      {type !== 'lg' ? (
        <div className={styles.contentsSection}>
          <div className={styles.textWrapper}>
            <p className={styles.title}>{title}</p>
            <p className={styles.description}>{description}</p>
          </div>
          <div className={styles.buttonWrapper}>
            <button
              className={styles.button}
              style={{ width: type !== 'sm' ? '100%' : '' }}
              onClick={handleClick}
            >
              Confirm
            </button>
            {type === 'sm' && (
              <button className={styles.cancelButton}>Next time</button>
            )}
          </div>
        </div>
      ) : (
        <LargeEventPopupLayout
          title={title}
          description={description}
          onClick={handleClick}
        />
      )}
    </div>
  );
};

const CloseButton = ({ onClose }) => (
  <button className={styles.closeButton} onClick={onClose} aria-label="close">
    <CloseIcon />
  </button>
);

export default NoImageEventPopupLayout;
