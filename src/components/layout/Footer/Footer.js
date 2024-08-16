import React from 'react';
import { useRouter } from 'next/router';
import styles from './Footer.module.scss';

import ArtisideLogoGray from '@/components/ui/Assets/ArtisideLogoGray';
import DiscordFooter from '@/components/ui/Icons/DiscordFooter';
import TwitterFooter from '@/components/ui/Icons/TwitterFooter';
import MediumFooter from '@/components/ui/Icons/MediumFooter';
import TelegramFooter from '@/components/ui/Icons/TelegramFooter';
import GitbookFooter from '@/components/ui/Icons/GitbookFooter';
import Link from 'next/link';
import Image from 'next/image';

function Footer() {
  const router = useRouter();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          <button aria-label="artiside logo" onClick={() => router.push('/')}>
            <ArtisideLogoGray />
          </button>
          <div className={styles.snsWrapper}>
            <div
              onClick={() =>
                window.open(`https://discord.com/invite/art-de-finance`)
              }
            >
              <DiscordFooter />
            </div>
            <div
              onClick={() => window.open(`https://twitter.com/ArtdeFinance`)}
            >
              <TwitterFooter />
            </div>
            {/* <div
              onClick={() =>
                window.open(`https://www.instagram.com/art_de_finance/`)
              }
            >
              <InstagramFooter />
            </div> */}
            <div
              onClick={() => window.open(`https://medium.com/@Art_de_Finance`)}
            >
              <MediumFooter />
            </div>

            <div onClick={() => window.open(`https://t.me/artdefinanceann`)}>
              <TelegramFooter />
            </div>
            {/* <div
              onClick={() =>
                window.open(`https://www.youtube.com/@artdefinance`)
              }
            >
              <YoutubeFooter />
            </div> */}
            <div onClick={() => window.open(`https://docs.artdefinance.io/`)}>
              <GitbookFooter />
            </div>
            <Link
              href="https://automation.chain.link/polygon/16658488834653047630317612310624919329282922426306827068709008694114758203853"
              target="_blank"
            >
              <Image
                src="/assets/images/about-seeding/with-chainlink-badge-automation.svg"
                alt="automation secured with chainlink"
                width={176}
                height={48}
              />
            </Link>
          </div>
        </div>
        <div className={styles.content}>
          <p className={styles.copyRight}>
            © 2024. Art de Finance. All Rights Reserved.
          </p>
          <ul className={styles.navMenu}>
            <li onClick={() => window.open('https://www.artdefinance.io/')}>
              Company
            </li>
            <li onClick={() => router.push('/help')}>Help Desk</li>
            <li onClick={() => router.push('/terms')}>Terms of Service</li>
            <li onClick={() => router.push('/privacy')}>Privacy Policy</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
