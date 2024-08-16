import styles from './ContentWrapper.module.scss';

const ContentWrapper = ({ children }) => (
  <div className={styles.wrapper}>{children}</div>
);

export default ContentWrapper;
