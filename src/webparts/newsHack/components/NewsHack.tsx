import * as React from 'react';
import styles from './NewsHack.module.scss';
import type { INewsHackProps } from './INewsHackProps';
import { IPersonaSharedProps, Persona, PersonaPresence } from '@fluentui/react/lib/Persona';
import { TestImages } from '@fluentui/example-data';

const examplePersona1: IPersonaSharedProps = {
  imageUrl: TestImages.personaFemale,
  imageInitials: 'AL',
  text: 'Annie Lindqvist',
  secondaryText: 'Software Engineer',
  tertiaryText: 'In a meeting',
  optionalText: 'Available at 4:00pm',
};

const examplePersona2: IPersonaSharedProps = {
  imageUrl: TestImages.personaMale,
  imageInitials: 'JD',
  text: 'Jhon Doe',
  secondaryText: 'Software Engineer',
  tertiaryText: 'In a meeting',
  optionalText: 'Available at 4:00pm',
};

export default class NewsHack extends React.Component<INewsHackProps> {
  public render(): React.ReactElement<INewsHackProps> {
    const {
      hasTeamsContext,
    } = this.props;

    return (
      <section className={`${styles.newsHack} ${hasTeamsContext ? styles.teams : ''}`}>
        <div className={styles.gridContainer}>

          <div className={styles.personaCard}>
            <div className={styles.personaCardImage}>
              <img src="https://insight.knowledgeworkx.com/media/k2/items/cache/5ab529a5ebdeee2caf2312423d91adb3_XL.jpg"
                alt="Card Image" />
            </div>
            <div className={styles.personaCardContent}>
              <div className={styles.personaCardTitle}>Contoso has recruited 1,000 foreign-born engineers</div>
              <div className={styles.personaCardDescription}>
                Foreign talent essential for both the economy and the green transition.
              </div>
            </div>
            <div className={styles.personaFooter}>
              <div className={styles.personaAvatar}>
                {/* <img src="https://raw.githubusercontent.com/ngOfficeUIFabric/officeuifabric.github.io/master/img/satyanadella-279x279.png"
                  alt="Profile" /> */}
                <Persona
                  {...examplePersona2}
                  presence={PersonaPresence.none}
                />
              </div>
              <div className={styles.personaDetails}>
                <div className={styles.personaName}>Oscar</div>
                <div className={styles.personaDate}>2025-02-28</div>
              </div>
              <div className={styles.personaLikedBy}>
                <p>Liked by</p>
                <span className={styles.personaLikedByList}>
                  <a href="/sv/PersonProfile/a7c0244a-e283-4365-97e5-0b1f848623a2">
                    <img alt="Christina Andersson" src="https://victoryepes.blogs.upv.es/files/2015/03/2ddece9.jpg"
                      className={styles.likedAvatar} />
                  </a>
                  <a href="/sv/PersonProfile/e5a3a501-d69b-4703-82f3-14a515366145">
                    <img alt="Anna Svensson" src="https://upload.wikimedia.org/wikipedia/commons/8/82/Terry_Notary_2018_%28cropped%29.jpg"
                      className={styles.likedAvatar} />
                  </a>
                  <button className={styles.likedByButton} type="button">
                    <div className={styles.likedByRemaining}>
                      <span>+49</span>
                    </div>
                  </button>
                </span>
              </div>

            </div>
          </div>

          <div className={styles.personaCard}>
            <div className={styles.personaCardContent}>
              <div className={styles.personaCardTitle}>Welcome to Celebrate Nouruz in Solna!</div>
              <div className={styles.personaCardDescription}>
                Norooz means &rsquo;new day&rsquo; and celebrates the arrival of spring, kicking off the year with the vernal equinox. New Year according to the ancient Zoroastrian calendar as celebrated by many people for thousands of years. This ancient festival, observed in Iran and many other countries, symbolizes fertility and new beginnings.
              </div>
            </div>
            <div className={styles.personaFooter}>
              <div className={styles.personaAvatar}>
                {/* <img src="https://raw.githubusercontent.com/ngOfficeUIFabric/officeuifabric.github.io/master/img/satyanadella-279x279.png"
                  alt="Profile" /> */}
                <Persona
                  {...examplePersona1}
                  presence={PersonaPresence.none}
                />
              </div>
              <div className={styles.personaDetails}>
                <div className={styles.personaName}>Elin Eriksson</div>
                <div className={styles.personaDate}>2025-03-13</div>
              </div>
              <div className={styles.personaLikedBy}>
                <p>Liked by</p>
                <span className={styles.personaLikedByList}>
                  <a href="/sv/PersonProfile/a7c0244a-e283-4365-97e5-0b1f848623a2">
                    <img alt="Christina Andersson" src="https://www.calledtocommunion.com/wp-content/uploads/2011/08/TerryJohnson.jpg"
                      className={styles.likedAvatar} />
                  </a>
                  <a href="/sv/PersonProfile/e5a3a501-d69b-4703-82f3-14a515366145">
                    <img alt="Anna Svensson" src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Jhon_Jairo_Vel%C3%A1squez.png/440px-Jhon_Jairo_Vel%C3%A1squez.png"
                      className={styles.likedAvatar} />
                  </a>
                  <button className={styles.likedByButton} type="button">
                    <div className={styles.likedByRemaining}>
                      <span>+23</span>
                    </div>
                  </button>
                </span>
              </div>
            </div>
          </div>

          <div className={styles.personaCard}>
            <div className={styles.personaCardImage}>
              <img src="https://www.comptoir-hardware.com/images/stories/_logos/windows-11-wallpaper.jpg"
                alt="Card Image" />
            </div>
            <div className={styles.personaCardContent}>
              <div className={styles.personaCardTitle}>Windows 11 Upgrade</div>
              <div className={styles.personaCardDescription}>
                This update is mandatory because Microsoft will end support for Windows 10 soon. Windows 11 offers a modern design, improved performance, and advanced security features to help you work both more efficiently and securely.
              </div>
            </div>
            <div className={styles.personaFooter}>
              <div className={styles.personaAvatar}>
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/John_Doe%2C_born_John_Nommensen_Duchac.jpg/348px-John_Doe%2C_born_John_Nommensen_Duchac.jpg"
                  alt="Profile" />
              </div>
              <div className={styles.personaDetails}>
                <div className={styles.personaName}>Björn Solem</div>
                <div className={styles.personaDate}>2025-03-10</div>
              </div>
              <div className={styles.personaLikedBy}>
                <p>Liked by</p>
                <span className={styles.personaLikedByList}>
                  <a href="/sv/PersonProfile/a7c0244a-e283-4365-97e5-0b1f848623a2">
                    <img alt="Christina Andersson" src="https://www.publicdomainpictures.net/pictures/270000/velka/buzzed-guy.jpg"
                      className={styles.likedAvatar} />
                  </a>
                  <a href="/sv/PersonProfile/e5a3a501-d69b-4703-82f3-14a515366145">
                    <img alt="Anna Svensson" src="https://cambodiaict.net/wp-content/uploads/2018/12/Victor-300x300.jpg"
                      className={styles.likedAvatar} />
                  </a>
                  <button className={styles.likedByButton} type="button">
                    <div className={styles.likedByRemaining}>
                      <span>+14</span>
                    </div>
                  </button>
                </span>
              </div>

            </div>
          </div>
          <div className={styles.personaCard}>
            <div className={styles.personaCardImage}>
              <img src="https://s3-us-west-2.amazonaws.com/courses-images/wp-content/uploads/sites/4279/2018/04/11212123/diverse-students-1024x683.jpg"
                alt="Card Image" />
            </div>
            <div className={styles.personaCardContent}>
              <div className={styles.personaCardTitle}>Opening day Inclusion & Diversity Week 2025</div>
              <div className={styles.personaCardDescription}>
                Today marks the opening day of Inclusion & Diversity Week. In these challenging and turbulent times, many of us believe that we need this more than ever.
              </div>
            </div>
            <div className={styles.personaFooter}>
              <div className={styles.personaAvatar}>
                <img src="https://www.jhrehab.org/wp-content/uploads/2015/06/Emilly-Marshall_sq-400x400.jpg"
                  alt="Profile" />
              </div>
              <div className={styles.personaDetails}>
                <div className={styles.personaName}>Jenny S</div>
                <div className={styles.personaDate}>2025-03-09</div>
              </div>
              <div className={styles.personaLikedBy}>
                <p>Liked by</p>
                <span className={styles.personaLikedByList}>
                  <a href="/sv/PersonProfile/a7c0244a-e283-4365-97e5-0b1f848623a2">
                    <img alt="Christina Andersson" src="https://universityinnovation.org/images/thumb/d/d6/Parot_Victor_Charoonsophonsak.JPG/300px-Parot_Victor_Charoonsophonsak.JPG"
                      className={styles.likedAvatar} />
                  </a>
                  <a href="/sv/PersonProfile/e5a3a501-d69b-4703-82f3-14a515366145">
                    <img alt="Anna Svensson" src="https://revistarivar.cl/images/editores/agui.jpg"
                      className={styles.likedAvatar} />
                  </a>
                  <button className={styles.likedByButton} type="button">
                    <div className={styles.likedByRemaining}>
                      <span>+97</span>
                    </div>
                  </button>
                </span>
              </div>

            </div>
          </div>
        </div>
      </section>
    );
  }
}
