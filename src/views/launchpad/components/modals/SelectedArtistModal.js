import { Fragment } from 'react';
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

import styles from './Modal.module.scss';
import Close from '@/components/ui/Icons/Close';
import Avatar from '@/components/ui/Avatar/Avatar';
import numberFormat from '@/utils/numberFormat';
import Episode from '@/components/ui/Icons/Episode';

const SelectedArtistModal = ({ open, onClose, winners }) => (
  <Modal
    open={open}
    onClose={onClose}
    sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
  >
    <div className={styles.modalContainer}>
      <div className={styles.modalHeader}>
        <div className={styles.headerTitle}>
          Selected Artists from Previous Votings
        </div>
        <button
          aria-label="close button"
          className={styles.closeButton}
          onClick={onClose}
        >
          <Close />
        </button>
      </div>
      <div className={styles.selectedArtist}>
        <div className={styles.fixedHeadTable}>
          <TableContainer sx={{ maxHeight: 400 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Stack direction="row" alignItems="center">
                      <Episode color="var(--artiside-neutral2)" />
                      Round
                    </Stack>
                  </TableCell>
                  <TableCell>Artist</TableCell>
                  <TableCell align="right">Total VP Received</TableCell>
                  <TableCell align="right">Total Reward for Voters</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {winners && winners?.length !== 0 ? (
                  winners?.map((item, idx) => (
                    <Fragment key={`request-reward-row-${idx}`}>
                      <TableRow hover>
                        <TableCell>
                          <Stack
                            direction="row"
                            alignItems="center"
                            gap="8px"
                            style={{ fontSize: 14 }}
                          >
                            <Episode color="var(--artiside-neutral2)" />
                            Round {item.launchpadRoundInfo?.roundNo}
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" alignItems="center" gap="8px">
                            <Avatar
                              type="sm"
                              image={item.profileImgUrl}
                              username={item.nickname}
                            />
                            <div>
                              <div>{item.nickname}</div>
                              <span style={{ fontSize: 14 }}>
                                @{item.artistName}
                              </span>
                            </div>
                          </Stack>
                        </TableCell>
                        <TableCell align="right">
                          {numberFormat(item.accumVp, 2)}
                          <span> VP</span>
                        </TableCell>
                        <TableCell align="right">
                          {numberFormat(item.rewardAmtByVp, 2)}
                          <span> ADF</span>
                        </TableCell>
                      </TableRow>
                    </Fragment>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className={styles.noHistory}>
                      <Stack alignItems="center" gap="16px">
                        <div>No Votings</div>
                      </Stack>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </div>
  </Modal>
);

export default SelectedArtistModal;
