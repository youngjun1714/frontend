import styles from './MobileHeader.module.scss';

import MobileBackChevron from '../MobileIcons/MobileBackChevron';

const MobileHeader = (props) => {
  const { title, onClick } = props;

  return (
    <header className={styles.header}>
      <button onClick={onClick} aria-label="back">
        <MobileBackChevron />
      </button>
      <h1>{title}</h1>
    </header>
  );
};

export default MobileHeader;
