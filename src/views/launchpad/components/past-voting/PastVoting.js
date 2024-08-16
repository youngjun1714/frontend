import styles from './PastVoting.module.scss';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Controller, Autoplay } from 'swiper/modules';
import moment from 'moment';
import { Stack } from '@mui/material';
import Avatar from '@/components/ui/Avatar/Avatar';
import Picture from '@/components/ui/Picture/Picture';
import Verified from '@/components/ui/Icons/Verified';
import numberFormat from '@/utils/numberFormat';

const PastVoting = ({ winners }) => (
  <div>
    <div className={styles.title}>Past Voting</div>
    <Swiper
      className={styles.pastVotingSwiper}
      slidesPerView={1}
      loop
      navigation={true}
      modules={[Navigation, Controller, Autoplay]}
      autoplay={{
        delay: 5000,
        disableOnInteraction: false,
      }}
    >
      {winners?.map((winner) => (
        <SwiperSlide className={styles.pastVotingSlide} key={winner.partnerId}>
          <div className={styles.roundInfo}>
            <div className={styles.completed}>Completed</div>
            <div className={styles.roundNo}>
              Round {winner.launchpadRoundInfo?.roundNo}
            </div>
            <div className={styles.endDate}>
              End Date :{' '}
              {moment(winner.launchpadRoundInfo?.endTimeAt)
                .utc()
                .format('(UTC) MM DD, YYYY')}
            </div>
          </div>
          <div className={styles.artistInfo}>
            <Stack direction="row" alignItems="center">
              <Avatar
                image={winner.profileImgUrl}
                username={winner.nickname}
                type="lg"
              />
              <div className={styles.nameWrap}>
                <Stack direction="row" alignItems="center">
                  <div className={styles.userName}>{winner.nickname}</div>
                  <Verified />
                </Stack>
                <div className={styles.artistName}>@{winner.artistName}</div>
              </div>
            </Stack>
            <div className={styles.shortBio}>
              {winner.intro}
              <div className={styles.totalVP}>
                Total VP Received
                <b>{numberFormat(winner.accumVp, 0)}</b>
              </div>
            </div>
          </div>
          <div className={styles.artwork}>
            <Picture
              url={winner?.candidatePartnerInfo?.promotionThumbnailUrl}
              objectFit="cover"
              loading="lazy"
              placeholder="blur"
              alt={winner.nickname}
              blurDataURL="data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFklEQVR42mN8//HLfwYiAOOoQvoqBABbWyZJf74GZgAAAABJRU5ErkJggg=="
              sizes="504px"
              style={{ objectFit: 'cover' }}
              fill={true}
            />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  </div>
);

export default PastVoting;
