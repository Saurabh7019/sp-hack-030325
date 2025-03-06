import * as React from 'react';
import styles from './ComponentPreferences.module.scss';
import { Icon } from '@fluentui/react/lib/Icon';
import { IFeedbackComponents, IFeedbackComponentsReaction } from './../IFeedbackItem';

export interface IPreferencesProps {
  feedbackComponents: IFeedbackComponents[];
  componentReactions: IFeedbackComponentsReaction;
  updateFeedbackReaction: (reactionType: 'Like' | 'Dislike', componentInternalName: string) => Promise<void>;
}

export const ComponentPreferences: React.FC<IPreferencesProps> = ({ feedbackComponents, componentReactions, updateFeedbackReaction }) => {
  return (
    <ul className={styles.preferences}>
      {feedbackComponents.map(item => {
        const isLiked = componentReactions && componentReactions[item.ComponentInternalName] === 'Like';
        const isDisliked = componentReactions && componentReactions[item.ComponentInternalName] === 'Dislike';

        return (
          <li key={item.Order}>
            <span className={styles.leftContent}>
              <Icon iconName={item.Icon} />
              <span id={item.ComponentInternalName}>{item.Title}</span>
            </span>

            <span className={styles.rightContent}>
              <Icon
                iconName={isLiked ? 'LikeSolid' : 'Like'}
                onClick={() => updateFeedbackReaction('Like', item.ComponentInternalName)}
              />
              <Icon
                iconName={isDisliked ? 'DislikeSolid' : 'Dislike'}
                onClick={() => updateFeedbackReaction('Dislike', item.ComponentInternalName)}
              />
            </span>
          </li>
        );
      })}
    </ul>
  );
};