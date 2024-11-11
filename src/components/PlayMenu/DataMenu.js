import React from 'react'
import { Container, Text, Graphics } from '@inlet/react-pixi';
import { powderBlue, navyBlue, cornflowerBlue, green, neonGreen, black, blue, white, pink, orange, red, transparent, turquoise, yellow, gold, goldenRod, midnightBlue, royalBlue} from "../../utils/colors";
import RectButton from "../RectButton";
import { useCallback } from "react";
import { TextStyle } from "@pixi/text";
import InputBox from "../InputBox";
import { Input } from 'postcss';
import { useEffect, useRef, useState, } from 'react';
import { getUserEmailFromDatabase,  } from "../../firebase/userDatabase"
import { getFromDatabaseByGame,  } from "../../firebase/database"


function setLocalStorage(){
  localStorage.setItem("game_name", "");
  localStorage.setItem("start_date", "");
  localStorage.setItem("end_date", "");
  localStorage.setItem("all_data", "false");
  localStorage.setItem("csv", "false");
  localStorage.setItem("json", "false");
}


const DataMenu = (props) => {
  const {
    menuWidth,
    menuHeight,
    x,
    y,
    trigger
  } = props;

  // For fetching email when componenet first mounts
  const [userEmail, setUserEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const innerRectWidth = menuWidth * 0.94;
  const innerRectHeight = menuHeight * 0.8; 
  const innerRectMargins = (menuWidth - innerRectWidth) / 2;
  const fieldTextMarginsFromInnerRect = menuHeight * 0.07;
  const fieldTextMarginsFromEachOther = menuHeight * 0.11;
  const fieldHeight = menuWidth * 0.028;
  const inputBoxHeight = fieldHeight * 3;
  const inputBoxTextSize = menuWidth * 0.02;
  const distanceFromFieldTextToField = menuWidth * 0.3;
  const checkButtonWidth = menuWidth * 0.07;
  const checkButtonFont = menuWidth * 0.5;
  const fieldText = new TextStyle({
    align: "center",                    
    fontFamily: "Arial",                 
    fontSize: fieldHeight,                    
    fontWeight: 1000,                 
    fill: [black],                      
  })

  // When component mounts, user email is either loading, fetched, or reached an error
  useEffect(() => {
    const fetchEmail = async () => {
      try {
        setIsLoading(true);
        const email = await getUserEmailFromDatabase();
        setUserEmail(email);
      } catch (error) {
        console.error('Error fetching email:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmail();
  }, []);


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
    setLocalStorage();
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
      <InputBox //Box for user ID
        height={inputBoxHeight}
        width={(innerRectWidth - distanceFromFieldTextToField - fieldTextMarginsFromInnerRect * 2) / 0.4}
        x={x + innerRectMargins + fieldTextMarginsFromInnerRect + distanceFromFieldTextToField}
        y={y + menuHeight - innerRectMargins - innerRectHeight + fieldTextMarginsFromInnerRect}
        color={white}
        fontSize={inputBoxTextSize}  //  Dynamically modify font size based on screen width
        fontColor={black}
        text={isLoading ? 'Loading...' : error ? 'Error loading email' : userEmail}
        fontWeight={600}
      />
      <Text
        text={"GAME NAME"}                             
        style={fieldText}
        x={x + innerRectMargins + fieldTextMarginsFromInnerRect} 
        y={y + menuHeight - innerRectMargins - innerRectHeight + fieldTextMarginsFromInnerRect + fieldTextMarginsFromEachOther}
        anchor={0}
      />
      <InputBox //Box for game name
        height={inputBoxHeight}
        width={(innerRectWidth - distanceFromFieldTextToField - fieldTextMarginsFromInnerRect * 2) / 0.4}
        x={x + innerRectMargins + fieldTextMarginsFromInnerRect + distanceFromFieldTextToField}
        y={y + menuHeight - innerRectMargins - innerRectHeight + fieldTextMarginsFromInnerRect + fieldTextMarginsFromEachOther}
        color={white}
        fontSize={inputBoxTextSize}  //  Dynamically modify font size based on screen width
        fontColor={black}
        text={localStorage.getItem("game_name")}
        fontWeight={600}
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
        
      <InputBox //Check box for downloading all the data for the user
        height={checkButtonWidth}
        width={checkButtonWidth}
        x={x + innerRectMargins + fieldTextMarginsFromInnerRect}
        y={y + menuHeight - innerRectMargins - innerRectHeight + fieldTextMarginsFromInnerRect + fieldTextMarginsFromEachOther * 4}
        color={white}
        fontSize={checkButtonFont}
        fontColor={black}
        text={localStorage.getItem("all_data") === "true" ? "  X" : " "}
        callback = {() => {
          if (localStorage.getItem("all_data") === "true") {
            localStorage.setItem("all_data", "false");
          } else {
            localStorage.setItem("all_data", "true");
          }
        }}
      />
      <RectButton //Button for downloading the data
        height={menuHeight * 0.3}
        width={menuWidth* 0.4}
        x={x + innerRectMargins + innerRectWidth - menuWidth* 0.2 - fieldTextMarginsFromInnerRect}
        y={y + menuHeight - innerRectMargins - innerRectHeight + fieldTextMarginsFromInnerRect + fieldTextMarginsFromEachOther * 4}
        color={royalBlue}
        text={"DOWNLOAD"}
        fontSize={menuWidth * 0.02}
        fontColor={white}
        fontWeight={600}
        callback={() => {
          //Sophia, enter code here
          getFromDatabaseByGame('sittingquicktest', '2024-11-11', '2024-12-11'); //game, start date, end date
        }}
      />
    </Container>
    )
} else {
    return <Container/>;
  }
}

export default DataMenu