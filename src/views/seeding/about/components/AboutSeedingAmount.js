import Image from 'next/image';

import ContentBox from '@/views/seeding/about/components/Wrapper/ContentBox/ContentBox';
import ContentWrapper from './Wrapper/ContentWrapper/ContentWrapper';
import TextWrapper from './Wrapper/TextWrapper/TextWrapper';
import ImageWrapper from './Wrapper/ImageWrapper/ImageWrapper';

const AboutSeedingAmount = (props) => (
  <ContentBox>
    <ContentWrapper>
      <TextWrapper>
        <p>
          Those who have contributed a <b>larger Seeding amount</b> <br />
          and Seeders who have Seeded <b>early in the beginning</b> <br />
          of the Episode receive a higher proportion of the <br />
          rewards even if Seeders have Seeded the same artist.
        </p>
        <p>
          The artist&apos;s share is determined based on the <br />
          commission rate set by the artist (0-5%) for <br />
          distributing the rewards.
        </p>
        <p>
          The commission rate remains unchanged <br />
          during the progress of the Episode.
        </p>
      </TextWrapper>
      <ImageWrapper align="right">
        <Image
          width={535}
          height={525}
          src={'/assets/images/about-seeding/about-seeding-amount.svg'}
          alt={'about seeding larger amount'}
        />
      </ImageWrapper>
      <ImageWrapper display="mobile">
        <Image
          width={280}
          height={299}
          src={'/assets/images/about-seeding/mobile/about-seeding-amount.svg'}
          alt={'about seeding larger amount'}
        />
      </ImageWrapper>
    </ContentWrapper>
  </ContentBox>
);

export default AboutSeedingAmount;
