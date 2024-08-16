import styles from './TextWrapper.module.scss';

const TextWrapper = ({ children }) => (
  <div className={styles.textWrapper}>{children}</div>
);

export default TextWrapper;
