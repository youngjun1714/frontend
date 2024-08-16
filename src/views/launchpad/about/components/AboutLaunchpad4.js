import Image from 'next/image';

import ContentBox from '@/views/launchpad/about/components/Wrapper/ContentBox/ContentBox';
import TextWrapper from './Wrapper/TextWrapper/TextWrapper';
import ImageWrapper from './Wrapper/ImageWrapper/ImageWrapper';

const AboutLaunchpad4 = () => (
  <ContentBox>
    <TextWrapper>
      <div>04</div>
      <b>
        Voting lasts for 7 days, during which time it&apos;s important to
        carefully assess the capabilities of the artists before casting your
        vote.
      </b>
      <p>
        Once the final three artists are selected through ADF Partners for
        participation in Launchpad, the voting process will commence. Watch
        video clips introducing each artist&apos;s capabilities and cast your
        vote for your preferred candidate. Your valuable vote will increase the
        chances of talented artists being registered in the Seeding pool.
      </p>
    </TextWrapper>
    <ImageWrapper align="right">
      <Image
        width={479}
        height={376}
        src={'/assets/images/launchpad/about-launchpad-4.svg'}
        alt={'about seeding episodes'}
      />
    </ImageWrapper>

    <ImageWrapper display="mobile">
      <Image
        width={278}
        height={262}
        src={'/assets/images/launchpad/mobile-about-launchpad-4.svg'}
        alt={'get whitelist'}
      />
    </ImageWrapper>
  </ContentBox>
);

export default AboutLaunchpad4;
