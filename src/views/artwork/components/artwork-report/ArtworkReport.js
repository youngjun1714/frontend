import { useState } from 'react';
import styles from './ArtworkReport.module.scss';

import { Modal } from '@mui/material';

import Button from '@/components/ui/Button/Button';
import { customToast } from '@/utils/customToast';
import Close from '@/components/ui/Icons/Close';
import RadioButton from '@/components/ui/RadioButton/RadioButton';

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

function ArtworkReport(props) {
  const { onClick, report, onHandleInput, loading, onClose, open } = props;

  const [checkedItems, setCheckedItems] = useState([]);

  const [next, setNext] = useState(false);
  const handleRadioChange = (e, item) => {
    if (e.target.checked) {
      setCheckedItems([item]);
    } else {
      setCheckedItems(
        checkedItems.filter(
          (checkedItems) => checkedItems.description !== item.description
        )
      );
    }
  };

  return (
    <Modal
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        '@media (max-width: 480px)': {
          display: 'none',
        },
      }}
      open={open}
    >
      <div className={styles.reportModal}>
        <div className={styles.header}>
          <h1>Report</h1>
          <button onClick={onClose} aria-label="close">
            <Close />
          </button>
        </div>
        {!next && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 32,
              marginBottom: 36,
            }}
          >
            {REPORT_LIST.map((item, i) => {
              // const isChecked = checkedItems.includes(item);
              const isChecked = checkedItems.some(
                (checkedItem) => checkedItem.reason === item.reason
              );

              return (
                <div key={i} className={styles.reportList}>
                  <RadioButton
                    id={item.reason}
                    checked={isChecked}
                    label={item.description}
                    onClick={(e) => handleRadioChange(e, item)}
                  />
                </div>
              );
            })}
          </div>
        )}

        {next && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 32,
              marginBottom: 36,
            }}
          >
            <div>
              <h1 className={styles.formTitle}>
                {checkedItems[0]?.description}
              </h1>
              <div
                className={styles.textarea}
                style={{
                  borderColor:
                    report?.length < 10
                      ? 'var(--secondary-color)'
                      : 'var(--artiside-neutral5)',
                }}
              >
                <textarea
                  rows={10}
                  placeholder="Please explain why this content is inappropriate."
                  value={report}
                  onChange={(e) => {
                    onHandleInput(e);
                  }}
                />
              </div>
              <div className={styles.count}>
                <p
                  style={{
                    color:
                      report?.length < 10
                        ? 'var(--secondary-color)'
                        : 'var(--artiside-neutral2)',
                  }}
                >
                  Enter at least 10 characters
                </p>
                <p>
                  <span
                    style={{
                      color:
                        report?.length < 10
                          ? 'var(--secondary-color)'
                          : 'var(--artiside-neutral2)',
                    }}
                  >
                    {report?.length}
                  </span>
                  /500
                </p>
              </div>
            </div>

            <div>
              <h1 className={styles.formTitle}>About the reported content:</h1>
              <div className={styles.aboutReport}>
                The reported content will be immediately closed and will reopen
                or be permanently deleted depending on ADF policy. Each user may
                report a content per day.
              </div>
            </div>
          </div>
        )}

        <div>
          {!next && (
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                onClick={() => {
                  if (!!!checkedItems.length) {
                    return;
                  }
                  setNext(true);
                }}
                size="sm"
                type="primary"
                disabled={!!!checkedItems?.length}
              >
                Next
              </Button>
            </div>
          )}

          {next && (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button
                size="sm"
                type="secondary"
                color="black"
                onClick={() => setNext(false)}
              >
                Back
              </Button>
              <Button
                onClick={() => {
                  if (report?.length < 10 || report?.trim() === '') {
                    customToast({
                      toastType: 'error',
                      msg: <>Enter at least 10 characters</>,
                      autoClose: 1000,
                    });
                    return;
                  }

                  onClick(checkedItems);
                  setNext(true);
                  if (!loading) {
                    onClose();
                  }
                }}
                size="sm"
                type="primary"
              >
                Submit
              </Button>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}

export default ArtworkReport;
