import React, { useEffect, useRef, useState } from 'react';

import { useRouter } from 'next/router';
import { useRecoilValue } from 'recoil';

import { useConnectModalContext } from '@/adf-connect/contexts/ConnectModalContext';
import NavItems from '@/components/layout/TopNav/NavItems/NavItems.js';
import styles from '@/components/layout/TopNav/TopNav.module.scss';

import stores from '@/store';
import { Menu } from '@mui/material';

import ConnectBox from './ConnectBox/ConnectBox';
import SearchResult from './SearchResult/SearchResult';
import LogoWrapper from './LogoWrapper/LogoWrapper';
import MobileSearch from '@/components/mobile-ui/MobileSearch/MobileSearch';
import Wallet from '@/components/ui/Icons/Wallet';
import Search from '@/components/ui/Icons/Search';
import Doodle from '@/components/ui/Icons/Doodle';
import Pencil from '@/components/ui/Icons/Pencil';
import CloseCircle from '@/components/ui/Icons/CloseCircle';
import MobileSortIcon from '@/components/mobile-ui/MobileIcons/MobileSortIcon';
import MobileNavMenu from './MobileNavMenu/MobileNavMenu';
import useSessionStorage from '@/hooks/useSessionStorage';
import isExpiredPopup from '@/utils/isExpiredPopup';
import dynamic from 'next/dynamic';

const MobileCreate = dynamic(() =>
  import('@/components/mobile-ui/MobileCreate/MobileCreate')
);
const MobileNavigation = dynamic(() =>
  import('@/components/mobile-ui/MobileNavigation/MobileNavigation')
);
const CreatePopup = dynamic(() => import('./CreatePopup/CreatePopup'));
const ImportArtworks = dynamic(() => import('./CreatePopup/ImportArtworks'));
const HowToCreatePopup = dynamic(() =>
  import('@/components/popup/HowToCreatePopup/HowToCreatePopup')
);
const HowToImportPopup = dynamic(() =>
  import('@/components/popup/HowToImportPopup/HowToImportPopup')
);
const HowToArtisidePopup = dynamic(() =>
  import('@/components/popup/HowToArtisidePopup/HowToArtisidePopup')
);

