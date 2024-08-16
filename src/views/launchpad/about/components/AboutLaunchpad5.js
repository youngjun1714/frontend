import Image from 'next/image';

import ContentBox from '@/views/launchpad/about/components/Wrapper/ContentBox/ContentBox';
import TextWrapper from './Wrapper/TextWrapper/TextWrapper';
import ImageWrapper from './Wrapper/ImageWrapper/ImageWrapper';

const AboutLaunchpad5 = () => (
  <ContentBox>
    <ImageWrapper>
      <Image
        width={435}
        height={421}
        src={'/assets/images/launchpad/about-launchpad-5.svg'}
        alt={'about seeding episodes'}
      />
    </ImageWrapper>
    <TextWrapper>
      <div>05</div>
      <b>Check the voting results and receive Rewards.</b>
      <p>
        Depending on the voting results, one artist will be selected to
        participate in the next round of Seeding pool, and if the artist you
        voted for is finally selected, you will receive additional Rewards than
        other voters.
      </p>
      <ul>
        <li> Claiming is necessary after a request to receive the Reward.</li>
        <li>
          Staking Rewards will still be provided even if you didn&apos;t
          participate in the voting.
        </li>
      </ul>
    </TextWrapper>

    <ImageWrapper display="mobile">
      <Image
        width={248}
        height={256}
        src={'/assets/images/launchpad/mobile-about-launchpad-5.svg'}
        alt={'get whitelist'}
      />
    </ImageWrapper>
  </ContentBox>
);

export default AboutLaunchpad5;
