import React, { Fragment } from 'react';
import {
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
} from '@mui/material';
import moment from 'moment';
import styles from './Table.module.scss';
import AcitivityLabel from '@/views/seeding/components/activity-label/AcitivityLabel';
import numberFormat from '@/utils/numberFormat';
import { getExplorerUrlByHash, getShortAddress } from '@/utils/contractUtil';
import Link from 'next/link';
import History from '@/components/ui/Icons/History';
import GuideButton from '@/components/ui/Button/GuideButton';

const HistoryTable = (props) => {
  const { items } = props;
  return (
    <Table className={styles.table}>
      <TableHead>
        <TableRow>
          <TableCell>Activities</TableCell>
          <TableCell
            align="right"
            sx={{ width: '300px', paddingRight: '180px !important' }}
          >
            <Stack direction="row" alignItems="center" gap={'2px'}>
              Amount <span className={styles.adf}>ADF</span>
              <Tooltip
                title={
                  <>Only amounts up to 4 decimal places will be indicated</>
                }
                placement="top"
                arrow
              >
                <span>
                  <GuideButton />
                </span>
              </Tooltip>
            </Stack>
          </TableCell>
          <TableCell>TxID</TableCell>
          <TableCell>Status</TableCell>
          <TableCell align="right" sx={{ width: '180px' }}>
            Date
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {items && items.length ? (
          items?.map((item) => (
            <Fragment key={`${item.event} ${item.createdAt}`}>
              <TableRow hover key={item.title}>
                <TableCell>
                  <AcitivityLabel type={item.event} />
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ width: '300px', paddingRight: '180px !important' }}
                >
                  {numberFormat(
                    item.amt,
                    item.event === 'SEEDING' || item.event === 'UNSEEDING'
                      ? 2
                      : 5
                  )}
                </TableCell>
                <TableCell>
                  <Link
                    target="_blank"
                    href={getExplorerUrlByHash(item.txHash)}
                  >
                    {getShortAddress(item.txHash)}
                  </Link>
                </TableCell>
                <TableCell>
                  <span
                    className={
                      item.status === 'Completed' ? styles.completed : null
                    }
                  >
                    {item.status}
                  </span>
                </TableCell>
                <TableCell sx={{ width: '150px' }}>
                  <Stack alignItems="flex-end">
                    <div>
                      {moment(item.createdAt)
                        .utc()
                        .format('(UTC) MMM DD, YYYY')}
                    </div>
                    <div className={styles.time}>
                      {moment(item.createdAt).utc().format('HH:mm:ss')}
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
                <div>No History Yet</div>
              </Stack>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default HistoryTable;
