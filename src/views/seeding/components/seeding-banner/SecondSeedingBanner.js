import Image from 'next/image';
import styles from './SeedingBanner.module.scss';
import Link from 'next/link';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Controller, Autoplay } from 'swiper/modules';
import { CircularProgress } from '@mui/material';

const BannerImage = ({ img, priority }) => (
  <Image src={img} alt="banner" fill sizes="253px" priority={priority} />
);

const SecondSeedingBanner = ({ banners, loading }) => {
  if (!banners?.length || loading)
    return (
      <div className={styles.loadingDiv}>
        <CircularProgress
          sx={{
            color: 'var(--primary-color)',
          }}
        />
      </div>
    );

  return (
    <div className={styles.secondBanner}>
      <Swiper
        className="banner-slide"
        slidesPerView={1}
        loop
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Pagination, Navigation, Controller, Autoplay]}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
      >
        {banners?.map((banner, idx) => {
          const { link, imageUrl, bannerId } = banner;
          return (
            <SwiperSlide key={bannerId}>
              {link ? (
                <Link
                  aria-label="go to banner link"
                  href={link}
                  target="_blank"
                >
                  <BannerImage img={imageUrl} priority={!idx} />
                </Link>
              ) : (
                <BannerImage img={imageUrl} priority={!idx} />
              )}
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default SecondSeedingBanner;
