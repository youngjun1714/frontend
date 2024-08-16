import Image from 'next/image';

import ContentBox from '@/views/seeding/about/components/Wrapper/ContentBox/ContentBox';
import ContentWrapper from './Wrapper/ContentWrapper/ContentWrapper';
import TextWrapper from './Wrapper/TextWrapper/TextWrapper';
import ImageWrapper from './Wrapper/ImageWrapper/ImageWrapper';

const AboutSeedingReward = (props) => (
  <ContentBox>
    <ContentWrapper>
      <ImageWrapper align="center">
        <Image
          width={274}
          height={490}
          src={'/assets/images/about-seeding/about-seeding-reward.svg'}
          alt={'about seeding reward'}
        />
      </ImageWrapper>

      <TextWrapper>
        <p>
          The Seeding rewards generated within <br />
          each group are distributed proportionally <br />
          to the amount of Seed for each artist when <br />
          an Episode ends.
        </p>
        <p>
          The distributed rewards are then divided <br />
          among the artists and the Seeders who <br />
          have participated in Seeding.
        </p>
      </TextWrapper>

      <ImageWrapper display="mobile">
        <Image
          width={228}
          height={386}
          src={'/assets/images/about-seeding/mobile/about-seeding-reward.svg'}
          alt={'about seeding reward'}
        />
      </ImageWrapper>
    </ContentWrapper>
  </ContentBox>
);

export default AboutSeedingReward;
