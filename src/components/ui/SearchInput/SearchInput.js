import styles from './SearchInput.module.scss';
import Search from '../Icons/Search';
import CloseCircle from '../Icons/CloseCircle';
import classNames from 'classnames';

const SearchInput = (props) => {
  const { search, onChangeSearch, type } = props;

  return (
    <div className={classNames(styles.search, type && styles[type])}>
      <div className={styles.icon}>
        <Search color={search && 'var(--artiside-neutral1)'} />
      </div>
      <div className={styles.input}>
        <input
          placeholder="Search"
          value={search}
          onChange={(e) => onChangeSearch(e.currentTarget.value)}
        />
      </div>
      {search && (
        <button
          className={styles.close}
          onClick={() => onChangeSearch('')}
          aria-label="close"
        >
          <CloseCircle />
        </button>
      )}
    </div>
  );
};

export default SearchInput;
