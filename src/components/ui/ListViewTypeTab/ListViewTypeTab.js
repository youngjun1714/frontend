import React from 'react';
import styles from './ListViewTypeTab.module.scss';
import Album from '../Icons/Album';
import List from '../Icons/List';

const ListViewTypeTab = ({ viewType, onChangeViewType }) => (
  <div className={styles.listViewTypeTab}>
    <button
      className={viewType === 'album' ? styles.active : null}
      onClick={() => {
        onChangeViewType('album');
      }}
      aria-label="album view"
    >
      <Album color={viewType === 'album' ? '#ffffff' : '#7D8287'} />
    </button>
    <button
      className={viewType === 'list' ? styles.active : null}
      onClick={() => {
        onChangeViewType('list');
      }}
      aria-label="list view"
    >
      <List color={viewType === 'list' ? '#ffffff' : '#7D8287'} />
    </button>
  </div>
);

export default ListViewTypeTab;
