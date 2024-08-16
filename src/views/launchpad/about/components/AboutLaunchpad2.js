import Image from 'next/image';

import ContentBox from '@/views/launchpad/about/components/Wrapper/ContentBox/ContentBox';
import TextWrapper from './Wrapper/TextWrapper/TextWrapper';
import ImageWrapper from './Wrapper/ImageWrapper/ImageWrapper';

const AboutLaunchpad2 = () => (
  <ContentBox>
    <TextWrapper>
      <div>02</div>
      <b>Participate in Seeding and acquire Whitelist privileges.</b>
      <p>
        To use the <b>Staking service</b>, which is the beginning of{' '}
        <b>Launchpad</b>, it is required to acquire <b>Whitelist</b> privileges.
        It&apos;s simple! Just participate in <b>Seeding</b> with the{' '}
        <b>ADF tokens</b> prepared in your wallet, and you&apos;re done!
        <br />
        <br />
        *Make sure to have <b>ADF/MATIC tokens</b> ready <br />
        in your wallet for <b>Seeding and Staking</b>.
      </p>
    </TextWrapper>
    <ImageWrapper align="right">
      <Image
        width={586}
        height={247}
        src={'/assets/images/launchpad/about-launchpad-2.svg'}
        alt={'about seeding episodes'}
      />
    </ImageWrapper>

    <ImageWrapper display="mobile">
      <Image
        width={261}
        height={325}
        src={'/assets/images/launchpad/mobile-about-launchpad-2.svg'}
        alt={'get whitelist'}
      />
    </ImageWrapper>
  </ContentBox>
);

export default AboutLaunchpad2;
