import { gql, useLazyQuery, useMutation } from '@apollo/client';
import { useRef, useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import styles from './CreatePopup.module.scss';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { FileDrop } from 'react-file-drop';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Controller } from 'swiper/modules';
import axios from 'axios';

import { CircularProgress, Unstable_Grid2 as Grid, Modal } from '@mui/material';

import { forwardRef } from 'react';
import { customToast } from '@/utils/customToast';
import Delete from '@/components/ui/Icons/Delete';
import File from '@/components/ui/Icons/File';
import Add from '@/components/ui/Icons/Add';
import Close from '@/components/ui/Icons/Close';
import PictureDnd from '@/components/ui/Icons/PictureDnd';
import Picture from '@/components/ui/Picture/Picture';

const CREATE_POST = gql`
  mutation CreatePost($input: CreatePostInput!) {
    createPost(input: $input) {
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

function CreatePopup(props, ref) {
  const { onClose, open } = props;
  const [isValid, setIsValid] = useState(false);
  const router = useRouter();

  const [getS3Path] = useLazyQuery(GET_S3URL, {
    fetchPolicy: 'network-only',
  });

  const [controlledSwiper, setControlledSwiper] = useState(null);

  const [imageUrls, setImageUrls] = useState([]);
  const [uploadLoading, setUploadLoading] = useState(false);

  const uploadFile = async (file) => {
    if (!file) return;

    setUploadLoading(true);
    const fileSplit = file.name?.split('.');
    const extension = fileSplit[fileSplit.length - 1]?.toLowerCase();

    if (mimeType.includes(extension)) {
      try {
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
              setImageUrls((prev) => [...prev, s3Path.key.split('?')[0]]);
              setUploadLoading(false);
            })
            .catch((error) => {
              console.log(error);
              throw error;
            });
        } else {
          throw new Error('no');
        }

        if (controlledSwiper) {
          const nextIndex = controlledSwiper.activeIndex + 1;
          controlledSwiper.slideTo(nextIndex);
        }
      } catch (e) {
        setUploadLoading(false);
        console.error(e);
      }
    }
  };

  const setImages = async (files) => {
    for (const file of files) {
      await uploadFile(file);
    }
  };

  const [title, setTitle] = useState('');
  const [contents, setContents] = useState('');

  const TITLE_MAX_LENGTH = 50;
  const handleChangeTitle = (e) => {
    if (e.target.value.length > 3 && e.target.value.length <= 50) {
      setIsValid(true);
    }
    if (e.target.value.length > TITLE_MAX_LENGTH) {
      e.target.value = e.target.value.slice(0, TITLE_MAX_LENGTH);
    }
    const removeBlank = e.target.value.replace(/ {2,}/g, ' ');
    setTitle(removeBlank);
  };

  const DESCRIPTION_MAX_LENGTH = 1000;
  const handleChangeDesc = (e) => {
    if (e.target.value.length > DESCRIPTION_MAX_LENGTH) {
      e.target.value = e.target.value.slice(0, DESCRIPTION_MAX_LENGTH);
    }
    setContents(e.target.value);
  };

  // page
  const [next, setNext] = useState(false);

  // Drag & drop
  const inputRef = useRef(null);

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [dndState, setDndState] = useState('');

  const IMG_MAX_SIZE = 100_000_000;
  const handleFiles = (files, e) => {
    const filesFiltered = Array.from(files).filter((file) => {
      const fileSplit = file.name?.split('.');
      const extension = fileSplit[fileSplit.length - 1]?.toLowerCase();

      if (!mimeType.includes(extension)) {
        customToast({
          toastType: 'error',
          msg: (
            <>
              File type not supported <br />
              Supported file types: jpg, png, gif, svg
            </>
          ),
          autoClose: 4000,
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

    if (filesFiltered.length + selectedFiles.length > 5) {
      customToast({
        msg: <>Please upload less than 5 files</>,
        autoClose: 2000,
        toastType: 'alert',
      });
    } else {
      setSelectedFiles((prev) => [...prev, ...filesFiltered]);
      setImages(filesFiltered);
      e.target.value = null; // reset input files
    }
  };

  const handleDeleteActiveImage = () => {
    const activeIndex = controlledSwiper?.activeIndex;
    setImageUrls((prev) => [
      ...prev.slice(0, activeIndex),
      ...prev.slice(activeIndex + 1),
    ]);
    setSelectedFiles((prev) => [
      ...prev.slice(0, activeIndex),
      ...prev.slice(activeIndex + 1),
    ]);
  };

  const handleDrop = (files, e) => {
    e.preventDefault();
    handleFiles(files, e);
  };

  const renderPreviewImages = useMemo(
    () =>
      selectedFiles.map((file, i) => (
        <SwiperSlide key={i}>
          <Picture
            url={URL.createObjectURL(file)}
            objectFit="cover"
            alt="preview"
            style={{ borderRadius: '10px' }}
          />
        </SwiperSlide>
      )),
    [selectedFiles]
  );

  const [create, { loading: createLoading }] = useMutation(CREATE_POST);
  const handleCreate = async (e, value) => {
    e.preventDefault();
    if (title.trim() === '') {
      setIsValid(false);
      return;
    }
    if (title.length < 4) {
      setIsValid(false);
      return;
    }
    try {
      const { data } = await create({
        variables: {
          input: {
            title: title,
            description: contents,
            mainImage: imageUrls[0],
            images: imageUrls,
          },
        },
      });
      const {
        createPost: { id: postId },
      } = data;
      router.push(`/inspiration/${postId}`);

      onClose();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Modal
      open={open}
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        '@media (max-width: 1024px)': { display: 'none' },
      }}
    >
      <div
        className={styles.box}
        style={{ maxWidth: !next ? '580px' : '1140px' }}
        ref={ref}
      >
        <div className={styles.header}>
          <h1>Share your inspiration</h1>
          <button onClick={onClose} aria-label="close">
            <Close />
          </button>
        </div>
        <Grid container spacing={3}>
          <Grid xs={12} sm={next ? 6 : 12}>
            {!selectedFiles?.length ? (
              <FileDrop
                className={
                  dndState === 'enter-frame'
                    ? `${styles.dropZone} ${styles.onFrame}`
                    : dndState === 'drag-over'
                    ? `${styles.dropZone} ${styles.dragOver}`
                    : styles.dropZone
                }
                style={{ backgroundColor: 'rgba(230, 233, 236, 0.2)' }}
                onFrameDragEnter={() => setDndState('enter-frame')}
                onFrameDragLeave={() => setDndState('leave-frame')}
                onDragOver={() => setDndState('drag-over')}
                onDrop={handleDrop}
              >
                <PictureDnd />
                <span>Drag & Drop</span>
                <button
                  onClick={() => {
                    inputRef?.current.click();
                  }}
                >
                  <File dimension="20px" color="var(--primary-color)" />
                  <span>Browse file</span>
                </button>
              </FileDrop>
            ) : (
              <div className={styles.uploadPhoto}>
                {selectedFiles.length > 0 ? (
                  <Swiper
                    controller={{ control: controlledSwiper }}
                    onSwiper={setControlledSwiper}
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
                    {renderPreviewImages}
                  </Swiper>
                ) : (
                  ''
                )}
              </div>
            )}
            <input
              type="file"
              style={{ visibility: 'hidden' }}
              ref={inputRef}
              accept="image/jpeg,image/png,image/heif,image/gif,image/svg+xml,"
              multiple={true}
              onChange={(e) => handleFiles(e.target.files, e)}
            />

            <div
              className={styles.button}
              style={{
                justifyContent: selectedFiles?.length
                  ? 'space-between'
                  : 'flex-end',
              }}
            >
              {selectedFiles.length > 0 && (
                <>
                  <div className={styles.featureButton}>
                    <button
                      onClick={() => {
                        if (selectedFiles?.length <= 1) {
                          customToast({
                            toastType: 'alert',
                            msg: <>Please add at least one image.</>,
                            autoClose: 2000,
                          });
                          return;
                        }
                        handleDeleteActiveImage();
                      }}
                      disabled={
                        selectedFiles?.length <= 1 ||
                        uploadLoading ||
                        selectedFiles?.length !== imageUrls?.length
                      }
                      aria-label="delete"
                    >
                      <Delete />
                    </button>
                    <button
                      onClick={() => {
                        inputRef?.current.click();
                      }}
                      disabled={
                        uploadLoading ||
                        selectedFiles?.length !== imageUrls?.length
                      }
                      aria-label="add"
                    >
                      <Add />
                    </button>
                  </div>
                </>
              )}
              {next ? null : (
                <button
                  // disabled={!!selectedFiles.length}
                  className={
                    uploadLoading
                      ? `${styles.wait} ${styles.nextButton}`
                      : styles.nextButton
                  }
                  onClick={() => {
                    if (!!selectedFiles.length) {
                      setNext(true);
                    } else {
                      customToast({
                        toastType: 'error',
                        msg: <>Need picture(s)</>,
                        autoClose: 1000,
                      });
                      setNext(false);
                    }
                  }}
                  disabled={
                    uploadLoading || selectedFiles?.length !== imageUrls?.length
                  }
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
                  <p>Next</p>
                </button>
              )}
            </div>
          </Grid>

          {next ? (
            <Grid xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
              <div className={styles.form}>
                <div
                  className={styles.formTitle}
                  style={{
                    borderColor: isValid
                      ? 'var(--artiside-neutral5)'
                      : 'var(--secondary-color)',
                  }}
                >
                  <input
                    placeholder="Title"
                    onChange={handleChangeTitle}
                    value={title}
                    maxLength={50}
                  />
                  <div className={styles.count}>
                    <span>{title?.length}</span>/50
                  </div>
                </div>
                {!isValid && (
                  <p className={styles.errorText}>
                    Enter title, more than 4 characters.
                  </p>
                )}
                <div className={styles.formContents}>
                  <textarea
                    placeholder="Describe your inspiration"
                    rows={15}
                    spellCheck={false}
                    onChange={handleChangeDesc}
                    value={contents}
                    maxLength={1000}
                  />
                  <div className={styles.count}>
                    <span>{contents?.length.toLocaleString()}</span>/1,000
                  </div>
                </div>
              </div>
            </Grid>
          ) : null}
        </Grid>

        {next ? (
          <div className={styles.button}>
            <button
              size="sm"
              type="primary"
              onClick={(e) => {
                handleCreate(e);
                // if (!createLoading) {
                //   onClose();
                // }
              }}
              disabled={!isValid || !imageUrls?.length}
            >
              Share
            </button>
          </div>
        ) : null}
      </div>
    </Modal>
  );
}

export default forwardRef(CreatePopup);
