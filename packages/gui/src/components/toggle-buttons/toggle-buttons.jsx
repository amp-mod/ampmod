import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import TWRenderRecoloredImage from '../../lib/tw-recolor/render.jsx';
import styles from './toggle-buttons.css';
import { ToggleGroup } from 'radix-ui';

const ToggleButtons = ({buttons, className, disabled}) => {
    const selectedValue = buttons.findIndex(b => b.isSelected);

    return (
        <ToggleGroup.Root
            type="single"
            className={classNames(className, styles.row, {
                [styles.disabled]: disabled
            })}
            value={selectedValue !== -1 ? String(selectedValue) : undefined}
            onValueChange={value => {
                if (value) {
                    buttons[Number(value)]?.handleClick();
                }
            }}
            disabled={disabled}
        >
            {buttons.map((button, index) => (
                <ToggleGroup.Item
                    key={`toggle-${index}`}
                    className={styles.button}
                    title={button.title}
                    aria-label={button.title}
                    value={String(index)}
                >
                    <TWRenderRecoloredImage
                        src={button.icon}
                        aria-hidden="true"
                        className={button.iconClassName}
                        draggable={false}
                    />
                </ToggleGroup.Item>
            ))}
        </ToggleGroup.Root>
    );
};

ToggleButtons.propTypes = {
    buttons: PropTypes.arrayOf(
        PropTypes.shape({
            title: PropTypes.string.isRequired,
            handleClick: PropTypes.func.isRequired,
            icon: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
            iconClassName: PropTypes.string,
            isSelected: PropTypes.bool
        })
    ),
    className: PropTypes.string,
    disabled: PropTypes.bool
};

ToggleButtons.defaultProps = {
    disabled: false
};

export default ToggleButtons;
