import React, { Fragment } from 'react';
import {
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import moment from 'moment';
import styles from './Table.module.scss';
import numberFormat from '@/utils/numberFormat';
import History from '@/components/ui/Icons/History';
import AcitivityLabel from '@/views/seeding/components/activity-label/AcitivityLabel';

const RewardTable = ({ items }) => (
  <Table className={styles.table}>
    <TableHead>
      <TableRow className={styles.rewardTableRow}>
        <TableCell>Type</TableCell>
        <TableCell align="right">
          Reward <span className={styles.adf}>ADF</span>
        </TableCell>
        <TableCell align="right">Request Date</TableCell>
        <TableCell align="center">Status</TableCell>
        <TableCell align="right" sx={{ width: '180px' }}>
          Unlock Date
        </TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {items && items.length ? (
        items?.map((item, idx) => (
          <Fragment key={`pending-reward-row-${idx}`}>
            <TableRow hover className={styles.rewardTableRow}>
              <TableCell>
                <AcitivityLabel type="SEEDING_REWARD" />
              </TableCell>
              <TableCell
                align="right"
                style={{
                  color: 'var(--primary-color)',
                }}
              >
                + {numberFormat(item.episodeRewardRequestAmt, 5)}
              </TableCell>

              <TableCell>
                <Stack alignItems="flex-end">
                  <div>
                    {moment(item.requestAt).utc().format('(UTC) MMM DD, YYYY')}
                  </div>
                  <div className={styles.time}>
                    {moment(item.requestAt).utc().format('HH:mm:ss')}
                  </div>
                </Stack>
              </TableCell>
              <TableCell
                align="center"
                style={{
                  textTransform: 'capitalize',
                }}
              >
                {item.rewardStatus}
              </TableCell>
              <TableCell sx={{ width: '180px' }}>
                <Stack alignItems="flex-end">
                  <div>
                    {moment(item.unlockTimeAt)
                      .utc()
                      .format('(UTC) MMM DD, YYYY')}
                  </div>
                  <div className={styles.time}>
                    {moment(item.unlockTimeAt).utc().format('HH:mm:ss')}
                  </div>
                </Stack>
              </TableCell>
            </TableRow>
          </Fragment>
        ))
      ) : (
        <TableRow>
          <TableCell colSpan={5} className={styles.noItems}>
            <Stack alignItems="center" gap="16px">
              <History />
              <div>No Reward Data</div>
            </Stack>
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  </Table>
);

export default RewardTable;
