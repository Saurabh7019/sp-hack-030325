import * as React from 'react';
import styles from './GuidedSiteTour.module.scss';
import * as strings from 'GuidedSiteTourWebPartStrings';
import { GuidedSiteTourService } from './GuidedSiteTourService';
import type { IGuidedSiteTourProps } from './IGuidedSiteTourProps';
import type { IGuideSiteTourState } from './IGuidedSiteTourState';
import { ITourItem, ISteps } from './ITourItem';
import { Icon } from '@fluentui/react/lib/Icon';
import Tours from 'reactour';
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';

import DOMPurify from 'dompurify';
import { CustomCheckbox } from './CustomCheckbox';

export default class GuidedSiteTour extends React.Component<IGuidedSiteTourProps, IGuideSiteTourState> {
  private _service: GuidedSiteTourService;

  constructor(props: IGuidedSiteTourProps) {
    super(props);
    this.state = {
      items: [],
      steps: [],
      isTourActive: false,
      stepIndex: 0,
      checked: false
    };

    this._service = new GuidedSiteTourService();
  }

  public async componentDidMount(): Promise<void> {
    try {
      const [items, checked] = await Promise.all([
        this._service.GetTourContent(this.props.spHttpClient, this.props.siteUrl),
        this._service.GetUserProfileProperties(this.props.spHttpClient, this.props.userLoginName, this.props.siteUrl)
      ]);

      const steps = this._getSteps(items);

      this.setState({
        items, checked, steps, isTourActive: !checked
      });

    } catch (error) {
      console.error('Error in componentDidMount:', error);
    }
  }

  public render(): React.ReactElement<IGuidedSiteTourProps> {
    return (
      <>
        {this.state.steps && this.state.steps.length > 0 &&
          <Tours
            steps={this.state.steps}
            isOpen={this.state.isTourActive}
            onRequestClose={() => this.setState({ isTourActive: false })}
            showCloseButton={true}
            showNavigation={true}
            showNavigationNumber={true}
            showNumber={true}
            showButtons={true}
            disableDotsNavigation={false}
            disableKeyboardNavigation={false}
            accentColor='#0078d4'
            maskSpace={10}
            onAfterOpen={this._disableBody}
            onBeforeClose={this._enableBody}
          />
        }

        <section className={`${styles.guidedSiteTour}`}>
          <Icon iconName="PlaySolid" onClick={this._initializeTour} className={styles.circleIcon} />
        </section>
      </>
    );
  }


  private _onCheckChange = async (ev?: React.FormEvent<HTMLElement | HTMLInputElement>, isChecked?: boolean): Promise<void> => {
    const checkedValue = isChecked !== undefined ? isChecked : false;
    await this._service.SetUserProfileProperties(this.props.spHttpClient, this.props.userLoginName, checkedValue);

    this.setState({
      checked: isChecked
    });
  }

  /**
     * initilizes site tour
     * returns @{void}
     */
  private _initializeTour = (): void => {
    const steps = this._getSteps(this.state.items);
    this.setState(
      {
        isTourActive: true,
        steps
      }
    );
  }

  /**
  * Generates an array of Joyride steps based on the provided tour items.
  * @param {ITourItem[]} items - The array of tour items.
  * @returns {ISteps[]} - The array of Joyride steps.
  */
  private _getSteps(items: ITourItem[]): ISteps[] {
    const steps: ISteps[] = [];
    let isFirst: boolean = true;

    // Iterate through each tour item to generate Joyride steps
    items.forEach((item: ITourItem) => {
      let html: React.ReactNode = this._sanitizeAndSetInnerHTML(item.title, item.description);

      // If the item has order 0, append a CustomCheckbox to the HTML content
      if (item.order !== null && item.order.toString() === '0') {
        html = (
          <>
            {html}
            <CustomCheckbox
              label={strings.disableAutoPlay}
              checked={this.state.checked ?? false}
              onChange={this._onCheckChange}
            />
          </>
        );
      }

      // let placement = 'bottom';
      const target = this._target(item.selector, item.controlId);

      if (target) {
        const step: ISteps = {
          content: html,
          selector: target,
          order: item.order,
          disableBeacon: !isFirst,
          // placement,
        };

        steps.push(step);
        isFirst = false;
      }
    });

    return steps;
  }

  /**
 * Sanitizes the HTML content using DOMPurify and returns a React node
 * with dangerously set inner HTML.
 * @param {string} title - The title to be included in the sanitized HTML.
 * @param {string} description - The description to be included in the sanitized HTML.
 * @returns {React.ReactNode} - React node with sanitized inner HTML.
 */
  private _sanitizeAndSetInnerHTML(title: string, description: string): React.ReactNode {
    const sanitizedContent = DOMPurify.sanitize(`
      <div class="${styles.header}">
        ${title}
      </div>
      ${description}`,
      { ALLOWED_TAGS: ["div", "iframe", "ul", "li", "br", "b", "style", "span", "img"], ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling', 'style'] }
    );

    return <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />;
  }

  /**
   * Get the target selector for Joyride's step based on the provided parameters.
   * @param {string} selector - The type of selector (e.g., 'class', 'id', 'heading', 'webpartId', null).
   * @param {string} controlId - The control ID associated with the target.
   * @returns {string} - The target selector string.
   */
  private _target(selector: string, controlId: string): string {
    let target: string = '';

    switch (selector) {
      case 'class':
        target = `.${controlId}`;
        break;
      case 'id':
        target = `#${controlId}`;
        break;
      case 'heading':
        // Find heading elements with role='heading' and match the provided control ID
        document.querySelectorAll(`[role='heading']`).forEach((el) => {
          if (controlId && el.textContent && controlId.trim() === el.textContent.trim()) {
            // Find the closest ancestor with class 'ControlZone'
            const ele: HTMLElement | null = el.closest('.ControlZone');
            if (ele) {
              // Set the target selector based on the ancestor's ID
              target = `[id='${ele.id}']`;
            }
          }
        });
        break;
      case 'webpartId':
        target = `[data-sp-feature-instance-id='${controlId}']`;
        break;
      case null:
        // Default to 'body' if selector is null
        target = `body`;
        break;
      default:
        break;
    }

    return target;
  }

  private _disableBody = (target: HTMLDivElement): void => disableBodyScroll(target);
  private _enableBody = (target: HTMLDivElement): void => enableBodyScroll(target);
}
