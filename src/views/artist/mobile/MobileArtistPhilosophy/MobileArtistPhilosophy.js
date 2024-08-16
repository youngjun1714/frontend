import styles from './MobileArtistPhilosophy.module.scss';

const MobileArtistPhilosophy = (props) => {
  const { data } = props;

  const DATA_FORM = [
    {
      id: '1Q',
      title: 'Please tell us about your values ​​as an artist.',
      text: data?.values,
    },
    {
      id: '2Q',
      title:
        'What message do you want to convey to the public through your artwork?',
      text: data?.message,
    },
    {
      id: '3Q',
      title: 'What do you consider most important when create artwork?',
      text: data?.consideration,
    },
    {
      id: '4Q',
      title: 'What do you think is a good artwork?',
      text: data?.goodArtwork,
    },
  ];

  return (
    <div className={styles.article}>
      {DATA_FORM.map((data) => (
        <Column
          key={data?.id}
          id={data?.id}
          title={data?.title}
          text={data?.text}
        />
      ))}
    </div>
  );
};

const Column = ({ id, title, text }) => (
  <div className={styles.column}>
    <div className={styles.heading}>
      <h1>{id}</h1>
      <h2>{title}</h2>
    </div>

    <div className={styles.text}>
      <p>{text}</p>
    </div>
  </div>
);
export default MobileArtistPhilosophy;
