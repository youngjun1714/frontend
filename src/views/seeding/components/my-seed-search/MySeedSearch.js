import Dropdown from '@/components/ui/Dropdown/Dropdown';
import styles from './MySeedSearch.module.scss';
import { FormControlLabel, FormGroup, Stack, Switch } from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchInput from '@/components/ui/SearchInput/SearchInput';

const StyledSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 48,
  height: 28,
  padding: 0,
  marginRight: '7px',
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(20px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: '#00B5B0',
        opacity: 1,
        border: 0,
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5,
      },
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      color: '#33cf4d',
      border: '6px solid #fff',
    },
    '&.Mui-disabled .MuiSwitch-thumb': {
      color:
        theme.palette.mode === 'light'
          ? theme.palette.grey[100]
          : theme.palette.grey[600],
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 24,
    height: 24,
  },
  '& .MuiSwitch-track': {
    borderRadius: 28 / 2,
    backgroundColor: '#CED3D8',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500,
    }),
  },
}));

const MySeedSearch = (props) => {
  const {
    dropdownItems,
    sort,
    onChangeSort,
    search,
    onChangeSearch,
    showDetail,
    onChangeShowDetail,
  } = props;

  const handleChangeShowDetail = (e) => {
    onChangeShowDetail(e.target.checked);
  };

  return (
    <div className={styles.controlDiv}>
      <FormGroup>
        <FormControlLabel
          control={
            <StyledSwitch
              checked={showDetail}
              onChange={handleChangeShowDetail}
            />
          }
          label="All Detail"
          sx={{ color: 'var(--artiside-neutral2)' }}
          componentsProps={{
            typography: {
              sx: {
                fontFamily: 'SUIT',
                fontSize: 16,
                fontWeight: 600,
              },
            },
          }}
        />
      </FormGroup>
      <Stack direction="row" gap="20px">
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

export default MySeedSearch;
