import classNames from 'classnames';
import styles from './FollowButton.module.scss';
import CircleAdd from '@/components/ui/Icons/CircleAdd';

const FollowButton = ({ data, onClick, disabled, style, svgSize }) => (
  <button
    className={classNames(styles.button, {
      [styles.followed]: data,
    })}
    onClick={onClick}
    disabled={disabled}
    style={style}
  >
    {data ? (
      <p style={{ color: 'var(--artiside-neutral2)' }}>Following</p>
    ) : (
      <>
        <CircleAdd dimension={svgSize} />
        <p style={{ color: 'var(--artiside-neutral1)' }}>Follow</p>
      </>
    )}
  </button>
);

export default FollowButton;

FollowButton.defaultProps = {
  style: { height: '48px' },
};
