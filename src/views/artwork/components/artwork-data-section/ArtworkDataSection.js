import React from 'react';
import styles from './ArtworkDataSection.module.scss';

import ArtworkDetails from './artwork-details/ArtworkDetails';
import ArtworkCategories from './artwork-categories/ArtworkCategories';

function ArtworkDataSection(props) {
  const { data, dataLoading } = props;
  return (
    <section>
      <ArtworkDetails data={data} dataLoading={dataLoading} />
    </section>
  );
}

export default ArtworkDataSection;
