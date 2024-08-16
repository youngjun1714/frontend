import styles from './MobileDropdown.module.scss';
import MobileDropdownRow from './MobileDropdownRow';

const MobileDropdown = ({ children }) => (
  <div className={styles.dropdown}>{children}</div>
);

export default MobileDropdown;
