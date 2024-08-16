import Image from 'next/image';

import ContentBox from '@/views/seeding/about/components/Wrapper/ContentBox/ContentBox';
import TextWrapper from './Wrapper/TextWrapper/TextWrapper';
import ContentWrapper from './Wrapper/ContentWrapper/ContentWrapper';
import ImageWrapper from './Wrapper/ImageWrapper/ImageWrapper';

const AboutSeedingEpisode = () => (
  <ContentBox>
    <ContentWrapper>
      <TextWrapper>
        <p>
          The Seeding Program operates on a weekly basis <br />
          through <b>&apos;Episodes&apos;.</b> When an Episode opens, <br />
          Seeders are free to participate in Seeding for <br />
          multiple artists.
        </p>
        <p>
          Artists are grouped based on the amount of <br />
          Seeding they receive during the progress of an Episode. <br />
          The number of artists that can belong to each group <br />
          may vary, causing the composition of artists within a <br />
          group to fluctuate throughout the Episode.
        </p>
        <p>
          Since the amount of Reward generated within a <br />
          Seed Group is the same, the size of the distribution <br />
          reward pie varies depending on the number of <br />
          participants.
        </p>
      </TextWrapper>
      <ImageWrapper align="right">
        <Image
          width={624}
          height={604}
          src={'/assets/images/about-seeding/about-seeding-episode.svg'}
          alt={'about seeding episodes'}
        />
      </ImageWrapper>
      <ImageWrapper display="mobile">
        <Image
          width={400}
          height={1000}
          src={'/assets/images/about-seeding/mobile/about-seeding-episode.svg'}
          alt={'about seeding episodes'}
        />
      </ImageWrapper>
    </ContentWrapper>
  </ContentBox>
);

export default AboutSeedingEpisode;
