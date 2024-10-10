import React, { useState, useEffect } from 'react';
import Background from "../Background";
import { blue, white, red, neonGreen,green, black } from "../../utils/colors";
import RectButton from "../RectButton";
import { getCurricularList, writeToDatabaseGameSelect } from "../../firebase/database";
import { CurricularSelectorBoxes } from "./CurricularSelectorModuleBoxes";
import { useMachine } from "@xstate/react";
import {Curriculum} from "../CurricularModule/CurricularModule";
import { Text } from "@inlet/react-pixi"

export let playGame = false; // keep track of whether the curricular content list is being used to edit or play games.

export function getPlayGame() {
  return playGame;
}
export function setPlayGame(trueOrFalse) {
  playGame = trueOrFalse;
}

export function handlePIN(curricular, message = "Please Enter the PIN."){ // this function is meant to be used as an if statement (ex: if(handlePIN){...} )
  const existingPIN = curricular["CurricularPIN"];

  if(existingPIN == "" || existingPIN == "undefined" || existingPIN == null){ // no existing PIN
    return true;
  }

  const enteredPIN = prompt(message);

  if(enteredPIN == existingPIN){ // PIN is successful
    return true;
  }
  else if(enteredPIN != null && enteredPIN != ""){ // recursively try to have the user enter a PIN when it is incorrect
    return handlePIN(curricular, message = "Incorrect PIN, please try again.");
  }
  return false; // do nothing if cancel is clicked
}



