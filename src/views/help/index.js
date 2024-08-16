import Link from 'next/link';
import { useRouter } from 'next/router';

import styles from './Help.module.scss';
import HelpBox from './components/help-box/HelpBox';
import HelpQuestion from '@/components/ui/Icons/HelpQuestion';
import HelpContact from '@/components/ui/Icons/HelpContact';
import HelpBook from '@/components/ui/Icons/HelpBook';
import MediumFooter from '@/components/ui/Icons/MediumFooter';
import TwitterFooter from '@/components/ui/Icons/TwitterFooter';
import InstagramFooter from '@/components/ui/Icons/InstagramFooter';
import DiscordFooter from '@/components/ui/Icons/DiscordFooter';
import MobileHeader from '@/components/mobile-ui/MobileHeader/MobileHeader';

function Help() {
  const router = useRouter();

  return (
    <>
      <MobileHeader title="Help Center" onClick={() => router.push('/')} />
      <section className={styles.section}>
        <div className={styles.helpContainer}>
          <h1>Help Center</h1>

          <Link
            href={{
              pathname: 'mailto:business@artdefinance.io',
              query: 'subject=[Business%20Suggestion]',
            }}
          >
            <HelpBox>
              <div className={styles.wrapper}>
                <HelpContact />
                <div className={styles.text}>
                  <div>Contact Us!</div>
                  <p>Contact us if you have any business inquiries</p>
                </div>
              </div>
            </HelpBox>
          </Link>

          <Link
            href={{
              pathname: 'mailto:help@artdefinance.io',
              query: 'subject=[Service%20Inquiry]',
            }}
          >
            <HelpBox>
              <div className={styles.wrapper}>
                <HelpQuestion />
                <div className={styles.text}>
                  <div>Submit a new request</div>
                  <p>
                    Please let us know if you have trouble using our service
                  </p>
                </div>
              </div>
            </HelpBox>
          </Link>

          <Link
            href="https://docs.artdefinance.io/how-to-use/artiside-user-guide"
            target="_blank"
          >
            <HelpBox>
              <div className={styles.wrapper}>
                <HelpBook />
                <div className={styles.text}>
                  <div>How to Use?</div>
                  <p>Click here for detailed documentation of artiside!</p>
                </div>
              </div>
            </HelpBox>
          </Link>
        </div>
        <div className={styles.socialContainer}>
          <Link href="https://medium.com/@Art_de_Finance" target="_blank">
            <MediumFooter />
          </Link>
          <Link href="https://twitter.com/ArtdeFinance" target="_blank">
            <TwitterFooter />
          </Link>
          <Link
            href="https://www.instagram.com/artiside_global"
            target="_blank"
          >
            <InstagramFooter />
          </Link>
          <Link
            href="https://discord.com/invite/art-de-finance"
            target="_blank"
          >
            <DiscordFooter />
          </Link>
        </div>
      </section>
    </>
  );
}

export default Help;
