import { Checkbox as CheckboxMui, FormControlLabel } from '@mui/material';

const Checkbox = ({ checked, onClick, label }) => (
  <FormControlLabel
    control={
      <CheckboxMui
        checked={checked}
        onClick={onClick}
        sx={{
          color: '#CED3D8',
          '&.Mui-checked': {
            color: 'var(--primary-color)',
          },
          '& .PrivateSwitchBase-input': {
            width: '100%',
            height: '100%',
          },
        }}
      />
    }
    label={label}
    sx={{
      '& .MuiTypography-root': {
        fontFamily: 'SUIT',
      },
    }}
  />
);

export default Checkbox;
