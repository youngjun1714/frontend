import styles from './ImageDetails.module.scss';

import { Modal } from '@mui/material';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';

import Close from '../Icons/Close';
import Picture from '../Picture/Picture';

function ImageDetails(props) {
  const { open, onClose, imageUrls } = props;

  const renderImages = () =>
    imageUrls?.map((image, i) => (
      <SwiperSlide key={i}>
        <Picture
          url={image}
          objectFit="contain"
          alt="image"
          sizes="(max-width: 768px) 100vw, 30vw"
          loading="eager"
        />
      </SwiperSlide>
    ));
  return (
    <Modal
      onClose={onClose}
      open={open}
      sx={{
        backdropFilter: 'blur(5px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1550,
      }}
    >
      <>
        <button
          style={{ position: 'absolute', top: 16, right: 16, zIndex: 2 }}
          onClick={onClose}
          aria-label="close"
        >
          <Close color="white" />
        </button>
        <div
          className={styles.imageWrapper}
          style={{
            width: '100%',
            height: '100%',
          }}
        >
          <Swiper
            style={{ maxWidth: '826px' }}
            slidesPerView={1}
            spaceBetween={30}
            loop={true}
            pagination={{
              clickable: true,
            }}
            navigation={true}
            modules={[Pagination, Navigation]}
            className="mySwiper"
          >
            {renderImages()}
          </Swiper>
        </div>
      </>
    </Modal>
  );
}
export default ImageDetails;
