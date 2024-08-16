import styles from './TextWrapper.module.scss';

const TextWrapper = ({ children, maxWidth }) => (
  <div className={styles.textWrapper} style={{ maxWidth }}>
    {children}
  </div>
);

export default TextWrapper;
