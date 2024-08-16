import styles from './MobileReportInput.module.scss';

import { TextareaAutosize } from '@mui/material';

const PLACEHOLDER = `Please explain why this content is inappropriate`;

const MobileReportInput = (props) => {
  const { reason, value, onChangeInput } = props;

  return (
    <article className={styles.article}>
      <div className={styles.header}>
        <h1>{reason}</h1>
      </div>

      <div
        className={styles.textareaWrapper}
        style={{
          border: !!value
            ? '1px solid var(--artiside-neutral1)'
            : '1px solid var(--artiside-neutral5)',
        }}
      >
        <TextareaAutosize
          value={value}
          onChange={onChangeInput}
          minRows={10}
          maxRows={10}
          placeholder={PLACEHOLDER}
        />
      </div>
      <p className={styles.count}>{value?.length}/500</p>

      <div className={styles.help}>
        <h1>About the reported content:</h1>
        <p>
          The reported content will be immediately closed <br />
          and will reopen or be permanently deleted <br />
          depending on ADF policy. <br />
          <br />
          Each user may report a content per day.
        </p>
      </div>
    </article>
  );
};

export default MobileReportInput;
