import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";

interface TrashIconProps {
  height: number;
  width: number;
  color: string;
}

export const TrashIcon: React.FC<TrashIconProps> = ({
  height,
  width,
  color,
}) => (
  <Svg width={width} height={height} fill="none" viewBox="0 0 24 24">
    <Path
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 6h18M5 6v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M14 11v6M10 11v6"
    />
  </Svg>
);
