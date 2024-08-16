import Image from 'next/image';

import ContentBox from '@/views/seeding/about/components/Wrapper/ContentBox/ContentBox';
import ContentWrapper from './Wrapper/ContentWrapper/ContentWrapper';
import TextWrapper from './Wrapper/TextWrapper/TextWrapper';
import ImageWrapper from './Wrapper/ImageWrapper/ImageWrapper';

const AboutSeedingPending = () => (
  <ContentBox>
    <ContentWrapper>
      <ImageWrapper>
        <Image
          width={521}
          height={715}
          src={'/assets/images/about-seeding/about-seeding-lockup.svg'}
          alt={'about seeding lockup period'}
        />
      </ImageWrapper>

      <TextWrapper>
        <p>
          If you earn rewards through Seeding, <br />
          make sure to request them <b>within 2 weeks</b> <br />
          after the Episode ends. Unrequested rewards within <br />
          the designated period will go to the Community <br />
          Pool.
        </p>
        <p>
          You can claim the rewards to your wallet <br />
          <b>after 12 weeks of lock-up period.</b> <br />
          Rewards that are in the lock-up period can be <br />
          viewed in the <b>’Pending Rewards’</b> section under <br />
          [Wallet] {'>'} [Reward].
        </p>
        <p>
          You&apos;ll <b>receive 10%</b> of the pending reward <br />
          if you choose to claim the rewards immediately, <br />
          while waiting for the lock-up period will allow <br />
          you to <b>claim the full 100%</b> reward.
        </p>
        <p>
          Remember to claim the rewards to use <br />
          them as assets.
        </p>
      </TextWrapper>

      <ImageWrapper display="mobile">
        <Image
          width={265}
          height={426}
          src={'/assets/images/about-seeding/mobile/about-seeding-lockup.svg'}
          alt={'about seeding lockup period'}
        />
      </ImageWrapper>
    </ContentWrapper>
  </ContentBox>
);

export default AboutSeedingPending;
