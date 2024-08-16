import dynamic from 'next/dynamic';
import styles from './MobileDrawerList.module.scss';

const CircularProgress = dynamic(() =>
  import('@mui/material/CircularProgress')
);

const MobileDrawerList = (props) => {
  const { border, title, onClick, arrow, icon, isLoading } = props;

  return (
    <div
      className={styles.row}
      onClick={onClick}
      style={{
        borderBottom: border ? '1px solid var(--artiside-neutral5)' : '',
      }}
    >
      <h1>
        {icon && icon} {title}
      </h1>

      {arrow && !isLoading ? (
        arrow
      ) : (
        <CircularProgress
          sx={{
            width: '22px !important',
            height: '22px !important',
            color: 'var(--artiside-neutral3) !important',
          }}
          thickness={5}
        />
      )}
    </div>
  );
};

export default MobileDrawerList;
