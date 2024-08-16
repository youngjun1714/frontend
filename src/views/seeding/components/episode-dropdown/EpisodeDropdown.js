import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Stack } from '@mui/material';
import classNames from 'classnames';
import moment from 'moment';

import styles from './EpisodeDropdown.module.scss';
import ArrowDown from '@/components/ui/Icons/ArrowDown';
import Episode from '@/components/ui/Icons/Episode';
import Check from '@/components/ui/Icons/Check';
import { useRef } from 'react';
import { useCallback } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';

const PAGE_SIZE = 100;

const EpisodeDropdown = ({
  episode,
  onChangeEpisode,
  useAll = true,
  useEpisodeList,
}) => {
  const { episodeList, pageInfo, fetchMore, loading } = useEpisodeList || {};

  const observerTarget = useRef(null);
  const observerRoot = useRef(null);

  const [open, setOpen] = useState(false);

  const handleMore = useCallback(() => {
    if (
      ((pageInfo || {}).currentPage + 1) * PAGE_SIZE <
      (pageInfo || {}).totalCount
    ) {
      // if more item exists
      fetchMore({
        variables: {
          currentPage: pageInfo.currentPage + 1,
        },
      });
    }
  }, [pageInfo, fetchMore]);

  useEffect(() => {
    const target = observerTarget?.current;
    const root = observerRoot?.current;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          handleMore();
        }
      },
      { threshold: 1, root }
    );

    if (target && root && open) {
      observer.observe(target);
    }

    return () => {
      if (target && root) {
        observer.unobserve(target);
      }
    };
  }, [observerTarget, observerRoot, handleMore, open, loading]);

  const handleChangeEpisode = (e) => {
    onChangeEpisode(e.target.value);
  };

  const renderMenuItem = (episodeNo) => {
    if (episodeNo === 'all') {
      return (
        <Stack direction="row" gap="12px">
          <div className={styles.episodeNo}>
            <Episode
              color={
                episode === episodeNo
                  ? 'var(--primary-color)'
                  : 'var(--artiside-neutral4)'
              }
            />
            All Episodes
          </div>
          <div className={styles.episodePeriod}>(UTC) ~ Now</div>
        </Stack>
      );
    } else {
      const selectedEpisode = episodeList?.find(
        (item) => item.episodeNo === episodeNo
      );
      return (
        <Stack direction="row" gap="12px">
          <div className={styles.episodeNo}>
            <Episode
              color={
                episode === episodeNo
                  ? 'var(--primary-color)'
                  : 'var(--artiside-neutral4)'
              }
            />
            Episode {selectedEpisode?.episodeNo}
          </div>
          <div className={styles.episodePeriod}>
            (UTC){' '}
            {moment(selectedEpisode?.startTimeAt).utc().format('MMM DD, YYYY')}{' '}
            - {moment(selectedEpisode?.endTimeAt).utc().format('MMM DD, YYYY')}
          </div>
        </Stack>
      );
    }
  };

  return (
    <FormControl>
      <Select
        className={styles.episodSelect}
        value={episode}
        onChange={handleChangeEpisode}
        IconComponent={ArrowDown}
        renderValue={renderMenuItem}
        MenuProps={{
          PaperProps: {
            sx: {
              borderRadius: '10px',
              boxShadow: '3px 4px 20px 0px rgba(105, 127, 149, 0.15)',
              marginTop: '8px',
              padding: '6px 14px',
              maxHeight: '340px',
            },
          },
          ref: observerRoot,
        }}
        onOpen={() => {
          setTimeout(() => {
            setOpen(true);
          }, 1000);
        }}
        onClose={() => setOpen(false)}
      >
        {useAll && (
          <MenuItem
            className={classNames(styles.menuItem, {
              [styles.selected]: episode === 'all',
            })}
            key="all"
            value="all"
          >
            {renderMenuItem('all')}
            {episode === 'all' && <Check />}
          </MenuItem>
        )}
        {episodeList?.map((item) => (
          <MenuItem
            className={classNames(styles.menuItem, {
              [styles.selected]: episode === item.episodeNo,
            })}
            key={`episode-row-${item.episodeNo}`}
            value={item.episodeNo}
          >
            {renderMenuItem(item.episodeNo)}
            {episode === item.episodeNo && <Check />}
          </MenuItem>
        ))}

        <li ref={observerTarget} style={{ width: '100%', height: 10 }} />
      </Select>
    </FormControl>
  );
};

export default EpisodeDropdown;
