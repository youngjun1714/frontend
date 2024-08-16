import { Stack } from '@mui/material';
import styles from './RoundList.module.scss';
import classNames from 'classnames';
import StatusLabel from '@/components/ui/StatusLabel/StatusLabel';
import { useCallback, useEffect, useRef } from 'react';

const PAGE_SIZE = 10;

const RoundList = (props) => {
  const {
    items,
    onSelectRound,
    selectedRoundNo,
    pageInfo,
    loading,
    fetchMore,
  } = props;

  const observerTarget = useRef(null);

  const handleMore = useCallback(() => {
    if (
      ((pageInfo || {}).currentPage + 1) * PAGE_SIZE <
      (pageInfo || {}).totalCount
    ) {
      // if more item exists
      fetchMore({
        variables: {
          currentPage: pageInfo.currentPage + 1,
        },
      });
    }
  }, [pageInfo, fetchMore]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          handleMore();
        }
      },
      { threshold: 1 }
    );
    const target = observerTarget.current;

    if (target) {
      observer.observe(target);
    }

    return () => {
      if (target) {
        observer.unobserve(target);
      }
    };
  }, [observerTarget, loading, handleMore]);

  return (
    <div className={styles.listWrapper}>
      <div className={styles.scrollDiv}>
        {items?.map((item, idx) => (
          <div
            className={classNames(styles.roundCard, {
              [styles.selected]: selectedRoundNo === item.roundNo,
            })}
            key={`voting-list-${idx}`}
            onClick={() => onSelectRound(item.roundNo)}
          >
            <div>
              <Stack direction="row" gap="4px">
                <span className={styles.roundNo}>Round {item.roundNo}</span>
                {item.isLiveRound && <StatusLabel label="LIVE" size="sm" />}
              </Stack>
            </div>
          </div>
        ))}
        <div ref={observerTarget} style={{ width: '100%' }} />
      </div>
    </div>
  );
};

export default RoundList;
