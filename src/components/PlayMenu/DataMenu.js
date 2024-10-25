import React from 'react'
import { Container, Text, Graphics } from '@inlet/react-pixi';
import { powderBlue, skyBlue, cornflowerBlue, green, neonGreen, black, blue, white, pink, orange, red, transparent, turquoise } from "../../utils/colors";
import RectButton from "../RectButton";
import { useCallback } from "react";
import { TextStyle } from "@pixi/text";
import InputBox from "../InputBox";
import { Input } from 'postcss';
import { useEffect, useRef } from 'react';
import { getUserEmailFromDatabase } from "../../firebase/userDatabase"

const DataMenu = (props) => {
  const {
    menuWidth,
    menuHeight,
    x,
    y,
    trigger
  } = props;

  const innerRectWidth = menuWidth * 0.94;
  const innerRectHeight = menuHeight * 0.8; 
  const innerRectMargins = (menuWidth - innerRectWidth) / 2;
  const fieldTextMarginsFromInnerRect = menuHeight * 0.07;
  const fieldTextMarginsFromEachOther = menuHeight * 0.11;
  const fieldHeight = menuWidth * 0.028;
  const inputBoxHeight = fieldHeight * 2;
  const inputBoxTextSize = menuWidth * 0.02;
  const distanceFromFieldTextToField = menuWidth * 0.4;
  const checkButtonWidth = menuWidth * 0.07;
  const checkButtonFont = menuWidth * 0.05;
  const fieldText = new TextStyle({
    align: "center",                    
    fontFamily: "Arial",                 
    fontSize: fieldHeight,                    
    fontWeight: 1000,                 
    fill: [black],                      
  })

  const draw = useCallback(
    (g) => {
      g.clear();
      g.beginFill(cornflowerBlue);
      g.drawRect(x, y, menuWidth, menuHeight);
      g.endFill();
      g.beginFill(white);
      g.drawRoundedRect(
        x + innerRectMargins, 
        y + menuHeight - innerRectMargins - innerRectHeight,
        innerRectWidth, 
        innerRectHeight);
      g.endFill();
    },
    [menuHeight, menuWidth, x, y]
  );

  if (trigger) {
    return (
    <Container>
      <Graphics
        draw={draw}
        interactive={true}
      />
      <Text
        text={"DOWNLOAD DATA"}                                
        style={                                
          new TextStyle({
            align: "center",                      
            fontFamily: "Arial",                  
            fontSize: menuWidth * 0.03,                     
            fontWeight: 1000,                
            fill: [white],                     
          })
        }
        x={x + menuWidth / 2} // Center in menu
        y={y + (menuHeight - innerRectMargins - innerRectHeight) / 2} //Center in top margins
        anchor={0.5}
      />
      
      <Text
        text={"USER ID"}                             
        style={fieldText}
        x={x + innerRectMargins + fieldTextMarginsFromInnerRect} 
        y={y + menuHeight - innerRectMargins - innerRectHeight + fieldTextMarginsFromInnerRect}
        anchor={0}
      />
      <Text
        text={"GAME NAME"}                             
        style={fieldText}
        x={x + innerRectMargins + fieldTextMarginsFromInnerRect} 
        y={y + menuHeight - innerRectMargins - innerRectHeight + fieldTextMarginsFromInnerRect + fieldTextMarginsFromEachOther}
        anchor={0}
      />
      <Text
        text={"START DATE"}                             
        style={fieldText}
        x={x + innerRectMargins + fieldTextMarginsFromInnerRect} 
        y={y + menuHeight - innerRectMargins - innerRectHeight + fieldTextMarginsFromInnerRect + fieldTextMarginsFromEachOther * 2}
        anchor={0}
      />
      <Text
        text={"END DATE"}              
        style={fieldText}
        x={x + innerRectMargins + fieldTextMarginsFromInnerRect} 
        y={y + menuHeight - innerRectMargins - innerRectHeight + fieldTextMarginsFromInnerRect + fieldTextMarginsFromEachOther * 3}
        anchor={0}
      />
        <InputBox
          height={inputBoxHeight}
          width={(innerRectWidth - distanceFromFieldTextToField - fieldTextMarginsFromInnerRect * 2) / 0.4}
          x={x + innerRectMargins + fieldTextMarginsFromInnerRect + distanceFromFieldTextToField}
          y={y + menuHeight - innerRectMargins - innerRectHeight + fieldTextMarginsFromInnerRect - (fieldHeight / 2)}
          color={white}
          fontSize={inputBoxTextSize}  //  Dynamically modify font size based on screen width
          fontColor={black}
          text={getUserEmailFromDatabase()}
          fontWeight={600}
        />
      {/* <InputBox
        height={checkButtonWidth}
        width={checkButtonWidth}
        x={x + innerRectMargins + fieldTextMarginsFromInnerRect}
        y={y + menuHeight - innerRectMargins - innerRectHeight + fieldTextMarginsFromInnerRect + fieldTextMarginsFromEachOther * 4}
        color={white}
        fontSize={checkButtonFont}
        fontColor={black}
        text={"X"}
      /> */}
    </Container>
    )
} else {
    return <Container/>;
  }
}

export default DataMenu