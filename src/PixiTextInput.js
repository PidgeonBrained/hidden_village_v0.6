import * as PIXI from 'pixi.js';
import { Input } from '@pixi/ui';

class CustomTextInput extends PIXI.Container {
    constructor(options = {}) {
        super();

        this.input = new Input({
            input: {
                fontSize: '16px',
                padding: '10px',
                width: '200px',
                color: '#26272E',
                backgroundColor: '#DDDDDD',
                borderRadius: '5px',
                ...options.input
            },
            box: {
                default: { fill: 0xFFFFFF, rounded: 12 },
                focused: { fill: 0xAAAAAA, rounded: 12 },
                disabled: { fill: 0xDDDDDD, rounded: 12 },
                ...options.box
            }
        });

        this.addChild(this.input);

        this.input.on('focus', this.onFocus.bind(this));
        this.input.on('blur', this.onBlur.bind(this));
    }

    get value() {
        return this.input.text;
    }

    set value(val) {
        this.input.text = val;
    }

    onFocus() {
        console.log('Input focused');
    }

    onBlur() {
        console.log('Input blurred');
    }
}

export default CustomTextInput;