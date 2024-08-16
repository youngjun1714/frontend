import { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import { gql, useLazyQuery, useMutation } from '@apollo/client';
import styles from './UpdatePopup.module.scss';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Controller } from 'swiper/modules';

import {
  CircularProgress,
  Unstable_Grid2 as Grid,
  Modal,
  TextareaAutosize,
} from '@mui/material';

import { customToast } from '@/utils/customToast';
import Delete from '../../Icons/Delete';
import Add from '../../Icons/Add';
import Close from '../../Icons/Close';
import Picture from '../../Picture/Picture';

const UPDATE_POST = gql`
  mutation updatePost($postId: ID!, $input: UpdatePostInput!) {
    updatePost(postId: $postId, input: $input) {
      id
    }
  }
`;

const GET_S3URL = gql`
  query getS3Url($ext: String!) {
    getS3Url(ext: $ext) {
      key
      mimeType
    }
  }
`;

const mimeType = ['png', 'jpg', 'jpeg', 'gif', 'svg'];

function UpdatePopup(props) {
  const [isError, setIsError] = useState(false);
  const { data, onClose, refetch, open } = props;

  const [controlledSwiper, setControlledSwiper] = useState(null);

  const TITLE_MIN_LENGTH = 4;
  const TITLE_MAX_LENGTH = 50;
  const DESCRIPTION_MAX_LENGTH = 1000;

  const swiperRef = useRef(null);

  const [isValid, setIsValid] = useState({
    title: false,
    description: false,
  });

  const [updateData, setUpdateData] = useState({
    title: data.title,
    description: data.description,
    images: data.images,
  });

  const [uploadLoading, setUploadLoading] = useState(false);

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

  const [submit, { loading }] = useMutation(UPDATE_POST);
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
      refetch();
    } catch (e) {
      console.error(e);
    }
  };

  // Delete Image
  const handleDeleteCurrentImage = () => {
    const currentSlideIndex = swiperRef.current.swiper.activeIndex;

    setUpdateData((prev) => ({
      ...prev,
      images: [
        ...prev.images.slice(0, currentSlideIndex),
        ...prev.images.slice(currentSlideIndex + 1),
      ],
    }));
  };

  // Add Image
  const inputRef = useRef(null);

  const [getS3Path, { loading: getUrlLoading }] = useLazyQuery(GET_S3URL, {
    fetchPolicy: 'network-only',
  });

  const IMG_MAX_SIZE = 100_000_000;
  const handleFiles = (files, e) => {
    const filesFiltered = Array.from(files).filter((file) => {
      const fileSplit = file.name?.split('.');
      const extension = fileSplit[fileSplit.length - 1]?.toLowerCase();

      if (!mimeType.includes(extension)) {
        customToast({
          toastType: 'error',
          msg: <>File type not supported</>,
          autoClose: 2000,
        });
        return;
      }

      if (file.size > IMG_MAX_SIZE)
        customToast({
          msg: <>File size should not exceed 100 MB.</>,
          autoClose: 2000,
          toastType: 'alert',
        });
      return file.size <= IMG_MAX_SIZE;
    });

    if (updateData?.images?.length + filesFiltered.length > 5) {
      customToast({
        msg: <>Please upload less than 5 files</>,
        autoClose: 2000,
        toastType: 'alert',
      });
    } else {
      setImages(filesFiltered);
      e.target.value = null; // reset input files
    }
  };

  const uploadFile = async (file) => {
    if (!file) return;

    setUploadLoading(true);
    const fileSplit = file.name?.split('.');
    const extension = fileSplit[fileSplit.length - 1]?.toLowerCase();

    if (!mimeType.includes(extension)) {
      customToast({
        toastType: 'error',
        msg: <>File type not supported</>,
        autoClose: 2000,
      });
      onClose();
      setIsError(true);
      return;
    }

    try {
      setIsError(false);
      const result = await getS3Path({
        variables: {
          ext: extension,
        },
      });
      const s3Path = result?.data?.getS3Url;

      if (s3Path) {
        let data = file;

        let config = {
          method: 'put',
          maxBodyLength: Infinity,
          url: s3Path.key,
          headers: {
            'Content-Type': s3Path.mimeType,
          },
          data: data,
        };
        axios
          .request(config)
          .then((response) => {
            setUpdateData((prev) => ({
              ...prev,
              images: [...prev.images, s3Path.key.split('?')[0]],
            }));
            setUploadLoading(false);
          })
          .catch((error) => {
            console.log(error);
            throw error;
          });
      } else {
        throw new Error('no');
      }
    } catch (e) {
      setUploadLoading(false);
      console.error(e);
    }
  };

  useEffect(() => {
    if (controlledSwiper && !isError) {
      const nextIndex = controlledSwiper.activeIndex + 1;
      controlledSwiper.slideTo(nextIndex);
    }
  }, [uploadLoading]);

  const setImages = async (files) => {
    for (const file of files) {
      await uploadFile(file);
    }
  };

  const renderPreviewImages = () =>
    updateData?.images?.map((image, i) => (
      <SwiperSlide key={i}>
        <Picture
          url={image}
          objectFit="cover"
          alt="preview"
          style={{ borderRadius: '10px' }}
        />
      </SwiperSlide>
    ));

  return (
    <Modal
      open={open}
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        '@media (max-width: 600px)': {
          display: 'none',
        },
      }}
    >
      <div className={styles.box} style={{ maxWidth: '1140px' }}>
        <div className={styles.header}>
          <h1>Share your inspiration</h1>
          <button onClick={onClose} aria-label="close">
            <Close />
          </button>
        </div>
        <Grid container spacing={3}>
          <Grid xs={12} sm={6}>
            <div className={styles.uploadPhoto}>
              {data?.images?.length > 0 ? (
                <Swiper
                  controller={{ control: controlledSwiper }}
                  onSwiper={setControlledSwiper}
                  ref={swiperRef}
                  slidesPerView={1}
                  spaceBetween={30}
                  loop={false}
                  pagination={{
                    clickable: true,
                  }}
                  navigation={true}
                  modules={[Pagination, Navigation, Controller]}
                  className="mySwiper"
                >
                  {renderPreviewImages()}
                </Swiper>
              ) : (
                ''
              )}
            </div>
          </Grid>

          <Grid xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
            <div className={styles.form}>
              <div
                className={styles.formTitle}
                style={{
                  borderColor:
                    updateData?.title?.length >= TITLE_MIN_LENGTH
                      ? 'var(--artiside-neutral5)'
                      : 'var(--secondary-color)',
                }}
              >
                <input
                  placeholder="Title"
                  value={updateData.title}
                  onChange={handleChangeTitle}
                  maxLength={50}
                />
                <div className={styles.count}>
                  <span>{updateData?.title?.length}</span>/50
                </div>
              </div>
              {updateData?.title?.length < TITLE_MIN_LENGTH && (
                <p className={styles.errorText}>
                  Enter title, more than 4 characters.
                </p>
              )}
              <div className={styles.formContents}>
                <textarea
                  placeholder="Describe your inspiration"
                  rows={13}
                  spellCheck={false}
                  value={updateData.description}
                  onChange={handleChangeDesc}
                  maxLength={1000}
                />
                <div className={styles.count}>
                  <span>{updateData?.description?.length}</span>/1,000
                </div>
              </div>
            </div>
          </Grid>
        </Grid>

        <div className={styles.button}>
          <div className={styles.featureButton}>
            <button
              disabled={uploadLoading || updateData?.images?.length <= 1}
              onClick={() => {
                if (updateData?.images?.length <= 1) {
                  customToast({
                    toastType: 'alert',
                    msg: (
                      <>
                        <b>Warning</b> Please add at least one image.
                      </>
                    ),
                    autoClose: 2000,
                  });
                  return;
                }
                handleDeleteCurrentImage();
              }}
              aria-label="delete"
            >
              <Delete />
            </button>
            <button
              disabled={uploadLoading || updateData?.images?.length >= 5}
              onClick={() => {
                if (updateData?.images?.length > 5) {
                  customToast({
                    msg: <>Please upload less than 5 files</>,
                    autoClose: 2000,
                    toastType: 'alert',
                  });
                  return;
                }
                inputRef?.current.click();
              }}
              aria-label="upload file"
            >
              <Add />
              <input
                type="file"
                accept="image/jpeg,image/png,image/heic,image/heif,video/mp4,video/quicktime,image/gif,image/svg+xml,image/tiff"
                style={{ display: 'none' }}
                ref={inputRef}
                multiple={true}
                onChange={(e) => handleFiles(e.target.files, e)}
              />
            </button>
          </div>
          <button
            className={
              uploadLoading
                ? `${styles.wait} ${styles.nextButton}`
                : styles.nextButton
            }
            size="sm"
            type="primary"
            onClick={() => {
              if (isValid?.title && isValid?.description) {
                handleSubmit();
                if (!loading) {
                  onClose();
                }
              } else {
                customToast({
                  toastType: 'error',
                  msg: <>Maximum character limit exceeded.</>,
                  autoClose: 2000,
                });
              }
            }}
          >
            {uploadLoading && (
              <div className={styles.spinner}>
                <CircularProgress
                  thickness={5}
                  sx={{
                    width: '16px !important',
                    height: '16px !important',
                    color: 'var(--artiside-neutral2) !important',
                  }}
                />
              </div>
            )}
            Share
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default UpdatePopup;
