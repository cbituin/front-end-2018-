import { arrayOf, shape, string } from 'prop-types';
import ReactPlayer from 'react-player';
import RssParser from 'rss-parser';
import Head from 'components/head';
import Alert from 'components/Alert/Alert';
import HeroBanner from 'components/HeroBanner/HeroBanner';
import Card from 'components/Cards/Card/Card';
import Content from 'components/Content/Content';
import AccordionItem from 'components/Accordion/AccordionItem/AccordionItem';
import styles from './styles/podcasts.css';

class Podcasts extends React.Component {
  static async getInitialProps() {
    const parser = new RssParser();

    try {
      const feed = await parser.parseURL('http://operationcode.libsyn.com/rss');

      const episodes = feed.items.map(({ itunes: { image }, link, title, contentSnippet }) => ({
        image,
        name: title,
        source: link,
        story: contentSnippet,
      }));

      return { episodes };
    } catch (error) {
      return { error };
    }
  }

  static propTypes = {
    episodes: arrayOf(shape({ image: string, name: string, source: string, story: string })),
    error: shape({ name: string }),
  };

  static defaultProps = {
    episodes: [],
    error: undefined,
  };

  render() {
    const { episodes, error } = this.props;
    const pageTitle = 'Podcasts';

    return (
      <>
        <Head title={pageTitle} />

        <HeroBanner title={pageTitle}>
          <p>Come listen to some inspiring stories of our vets transitioning into tech!</p>
        </HeroBanner>

        <Content
          columns={
            error ? (
              <Alert isOpen>Something went wrong on our end...</Alert>
            ) : (
              episodes.map(({ name, image, source, story }) => {
                /*
                 * Some episodes have multiple parts and are named like "${Name}, part 1".
                 * Some episodes are named "${Name} Interview"
                 *
                 * Parsing them in this manner ensures that the name of the interviewee is
                 * available and used for the image alt tag.
                 */
                const interviewee = name.replace(/ interview/gi, '').split(',')[0];

                return (
                  <Card data-testid="podcast-card" className={styles.content}>
                    <img src={image} alt={interviewee} className={styles.img} />

                    <ReactPlayer url={source} controls width="80%" height="65px" />

                    <AccordionItem title={name} content={story} key={name} />
                  </Card>
                );
              })
            )
          }
        />
      </>
    );
  }
}

export default Podcasts;
