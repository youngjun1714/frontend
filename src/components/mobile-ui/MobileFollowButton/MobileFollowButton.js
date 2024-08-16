import styles from './MobileFollowButton.module.scss';

import MobileFollowIcon from '../MobileIcons/MobileFollowIcon';

const MobileFollowButton = ({
  isFollow,
  icon,
  loading,
  disabled,
  onClick,
  width,
}) => {
  if (loading) {
    return (
      <button
        className={`${styles.button} ${styles.loading}`}
        disabled={true}
      ></button>
    );
  }
  return (
    <button
      className={styles.button}
      style={{
        width: width,
        backgroundColor: isFollow ? 'var(--artiside-neutral6)' : '#FFFFFF',
        color: isFollow
          ? 'var(--artiside-neutral2)'
          : 'var(--artiside-neutral1)',
      }}
      onClick={onClick}
      disabled={disabled}
    >
      {isFollow ? (
        'Following'
      ) : (
        <>
          {icon && <MobileFollowIcon size="sm" />} <span>Follow</span>
        </>
      )}
    </button>
  );
};

export default MobileFollowButton;

MobileFollowButton.defaultProps = {
  icon: true,
  width: '90px',
};
