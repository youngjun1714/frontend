import styles from './HelpBox.module.scss';

function HelpBox({ children }) {
  return <div className={styles.box}>{children}</div>;
}

export default HelpBox;
