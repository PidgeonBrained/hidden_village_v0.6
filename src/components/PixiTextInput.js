import React, { useEffect, useRef, useCallback } from 'react';
import { Container, Input } from '@inlet/react-pixi';
import TextInput from 'pixi-text-input';

const PixiTextInput = ({ x, y, width, height, value, onChange, style }) => {
  const inputRef = useRef(null);
  const textInputRef = useRef(null);

  const addInputToContainer = useCallback(() => {
    if (inputRef.current) {
      const input = new TextInput({
        input: {
          fontSize: '18px',
          padding: '12px',
          width: `${width}px`,
          color: '#26272E',
          ...style?.input, // Merge custom styles if provided
        },
        box: {
          default: { fill: 0xE8E9F3, rounded: 12, stroke: { color: 0xCBCEE0, width: 3 } },
          focused: { fill: 0xE1E3EE, rounded: 12, stroke: { color: 0xABAFC6, width: 3 } },
          disabled: { fill: 0xDBDBDB, rounded: 12 },
          ...style?.box, // Merge custom styles if provided
        }
      });

      input.x = x;
      input.y = y;
      input.width = width;
      input.height = height;
      input.text = value;

      input.on('input', (newValue) => {
        if (onChange) {
          onChange(newValue);
        }
      });

      input.on('', (newValue) => {
        if (onChange) {
          onChange(newValue);
        }
      });

      inputRef.current.addChild(input);
      textInputRef.current = input;

      // // Focus the input to ensure it can receive keyboard events
      // input.focus();

      return () => {
        if (inputRef.current) {
          inputRef.current.removeChild(input);
        }
        input.destroy();
      };
    }
  }, [x, y, width, height, value, onChange, style]);

  useEffect(() => {
    const cleanup = addInputToContainer();
    return cleanup;
  }, [addInputToContainer]);

  // Ensure the input receives focus when the component mounts
  useEffect(() => {
    if (textInputRef.current) {
      textInputRef.current.focus();
    }
  }, []);

  return <Container ref={inputRef} interactive={true} />;
};

export default PixiTextInput;