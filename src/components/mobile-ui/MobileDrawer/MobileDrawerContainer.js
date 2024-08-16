import styles from './MobileDrawer.module.scss';

import MobileBackChevron from '../MobileIcons/MobileBackChevron';

const MobileDrawerContainer = ({
  title,
  type,
  children,
  onClose,
  onSubmit,
  disabled,
  border,
  padding,
  ref,
}) => {
  if (type === 'long' || type === 'full') {
    const containerClassName = styles[`${type}Container`];
    return (
      <section className={containerClassName} ref={ref}>
        <div
          className={styles.header}
          style={{
            borderBottom: border
              ? '1px solid var(--artiside-neutral5)'
              : 'none',
          }}
        >
          <button
            className={styles.leftButton}
            onClick={() => onClose && onClose()}
            aria-label="back"
          >
            <MobileBackChevron />
          </button>
          <h1>{title}</h1>
          {onSubmit && (
            <button
              className={styles.submitButton}
              onClick={() => onSubmit()}
              disabled={disabled}
            >
              Share
            </button>
          )}
        </div>

        <div
          className={styles.content}
          style={{ padding: padding ? '0 10px' : '0' }}
        >
          {children}
        </div>
      </section>
    );
  }

  return (
    <section className={styles.container}>
      <div className={styles.bar} />
      {children}
    </section>
  );
};

export default MobileDrawerContainer;

MobileDrawerContainer.defaultProps = {
  border: true,
  padding: true,
};
