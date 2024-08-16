import { Fragment, useCallback, useEffect, useRef } from 'react';
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
import Avatar from '@/components/ui/Avatar/Avatar';
import StatusLabel from '@/components/ui/StatusLabel/StatusLabel';
import numberFormat from '@/utils/numberFormat';
import Verified from '@/components/ui/Icons/Verified';
import InfoTypography from '@/components/ui/Typography/InfoTypography';

const GET_SEED_PARTNER_INFO = gql`
  query getSeedersToPartner(
    $partnerId: Long
    $episodeNo: Long
    $currentPage: Int
    $take: Int
  ) {
    getSeedersToPartner(
      partnerId: $partnerId
      episodeNo: $episodeNo
      currentPage: $currentPage
      take: $take
    ) {
      pageInfo {
        totalCount
        take
        currentPage
      }
      seedingInfos {
        seederUserId
        seederUserName
        seederProfileImgUrl
        isArtist
        seedAmt
        weight
      }
    }
  }
`;

const PAGE_SIZE = 100;
const POLL_INTERVAL = 30000;

function SeedersModal(props) {
  const { open, onClose, episodeNo, partner, isLiveEpisode } = props;

  const { userName, artistName, seed, seeders, partnerId, profileImgUrl } =
    partner || {};

  const [
    getSeedersToPartnerQuery,
    { data: seedersData, loading, fetchMore, startPolling, stopPolling },
  ] = useLazyQuery(GET_SEED_PARTNER_INFO, {
    fetchPolicy: 'cache-and-network',
    variables: {
      episodeNo,
      partnerId,
      take: PAGE_SIZE,
    },
    context: { clientName: 'seed' },
  });

  useEffect(() => {
    startPolling(POLL_INTERVAL); // poll interval

    return () => {
      stopPolling();
    };
  }, []);

  const { getSeedersToPartner } = seedersData || {};
  const { seedingInfos, pageInfo } = getSeedersToPartner || {};

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
    if (open)
      getSeedersToPartnerQuery({
        variables: {
          episodeNo,
          partnerId,
          take: PAGE_SIZE,
        },
      });
  }, [open]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
    >
      <div className={styles.modalContainer}>
        <div className={styles.modalHeader}>
          <div className={styles.headerTitle}>
            <div>Episode {episodeNo}</div>
            <StatusLabel label={isLiveEpisode ? 'LIVE' : 'CLOSED'} />
          </div>
          <button
            aria-label="close button"
            className={styles.closeButton}
            onClick={onClose}
          >
            <Close />
          </button>
        </div>
        <div className={styles.modalBody}>
          <div className={styles.seederStat}>
            <div className={styles.statItem}>
              <div className={styles.label}>Seed to</div>
              <div className={styles.value}>
                <Stack direction="row" gap="8px" alignItems="center">
                  <Avatar image={profileImgUrl} username={userName} type="md" />
                  <div>
                    <div>{userName}</div>
                    <div className={styles.artistName}>@{artistName}</div>
                  </div>
                </Stack>
              </div>
            </div>
            <div className={styles.verticalLine} />
            <div className={styles.statItem}>
              <div className={styles.label}>Seeders</div>
              <div className={styles.value}>{numberFormat(seeders, 0)}</div>
            </div>
            <div className={styles.verticalLine} />
            <div className={styles.statItem}>
              <div className={styles.label}>Seed ADF</div>
              <div className={styles.value}>
                <InfoTypography
                  content={seed}
                  decimals={2}
                  size="xs"
                  align="left"
                />
              </div>
            </div>
          </div>

          <div className={styles.thickLine} />

          <div className={styles.fixedHeadTable} ref={observerRoot}>
            <TableContainer sx={{ maxHeight: 400 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Seeders</TableCell>
                    <TableCell align="right">Weight</TableCell>
                    <TableCell align="right">
                      Seed <span className={styles.adf}>ADF</span>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {seedingInfos?.length !== 0 ? (
                    seedingInfos?.map((item, idx) => (
                      <Fragment key={`request-reward-row-${idx}`}>
                        <TableRow hover>
                          <TableCell>
                            <Stack
                              direction="row"
                              alignItems="center"
                              gap="8px"
                            >
                              <Avatar
                                type="sm"
                                image={item.seederProfileImgUrl}
                                username={item.seederUserName}
                              />
                              <div>{item.seederUserName}</div>
                              {item.isArtist && <Verified />}
                            </Stack>
                          </TableCell>
                          <TableCell align="right">
                            {numberFormat(item.weight, 2)}
                          </TableCell>
                          <TableCell align="right">
                            {numberFormat(item.seedAmt, 2)}
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
                          <div>No Seeders</div>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  )}
                  <div ref={observerTarget} style={{ width: '100%' }} />
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default SeedersModal;
