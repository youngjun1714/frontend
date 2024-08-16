import styles from './MobileDropdown.module.scss';

import MobileDropdownIcons from '../MobileIcons/MobileDropdownIcons';

const MobileDropdownRow = (props) => {
  const { title, onClick } = props;
  return (
    <div className={styles.row} onClick={onClick}>
      <MobileDropdownIcons shape={title} />
      <h1>{title}</h1>
    </div>
  );
};

export default MobileDropdownRow;
