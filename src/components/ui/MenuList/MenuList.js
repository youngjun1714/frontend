import styles from './MenuList.module.scss';

const MenuList = (props) => {
  const { icon, text, onClick } = props;

  return (
    <div className={styles.list} onClick={onClick}>
      <span>{icon}</span>
      <h1>{text}</h1>
    </div>
  );
};

export default MenuList;
