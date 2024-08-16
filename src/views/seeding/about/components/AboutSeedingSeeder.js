import Image from 'next/image';

import ContentBox from '@/views/seeding/about/components/Wrapper/ContentBox/ContentBox';
import TextWrapper from './Wrapper/TextWrapper/TextWrapper';
import ContentWrapper from './Wrapper/ContentWrapper/ContentWrapper';
import ImageWrapper from './Wrapper/ImageWrapper/ImageWrapper';

const AboutSeedingSeeder = () => (
  <ContentBox>
    <ContentWrapper>
      <ImageWrapper>
        <Image
          width={502}
          height={465}
          src={'/assets/images/about-seeding/about-seeding-seeder.svg'}
          alt={'seeding reward seeders'}
        />
      </ImageWrapper>

      <TextWrapper>
        <p>
          <b>‘Seeding’</b> is when members stake $ADF in the <br />
          Artiside platform in the Seeding Program.
        </p>
        <p>
          The Seeding Program of Artiside aims to <br />
          support artists and grow together with Stakers. <br />
          Therefore, Stakers participate in Seeding for the <br />
          artists they want to support.
        </p>
        <p>
          The Staker, or <b>&apos;Seeder&apos;</b> who participates in <br />
          Seeding by selecting an artist receives a <br />
          portion of the profits obtained through Seeding, <br />
          which is shared with the artist.
        </p>
      </TextWrapper>
      <ImageWrapper display="mobile">
        <Image
          width={265}
          height={340}
          src={'/assets/images/about-seeding/mobile/about-seeding-seeder.svg'}
          alt={'seeding reward seeders'}
        />
      </ImageWrapper>
    </ContentWrapper>
  </ContentBox>
);

export default AboutSeedingSeeder;
