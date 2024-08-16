import React from 'react';

import styles from '@/views/artwork/components/artwork-data-section/artwork-details/ArtworkDetails.module.scss';
import Skeleton from '@/components/ui/Skeleton/Skeleton';
import {
  formatTokenId,
  getNftContractAddress,
  getShortAddress,
} from '@/utils/contractUtil';
import { capitalize } from '@/utils/stringUtil';

function ArtworkDetails(props) {
  const { data, dataLoading } = props;
  const { artworkInfo } = data || {};

  const convertAndOpenUrl = (url) => {
    const convertUrl = url?.includes('ipfs://')
      ? `https://ipfs.io/ipfs/${url.split('ipfs://')[1]}`
      : url;
    window.open(convertUrl);
  };

  return (
    <section className={styles.section}>
      <article className={styles.header}>
        <h1>Details</h1>
        <div className={styles.subMenu}>
          <button
            onClick={() => {
              convertAndOpenUrl(data?.metaUrl);
            }}
          >
            Metadata
          </button>
          <button
            onClick={() => {
              convertAndOpenUrl(data?.artworkUrl);
            }}
          >
            IPFS
          </button>
        </div>
      </article>
      <table className={styles.table}>
        <tbody>
          <tr>
            <th>Creation Year</th>
            {dataLoading ? (
              <td>
                <Skeleton width={122} height={15} />
              </td>
            ) : (
              <td>{artworkInfo?.creationYear}</td>
            )}
          </tr>
          <tr>
            <th>Edition</th>
            {dataLoading ? (
              <td>
                <Skeleton width={122} height={15} />
              </td>
            ) : (
              <td>{artworkInfo?.edition}</td>
            )}
          </tr>
          <tr>
            <th>Medium</th>
            {dataLoading ? (
              <td>
                <Skeleton width={122} height={15} />
              </td>
            ) : (
              <td>{capitalize(artworkInfo?.medium)}</td>
            )}
          </tr>
          <tr>
            <th>Dimensions</th>
            {dataLoading ? (
              <td>
                <Skeleton width={122} height={15} />
              </td>
            ) : (
              <td>{`${artworkInfo?.width} x ${artworkInfo?.height}`}</td>
            )}
          </tr>
        </tbody>
        <tbody>
          <tr>
            <th>Contract Address</th>
            {dataLoading ? (
              <td>
                <Skeleton width={122} height={15} />
              </td>
            ) : (
              <td>{getShortAddress(getNftContractAddress())}</td>
            )}
          </tr>
          <tr>
            <th>Token ID</th>
            {dataLoading ? (
              <td>
                <Skeleton width={122} height={15} />
              </td>
            ) : (
              <td>{formatTokenId(data?.tokenId)}</td>
            )}
          </tr>
          <tr>
            <th>Token Standard</th>
            {dataLoading ? (
              <td>
                <Skeleton width={122} height={15} />
              </td>
            ) : (
              <td>ERC-721</td>
            )}
          </tr>
          <tr>
            <th>Blockchain</th>
            {dataLoading ? (
              <td>
                <Skeleton width={122} height={15} />
              </td>
            ) : (
              <td>Polygon</td>
            )}
          </tr>
        </tbody>
      </table>
    </section>
  );
}

export default ArtworkDetails;
