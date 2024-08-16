import { useMemo, useState } from 'react';
import styles from './index.module.scss';
import VotingCard from './VotingCard';
import useOpen from '@/hooks/useOpen';
import { customToast } from '@/utils/customToast';
import dynamic from 'next/dynamic';
import useLaunchpad from '@/hooks/useLaunchpad';
import useCheckConnected from '@/hooks/useCheckConnected';
import EmptyVotingCard from './EmptyVotingCard';

const ImageDetail = dynamic(() =>
  import('@/components/ui/ImageDetail/ImageDetail')
);
const VoteModal = dynamic(() => import('../modals/VoteModal'));
const VoteConfirmModal = dynamic(() => import('../modals/VoteConfirmModal'));

const VotingBoard = ({
  onRefetch,
  myVotingInfo,
  roundNo,
  launchpadPartnerInfos,
  hideVoteBtn,
}) => {
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [voteModalOpen, handleOpenVoteModal, handleCloseVoteModal] = useOpen();
  const [confirmModalOpen, handleOpenConfirmModal, handleCloseConfirmModal] =
    useOpen();

  // View image detail
  const [artworkModalOpen, handleOpenArtworkModal, handleCloseArtworkModal] =
    useOpen();
  const [selectedArtwork, setSelectedArtwork] = useState(null);

  const handleSelectPicture = (artwork) => {
    if (!artwork) return;
    setSelectedArtwork(artwork);
    handleOpenArtworkModal();
  };

  const handleClickVoteBtn = (artist) => {
    setSelectedArtist(artist);
    handleOpenVoteModal();
  };

  const handleOpenVoteConfirm = () => {
    if (!amount || !availableVp || availableVp < amount) return;
    handleOpenConfirmModal();
  };

  const { voting } = useLaunchpad();

  const [loading, setLoading] = useState(false);

  const availableVp = useMemo(
    () => (myVotingInfo ? myVotingInfo?.totalVp - myVotingInfo?.spentVp : 0),
    [myVotingInfo]
  );

  const [amount, setAmount] = useState();

  const handleVote = async () => {
    handleCloseConfirmModal();
    setLoading(true);
    try {
      await voting({
        artistWallet: selectedArtist?.artistWallet,
        amount,
      });
      setLoading(false);
      setSelectedArtist(null);
      setAmount(0);
      handleCloseVoteModal();
      customToast({
        msg: <>Voting has been successfully activated</>,
        autoClose: 2000,
      });
      onRefetch && onRefetch();
    } catch (error) {
      console.log(error);
      setLoading(false);
      customToast({
        msg: <>Voting Failed</>,
        toastType: 'error',
        autoClose: 1000,
      });
    }
  };

  const handleCheckConnected = useCheckConnected();

  const handleCheckAndOpenModal = (artist) => {
    handleCheckConnected(() => handleClickVoteBtn(artist));
  };

  const TOTAL_ARTIST_COUNT = 3;
  const emptyImages = useMemo(() => {
    const arr = new Array(
      TOTAL_ARTIST_COUNT -
        (launchpadPartnerInfos && launchpadPartnerInfos?.length
          ? launchpadPartnerInfos?.length
          : 0)
    ).fill(1);
    return arr;
  }, [launchpadPartnerInfos]);

  return (
    <div className={styles.votingBoard}>
      <div className={styles.title}>Artist Pool</div>
      <div className={styles.votingCardWrap}>
        {launchpadPartnerInfos?.map((item) => (
          <VotingCard
            artist={item}
            key={item.partnerId}
            onSelectArtwork={handleSelectPicture}
            onClickVoteBtn={() => handleCheckAndOpenModal(item)}
            hideVoteBtn={hideVoteBtn}
          />
        ))}
        {launchpadPartnerInfos?.length < TOTAL_ARTIST_COUNT ? (
          emptyImages?.map((item, index) => <EmptyVotingCard key={index} />)
        ) : (
          <></>
        )}
      </div>
      {artworkModalOpen && (
        <ImageDetail
          open={artworkModalOpen}
          onClose={handleCloseArtworkModal}
          title={selectedArtwork?.title}
          imageUrl={selectedArtwork?.artworkUrl}
          mediaType={selectedArtwork?.mediaType}
        />
      )}
      {voteModalOpen && (
        <VoteModal
          open={voteModalOpen}
          onClose={handleCloseVoteModal}
          onOpenVoteConfirm={handleOpenVoteConfirm}
          selectedArtist={{
            ...selectedArtist,
            promotionThumbnailUrl:
              selectedArtist.candidatePartnerInfo.promotionThumbnailUrl,
          }}
          loading={loading}
          amount={amount}
          onChangeAmount={setAmount}
          availableVp={availableVp}
          roundNo={roundNo}
        />
      )}
      {confirmModalOpen && (
        <VoteConfirmModal
          open={confirmModalOpen}
          onClose={handleCloseConfirmModal}
          onVote={handleVote}
        />
      )}
    </div>
  );
};

export default VotingBoard;
