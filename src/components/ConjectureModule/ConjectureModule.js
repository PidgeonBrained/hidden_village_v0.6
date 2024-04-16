import Background from "../Background";
import React, { useState} from 'react';
import { green, neonGreen, black, blue, white, pink, orange, red, transparent, turquoise } from "../../utils/colors";
import Button from "../Button";
import RectButton from "../RectButton";
import InputBox from "../InputBox";
import { ConjectureBox, KeywordsBox, NameBox, PINBox } from "./ConjectureModuleBoxes";
import { EndBox, IntermediateBox, StartBox } from "../PoseAuth/PoseAuthoringBoxes";
import { writeToDatabaseConjecture, writeToDatabaseConjectureDraft, keysToPush, searchConjecturesByWord} from "../../firebase/database";
import { useMachine } from "@xstate/react";
import { ConjectureEditorMachine } from "../../machines/conjectureEditorMachine";

let editLevel = true;
export function setEditLevel(trueOrFalse){
  editLevel = trueOrFalse;
}
export function getEditLevel(){
  return editLevel;
}

let goBack = "MAIN";
export function setGoBackFromLevelEdit(previous){
  goBack = previous;
}
export function getGoBackFromLevelEdit(){
  return goBack;
}

export const currentConjecture = {
  CurrentConjecture: [],
  CurrentUUID: [],

  setConjecture(conjecture) {
    this.CurrentConjecture = conjecture;
  },

  getCurrentConjecture() {
    return this.CurrentConjecture;
  },

  setCurrentUUID(UUID){
    this.CurrentUUID = UUID;
  },

  getCurrentUUID(){
    if(this.CurrentUUID != null && this.CurrentUUID != ""){
      return this.CurrentUUID;
    }
    else{
      return null;
    }
  }
}

// fill in local storage using currentConjecture if an existing conjecture is selected
// currentConjecture receives the value when the conjecture is clicked from ConjectureSelectorModule
function setLocalStorage(){ 
  const conjecture = currentConjecture.getCurrentConjecture();
  if (currentConjecture.getCurrentConjecture() != null && currentConjecture.getCurrentConjecture().length != 0) {
    // fill in keys pushed to Text Boxes by writeToDatabase in database.js
    for (i = 0; i < keysToPush.length; i++){
      localStorage.setItem(keysToPush[i], conjecture['Text Boxes'][keysToPush[i]]);
    }

    // fill in poses from database
    if (conjecture['Intermediate Pose']['poseData'] !== undefined)
      localStorage.setItem('start.json' , conjecture['Start Pose']['poseData']);
    if (conjecture['Intermediate Pose']['poseData'] !== undefined)
      localStorage.setItem('intermediate.json' , conjecture['Intermediate Pose']['poseData']);
    if (conjecture['Intermediate Pose']['poseData'] !== undefined)
      localStorage.setItem('end.json' , conjecture['End Pose']['poseData']);

    currentConjecture.CurrentUUID = conjecture['UUID']; // set the UUID before clearing currentConjecture
    currentConjecture.CurrentConjecture = null; // clear currentConjecture to avoid an infinite loop
  }

  if(localStorage.getItem("Correct Answer") == null) { // ensures that there is always a correct answer
    localStorage.setItem("Correct Answer", "A");
  }
}

