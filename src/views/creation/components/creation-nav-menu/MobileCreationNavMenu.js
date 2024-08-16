import { useState, useEffect, forwardRef } from 'react';

import MobileDrawerContainer from '@/components/mobile-ui/MobileDrawer/MobileDrawerContainer';
import MobileDrawerList from '@/components/mobile-ui/MobileDrawer/MobileDrawerList';
import MobileRightChevron from '@/components/mobile-ui/MobileIcons/MobileRightChevron';
import dynamic from 'next/dynamic';

const Drawer = dynamic(() => import('@mui/material/Drawer'));

const MobileCreationNavMenu = (props, ref) => {
  const { onChange, content, defaultValue, value, open, onClose } = props;

  const [selected, setSelected] = useState(defaultValue);

  const handleClick = (value) => {
    setSelected(value);
    onChange && onChange(value);
  };

  useEffect(() => {
    if (value) setSelected(value);
  }, [value]);

  return (
    <>
      {open ? (
        <Drawer
          sx={{
            backdropFilter: 'blur(6px)',
            '@media (min-width: 769px)': {
              display: 'none',
            },
            '&': {
              zIndex: 1500,
            },
            '& > .MuiPaper-root': {
              backgroundColor: 'transparent',
            },
          }}
          transitionDuration={200}
          anchor="bottom"
          open={open}
          // onClick={() => setSortOpen(!sortOpen)}
          onClose={onClose}
        >
          <MobileDrawerContainer ref={ref}>
            {content.map((item) => (
              <MobileDrawerList
                key={item.id}
                title={item.title}
                border
                arrow={<MobileRightChevron />}
                onClick={() => handleClick(item.id)}
              />
            ))}
          </MobileDrawerContainer>
        </Drawer>
      ) : (
        <></>
      )}
    </>
  );
};

export default forwardRef(MobileCreationNavMenu);
