import { Badge } from '@mui/material';

const NotificationBadge = ({ children, anchorOrigin, ...props }) => (
  <Badge
    size="sm"
    variant="dot"
    anchorOrigin={anchorOrigin}
    sx={{
      '& .MuiBadge-badge': {
        backgroundColor: 'var(--secondary-color)',
        minWidth: '6px',
        height: '6px',
      },
    }}
    {...props}
  >
    {children}
  </Badge>
);

export default NotificationBadge;

NotificationBadge.defaultProps = {
  anchorOrigin: {
    vertical: 'top',
    horizontal: 'left',
  },
};
