import styles from './MobileArtistBio.module.scss';

const MobileArtistBio = (props) => {
  const { data } = props;

  const DATA_FORM = [
    {
      id: '1Q',
      title:
        'Please briefly introduce yourself (Country of origin, city of activity, author name, group affiliated, etc.)',
      text: data?.intro,
    },
    {
      id: '2Q',
      title:
        'Please briefly describe one of your masterpiece and the reason for your selection.',
      text: data?.artStyle,
    },
    {
      id: '3Q',
      title: 'If there is an artist who inspires you, please recommend it.',
      text: data?.representativeArtwork,
    },
    {
      id: '4Q',
      title: 'Can you describe your artwork style?',
      text: data?.rememberAs,
    },
    {
      id: '5Q',
      title: 'What kind of artist do you want to be remembered by peoples?',
      text: data?.recommendArtist,
    },
    {
      id: '6Q',
      title: 'Describe about your plans for future activities.',
      text: data?.futureActivities,
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
export default MobileArtistBio;
