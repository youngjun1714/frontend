import React, { Fragment } from 'react';
import { Stack, Table, TableBody, TableCell, TableRow } from '@mui/material';
import Avatar from '@/components/ui/Avatar/Avatar';
import styles from './Table.module.scss';
import Link from 'next/link';

const NextEpisodeTable = (props) => {
  const { items } = props;
  return (
    <Table className={styles.table}>
      <TableBody>
        {items?.map((item, idx) => (
          <Fragment key={`next-${idx}`}>
            <TableRow>
              <TableCell>
                <Link href={`/artist/${item.partnerUserId}?list=artworks`}>
                  <Stack direction="row" alignItems="center">
                    <Avatar
                      image={item.profileImgUrl}
                      username={item.userName}
                      type="md"
                    />
                    <Stack ml="12px">
                      <div>{item.userName}</div>
                      <div className={styles.artistName}>
                        @{item.artistName}
                      </div>
                    </Stack>
                  </Stack>
                </Link>
              </TableCell>
              <TableCell className={styles.nextEpisode} align="right">
                Coming up next episode
              </TableCell>
            </TableRow>
          </Fragment>
        ))}
      </TableBody>
    </Table>
  );
};

export default NextEpisodeTable;
