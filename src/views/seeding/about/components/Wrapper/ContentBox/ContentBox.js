import styles from './ContentBox.module.scss';
import classNames from 'classnames';

const ContentBox = (props) => {
  const { children, whiteBackground = true } = props;

  const boxClassName = classNames(styles.box, {
    [styles.whiteBackground]: whiteBackground,
  });

  return <article className={boxClassName}>{children}</article>;
};

export default ContentBox;
