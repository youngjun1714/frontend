import { useEffect, useState } from 'react';
import styles from './PopupBox.module.scss';
import Image from 'next/image';

import MobileBackChevron from '@/components/mobile-ui/MobileIcons/MobileBackChevron';

const PopupBox = (props) => {
  const {
    video,
    title,
    contents,
    nextVideo,
    nextTitle,
    nextContents,
    checked,
    onChange,
    onClose,
    onCreate,
    sessionStorageItem,
  } = props;

  const insertLineBreaks = (text) => {
    const lines = text.split('\\n');

    return lines.map((line, index) => (
      <span key={index}>
        {line}
        {index < lines.length - 1 && <br />}
      </span>
    ));
  };

  const [isNext, setIsNext] = useState(false);

  const handleStart = () => {
    if (checked) {
      sessionStorage.setItem(sessionStorageItem, Date.now().toString());
    }
    onClose();
  };

  const [animateOrder1, setAnimateOrder1] = useState(false);
  const [animateOrder2, setAnimateOrder2] = useState(false);
  const [animateOrder3, setAnimateOrder3] = useState(false);

  useEffect(() => {
    setAnimateOrder1(false);
    setAnimateOrder2(false);
    setAnimateOrder3(false);

    setTimeout(() => {
      setAnimateOrder1(true);
    }, 0);
    setTimeout(() => {
      setAnimateOrder2(true);
    }, 100);
    setTimeout(() => {
      setAnimateOrder3(true);
    }, 200);
  }, [isNext]);

  return (
    <div className={styles.box}>
      <div
        className={
          animateOrder1
            ? `${styles.video} ${styles.openVideo}`
            : `${styles.video} ${styles.closeVideo}`
        }
      >
        <Image
          src={!isNext ? video : nextVideo}
          fill
          alt="How to Create Artist"
        />
        {isNext && (
          <button onClick={() => setIsNext(false)} aria-label="back">
            <MobileBackChevron />
          </button>
        )}
      </div>
      <div className={styles.contents}>
        <article className={styles.article}>
          <h1 className={animateOrder2 ? styles.open : styles.close}>
            {!isNext ? insertLineBreaks(title) : insertLineBreaks(nextTitle)}
          </h1>
          <p className={animateOrder3 ? styles.open : styles.close}>
            {!isNext
              ? insertLineBreaks(contents)
              : insertLineBreaks(nextContents)}
          </p>
        </article>
        <div className={styles.buttonWrapper}>
          <div>
            {isNext && (
              <div className={styles.checkbox}>
                <input
                  type="checkbox"
                  id="checkbox"
                  checked={checked}
                  onChange={onChange}
                />
                <label htmlFor="checkbox">Hide a for a week</label>
              </div>
            )}
          </div>
          <button
            onClick={() => {
              if (!isNext) {
                setIsNext(true);
              } else {
                handleStart();
                onCreate();
              }
            }}
          >
            {!isNext ? `Next` : `Start`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopupBox;