const ConjectureModule = (props) => {
  const { height, width, poseData, columnDimensions, rowDimensions, editCallback, backCallback } = props;
  const [state, send] = useMachine(ConjectureEditorMachine);
  const [isSaved, setIsSaved] = useState(false);
  setLocalStorage();

  return (
    <>
      <Background height={height * 1.1} width={width} />
      <NameBox height={height} width={width} boxState={state.value} />
      <PINBox height={height} width={width} />
      <StartBox height={height * 0.5} width={width * 0.5} x={5} y={4.6} boxState={null} similarityScores={null} inCE={true} />
      <IntermediateBox height={height * 0.5} width={width * 0.5} x={9} y={1.906} boxState={null} similarityScores={null} inCE={true} />
      <EndBox height={height * 0.5} width={width * 0.5} x={13} y={1.2035} boxState={null} similarityScores={null} inCE={true} />
      <Button
        height={height * 0.14}
        width={width * 0.04}
        x={width * 0.10}
        y={height * 0.61}
        color={blue}
        fontSize={40}
        fontColor={white}
        text={"A"}
        fontWeight={800}
        callback={null}
      />
      <Button
        height={height * 0.14}
        width={width * 0.04}
        x={width * 0.10}
        y={height * 0.70}
        color={blue}
        fontSize={40}
        fontColor={white}
        text={"B"}
        fontWeight={800}
        callback={null}
      />
      <Button
        height={height * 0.14}
        width={width * 0.04}
        x={width * 0.10}
        y={height * 0.79}
        color={blue}
        fontSize={40}
        fontColor={white}
        text={"C"}
        fontWeight={800}
        callback={null}
      />
      <Button
        height={height * 0.14}
        width={width * 0.04}
        x={width * 0.10}
        y={height * 0.88}
        color={blue}
        fontSize={40}
        fontColor={white}
        text={"D"}
        fontWeight={800}
        callback={null}
      />

      {/* Only show the pose editor, save, publish, and cancel buttons if the user is editing */}
      {getEditLevel() ? (
        <>
        {/* Button to Pose Editor */}
        <Button
          height={height * 0.12}
          width={width * 0.0950}
          x={width * 0.17}
          y={height * 0.42}
          color={blue}
          fontSize={21}
          fontColor={white}
          text={"POSE EDITOR"}
          fontWeight={800}
          callback={editCallback}
        />
        {/* Save button */}
        <RectButton
          height={height * 0.13}
          width={width * 0.26}
          x={width * 0.58}
          y={height * 0.93}
          color={neonGreen}
          fontSize={width * 0.014}
          fontColor={white}
          text={"SAVE DRAFT"}
          fontWeight={800}
          callback={ () =>{
            writeToDatabaseConjectureDraft(currentConjecture.getCurrentUUID());
            setIsSaved(true);
          }}/>
        {/* Cancel button */}
        <RectButton
          height={height * 0.13}
          width={width * 0.26}
          x={width * 0.71}
          y={height * 0.93}
          color={red}
          fontSize={width * 0.015}
          fontColor={white}
          text={"CANCEL"}
          fontWeight={800}
          callback={() => {
            localStorage.clear();
            mainCallback(); // Exit Back the main menu
          }}
        />
        {/* Publish button */}
        <RectButton
          height={height * 0.13}
          width={width * 0.26}
          x={width * 0.45}
          y={height * 0.93}
          color={blue}
          fontSize={width * 0.015}
          fontColor={white}
          text={"PUBLISH"}
          fontWeight={800}
          callback={ () =>{
            writeToDatabaseConjecture(currentConjecture.getCurrentUUID());
            setIsSaved(true);
            } // publish to database
          }
        />
        </>
        )
        :(null) // don't show any of the above things during a preview
      }

      {/* Back Button */}
      <Button
        height={height * 0.32}
        width={width * 0.07}
        x={width * 0.06}
        y={height * 0.15}
        color={red}
        fontSize={width * 0.015}
        fontColor={white}
        text={"BACK"}
        fontWeight={800}
        callback={() => {
          if(editLevel){
            setGoBackFromLevelEdit("MAIN"); //ensures that the back button works correctly 
          }
          if (!isSaved && editLevel) {
            // If data hasn't been saved
            const confirmLeave = window.confirm("You didnt save your work. Are you sure you want to leave?");
            if (confirmLeave) {
              // if User confirmed, clear local storage and go back
              localStorage.clear();
              backCallback();
            }
          } else {
            // If it is saved, just go back
            localStorage.clear();
            backCallback();
          }
        }}
      />
      {/* 'X' Buttons for the mutliple choice boxes */}
      <InputBox
        height={height * 0.14}
        width={width * 0.07}
        x={width * 0.735}
        y={height * 0.58}
        color={white}
        fontSize={width * 0.024}  //  Dynamically modify font size based on screen width
        fontColor={black}
        text={localStorage.getItem("Correct Answer") === "A" ? " X" : " "}
        fontWeight={600}
        callback={() => {
          if(editLevel){
            send("OPTIONA");
            localStorage.setItem("Correct Answer", "A");
          }
        }}
      />
      <InputBox
        height={height * 0.14}
        width={width * 0.07}
        x={width * 0.735}
        y={height * 0.67}
        color={white}
        fontSize={width * 0.024}  //  Dynamically modify font size based on screen width
        fontColor={black}
        text={localStorage.getItem("Correct Answer") === "B" ? " X" : " "}
        fontWeight={600}
        callback={() => {
          if(editLevel){
            send("OPTIONB");
            localStorage.setItem("Correct Answer", "B");
          }
        }}
      />
      <InputBox
        height={height * 0.14}
        width={width * 0.07}
        x={width * 0.735}
        y={height * 0.76}
        color={white}
        fontSize={width * 0.024}  //  Dynamically modify font size based on screen width
        fontColor={black}
        text={localStorage.getItem("Correct Answer") === "C" ? " X" : " "}
        fontWeight={600}
        callback={() => {
          if(editLevel){
            send("OPTIONC");
            localStorage.setItem("Correct Answer", "C");
          }
        }}
      />
      <InputBox
        height={height * 0.14}
        width={width * 0.07}
        x={width * 0.735}
        y={height * 0.85}
        color={white}
        fontSize={width * 0.024}  //  Dynamically modify font size based on screen width
        fontColor={black}
        text={localStorage.getItem("Correct Answer") === "D" ? " X" : " "}
        fontWeight={600}
        callback={() => {
          if(editLevel){
            send("OPTIOND");
            localStorage.setItem("Correct Answer", "D");
          }
        }}
      />
    </>
  );
};
  
export default ConjectureModule;
