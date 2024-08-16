import { Fragment, useEffect } from 'react';
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

import Close from '@/components/ui/Icons/Close';
import Avatar from '@/components/ui/Avatar/Avatar';
import styles from './Modal.module.scss';
import SeedingGroupChip from '@/components/ui/SeedingGroupChip/SeedingGroupChip';
import numberFormat from '@/utils/numberFormat';
import InfoTypography from '@/components/ui/Typography/InfoTypography';

const GET_ARTIST_SEED_HISTORY = gql`
  query getArtistSeedHistory($partnerId: Long, $currentPage: Int, $take: Int) {
    getArtistSeedHistory(
      partnerId: $partnerId
      currentPage: $currentPage
      take: $take
    ) {
      pageInfo {
        totalCount
        take
        currentPage
      }
      totalEpisodes
      averageSeed
      userName
      artistName
      profileImgUrl
      partners {
        seeders
        seed
        group
        episodeNo
        partnerId
      }
    }
  }
`;

function ArtistSeedHistoryModal(props) {
  const { open, onClose, partnerId } = props;

  const [getArtistSeedHistoryQuery, { data }] = useLazyQuery(
    GET_ARTIST_SEED_HISTORY,
    {
      fetchPolicy: 'cache-and-network',
      context: { clientName: 'seed' },
    }
  );
  const { getArtistSeedHistory } = data || {};

  const {
    totalEpisodes,
    averageSeed,
    userName,
    artistName,
    profileImgUrl,
    partners: episodeHistory,
  } = getArtistSeedHistory || {};

  useEffect(() => {
    if (open) {
      getArtistSeedHistoryQuery({
        variables: {
          partnerId,
          take: 100,
        },
      });
    }
  }, [open]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
    >
      <div className={styles.modalContainer}>
        <div className={styles.modalHeader}>
          <div className={styles.headerTitle}>Artist Seed History</div>
          <button
            aria-label="close button"
            className={styles.close}
            onClick={onClose}
          >
            <Close />
          </button>
        </div>
        <div className={styles.modalBody}>
          <div className={styles.seedStat}>
            <div className={styles.statItem}>
              <div className={styles.label}>Artist</div>
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
              <div className={styles.label}>Total Episodes</div>
              <div className={styles.value} style={{ marginBottom: 24 }}>
                {numberFormat(totalEpisodes, 0)}
              </div>
              <div className={styles.label}>Average Seed</div>
              <div className={styles.value}>
                <InfoTypography
                  content={averageSeed}
                  decimals={2}
                  size="xs"
                  align="left"
                />
              </div>
            </div>
          </div>
          <div className={styles.thickLine} />
          <div className={styles.fixedHeadTable}>
            <TableContainer sx={{ maxHeight: 400 }}>
              <Table stickyHeader className={styles.artistSeedHistoryTable}>
                <TableHead>
                  <TableRow>
                    <TableCell>Episodes</TableCell>
                    <TableCell align="right">Seeders</TableCell>
                    <TableCell align="right">
                      Seed <span className={styles.adf}>ADF</span>
                    </TableCell>
                    <TableCell align="center">Group</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {episodeHistory?.map((item, idx) => (
                    <Fragment key={`artist-seed-history-row-${idx}`}>
                      <TableRow hover>
                        <TableCell>Episode {item.episodeNo}</TableCell>
                        <TableCell align="right">
                          {numberFormat(item.seeders, 0)}
                        </TableCell>
                        <TableCell align="right">
                          {numberFormat(item.seed, 2)}
                        </TableCell>
                        <TableCell align="center">
                          <SeedingGroupChip group={item.group} />
                        </TableCell>
                      </TableRow>
                    </Fragment>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default ArtistSeedHistoryModal;
