import { Text, Graphics } from "@inlet/react-pixi";
import { TextStyle } from "@pixi/text";
import { useCallback } from "react";

const Button = (props) => {
  const {
    width,
    x,
    y,
    text,
    color,
    fontSize,
    fontColor,
    fontWeight,
    callback,
  } = props;
  const draw = useCallback(
    (g) => {
      g.clear();
      g.beginFill(color);
      g.drawCircle(x, y, width * 0.45); // Draws a circular button
      g.endFill();
    },
    [width, x, y, color]
  );
  return (
    <>
      <Graphics 
        draw={draw} 
        interactive={true} 
        pointerdown={callback}
        cursor="pointer"
        />
      <Text
        text={text}
        style={
          new TextStyle({
            align: "center",
            fontFamily: "Arial",
            fontSize: fontSize,
            fontWeight: fontWeight,
            fill: [fontColor],
            wordWrap: true,
          })
        }
        interactive={true}
        pointerdown={callback}
        cursor="pointer"
        x={x}
        y={y}
        anchor={0.5}
      />
    </>
  );
};

export default Button;
