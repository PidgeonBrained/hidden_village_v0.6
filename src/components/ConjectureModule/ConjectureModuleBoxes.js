import React, { useState } from 'react';
import { Graphics, Text } from "@inlet/react-pixi";
import { TextStyle } from "@pixi/text";
import { yellow, blue, green, white, red, black } from "../../utils/colors";
import InputBox from "../InputBox";
import { getEditLevel } from './ConjectureModule';

function createInputBox(charLimit, scaleFactor, widthMultiplier, xMultiplier, yMultiplier, textKey, totalWidth, totalHeight, inputCallback) {
  const text = localStorage.getItem(textKey)?.slice(0, charLimit) +
               (localStorage.getItem(textKey)?.length > charLimit ? '...' : '');

  const height = totalHeight * scaleFactor;
  const width = totalWidth * widthMultiplier;
  const x = totalWidth * xMultiplier;
  const y = totalHeight * yMultiplier;

  
  return (
    <InputBox
      height={height}
      width={width}
      x={x}
      y={y}
      color={white}
      fontSize={totalWidth * 0.012}
      fontColor={black}
      text={text}
      fontWeight={500}
      outlineColor={black}
      callback={() => {
        if(getEditLevel())
          inputCallback(textKey);
      }}
    />
  );
}

export const NameBox = (props) => {
  const { height, width } = props;

  let titleText = "";
  if(getEditLevel())
    titleText = "Level Editor";
  else
    titleText = "Level Preview";

  function handleBoxInput(key) {
    const existingValue = localStorage.getItem(key);
    const newValue = prompt(`Please Enter Your Value for ${key}`, existingValue);

    if (newValue !== null) {
      localStorage.setItem(key, newValue);
    }
  }

  return (
    <>
      {/* charLimit, scaleFactor, widthMultiplier, xMultiplier, yMultiplier, textKey, totalWidth, totalHeight, callback*/}
      {createInputBox(220, 0.19, 1.595, 0.134, 0.57, 'Multiple Choice 1', width, height, handleBoxInput)}
      {createInputBox(220, 0.19, 1.595, 0.134, 0.66, 'Multiple Choice 2', width, height, handleBoxInput)}
      {createInputBox(220, 0.19, 1.595, 0.134, 0.75, 'Multiple Choice 3', width, height, handleBoxInput)}
      {createInputBox(220, 0.19, 1.595, 0.134, 0.84, 'Multiple Choice 4', width, height, handleBoxInput)}
      {createInputBox(60, 0.10, 0.54, 0.143+ 0.062, 0.136-.050, 'Conjecture Name', width, height, handleBoxInput)}
      {createInputBox(220, 0.10, .3, 0.46+ 0.062, 0.136-.050, 'Author Name', width, height, handleBoxInput)}
      {createInputBox(220, 0.30, 1.595, 0.134, 0.175-.050, 'Conjecture Description', width, height, handleBoxInput)}
      {createInputBox(220, 0.10, 1.268, 0.203 + 0.062, 0.295-.050, 'Conjecture Keywords', width, height, handleBoxInput)}

      {/* text, xMultiplier, yMultiplier, fontSizeMultiplier, totalWidth, totalHeight, color */}
      {createTextElement("KEYWORDS:", 0.137+ 0.062, 0.315-0.05, 0.018, width, height)}
      {createTextElement("PIN:", 0.605+ 0.062, 0.155-0.05, 0.018, width, height)}
      {createTextElement("AUTHOR:", 0.41+ 0.062, 0.155-0.05, 0.018, width, height)}
      {createTextElement("CURRENT M-CLIP:", 0.45, 0.305, 0.018, width, height)}
      {createTextElement("MULTIPLE CHOICE", 0.45, 0.533, 0.018, width, height)}
      {createTextElement(titleText, 0.45, 0.05, 0.025, width, height)}
      {createTextElement("NAME:", 0.108+ 0.062, 0.155-0.05, 0.018, width, height)}

    </>
  );
}

function createTextElement(text, xMultiplier, yMultiplier, fontSizeMultiplier, totalWidth, totalHeight, color = blue) {
  return (
    <Text
      text={text}
      x={totalWidth * xMultiplier}
      y={totalHeight * yMultiplier}
      style={
        new TextStyle({
          align: "left",
          fontFamily: "Arial",
          fontSize: totalWidth * fontSizeMultiplier,
          fontWeight: 800,
          fill: [color],
          letterSpacing: 0,
        })
      }
      anchor={0.5}
    />
  );
}

export const PINBox = (props) => {
  const { height, width } = props;

  // Creates a popup in which the user can set a pin for their conjecture
  function pinBoxInput() {
    if(getEditLevel()){
      const existingPin = localStorage.getItem('PIN');
      let pin = prompt("Please Enter Your PIN", existingPin);

      if (!isNaN(pin) && pin !== null) {
        localStorage.setItem('PIN', pin);
      } else if (pin !== null) {
        alert('PIN must be numeric');
      }
    }
  }

  return (
      <>
      {/* PINBox InputBox */}
      <InputBox
        height={height * 0.10}
        width={width * 0.2}
        x={width * 0.6910}
        y={height * 0.085}
        color={white}
        fontSize={width * 0.013}
        fontColor={black}
        text={
          localStorage.getItem('PIN') || ' ' // Show existing PIN if available
        }
        fontWeight={300}
        callback={pinBoxInput} // Create Popup
      />
      </>
  )
}
