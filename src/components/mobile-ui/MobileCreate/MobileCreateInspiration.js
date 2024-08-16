import { useState, useRef } from 'react';
import styles from './MobileCreateInspiration.module.scss';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Controller } from 'swiper/modules';

import { TextareaAutosize } from '@mui/material';

import ImageDetails from '@/components/ui/ImageDetail/ImageDetails';
import Picture from '@/components/ui/Picture/Picture';

const MobileCreateInspiration = (props) => {
  const { images, title, contents, onChangeTitle, onChangeDesc } = props;

  const titleRef = useRef(null);

  const [isTitleFocus, setIsTitleFocus] = useState(false);

  const [detailOpen, setDetailOpen] = useState(false);

  const renderPreviewImages = () =>
    images?.map((image, i) => (
      <SwiperSlide key={i}>
        <div onClick={() => setDetailOpen(true)} style={{ cursor: 'zoom-in' }}>
          <Picture
            url={image}
            objectFit="cover"
            alt="preview"
            style={{ borderRadius: '10px' }}
          />
        </div>
      </SwiperSlide>
    ));

  return (
    <section className={styles.section}>
      <article style={{ width: '100%' }}>
        <div className={styles.image} style={{ aspectRatio: 1 / 1 }}>
          <Swiper
            slidesPerView={1}
            spaceBetween={30}
            loop={false}
            pagination={{ clickable: true }}
            navigation={true}
            modules={[Pagination, Navigation, Controller]}
            className="mySwiper"
          >
            {renderPreviewImages()}
          </Swiper>
          <ImageDetails
            imageUrls={images}
            open={detailOpen}
            onClose={() => setDetailOpen(false)}
          />
        </div>
      </article>

      <article className={styles.contents}>
        <div className={styles.title}>
          <div
            className={styles.input}
            style={{
              borderBottom:
                title?.length < 4
                  ? '1px solid var(--secondary-color)'
                  : isTitleFocus
                  ? '1px solid var(--artiside-neutral1)'
                  : '1px solid var(--artiside-neutral5)',
            }}
          >
            <input
              placeholder="Title"
              value={title}
              onChange={onChangeTitle}
              ref={titleRef}
              onFocus={() => setIsTitleFocus(true)}
              onBlur={() => setIsTitleFocus(false)}
            />
            <p className={styles.count}>
              {title?.length}
              <span>/50</span>
            </p>
          </div>
          {title?.length < 4 && (
            <p className={styles.error}>Enter title, more than character.</p>
          )}
        </div>

        <div className={styles.description}>
          <TextareaAutosize
            placeholder="Describe your inspiration..."
            onChange={onChangeDesc}
            value={contents}
            maxRows={18}
            spellCheck={false}
          />
          <p className={styles.count}>
            {contents?.length}
            <span>/1,000</span>
          </p>
        </div>
      </article>
    </section>
  );
};

export default MobileCreateInspiration;
