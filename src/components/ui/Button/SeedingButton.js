import Seeding from '../Icons/Seeding';
import styles from './SeedingButton.module.scss';

function SeedingButton(props) {
  const { onClick } = props;

  return (
    <button className={styles.button}>
      <Seeding />
      <span>Seeding</span>
    </button>
  );
}

export default SeedingButton;
