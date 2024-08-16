import React, { useRef, useState } from 'react';
import { gql } from '@apollo/client';
import classNames from 'classnames';
import styles from '@/components/ui/Avatar/Avatar.module.scss';
import { useRecoilState } from 'recoil';

import stores from '@/store';

import DefaultProfile from './DefaultProfile';
import Image from 'next/image';
import axios from 'axios';
import tokenStore from '@/adf-connect/utils/token-store';
import { customToast } from '@/utils/customToast';
import { useApollo } from '@/library/apollo-client';
import Pencil from '../Icons/Pencil';

/**
 *
 * @prop {string} type : sm | md | mdl | lg | xl | max
 * @prop {boolean} border
 */

const IMG_SIZES = {
  xs: '24px',
  sm: '32px',
  md: '40px',
  mdl: '56px',
  lg: '64px',
  xl: '80px',
  max: '200px',
};

function Avatar(props) {
  // size는 avatar의 width, height를 강제로 지정해줄 때 사용되는 프롭 ex) MobileConnectBoxUsername.js
  const { size, type, border, image, isSetting, username } = props;

  const sizes = type ? (IMG_SIZES[type] ? IMG_SIZES[type] : '48px') : '48px';

  const {
    common: { meState },
  } = stores;

  const [me, setMe] = useRecoilState(meState);

  const [isUploading, setIsUploading] = useState(false);
  const fileRef = useRef(null);

  const IMG_MAX_SIZE = 100_000_000;
  const handleFile = async (files) => {
    if (!files) return;

    const file = files[0];

    if (file.size > IMG_MAX_SIZE)
      return customToast({
        msg: <>File size should not exceed 100 MB.</>,
        autoClose: 2000,
        toastType: 'alert',
      });

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const accessToken = tokenStore.get('accessToken');

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/me/profile-img`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setMe({
        ...me,
        profileImgUrl: response?.data?.profileImgUrl,
      });

      setIsUploading(false);
      handleCache(response?.data?.profileImgUrl);
    } catch (error) {
      setIsUploading(false);
      console.log(error);
    }
  };

  const apolloClient = useApollo();

  const handleCache = (imgUrl) => {
    const { cache } = apolloClient;

    const existUser = cache.readFragment({
      id: `User:${me.id}`,
      fragment: gql`
        fragment UserId on User {
          id
        }
      `,
    });
    if (existUser) {
      cache.updateFragment(
        {
          id: `User:${me.id}`,
          fragment: gql`
            fragment UserProfileImg on User {
              profileImgUrl
            }
          `,
        },
        (data) => ({ ...data, profileImgUrl: imgUrl })
      );
    }
    const existUserDetail = cache.readFragment({
      id: `UserDetail:${me.id}`,
      fragment: gql`
        fragment UserDetailId on UserDetail {
          id
        }
      `,
    });
    if (existUserDetail) {
      cache.updateFragment(
        {
          id: `UserDetail:${me.id}`,
          fragment: gql`
            fragment UserDetailProfileImg on UserDetail {
              profileImgUrl
            }
          `,
        },
        (data) => ({ ...data, profileImgUrl: imgUrl })
      );
    }
  };

  const avatarClassName = classNames(styles.avatar, {
    [styles[type]]: type,
  });

  const avatarStyle = {
    width: size ? `${size}px !important` : '',
    height: size ? `${size}px !important` : '',
    border: border ? '3px solid #FFFFFF' : '',
    boxShadow: border ? '2px 3px 4px rgba(70, 79, 87, 0.15)' : '',
  };

  return (
    <div
      className={classNames(styles.avatarDiv, {
        [styles.settingMode]: isSetting,
      })}
    >
      {image ? (
        <div className={avatarClassName} style={{ ...avatarStyle }}>
          <Image
            src={
              isUploading
                ? URL.createObjectURL(fileRef?.current?.files?.[0])
                : image
            }
            fill={true}
            alt="User Avatar"
            sizes={sizes}
          />
          {/* <FollowIcon classNameProp={styles.followIcon} /> */}
        </div>
      ) : (
        <DefaultProfile className={avatarClassName} username={username} />
      )}
      {isSetting ? (
        <button
          className={styles.setting}
          onClick={() => fileRef.current.click()}
          aria-label="create"
        >
          <Pencil color="#FFFFFF" />
        </button>
      ) : (
        <></>
      )}
      <input
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        ref={fileRef}
        onChange={(e) => handleFile(e.target.files)}
      />
    </div>
  );
}

export default Avatar;
