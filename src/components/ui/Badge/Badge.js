import styles from './Badge.module.scss';

function Badge(props) {
  const { content, hashtag } = props;

  return (
    <div className={styles.badge}>
      <span>
        {hashtag && '#'}
        {content}
      </span>
    </div>
  );
}

export default Badge;

Badge.defaultProps = {
  type: 'square',
};