function TopNav(props) {
  const { isNavHidden, isNeedNav } = props;

  const router = useRouter();
  const { query } = router;
  const { search: querySearch } = query;

  // Web, Mobile Common state
  const [path, setPath] = useState(router.pathname);
  const handleChangePath = (path) => {
    setPath(path);
  };

  // me
  const {
    common: { meState },
  } = stores;
  const me = useRecoilValue(meState);

  const [search, setSearch] = useState('');
  const [showResult, setShowResult] = useState(false);

  const searchRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (router.query.q) setSearch(router.query.q);
  }, [router.query.q]);

  const handleInputChange = (e) => {
    setSearch(e.target.value);
    setShowResult(true);

    if (!e.target.value) {
      setShowResult(false);
    }
  };

  // mobile search button
  const [mobileOpen, setMobileOpen] = useState(false);

  // mobile navigation button
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // create Button
  const [open, setOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);

  // Guide Popup
  const [userPopupOpen, setUserPopupOpen] = useState(false);
  const [hideUserPopup, setHideUserPopup] = useSessionStorage(
    'hideCreatePopup',
    false
  );

  const [aritstPopupOpen, setArtistPopupOpen] = useState(false);
  const [hideArtistPopup, setHideArtistPopup] = useSessionStorage(
    'hideImportPopup',
    false
  );

  const [artisidePopupOpen, setArtisidePopupOpen] = useState(false);
  const [hideArtisidePopup, setHideArtisidePopup] = useSessionStorage(
    'hideArtisidePopup',
    false
  );

  const handleOpen = (e) => {
    if (me?.isPartner) {
      setAnchorEl(e.currentTarget);

      return;
    }
    if (!me?.isPartner) {
      if (hideUserPopup) {
        setModalContent('new');
      } else {
        setUserPopupOpen(true);
      }
    }
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setAnchorEl(null);
  };

  const handleModalClose = () => {
    setOpen(false);
    setAnchorEl(null);
    setModalContent(null);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowResult(false);
      }
    };

    const handleEscapeKey = (e) => {
      const isOtherInputFocused =
        e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA';
      if (e.key === 'Escape') {
        inputRef.current.blur();
        setShowResult(false);
      }

      if (e.key === '/' && isOtherInputFocused) {
        e.preventDefault();
        inputRef.current.focus();
        setShowResult(true);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [searchRef]);

  const { openModalPage, account } = useConnectModalContext();
  const { isLoggedIn } = account;

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleResize = () => {
        setIsMobile(window.innerWidth <= 480);
      };

      handleResize();

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, []);

  return (
    <>
      {!isMobile &&
      (path !== '/seeding/about' || path !== '/launchpad/about') ? (
        <header className={styles.header}>
          <div className={styles.container}>
            <LogoWrapper onChangePath={handleChangePath} />
            <NavItems path={path} onChangePath={handleChangePath} />
            <div className={styles.search}>
              <div className={styles.icon}>
                <Search color={search && 'var(--artiside-neutral1)'} />
              </div>
              <div className={styles.input}>
                <input
                  ref={inputRef}
                  placeholder="Search"
                  value={search}
                  onChange={handleInputChange}
                />
              </div>
              {search ? (
                <button
                  className={styles.close}
                  onClick={() => setSearch('')}
                  aria-label="close"
                >
                  <CloseCircle />
                </button>
              ) : (
                <button
                  className={styles.searchOpen}
                  onClick={() => {
                    inputRef.current.focus();
                    setShowResult(true);
                  }}
                  aria-label="focus"
                >
                  /
                </button>
              )}

              <div ref={searchRef}>
                {search !== '' && (
                  <SearchResult
                    search={search}
                    className={
                      showResult
                        ? `${styles.searchResult} ${styles.on}`
                        : styles.searchResult
                    }
                  />
                )}
              </div>
            </div>
            {isLoggedIn ? (
              <div className={styles.isConnect}>
                <button
                  className={styles.createButton}
                  onClick={handleOpen}
                  aria-label="create"
                >
                  <Pencil color="#FFFFFF" dimension="18px" />
                  <span>Create</span>
                </button>
                <div className={styles.connectBox}>
                  <ConnectBox />
                </div>
                <button className={styles.mobileButton} aria-label="search">
                  <Search color="var(--artiside-neutral3)" dimension="22px" />
                </button>
                <button
                  className={styles.mobileButton}
                  aria-label="create"
                  onClick={() => {
                    setMobileOpen(!mobileOpen);
                  }}
                >
                  <Pencil color="var(--artiside-neutral3)" dimension="22px" />
                </button>
                <button className={styles.mobileButton} aria-label="wallet">
                  <Wallet color="var(--artiside-neutral3)" dimension="22px" />
                </button>
                <Menu
                  id="create-menu"
                  anchorEl={anchorEl}
                  open={menuOpen}
                  onClose={handleClose}
                  sx={{
                    '@media (max-width: 1024px)': {
                      visibility: 'hidden',
                    },
                    '& .MuiPaper-root': {
                      width: 282,
                      top: '74px !important',
                      padding: '10px 15px',
                      backrgroundColor: '#ffffff',
                      boxShadow: '0px 26px 80px rgba(18, 18, 23, 0.1)',
                      borderRadius: 10,
                      boxSizing: 'border-box',
                    },
                  }}
                  MenuListProps={{
                    'aria-labelledby': 'create-button',
                  }}
                >
                  <ul className={styles.menu}>
                    <li
                      className={styles.list}
                      onClick={() => {
                        if (!isExpiredPopup('hideCreatePopup')) {
                          setUserPopupOpen(true);
                          return;
                        }
                        setModalContent('new');
                        setOpen(true);
                      }}
                    >
                      <Pencil /> <h1>Share my inspiration</h1>
                    </li>
                    <li
                      className={styles.list}
                      onClick={() => {
                        if (!isExpiredPopup('hideImportPopup')) {
                          setArtistPopupOpen(true);
                          return;
                        }
                        setModalContent('import');
                        setOpen(true);
                      }}
                    >
                      <Doodle /> <h1>Import my artworks</h1>
                    </li>
                  </ul>
                </Menu>
                {menuOpen && (
                  <MobileCreate
                    open={menuOpen}
                    isPartner={me?.isPartner}
                    onClose={() => setAnchorEl(null)}
                  />
                )}
              </div>
            ) : (
              <div className={styles.buttonWrapper}>
                <button
                  className={styles.signin}
                  type="button"
                  onClick={() => {
                    if (!isExpiredPopup('hideArtisidePopup')) {
                      setArtisidePopupOpen(true);
                      return;
                    }
                    openModalPage('SIGNIN');
                  }}
                  aria-label="sign in"
                >
                  Sign in
                </button>
                <button
                  className={styles.signup}
                  type="button"
                  onClick={() => router.push('/adf-signup')}
                  aria-label="sign up"
                >
                  Sign up
                </button>
                {/* <ConnectButton onConnect={connect} /> */}
              </div>
            )}
            <div className={styles.mobileButtonWrapper}>
              <button
                className={`${styles.mobileButton} ${styles.tabletButton}`}
                aria-label="nav"
                onClick={() => setMobileNavOpen(!mobileNavOpen)}
              >
                <MobileSortIcon />
              </button>
              <button
                className={styles.mobileButton}
                aria-label="search"
                onClick={() => {
                  router.push(
                    {
                      pathname: `/`,
                      query: { search: true },
                    },
                    undefined,
                    { shallow: true }
                  );
                }}
              >
                <Search
                  shape="search"
                  color="var(--artiside-neutral3)"
                  dimension="22px"
                />
              </button>
            </div>
            <MobileSearch
              open={!!querySearch}
              search={search}
              onChange={(e) => setSearch(e.target.value)}
              onClose={() => {
                router.back();
                setSearch('');
              }}
              onRemove={() => setSearch('')}
            />
          </div>
          {artisidePopupOpen && (
            <HowToArtisidePopup
              open={artisidePopupOpen}
              onClose={() => setArtisidePopupOpen(false)}
              isHide={hideArtisidePopup}
              setIsHide={setHideArtisidePopup}
              openCreate={() => openModalPage('SIGNIN')}
              sessionStorageItem="hideArtisidePopup"
            />
          )}
          {aritstPopupOpen && (
            <HowToImportPopup
              open={aritstPopupOpen}
              onClose={() => setArtistPopupOpen(false)}
              isHide={hideArtistPopup}
              setIsHide={setHideArtistPopup}
              openCreate={() => {
                setModalContent('import');
                setOpen(true);
              }}
              sessionStorageItem="hideImportPopup"
            />
          )}
          {userPopupOpen && (
            <HowToCreatePopup
              open={userPopupOpen}
              onClose={() => setUserPopupOpen(false)}
              isHide={hideUserPopup}
              setIsHide={setHideUserPopup}
              openCreate={() => {
                setModalContent('new');
                setOpen(true);
              }}
              sessionStorageItem="hideCreatePopup"
            />
          )}
          {modalContent === 'new' && (
            <CreatePopup onClose={handleModalClose} open={open} />
          )}
          {modalContent === 'import' && (
            <ImportArtworks onClose={handleModalClose} open={open} />
          )}
        </header>
      ) : (
        isNeedNav && (
          <header className={styles.header}>
            <div className={styles.container}>
              <LogoWrapper onChangePath={handleChangePath} />
              <NavItems path={path} onChangePath={handleChangePath} />
              <div className={styles.search}>
                <div className={styles.icon}>
                  <Search color={search && 'var(--artiside-neutral1)'} />
                </div>
                <div className={styles.input}>
                  <input
                    ref={inputRef}
                    placeholder="Search"
                    value={search}
                    onChange={handleInputChange}
                  />
                </div>
                {search ? (
                  <button
                    className={styles.close}
                    onClick={() => setSearch('')}
                    aria-label="close"
                  >
                    <CloseCircle />
                  </button>
                ) : (
                  <button
                    className={styles.searchOpen}
                    onClick={() => {
                      inputRef.current.focus();
                      setShowResult(true);
                    }}
                    aria-label="focus"
                  >
                    /
                  </button>
                )}

                <div ref={searchRef}>
                  {search !== '' && (
                    <SearchResult
                      search={search}
                      className={
                        showResult
                          ? `${styles.searchResult} ${styles.on}`
                          : styles.searchResult
                      }
                    />
                  )}
                </div>
              </div>
              {isLoggedIn ? (
                <div className={styles.isConnect}>
                  <button
                    className={styles.createButton}
                    onClick={handleOpen}
                    aria-label="create"
                  >
                    <Pencil color="#FFFFFF" dimension="18px" />
                    <span>Create</span>
                  </button>
                  <div className={styles.connectBox}>
                    <ConnectBox />
                  </div>
                  <button className={styles.mobileButton} aria-label="search">
                    <Search color="var(--artiside-neutral3)" dimension="22px" />
                  </button>
                  <button
                    className={styles.mobileButton}
                    aria-label="search"
                    onClick={() => setMobileOpen(!mobileOpen)}
                  >
                    <Pencil color="var(--artiside-neutral3)" dimension="22px" />
                  </button>
                  <button className={styles.mobileButton} aria-label="wallet">
                    <Wallet color="var(--artiside-neutral3)" dimension="22px" />
                  </button>
                  <Menu
                    id="create-menu"
                    anchorEl={anchorEl}
                    open={menuOpen}
                    onClose={handleClose}
                    sx={{
                      '@media (max-width: 480px)': {
                        display: 'none',
                      },
                    }}
                    MenuListProps={{
                      'aria-labelledby': 'create-button',
                    }}
                  >
                    <ul className={styles.menu}>
                      <li
                        className={styles.list}
                        onClick={() => {
                          if (!hideUserPopup) {
                            setUserPopupOpen(true);
                            return;
                          }
                          setModalContent('new');
                          setOpen(true);
                        }}
                      >
                        <Pencil /> <h1>Share my inspiration</h1>
                      </li>
                      <li
                        className={styles.list}
                        onClick={() => {
                          if (!hideArtistPopup) {
                            setArtistPopupOpen(true);
                            return;
                          }
                          setModalContent('import');
                          setOpen(true);
                        }}
                      >
                        <Doodle /> <h1>Import my artworks</h1>
                      </li>
                    </ul>
                  </Menu>
                  {menuOpen && (
                    <MobileCreate
                      open={menuOpen}
                      isPartner={me?.isPartner}
                      onClose={() => setAnchorEl(null)}
                    />
                  )}
                </div>
              ) : (
                <div className={styles.buttonWrapper}>
                  <button
                    className={styles.signin}
                    type="button"
                    onClick={() => openModalPage('SIGNIN')}
                    aria-label="sign in"
                  >
                    Sign in
                  </button>
                  <button
                    className={styles.signup}
                    type="button"
                    onClick={() => router.push('/adf-signup')}
                    aria-label="sign up"
                  >
                    Sign up
                  </button>
                  {/* <ConnectButton onConnect={connect} /> */}
                </div>
              )}
              <div className={styles.mobileButtonWrapper}>
                <button
                  className={`${styles.mobileButton} ${styles.tabletButton}`}
                  aria-label="nav"
                  onClick={() => setMobileNavOpen(!mobileNavOpen)}
                >
                  <MobileSortIcon />
                </button>
                <button
                  className={styles.mobileButton}
                  aria-label="search"
                  onClick={() => {
                    router.push(
                      {
                        pathname: `/`,
                        query: { search: true },
                      },
                      undefined,
                      { shallow: true }
                    );
                  }}
                >
                  <Search
                    shape="search"
                    color="var(--artiside-neutral3)"
                    dimension="22px"
                  />
                </button>
              </div>
              <MobileSearch
                open={querySearch}
                search={search}
                onChange={(e) => setSearch(e.target.value)}
                onClose={() => {
                  router.back();
                  setSearch('');
                }}
                onRemove={() => setSearch('')}
              />
            </div>
            {modalContent === 'new' && (
              <>
                <CreatePopup onClose={handleModalClose} open={open} />
              </>
            )}
            {modalContent === 'import' && (
              <ImportArtworks onClose={handleModalClose} open={open} />
            )}
          </header>
        )
      )}
      {(!!isNavHidden || isNeedNav) && (
        <MobileNavigation
          isHidden={isNavHidden}
          isNeedNav={isNeedNav}
          path={path}
          onChangePath={handleChangePath}
          setPath={setPath}
        />
      )}
      {mobileNavOpen && (
        <MobileNavMenu
          open={mobileNavOpen}
          onClose={() => setMobileNavOpen(false)}
          onChangePath={handleChangePath}
          isPartner={me?.isPartner}
        />
      )}
    </>
  );
}

export default TopNav;
