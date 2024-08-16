import React, { Fragment } from 'react';
import {
  CircularProgress,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import moment from 'moment';
import styles from './Table.module.scss';
import Episode from '@/components/ui/Icons/Episode';
import AcitivityLabel from '../activity-label/AcitivityLabel';
import History from '@/components/ui/Icons/History';
import numberFormat from '@/utils/numberFormat';
import ToastAlert from '@/components/ui/Icons/ToastAlert';

const HistoryTable = (props) => {
  const { items, loading } = props;

  return (
    <Table className={styles.table}>
      <TableHead>
        <TableRow>
          <TableCell>Episodes</TableCell>
          <TableCell>Activities</TableCell>
          <TableCell
            align="right"
            sx={{ width: '280px', paddingRight: '160px !important' }}
          >
            Amount <span className={styles.adf}>ADF</span>
          </TableCell>
          <TableCell>Additional Information</TableCell>
          <TableCell align="right" sx={{ width: '190px' }}>
            Date
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {loading && !items?.length ? (
          <TableRow>
            <TableCell colSpan={5} className={styles.noItems}>
              <Stack alignItems="center" gap="16px">
                <CircularProgress
                  sx={{
                    color: 'var(--primary-color)',
                  }}
                />
              </Stack>
            </TableCell>
          </TableRow>
        ) : items && items?.length ? (
          items.map((item, idx) => {
            const amount =
              item.event === 'SEEDING'
                ? numberFormat(item.seedAmt, 2)
                : item.event === 'UNSEEDING'
                ? numberFormat(item.unseedAmt, 2)
                : numberFormat(item.rewardAmt, 5);
            const date =
              item.event === 'SEEDING'
                ? item.seedingAt
                : item.event === 'UNSEEDING'
                ? item.unseedingAt
                : item.requestAt;
            return (
              <Fragment key={`history-row-${idx}`}>
                <TableRow hover>
                  <TableCell>
                    <Stack direction="row" alignItems="center">
                      <Episode color="var(--artiside-neutral2)" />
                      Episode {item.episodeNo}
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <AcitivityLabel type={item.event} />
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ width: 280, paddingRight: '160px !important' }}
                  >
                    {amount}
                  </TableCell>
                  <TableCell>
                    {item.event === 'SEEDING' ? (
                      <>
                        Seed to <b>{item.artistUserName}</b>
                      </>
                    ) : item.event === 'UNSEEDING' ? (
                      <>
                        <div>
                          Unseed from <b>{item.artistUserName}</b>
                        </div>
                        {/* <div style={{ position: 'relative' }}>
                          <Tooltip />
                          <div className={styles.unlockDateTooltip}>
                            <ToastAlert /> Unlock:{' '}
                            {moment(item.unLockEndAt).format(
                              '(UTC) MMM DD, YYYY'
                            )}
                          </div>
                        </div> */}
                      </>
                    ) : (
                      <div className={styles.unlockDate}>
                        <ToastAlert /> Unlock:{' '}
                        {moment(item.unLockEndAt)
                          .utc()
                          .format('(UTC) MMM DD, YYYY')}
                      </div>
                    )}
                  </TableCell>
                  <TableCell sx={{ width: '190px' }}>
                    <Stack alignItems="flex-end">
                      <div>
                        {moment(date).utc().format('(UTC) MMM DD, YYYY')}
                      </div>
                      <div className={styles.time}>
                        {moment(date).utc().format('HH:mm:ss')}
                      </div>
                    </Stack>
                  </TableCell>
                </TableRow>
              </Fragment>
            );
          })
        ) : (
          <TableRow>
            <TableCell colSpan={5} className={styles.noItems}>
              <Stack alignItems="center" gap="16px">
                <History />
                <div>No Seeding History Yet</div>
              </Stack>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default HistoryTable;
