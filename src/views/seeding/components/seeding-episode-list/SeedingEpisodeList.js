import { Stack } from '@mui/material';
import styles from './SeedingEpisodeList.module.scss';
import moment from 'moment';
import RequestButton from '../request-button/RequestButton';
import ToastAlert from '@/components/ui/Icons/ToastAlert';
import useOpen from '@/hooks/useOpen';
import classNames from 'classnames';
import { useCallback, useEffect, useRef, useState } from 'react';
import StatusLabel from '@/components/ui/StatusLabel/StatusLabel';
import dynamic from 'next/dynamic';

const RequestPeriodModal = dynamic(() =>
  import('../modals/RequestPeriodModal')
);
const RequestRewardModal = dynamic(() =>
  import('../modals/RequestRewardModal')
);

const PAGE_SIZE = 100;

const SeedingEpisodeList = (props) => {
  const {
    useEpisodeList,
    onSelectEpisode,
    selectedEpisodeNo,
    onRefetch,
    onCheckConnected,
    isPolling,
  } = props;

  const [
    requestPeriodModalOpen,
    handleOpenRequestPeriodModal,
    handleCloseRequestPeriodModal,
  ] = useOpen();

  const [
    requestRewardModalOpen,
    handleOpenRequestRewardModal,
    handleCloseRequestRewardModal,
  ] = useOpen();

  const { episodeList, pageInfo, fetchMore, loading } = useEpisodeList || {};

  const [episodeToRequest, setEpisodeToRequest] = useState({});

  const handleOpenRequestRewardModalWithEpisode = (episode) => {
    onCheckConnected(() => {
      setEpisodeToRequest(episode);
      handleOpenRequestRewardModal();
    });
  };

  const observerTarget = useRef(null);
  const observerRoot = useRef(null);

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
      { threshold: 1, root: observerRoot.current }
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
  }, [observerTarget, observerRoot, loading, handleMore]);

  return (
    <div className={styles.listWrapper} ref={observerRoot}>
      <div className={styles.scrollDiv}>
        {episodeList?.map((item, idx) => (
          <div
            className={classNames(styles.episodeCard, {
              [styles.selected]: selectedEpisodeNo === item.episodeNo,
            })}
            key={`episode-list-${item.episodeNo}`}
            onClick={() => onSelectEpisode(item.episodeNo)}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <div>
                <Stack direction="row" gap="4px" mb="12px">
                  <span className={styles.episodeNo}>
                    Episode {item.episodeNo}
                  </span>
                  {item.isLiveEpisode && (
                    <StatusLabel
                      label={
                        moment().isBefore(item.endTimeAt) ? 'LIVE' : 'CLOSED'
                      }
                      size="sm"
                    />
                  )}
                </Stack>
                <div className={styles.episodePeriod}>
                  (UTC)
                  {moment(item.startTimeAt).utc().format('MMM DD, YYYY')} -{' '}
                  {moment(item.endTimeAt).utc().format('MMM DD, YYYY')}
                </div>
              </div>
              <RequestButton
                rewardRequestType={item.rewardRequestType}
                requestPeriod={item.requestPeriod}
                isLiveEpisode={item.isLiveEpisode}
                onRequest={() => handleOpenRequestRewardModalWithEpisode(item)}
                isPolling={isPolling}
                isSelected={episodeToRequest?.episodeNo === item.episodeNo}
                isLastEpisode={idx === 0}
              />
            </Stack>
            {item.rewardRequestType === 'NONE' &&
              !item.isLiveEpisode &&
              moment().isBefore(item.requestPeriod) &&
              idx !== 0 && (
                <div className={styles.requestPeriod}>
                  <button
                    aria-label="open alert button"
                    style={{ display: 'flex' }}
                    onClick={handleOpenRequestPeriodModal}
                  >
                    <ToastAlert />
                  </button>{' '}
                  Request Period:{' '}
                  {moment(item.requestPeriod).format('MMM DD, YYYY')}
                  <div className={styles.triangle} />
                </div>
              )}
          </div>
        ))}
        <div ref={observerTarget} style={{ width: '100%' }} />
      </div>

      {requestPeriodModalOpen && (
        <RequestPeriodModal
          open={requestPeriodModalOpen}
          onClose={handleCloseRequestPeriodModal}
        />
      )}
      {episodeToRequest && requestRewardModalOpen && (
        <RequestRewardModal
          open={requestRewardModalOpen}
          onClose={handleCloseRequestRewardModal}
          requestPeriod={episodeToRequest?.requestPeriod}
          episodeNo={episodeToRequest?.episodeNo}
          onRefetch={onRefetch}
        />
      )}
    </div>
  );
};

export default SeedingEpisodeList;
