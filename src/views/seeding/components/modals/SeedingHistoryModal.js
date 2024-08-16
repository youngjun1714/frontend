import { Fragment, useEffect, useState, useCallback, useRef } from 'react';
import {
  Modal,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { gql, useLazyQuery } from '@apollo/client';

import styles from './Modal.module.scss';
import Close from '@/components/ui/Icons/Close';
import EpisodeDropdown from '../episode-dropdown/EpisodeDropdown';
import SearchInput from '@/components/ui/SearchInput/SearchInput';
import Avatar from '@/components/ui/Avatar/Avatar';
import Verified from '@/components/ui/Icons/Verified';
import History from '@/components/ui/Icons/History';
import numberFormat from '@/utils/numberFormat';
import moment from 'moment';

const GET_SEED_HISTORY = gql`
  query getSeedingHistory(
    $episodeNo: Long
    $currentPage: Int
    $take: Int
    $searchKeyword: String
  ) {
    getSeedingHistory(
      episodeNo: $episodeNo
      currentPage: $currentPage
      take: $take
      searchKeyword: $searchKeyword
    ) {
      pageInfo {
        totalCount
        take
        currentPage
      }
      seedActivities {
        episodeNo
        seederUserId
        seederUserName
        partnerId
        artistName
        artistUserName
        seedAmt
        unseedAmt
        group
        rewardPercentage
        profileImgUrl
        event
        seedingAt
        unseedingAt
      }
    }
  }
`;

const PAGE_SIZE = 10;

function SeedingHistoryModal({
  open,
  onClose,
  selectedEpisodeNo,
  useEpisodeList,
}) {
  const { episodeList } = useEpisodeList || {};
  const [episodeNo, setEpisodeNo] = useState(selectedEpisodeNo);
  const [search, setSearch] = useState('');

  const [getSeedingHistoryQuery, { data, loading, fetchMore }] = useLazyQuery(
    GET_SEED_HISTORY,
    {
      fetchPolicy: 'cache-and-network',
      variables: {
        episodeNo,
        searchKeyword: search,
        take: PAGE_SIZE,
      },
      context: { clientName: 'seed' },
    }
  );
  const { getSeedingHistory } = data || {};
  const { seedActivities, pageInfo } = getSeedingHistory || {};

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

  useEffect(() => {
    if (open) {
      getSeedingHistoryQuery({
        variables: {
          episodeNo,
          searchKeyword: search,
          take: PAGE_SIZE,
        },
      });

      if (!episodeNo && episodeList?.length) {
        setEpisodeNo(episodeList[0].episodeNo);
      }
    }
  }, [open, episodeNo, search]);

  useEffect(() => {
    setEpisodeNo(selectedEpisodeNo);
  }, [selectedEpisodeNo]);
  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
    >
      <div className={styles.modalContainer}>
        <div className={styles.modalHeader}>
          <div className={styles.headerTitle}>Seeding History</div>
          <button
            aria-label="close button"
            className={styles.close}
            onClick={onClose}
          >
            <Close />
          </button>
        </div>
        <div className={styles.modalBody}>
          <div className={styles.seedingHistorySearchBar}>
            <EpisodeDropdown
              useEpisodeList={useEpisodeList}
              episode={episodeNo}
              onChangeEpisode={setEpisodeNo}
              useAll={false}
            />
            <SearchInput search={search} onChangeSearch={setSearch} />
          </div>
          <div className={styles.thickLine} />
          <div className={styles.fixedHeadTable} ref={observerRoot}>
            <TableContainer sx={{ maxHeight: 400 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Artists</TableCell>
                    <TableCell align="right">
                      Seeding Amount <span className={styles.adf}>ADF</span>
                    </TableCell>
                    <TableCell align="right">Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {seedActivities && seedActivities.length ? (
                    seedActivities.map((item, idx) => (
                      <Fragment key={`seeding-history-modal-row-${idx}`}>
                        <TableRow hover>
                          <TableCell>
                            <Stack
                              direction="row"
                              alignItems="center"
                              gap="8px"
                            >
                              <Avatar
                                image={item.profileImgUrl}
                                username={item.artistUserName}
                                type="sm"
                              />
                              <div>{item.artistUserName}</div>
                              <Verified />
                            </Stack>
                          </TableCell>
                          <TableCell
                            align="right"
                            style={{
                              color:
                                item.event === 'SEEDING'
                                  ? 'var(--primary-color)'
                                  : 'var(--artiside-neutral1)',
                            }}
                          >
                            {item.event === 'SEEDING'
                              ? `+${numberFormat(item.seedAmt, 2)}`
                              : `-${numberFormat(item.unseedAmt, 2)}`}
                          </TableCell>
                          <TableCell align="right">
                            <div className={styles.date}>
                              {moment(item.seedingAt)
                                .utc()
                                .format('(UTC) MMM DD, YYYY')}
                            </div>
                            <div className={styles.time}>
                              {moment(
                                item.event === 'SEEDING'
                                  ? item.seedingAt
                                  : item.unseedingAt
                              )
                                .utc()
                                .format('HH:mm:ss')}
                            </div>
                          </TableCell>
                        </TableRow>
                      </Fragment>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        className={styles.noSeedingHistory}
                      >
                        <Stack alignItems="center" gap="16px">
                          <History />
                          <div>No Seeding History Yet</div>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  )}
                  <tr ref={observerTarget} style={{ width: '100%' }} />
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default SeedingHistoryModal;
