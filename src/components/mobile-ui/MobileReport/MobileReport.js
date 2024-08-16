import { useState } from 'react';
import styles from './MobileReport.module.scss';

import { Drawer } from '@mui/material';

import MobileDrawerContainer from '../MobileDrawer/MobileDrawerContainer';
import MobileDrawerList from '../MobileDrawer/MobileDrawerList';
import MobileReportInput from './MobileReportInput';
import MobileRightChevron from '../MobileIcons/MobileRightChevron';

const REPORT_LIST = [
  {
    reason: 'SPAM',
    description: 'Spam',
  },
  {
    reason: 'SEXUAL',
    description: 'Nudity, pornography or sexual activity',
  },
  {
    reason: 'HATE',
    description: 'Hate speech or symbols',
  },
  {
    reason: 'BULLYING',
    description: 'Harassment, criticism or bullying',
  },
  {
    reason: 'PRIVACY',
    description: 'Privacy violation',
  },
  {
    reason: 'FASLE-INFO',
    description: 'False information',
  },
  {
    reason: 'SUICIDE',
    description: 'Suicide or self-harm',
  },
  {
    reason: 'INTELLECTUAL',
    description: 'Intellectual property violation',
  },
  {
    reason: 'DANGEROUS',
    description: 'Illegal or dangerous goods',
  },
  {
    reason: 'GRAPHIC-VIOLENCE',
    description: 'Graphic violence',
  },
];
const INPUT_MAX_LENGTH = 500;

const MobileReport = (props) => {
  const { open, onClose, onClick, report, onHandleInput } = props;

  // next page
  const [isNext, setIsNext] = useState(false);
  // reason select
  const [select, setSelect] = useState('');
  // description input value
  const [text, setText] = useState('');

  const handleClick = (menu) => {
    setSelect(menu);
    setIsNext(true);
  };

  const handleInputReport = (e) => {
    if (e.target.value.length > INPUT_MAX_LENGTH) {
      e.target.value = e.target.value.slice(0, INPUT_MAX_LENGTH);
    }
    setText(e.target.value);
  };

  const handleBackClick = () => {
    if (isNext) {
      setIsNext(false);
      setSelect(false);
    }
    if (!isNext) {
      onClose();
    }
  };

  return (
    <Drawer
      sx={{
        backdropFilter: 'blur(6px)',
        '@media (min-width: 481px)': {
          display: 'none',
        },
        '&': {
          zIndex: 1560,
        },
        '& > .MuiPaper-root': {
          backgroundColor: 'transparent',
        },
      }}
      transitionDuration={200}
      anchor="bottom"
      open={open}
    >
      <MobileDrawerContainer
        type="long"
        title="Report"
        onClose={handleBackClick}
      >
        <div className={styles.container}>
          {!isNext ? (
            REPORT_LIST.map((list) => (
              <MobileDrawerList
                key={list.reason}
                title={list.description}
                onClick={() => handleClick(list.description)}
                arrow={<MobileRightChevron />}
                border
              />
            ))
          ) : (
            <MobileReportInput
              reason={select}
              value={report}
              onChangeInput={onHandleInput}
            />
          )}

          {isNext && (
            <div
              className={styles.submit}
              onClick={() => {
                onClick(select);
                onClose();
              }}
            >
              <button disabled={!report}>Submit</button>
            </div>
          )}
        </div>
      </MobileDrawerContainer>
    </Drawer>
  );
};

export default MobileReport;
