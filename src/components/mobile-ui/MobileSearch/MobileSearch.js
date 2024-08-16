import { useState, useRef, forwardRef } from 'react';
import styles from './MobileSearch.module.scss';

import { Dialog } from '@mui/material';

import MobileBackChevron from '../MobileIcons/MobileBackChevron';
import MobileInputClearIcon from '../MobileIcons/MobileInputClearIcon';
import MobileSearchIcon from '../MobileIcons/MobileSearchIcon';
import MobileSearchResultContainer from './MobileSearchResultContainer';

const MobileSearch = (props, ref) => {
  const { open, search, onChange, onClose, onRemove } = props;

  const inputRef = useRef(null);

  const [isFocus, setIsFocus] = useState(false);

  return (
    <>
      {open && (
        <Dialog
          fullScreen
          open={open}
          sx={{
            transition: '300ms',
            '@media (min-width: 1025px)': { display: 'none' },
            zIndex: 1560,
          }}
        >
          <section className={styles.section} ref={ref}>
            <div className={styles.menu}>
              <button onClick={onClose} aria-label="back">
                <MobileBackChevron />
              </button>
            </div>

            <div className={styles.inputSection}>
              <div
                className={styles.searchBar}
                style={{
                  border: isFocus
                    ? '1px solid var(--artiside-neutral1)'
                    : '1px solid var(--artiside-neutral5)',
                }}
              >
                <div className={styles.icon}>
                  <MobileSearchIcon />
                </div>
                <div className={styles.input}>
                  <input
                    ref={inputRef}
                    placeholder="Search"
                    value={search}
                    onChange={onChange}
                    onFocus={() => setIsFocus(true)}
                    onBlur={() => setIsFocus(false)}
                  />
                </div>
                {search && (
                  <button
                    className={styles.clear}
                    onClick={() => {
                      onRemove();
                      inputRef.current.focus();
                    }}
                    aria-label="clear"
                  >
                    <MobileInputClearIcon />
                  </button>
                )}
              </div>
            </div>

            <article className={styles.resultSection}>
              <MobileSearchResultContainer search={search} onClose={onClose} />
            </article>
          </section>
        </Dialog>
      )}
    </>
  );
};

export default forwardRef(MobileSearch);
