import Image from 'next/image';

import ContentBox from '@/views/launchpad/about/components/Wrapper/ContentBox/ContentBox';
import TextWrapper from './Wrapper/TextWrapper/TextWrapper';
import ImageWrapper from './Wrapper/ImageWrapper/ImageWrapper';

const AboutLaunchpad6 = () => (
  <ContentBox>
    <TextWrapper>
      <div>06</div>
      <b>
        Once the voting period ends, please make sure to press the ‘Unstake’
        button.
      </b>
      <p>
        Pressing the Unstake button concludes your participation in Launchpad.
        Forgot to vote? Even if you couldn&apos;t participate in voting but
        participated in Staking, don&apos;t be too disappointed. Rewards for
        Staking are waiting for you. Don&apos;t forget to request Rewards on the
        My wallet page!
      </p>
      <ul>
        <li>After the round ends, any remaining VP will be carried over.</li>
      </ul>
    </TextWrapper>
    <ImageWrapper align="right">
      <Image
        width={600}
        height={491}
        src={'/assets/images/launchpad/about-launchpad-6.svg'}
        alt={'about seeding episodes'}
      />
    </ImageWrapper>

    <ImageWrapper display="mobile">
      <Image
        width={276}
        height={318}
        src={'/assets/images/launchpad/mobile-about-launchpad-6.svg'}
        alt={'get whitelist'}
      />
    </ImageWrapper>
  </ContentBox>
);

export default AboutLaunchpad6;
