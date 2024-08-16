import { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import styles from './MobileCreate.module.scss';
import axios from 'axios';
import { gql, useLazyQuery, useMutation } from '@apollo/client';

import { Drawer } from '@mui/material';

import MobileDrawerContainer from '../MobileDrawer/MobileDrawerContainer';
import MobileDrawerList from '../MobileDrawer/MobileDrawerList';
import MobileCreateIcons from '../MobileIcons/MobileCreateIcons';
import { customToast } from '@/utils/customToast';
import MobileCreateInspiration from './MobileCreateInspiration';
import MobileImportArtwork from './MobileImportArtwork';
import MobileRightChevron from '../MobileIcons/MobileRightChevron';

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

const IMG_MAX_SIZE = 100_000_000;
const mimeType = ['png', 'jpg', 'jpeg', 'gif', 'svg'];

const MobileCreate = (props) => {
  const { open, onClose, isPartner } = props;

  const router = useRouter();

  const inputRef = useRef(null);

  // import Artwork
  const [isImportOpen, setIsImportOpen] = useState(false);

  // upload step
  const [isNext, setIsNext] = useState(false);

  // Image upload
  const [imageUrls, setImageUrls] = useState([]); // S3 URL
  const [uploadLoading, setUploadLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  // Text
  const [title, setTitle] = useState('');
  const [contents, setContents] = useState('');
  const [isValid, setIsValid] = useState(false);

  const [getS3Path] = useLazyQuery(GET_S3URL, {
    fetchPolicy: 'network-only',
  });

  // Image Upload
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
              setIsNext(true);
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
    }
  };

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
          autoClose: 3000,
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

    if (filesFiltered.length + selectedFiles.length > 1) {
      customToast({
        msg: <>Please upload one image</>,
        autoClose: 1000,
        toastType: 'alert',
      });
    } else {
      setSelectedFiles((prev) => [...prev, ...filesFiltered]);
      setImages(filesFiltered);
      e.target.value = null; // reset input files
    }
  };

  const setImages = async (files) => {
    for (const file of files) {
      await uploadFile(file);
    }
  };

  // Create
  const [create, { loading: createLoading }] = useMutation(CREATE_POST);

  const handleCreate = async (e, value) => {
    // e.preventDefault();
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
      setImageUrls([]);
      setSelectedFiles([]);
      setTitle('');
      setContents('');
      setIsNext(false);
    } catch (e) {
      console.error(e);
    }
  };

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
      open={open}
      transitionDuration={200}
      anchor="bottom"
      onClose={onClose}
    >
      {!isNext ? (
        <MobileDrawerContainer>
          <MobileDrawerList
            icon={<MobileCreateIcons shape="inspiration" />}
            title="Share my inspiration"
            onClick={() => {
              if (!uploadLoading) {
                inputRef.current.click();
              }
            }}
            isLoading={uploadLoading}
            arrow={<MobileRightChevron />}
          />
          {isPartner && (
            <MobileDrawerList
              icon={<MobileCreateIcons shape="import" />}
              title="Import my artworks"
              onClick={() => {
                if (!uploadLoading) {
                  setIsImportOpen(true);
                }
              }}
              arrow={<MobileRightChevron />}
            />
          )}
        </MobileDrawerContainer>
      ) : (
        <MobileDrawerContainer
          type="full"
          onClose={() => {
            setIsNext(false);
            setImageUrls([]);
            setSelectedFiles([]);
          }}
          title="Inspiration"
          onSubmit={() => handleCreate()}
          disabled={title.length < 4 || title.length > 50}
        >
          <MobileCreateInspiration
            images={imageUrls}
            title={title}
            contents={contents}
            onChangeTitle={handleChangeTitle}
            onChangeDesc={handleChangeDesc}
          />
        </MobileDrawerContainer>
      )}

      <MobileImportArtwork
        open={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        onCloseAll={onClose}
      />
      <input
        className={styles.file}
        type="file"
        ref={inputRef}
        accept="image/jpeg,image/png,image/heif,image/gif,image/svg+xml,"
        onChange={(e) => handleFiles(e.target.files, e)}
      />
    </Drawer>
  );
};

export default MobileCreate;
