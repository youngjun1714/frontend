import styles from './ContentBox.module.scss';

const ContentBox = (props) => {
  const { children } = props;

  return <div className={styles.box}>{children}</div>;
};

export default ContentBox;
