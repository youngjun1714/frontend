import Dropdown from '@/components/ui/Dropdown/Dropdown';
import styles from './SeedingSearch.module.scss';
import ListViewTypeTab from '@/components/ui/ListViewTypeTab/ListViewTypeTab';
import { Stack } from '@mui/material';
import SearchInput from '@/components/ui/SearchInput/SearchInput';

const SeedingSearch = (props) => {
  const {
    dropdownItems,
    sort,
    onChangeSort,
    viewType,
    onChangeViewType,
    search,
    onChangeSearch,
  } = props;

  return (
    <div className={styles.controlDiv}>
      {props.hasOwnProperty('viewType') ? (
        <ListViewTypeTab
          viewType={viewType}
          onChangeViewType={onChangeViewType}
        />
      ) : (
        <div />
      )}
      <Stack direction="row" gap="16px">
        <SearchInput
          search={search}
          onChangeSearch={onChangeSearch}
          type="sub"
        />
        <Dropdown
          dropWidth="208px"
          dropHeight="40px"
          dropTitle={dropdownItems[0].title}
          dropClass="sub"
          defaultValue={sort}
          content={dropdownItems}
          onChange={onChangeSort}
          value={sort}
        />
      </Stack>
    </div>
  );
};

export default SeedingSearch;
