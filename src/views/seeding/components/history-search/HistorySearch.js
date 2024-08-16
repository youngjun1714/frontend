import styles from './HistorySearch.module.scss';
import { Stack } from '@mui/material';
import Document from '@/components/ui/Icons/Document';
import BarChart from '@/components/ui/Icons/BarChart';
import EpisodeDropdown from '../episode-dropdown/EpisodeDropdown';
import Checkbox from '@/components/ui/Checkbox/Checkbox';

const HistorySearch = (props) => {
  const {
    episode,
    onChangeEpisode,
    onSelectActivity,
    activities = [],
    useEpisodeList,
  } = props;

  return (
    <div className={styles.controlDiv}>
      <Stack direction="row" gap="20px" alignItems="center" mb="20px">
        <div className={styles.label}>
          <Document />
          View
        </div>
        <EpisodeDropdown
          episode={episode}
          onChangeEpisode={onChangeEpisode}
          useEpisodeList={useEpisodeList}
        />
      </Stack>
      <Stack direction="row" gap="20px" alignItems="center">
        <div className={styles.label}>
          <BarChart />
          Activity
        </div>
        <Checkbox
          checked={activities.includes('SEEDING')}
          onClick={() => onSelectActivity('SEEDING')}
          label="Seed"
        />
        <Checkbox
          checked={activities.includes('UNSEEDING')}
          onClick={() => onSelectActivity('UNSEEDING')}
          label="Unseed"
        />
        <Checkbox
          checked={activities.includes('REQUEST')}
          onClick={() => onSelectActivity('REQUEST')}
          label="Request"
        />
      </Stack>
    </div>
  );
};

export default HistorySearch;