const CurricularSelectModule = (props) => {
  
  const { height, width, mainCallback, curricularCallback} = props;
  const [curricularList, setCurricularList] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedCurricular, setSelectedCurricular] = useState(null);  // Declare the state at the beginning of the component


  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getCurricularList(getPlayGame());
        setCurricularList(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  //use to get a fixed number of conjectures per page and to navigate between the pages
  const curricularPerPage = 7;
  const totalPages = Math.ceil(curricularList.length / curricularPerPage);

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };
  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };
  // handle ok button click

  function handleOKButtonClicked(){
    if (selectedCurricular) {
      if (playGame) {
        writeToDatabaseGameSelect(selectedCurricular["UUID"]);
        Curriculum.setCurricularEditor(selectedCurricular);
        curricularCallback();  // Open the game
      } else if (handlePIN(selectedCurricular) && !playGame) {
        Curriculum.setCurrentUUID(selectedCurricular["UUID"]);
        Curriculum.setCurricularEditor(selectedCurricular);
        curricularCallback();  // Open the game editor
      }
    } else {
      alert("No curricular selected. Please select one before clicking OK.");
    }
  }


  // Handle game clicked 

  function handleGameClicked(curricular, curricularCallback){
    setSelectedCurricular(curricular);
    
  }



  // use to determine the subset of games to display based on the current page
  const startIndex = currentPage * curricularPerPage;
  const currentCurriculars = curricularList.slice(startIndex, startIndex + curricularPerPage);

  // draw the buttons that show the author name, name of game, and keywords, and the add conjecture button
  const drawCurricularList = (xMultiplier, yMultiplier, fontSizeMultiplier, totalWidth, totalHeight) => {
    return (
      <>
        {currentCurriculars.map((curricular, index) => (
          <RectButton
            key={index}
            height={totalHeight /2 * yMultiplier}
            width={totalWidth * 0.8}
            x={totalWidth * (xMultiplier-0.08)}
            y={totalHeight * index * 4 * fontSizeMultiplier + totalHeight * yMultiplier * 0.75}
            color={selectedCurricular === curricular ? neonGreen : white} /* Highlight selected */
            fontSize={totalWidth * fontSizeMultiplier/1.3}
            fontColor={selectedCurricular === curricular ? black : blue} /* Change text color */
            text={curricular["CurricularAuthor"]}
            fontWeight="bold"
            callback = {() => handleGameClicked(curricular, curricularCallback)}
          />
        ))}

        {currentCurriculars.map((curricular, index) => (
          <RectButton
            key={index}
            height={totalHeight / 2 * yMultiplier}
            width={totalWidth * 0.6}
            x={totalWidth * (xMultiplier + 0.25)}
            y={totalHeight * index * 4 * fontSizeMultiplier + totalHeight * yMultiplier * 0.75}
            color={selectedCurricular === curricular ? neonGreen : white}
            fontSize={totalWidth * fontSizeMultiplier / 1.3} 
            fontColor={selectedCurricular === curricular ? black : blue} /* Change text color */
            text={curricular["CurricularName"]}
            fontWeight="bold"
            callback = {() => handleGameClicked(curricular, curricularCallback)}
          />
        
        ))}

        {currentCurriculars.map((curricular, index) => (
          <RectButton
            key={index}
            height={totalHeight / 2 * yMultiplier}
            width={totalWidth * 0.8}
            x={totalWidth * (xMultiplier +0.5)} 
            y={totalHeight * index * 4 * fontSizeMultiplier + totalHeight * yMultiplier * 0.75} 
            color={selectedCurricular === curricular ? neonGreen : white} /* Highlight selected */
            fontSize={totalWidth * fontSizeMultiplier / 1.3}
            fontColor={blue}
            text={curricular["CurricularKeywords"]}
            fontWeight="bold"
            callback = {() => handleGameClicked(curricular, curricularCallback)}
          />
        ))}

        {/* show an X if the game (curricular) is published */}
        {(currentCurriculars.map((curricular, index) => (
            <RectButton
              key={index}
              height={totalHeight / 2 * yMultiplier}
              width={totalWidth * (xMultiplier * 0.85 )}
              x={totalWidth * xMultiplier - totalWidth * xMultiplier * 0.95}
              y={totalHeight * index * 4 * fontSizeMultiplier + totalHeight * yMultiplier * 0.75 }
              color={selectedCurricular === curricular ? neonGreen : white} /* Highlight selected */
              fontSize={totalWidth * fontSizeMultiplier / 1.3}
              fontColor={selectedCurricular === curricular ? black : blue} /* Change text color */
              text={curricular["isFinal"] ? "X" : " "}
              fontWeight="bold"
              callback = {() => handleGameClicked(curricular, curricularCallback)}
            />
          ))
            
          )  
        }
      </>
    );
  };

  return (
    <>
      <Background height={height * 1.1} width={width} />
      {selectedCurricular && (
      <Text
        text={`Game Selected: ${selectedCurricular["CurricularName"]}`}
        x={width * 0.2}  // Adjust the x-position 
        y={height * 0.1}  // Adjust the y-position 
        style={
          new PIXI.TextStyle({
            fill: "green",
            fontSize: 24,  // Adjust the font size 
            fontWeight: "bold",
          })
        }
      />
    )}


      <RectButton
        height={height * 0.13}
        width={width * 0.26}
        x={width * 0.15}
        y={height * 0.93}
        color={blue}
        fontSize={width * 0.014}
        fontColor={white}
        text={"PREVIOUS"}
        fontWeight={800}
        callback={prevPage}
      />

      <RectButton
        height={height * 0.13}
        width={width * 0.26}
        x={width * 0.56}
        y={height * 0.93}
        color={blue}
        fontSize={width * 0.014}
        fontColor={white}
        text={"NEXT"}
        fontWeight={800}
        callback={nextPage}
      />

      <RectButton
        height={height * 0.13}
        width={width * 0.26}
        x={width * 0.80}
        y={height * 0.93}
        color={red}
        fontSize={width * 0.015}
        fontColor={white}
        text={"BACK"}
        fontWeight={800}
        callback={mainCallback}
      />
      <RectButton
        height={height * 0.13}
        width={width * 0.26}
        x={width * 0.68}
        y={height * 0.93}
        color={green}
        fontSize={width * 0.014}
        fontColor={white}
        text={"OK"}
        fontWeight={800}
        callback={handleOKButtonClicked} // Attach the OK button callback
        disabled={!selectedCurricular}  // Disable the button until a game is selected
      />

      <CurricularSelectorBoxes height={height} width={width} />
      {drawCurricularList(0.15, 0.3, 0.018, width, height, mainCallback, curricularCallback)}
    </>
  );
};


export default CurricularSelectModule; 