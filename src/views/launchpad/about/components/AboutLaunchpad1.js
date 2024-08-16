import Image from 'next/image';

import ContentBox from '@/views/launchpad/about/components/Wrapper/ContentBox/ContentBox';
import TextWrapper from './Wrapper/TextWrapper/TextWrapper';
import ImageWrapper from './Wrapper/ImageWrapper/ImageWrapper';

const AboutLaunchpad1 = () => (
  <ContentBox>
    <ImageWrapper>
      <Image
        width={648}
        height={430}
        src={'/assets/images/launchpad/about-launchpad-1.svg'}
        alt={'get whitelist'}
      />
    </ImageWrapper>

    <TextWrapper maxWidth="530px">
      <div>01</div>
      <b>
        Introducing Launchpad, a decentralized service where artists to
        participate in the Seeding pool are selected through the votes of
        Seeders.
      </b>
      <p>
        Seeders, who are contributing to the development of the ADF ecosystem
        through the Seeding program, will be granted Whitelist access to
        participate in Launchpad. Whitelisted individuals acquire Voting Power
        (VP) through staking and utilize this VP to participate in voting.
      </p>
    </TextWrapper>

    <ImageWrapper display="mobile">
      <Image
        width={285}
        height={348}
        src={'/assets/images/launchpad/mobile-about-launchpad-1.svg'}
        alt={'get whitelist'}
      />
    </ImageWrapper>
  </ContentBox>
);

export default AboutLaunchpad1;
