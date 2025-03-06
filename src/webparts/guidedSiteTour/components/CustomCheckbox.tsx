import * as React from 'react';
import { useState, useEffect } from 'react';
import { Checkbox } from '@fluentui/react/lib/Checkbox';
import styles from './GuidedSiteTour.module.scss';

export const CustomCheckbox: React.FC<{ checked: boolean; onChange: (ev?: React.FormEvent<HTMLElement | HTMLInputElement>, isChecked?: boolean) => void; label: string }> = ({
    checked,
    onChange,
    label
}) => {

    const [isChecked, setIsChecked] = useState(checked);

    useEffect(() => {
        setIsChecked(checked);
    }, [checked]);

    const handleChange = (ev?: React.FormEvent<HTMLElement | HTMLInputElement>, isChecked?: boolean): void => {
        setIsChecked(isChecked ?? false);
        onChange?.(ev, isChecked);
    };

    return <Checkbox label={label} checked={isChecked} onChange={handleChange} className={styles.chkBox} />;
}
