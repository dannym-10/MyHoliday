import * as React from "react";
import Svg, { Path } from "react-native-svg";

interface ChevronRightProps {
  height: number;
  width: number;
  color: string;
}

export const ChevronRight: React.FC<ChevronRightProps> = ({
  width,
  height,
  color,
}) => (
  <Svg width={width} height={height} viewBox="0 0 24 24">
    <Path
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="m8.5 5 7 7-7 7"
    />
  </Svg>
);
