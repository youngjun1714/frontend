import classNames from 'classnames';
import styles from './Skeleton.module.scss';

function Skeleton(props) {
  const { width, height, className, type, rows } = props;

  const skeletonClassName = classNames(styles.skeleton, {
    [className]: className,
    [styles[type]]: type,
  });
  return (
    <div className={skeletonClassName} style={{ width: width, height: height }}>
      <></>
    </div>
  );
}

export default Skeleton;
