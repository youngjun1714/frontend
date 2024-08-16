import { Fragment, useCallback, useEffect, useRef } from 'react';
import {
  Modal,
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
import numberFormat from '@/utils/numberFormat';
import moment from 'moment';

const GET_REQUEST_HISTORY = gql`
  query getRequestHistory($currentPage: Int, $take: Int) {
    getRequestHistory(currentPage: $currentPage, take: $take) {
      pageInfo {
        totalCount
        take
        currentPage
      }
      seedActivities {
        episodeNo
        requestAt
        episodeRewardRequestAmt
      }
      totalRewardAmt
    }
  }
`;

const PAGE_SIZE = 10;

function RequestHistoryModal({ open, onClose }) {
  const [getRequestHistoryQuery, { data, loading, fetchMore }] = useLazyQuery(
    GET_REQUEST_HISTORY,
    {
      fetchPolicy: 'cache-and-network',
      variables: {
        take: PAGE_SIZE,
      },
      context: { clientName: 'seed' },
    }
  );
  const { getRequestHistory } = data || {};
  const { seedActivities, pageInfo, totalRewardAmt } = getRequestHistory || {};

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
      getRequestHistoryQuery({
        fetchPolicy: 'cache-and-network',
        variables: {
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
          <div className={styles.headerTitle}>Request History</div>
          <button
            aria-label="close button"
            className={styles.close}
            onClick={onClose}
          >
            <Close />
          </button>
        </div>
        <div className={styles.modalBody}>
          <div className={styles.priceContainer} style={{ marginBottom: 40 }}>
            <div className={styles.label}>
              Accum. Reward for Seed Participation
            </div>
            <div className={styles.priceBox}>
              <span>{numberFormat(totalRewardAmt, 5)}</span>
              <span className={styles.adf}>ADF</span>
            </div>
          </div>

          <div className={styles.thickLine} />

          <div className={styles.fixedHeadTable} ref={observerRoot}>
            <TableContainer sx={{ maxHeight: 400 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Episodes</TableCell>
                    <TableCell align="right">
                      Request <span className={styles.adf}>ADF</span>
                    </TableCell>
                    <TableCell align="right">Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {seedActivities?.map((item, idx) => (
                    <Fragment key={`request-reward-row-${idx}`}>
                      <TableRow hover>
                        <TableCell>Episode {item.episodeNo}</TableCell>
                        <TableCell align="right">
                          {numberFormat(item.episodeRewardRequestAmt, 5)}
                        </TableCell>
                        <TableCell align="right">
                          <div className={styles.date}>
                            {moment(item.requestAt)
                              .utc()
                              .format('(UTC) MMM DD, YYYY')}
                          </div>
                          <div className={styles.time}>
                            {moment(item.requestAt).format('HH:mm:ss')}
                          </div>
                        </TableCell>
                      </TableRow>
                    </Fragment>
                  ))}
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

export default RequestHistoryModal;
