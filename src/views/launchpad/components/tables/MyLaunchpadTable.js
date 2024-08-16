import React, { Fragment, useMemo, useState } from 'react';
import {
  CircularProgress,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import { gql, useLazyQuery } from '@apollo/client';

import Avatar from '@/components/ui/Avatar/Avatar';
import styles from './Table.module.scss';
import Link from 'next/link';
import numberFormat from '@/utils/numberFormat';
import History from '@/components/ui/Icons/History';
import CheckSquare from '@/components/ui/Icons/CheckSquare';
import useOpen from '@/hooks/useOpen';
import { customToast } from '@/utils/customToast';
import dynamic from 'next/dynamic';
import useLaunchpad from '@/hooks/useLaunchpad';
import Trophy from '@/components/ui/Icons/Trophy';

const VoteModal = dynamic(() => import('../modals/VoteModal'));
const VoteConfirmModal = dynamic(() => import('../modals/VoteConfirmModal'));

const GET_VOTING_INFO = gql`
  query getVotingInfo {
    getVotingInfo {
      spentVp
      totalVp
    }
  }
`;

const MyLaunchpadTable = ({
  items,
  loading,
  isLiveRound,
  disableVoting,
  onRefetch,
  selectedRoundNo,
}) => {
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [voteModalOpen, handleOpenVoteModal, handleCloseVoteModal] = useOpen();
  const [confirmModalOpen, handleOpenConfirmModal, handleCloseConfirmModal] =
    useOpen();

  const [votingLoading, setVotingLoading] = useState(false);
  const [amount, setAmount] = useState();

  const [getMyVotingInfo, { data: myVotingInfoData }] = useLazyQuery(
    GET_VOTING_INFO,
    {
      fetchPolicy: 'network-only',
      context: { clientName: 'launchpad' },
    }
  );

  const { getVotingInfo } = myVotingInfoData || {};

  const availableVp = useMemo(
    () => (getVotingInfo ? getVotingInfo?.totalVp - getVotingInfo?.spentVp : 0),
    [getVotingInfo]
  );

  const handleClickVoteBtn = (artist) => {
    setSelectedArtist(artist);
    getMyVotingInfo();
    handleOpenVoteModal();
  };

  const handleOpenVoteConfirm = () => {
    if (!amount || !availableVp || availableVp < amount) return;
    handleOpenConfirmModal();
  };

  const { voting } = useLaunchpad();

  const handleVote = async () => {
    handleCloseConfirmModal();
    setVotingLoading(true);
    try {
      await voting({
        artistWallet: selectedArtist?.launchpadPartnerInfo?.artistWallet,
        amount,
      });
      setVotingLoading(false);
      setSelectedArtist(null);
      setAmount(0);
      handleCloseVoteModal();
      customToast({
        msg: <>Voting has been successfully activated</>,
        autoClose: 2000,
      });
      getMyVotingInfo();
      onRefetch();
    } catch (error) {
      console.log(error);
      setVotingLoading(false);
      customToast({
        msg: <>Voting Failed</>,
        toastType: 'error',
        autoClose: 1000,
      });
    }
  };

  return (
    <>
      <Table className={styles.table}>
        <TableHead>
          <TableRow>
            <TableCell>Artists</TableCell>
            <TableCell>VP</TableCell>
            {isLiveRound ? <></> : <TableCell>Result</TableCell>}
            <TableCell align={isLiveRound ? 'right' : 'center'}>
              {isLiveRound ? '' : 'Voting Reward'}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading && !items?.length ? (
            <TableRow>
              <TableCell
                colSpan={isLiveRound ? 3 : 4}
                className={styles.noItems}
              >
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
            items?.map((item) => (
              <Fragment key={`my-voting-row-${item.userName}`}>
                <TableRow hover>
                  <TableCell>
                    <Link
                      href={`/artist/${item?.launchpadPartnerInfo?.userId}?list=artworks`}
                    >
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

                  <TableCell>{numberFormat(item.spentVp, 0)}</TableCell>
                  {isLiveRound ? (
                    <></>
                  ) : (
                    <TableCell>
                      {item.result ? (
                        <span className={styles.selected}>
                          <Trophy /> Selected
                        </span>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                  )}

                  <TableCell
                    align={isLiveRound ? 'right' : 'center'}
                    className={styles.votingReward}
                  >
                    {isLiveRound ? (
                      <button
                        className={styles.voteBtn}
                        onClick={() => {
                          handleClickVoteBtn(item);
                        }}
                        disabled={disableVoting}
                      >
                        <CheckSquare /> Vote
                      </button>
                    ) : item.rewardAmtByVp ? (
                      <span>{numberFormat(item.rewardAmtByVp, 5)}</span>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                </TableRow>
              </Fragment>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={isLiveRound ? 3 : 4}
                className={styles.noItems}
              >
                <Stack alignItems="center" gap="16px">
                  <History />
                  <div>You don&apos;t have any voting history.</div>
                </Stack>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {voteModalOpen && (
        <VoteModal
          open={voteModalOpen}
          onClose={handleCloseVoteModal}
          onOpenVoteConfirm={handleOpenVoteConfirm}
          selectedArtist={{
            ...selectedArtist,
            nickname: selectedArtist.userName,
          }}
          loading={votingLoading}
          amount={amount}
          onChangeAmount={setAmount}
          availableVp={availableVp}
          roundNo={selectedRoundNo}
        />
      )}
      {confirmModalOpen && (
        <VoteConfirmModal
          open={confirmModalOpen}
          onClose={handleCloseConfirmModal}
          onVote={handleVote}
        />
      )}
    </>
  );
};

export default MyLaunchpadTable;
