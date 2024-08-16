import Image from 'next/image';

import ContentBox from '@/views/launchpad/about/components/Wrapper/ContentBox/ContentBox';
import TextWrapper from './Wrapper/TextWrapper/TextWrapper';
import ImageWrapper from './Wrapper/ImageWrapper/ImageWrapper';

const AboutLaunchpad3 = () => (
  <ContentBox>
    <ImageWrapper>
      <Image
        width={563}
        height={606}
        src={'/assets/images/launchpad/about-launchpad-3.svg'}
        alt={'about seeding episodes'}
      />
    </ImageWrapper>
    <TextWrapper maxWidth="530px">
      <div>03</div>
      <b>
        You need Voting Power (VP) to participate in voting. That&apos;s why
        Staking is a must!
      </b>
      <p>
        By participating in Staking with ADF tokens, you can receive VP (Voting
        Power) and Staking Rewards simultaneously. Also, don&apos;t forget that
        VP and Staking Rewards vary depending on the amount of Staking. The VP
        you earn here is crucial for voting.
        <br />
        <br />
        *VP is generated hourly during the Voting Round period.
      </p>
    </TextWrapper>

    <ImageWrapper display="mobile">
      <Image
        width={270}
        height={388}
        src={'/assets/images/launchpad/mobile-about-launchpad-3.svg'}
        alt={'get whitelist'}
      />
    </ImageWrapper>
  </ContentBox>
);

export default AboutLaunchpad3;
