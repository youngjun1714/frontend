import { Fragment, useEffect, useState } from 'react';
import {
  Modal,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@mui/material';
import { gql, useLazyQuery } from '@apollo/client';

import styles from './Modal.module.scss';
import ArrowIcon from '@/components/ui/Icons/ArrowIcon';
import Close from '@/components/ui/Icons/Close';
import Episode from '@/components/ui/Icons/Episode';
import ArrowDown from '@/components/ui/Icons/ArrowDown';
import moment from 'moment';

const GET_PREVIOUS_EPISODE_INFOS = gql`
  query getPrevEpisodeInfos($currentPage: Int, $take: Int) {
    getPrevEpisodeInfos(currentPage: $currentPage, take: $take) {
      pageInfo {
        totalCount
        take
        currentPage
      }
      seedEpisodeInfos {
        episodeNo
        startTimeAt
        endTimeAt
        isLiveEpisode
      }
    }
  }
`;

const TAKE = 8;

function SelectEpisodeModal(props) {
  const { open, onClose, onChangeEpisodeNo, liveEpisodeNo } = props;
  const [list, setList] = useState([]);

  const [getPrevious, { data }] = useLazyQuery(GET_PREVIOUS_EPISODE_INFOS, {
    fetchPolicy: 'cache-and-network',
    context: { clientName: 'seed' },
  });

  const { getPrevEpisodeInfos } = data || {};
  const { pageInfo, seedEpisodeInfos } = getPrevEpisodeInfos || {};

  const handleGetMoreEpisodes = () => {
    if (list?.length < pageInfo.totalCount) {
      getPrevious({
        variables: {
          take: TAKE,
          currentPage: pageInfo?.currentPage + 1,
        },
      });
    }
  };

  const handleClickEpisode = (episodeNo) => {
    onChangeEpisodeNo(episodeNo);
    onClose();
  };

  const handleSelectLiveEpisode = () => {
    onChangeEpisodeNo(liveEpisodeNo);
    onClose();
  };

  useEffect(() => {
    if (open)
      getPrevious({
        variables: {
          take: TAKE,
        },
      });
  }, [open, getPrevious]);

  useEffect(() => {
    if (seedEpisodeInfos?.length) setList(seedEpisodeInfos);
  }, [seedEpisodeInfos]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
    >
      <div className={styles.modalContainer}>
        <div className={styles.modalHeader}>
          <div className={styles.headerTitle}>
            <div>Previous Episodes</div>
            <button
              className={styles.goToLiveButton}
              onClick={handleSelectLiveEpisode}
            >
              Go to Live Seeding
              <ArrowIcon />
            </button>
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
          <div className={styles.tableWrap}>
            <Table className={styles.selectEpisodeTable}>
              <TableBody>
                {list?.map((item, idx) => (
                  <Fragment key={`episode-${idx}`}>
                    <TableRow
                      hover
                      onClick={() => handleClickEpisode(item.episodeNo)}
                    >
                      <TableCell>
                        <Stack direction="row" alignItems="center">
                          <Episode color="var(--artiside-neutral2)" />
                          Episode {item.episodeNo}
                        </Stack>
                      </TableCell>
                      <TableCell>
                        (UTC){' '}
                        {moment(item.startTimeAt).utc().format('MMM DD, YYYY')}{' '}
                        - {moment(item.endTimeAt).utc().format('MMM DD, YYYY')}
                      </TableCell>
                      <TableCell>
                        {!item.isLiveEpisode && (
                          <div className={styles.closedChip}>Closed</div>
                        )}
                      </TableCell>
                    </TableRow>
                  </Fragment>
                ))}
              </TableBody>
            </Table>
          </div>
          {list?.length < pageInfo?.totalCount ? (
            <button
              className={styles.moreButton}
              onClick={handleGetMoreEpisodes}
            >
              More <ArrowDown />
            </button>
          ) : (
            <div style={{ height: 48, marginTop: 16 }} />
          )}
        </div>
      </div>
    </Modal>
  );
}

export default SelectEpisodeModal;
