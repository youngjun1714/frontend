import classNames from 'classnames';
import styles from './ImageWrapper.module.scss';

const ImageWrapper = ({ children, align, display = 'web' }) => (
  <div
    className={classNames(styles.imgWrapper, {
      [styles[align]]: align,
      [styles[display]]: display,
    })}
  >
    {children}
  </div>
);

export default ImageWrapper;
