import Button from "../Button";
import PlayGameMachine from "./PlayGameMachine";
import { white, red } from "../../utils/colors";
import { useMachine } from "@xstate/react";
import { useEffect, useState } from "react";
import LevelPlay from "../LevelPlayModule/LevelPlay";
import { getCurricularDataByUUID } from "../../firebase/database";
import { Curriculum } from "../CurricularModule/CurricularModule";

const PlayGame = (props) => {
    const { columnDimensions, rowDimensions, poseData, height, width, backCallback } = props;
    const uuidsList = Curriculum.getCurrentConjectures();
    const [uuidIDX, setuuidIDX] = useState(0);

    const [state, send] = useMachine(PlayGameMachine, {
        context: {
            uuids: uuidsList
        }
    });

    useEffect(() => {
        setuuidIDX(state.context.uuidIndex)
    }, [state.context.uuidIndex]);

    return (
        <>
            {/* Main gameplay area */}
            {state.value === "idle" && uuidsList[0] !== undefined && (
                <LevelPlay
                    key={uuidsList[uuidIDX]['UUID']}
                    width={width}
                    height={height}
                    columnDimensions={columnDimensions}
                    rowDimensions={rowDimensions}
                    poseData={poseData}
                    mainCallback={backCallback}
                    UUID={uuidsList[uuidIDX]['UUID']}
                    onLevelComplete={() => { send("LOAD_NEXT") }}
                    needBack={false}
                />
            )}

            {/* Exit button, displayed during gameplay */}
            <Button
                width={width * 0.04}
                x={width * 0.97}  // Position the button on the right
                y={height * 0.07} // Position the button at the top
                color={red}
                fontSize={width * 0.006}
                fontColor={white}
                text={"Exit Game"}
                fontWeight={800}
                callback={backCallback}  // Calls backCallback to exit
            />

            {/* End state with 'Back' button */}
            {state.value === "end" && (
                <Button
                    width={width * 0.20}
                    x={width * 0.5}
                    y={height * 0.5}
                    color={red}
                    fontSize={width * 0.02}
                    fontColor={white}
                    text={"Back"}
                    fontWeight={800}
                    callback={backCallback}
                />
            )}
        </>
    );
}

export default PlayGame;
