import { useState, useRef, useEffect } from 'react';
import styles from './MobileUpdatePost.module.scss';
import { useRouter } from 'next/router';
import { gql, useMutation } from '@apollo/client';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Controller } from 'swiper/modules';

import { Drawer, TextareaAutosize } from '@mui/material';

import MobileDrawerContainer from '../MobileDrawer/MobileDrawerContainer';
import ImageDetails from '@/components/ui/ImageDetail/ImageDetails';
import Picture from '@/components/ui/Picture/Picture';

const UPDATE_POST = gql`
  mutation updatePost($postId: ID!, $input: UpdatePostInput!) {
    updatePost(postId: $postId, input: $input) {
      id
    }
  }
`;

const TITLE_MIN_LENGTH = 4;
const TITLE_MAX_LENGTH = 50;
const DESCRIPTION_MAX_LENGTH = 1000;

const MobileUpdatePost = (props) => {
  const { open, onClose, data } = props;

  const router = useRouter();

  const [updateData, setUpdateData] = useState({
    title: data?.title,
    description: data?.description,
    images: data?.images,
  });

  const [isValid, setIsValid] = useState({
    title: false,
    description: false,
  });

  const [controlledSwiper, setControlledSwiper] = useState(null);

  const swiperRef = useRef(null);
  const titleRef = useRef(null);
  const descRef = useRef(null);

  const [isFocus, setIsFocus] = useState([false, false]);

  const handleFocus = (index) => () => {
    const updatedFocus = [...isFocus];
    updatedFocus[index] = true;
    setIsFocus(updatedFocus);
  };

  const handleBlur = (index) => () => {
    const updatedFocus = [...isFocus];
    updatedFocus[index] = false;
    setIsFocus(updatedFocus);
  };

  useEffect(() => {
    setUpdateData({
      title: data?.title,
      description: data?.description,
      images: data?.images,
    });
  }, [data]);

  useEffect(() => {
    // title validation
    if (
      updateData?.title?.length >= TITLE_MIN_LENGTH &&
      updateData?.title?.length <= TITLE_MAX_LENGTH
    ) {
      setIsValid((prev) => ({
        ...prev,
        title: true,
      }));
    } else {
      setIsValid((prev) => ({
        ...prev,
        title: false,
      }));
    }

    // subscription validation
    if (updateData?.description?.length <= DESCRIPTION_MAX_LENGTH) {
      setIsValid((prev) => ({
        ...prev,
        description: true,
      }));
    } else {
      setIsValid((prev) => ({
        ...prev,
        title: false,
      }));
    }
  }, [updateData]);

  const handleChangeTitle = (e) => {
    if (e.target.value.length > 3 && e.target.value.length <= 50) {
      setIsValid(true);
    }
    if (e.target.value.length > TITLE_MAX_LENGTH) {
      e.target.value = e.target.value.slice(0, TITLE_MAX_LENGTH);
    }
    const removeBlank = e.target.value.replace(/ {2,}/g, ' ');
    setUpdateData((prevData) => ({
      ...prevData,
      title: removeBlank,
    }));
  };

  const handleChangeDesc = (e) => {
    if (e.target.value.length > DESCRIPTION_MAX_LENGTH) {
      e.target.value = e.target.value.slice(0, DESCRIPTION_MAX_LENGTH);
    }
    setUpdateData((prevData) => ({
      ...prevData,
      description: e.target.value,
    }));
  };

  const [submit, { loading }] = useMutation(UPDATE_POST, {
    refetchQueries: ['getPost'],
  });
  const handleSubmit = async () => {
    try {
      await submit({
        variables: {
          postId: data.id,
          input: {
            title: updateData.title,
            description: updateData.description,
            images: updateData.images,
            mainImage: updateData.images[0],
          },
        },
      });
      router.push(`/inspiration/${data.id}`);
    } catch (e) {
      console.error(e);
    }
  };

  const [detailOpen, setDetailOpen] = useState(false);

  const renderPreviewImages = () =>
    updateData?.images?.map((image, i) => (
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
    <Drawer
      sx={{
        backdropFilter: 'blur(6px)',
        '@media (min-width: 1023px)': {
          display: 'none',
        },
        '&': {
          zIndex: 1500,
        },
        '& > .MuiPaper-root': {
          backgroundColor: 'transparent',
        },
      }}
      transitionDuration={200}
      anchor="bottom"
      open={open}
      onClose={onClose}
    >
      <MobileDrawerContainer
        type="long"
        title="Inspiration"
        onClose={onClose}
        onSubmit={() => {
          handleSubmit();
          onClose();
        }}
        disabled={!isValid.title && isValid.description}
      >
        <section className={styles.section}>
          <article style={{ width: '100%' }}>
            <div className={styles.image} style={{ aspectRatio: 1 / 1 }}>
              <Swiper
                controller={{ control: controlledSwiper }}
                onSwiper={setControlledSwiper}
                ref={swiperRef}
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
                imageUrls={updateData?.images}
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
                    updateData?.title?.length < 4
                      ? '1px solid var(--secondary-color)'
                      : isFocus[0]
                      ? '1px solid var(--artiside-neutral1)'
                      : '1px solid var(--artiside-neutral5)',
                }}
              >
                <input
                  placeholder="Title"
                  value={updateData?.title}
                  onChange={handleChangeTitle}
                  ref={titleRef}
                  onFocus={handleFocus(0)}
                  onBlur={handleBlur(0)}
                />
                <p className={styles.count}>
                  {updateData?.title?.length}
                  <span>/50</span>
                </p>
              </div>
              {updateData?.title?.length < 4 && (
                <p className={styles.error}>
                  Enter title, more than character.
                </p>
              )}
            </div>

            <div className={styles.description}>
              <TextareaAutosize
                placeholder="Describe your inspiration..."
                onChange={handleChangeDesc}
                value={updateData?.description}
                maxRows={18}
                spellCheck={false}
                ref={descRef}
              />
              <p className={styles.count}>
                {updateData?.description?.length}
                <span>/1,000</span>
              </p>
            </div>
          </article>
        </section>
      </MobileDrawerContainer>
    </Drawer>
  );
};

export default MobileUpdatePost;
