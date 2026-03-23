import * as React from "react";
import Svg, { Path } from "react-native-svg";

interface EditIconProps {
  height: number;
  width: number;
  color: string;
}

export const EditIcon: React.FC<EditIconProps> = ({ height, width, color }) => (
  <Svg width={width} height={height} fill="none" viewBox="0 0 24 24">
    <Path
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6M9 15v-2.5l8.75-8.75c.69-.69 1.81-.69 2.5 0v0c.69.69.69 1.81 0 2.5L15.5 11l-4 4H9Z"
    />
  </Svg>
);
