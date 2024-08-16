import styles from './RadioButton.module.scss';

const RadioButton = ({ checked, id, onClick, label }) => (
  <div className={styles.radio}>
    <input id={id} checked={checked} type="radio" onChange={onClick} />
    <label htmlFor={id}>{label}</label>
  </div>
);

export default RadioButton;
