import Image from 'next/image';

import ContentBox from '@/views/seeding/about/components/Wrapper/ContentBox/ContentBox';
import ContentWrapper from './Wrapper/ContentWrapper/ContentWrapper';
import TextWrapper from './Wrapper/TextWrapper/TextWrapper';
import ImageWrapper from './Wrapper/ImageWrapper/ImageWrapper';

const AboutSeedingUnseeding = () => (
  <ContentBox>
    <ContentWrapper>
      <TextWrapper>
        <p>
          &quot;Unseeding&quot; is when Seeders unstaking the amount <br />
          they have seeded to an artist in the Seeding program. <br />
          Unseeding must meet the following two conditions:
        </p>
        <p>
          <b>
            1. 4 days (+96 hours) after the last Seeding date <br />
            2. After the last Seeding Episode has ended
          </b>
        </p>
        <p>
          These conditions are calculated based on the date of <br />
          seeding for each artist, so the Unseeding eligibility may <br />
          vary for each artist. The Unseeding button will be <br />
          activated when Unseeding conditions are met.
        </p>
        <p>
          If you do not Unseeding the amount seeded in the <br />
          specific Episode, it will automatically be reseeded in the <br />
          next Episode. Auto Seeding is irrelevant to the <br />
          Unseeding conditions.
        </p>
      </TextWrapper>
      <ImageWrapper align="right">
        <Image
          width={576}
          height={691}
          src={'/assets/images/about-seeding/about-seeding-unseeding.svg'}
          alt={'about unseeding'}
        />
      </ImageWrapper>
      <ImageWrapper display="mobile">
        <Image
          width={400}
          height={1000}
          src={
            '/assets/images/about-seeding/mobile/about-seeding-unseeding.svg'
          }
          alt={'about unseeding'}
        />
      </ImageWrapper>
    </ContentWrapper>
  </ContentBox>
);

export default AboutSeedingUnseeding;
