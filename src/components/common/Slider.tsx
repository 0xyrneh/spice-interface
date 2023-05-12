import * as React from "react";
import Slider, { SliderThumb } from "@mui/material/Slider";
import { styled } from "@mui/material/styles";
import MenuSVG from "@/assets/icons/menu.svg";

const AirbnbSlider = styled(Slider)(() => ({
  "& .MuiSlider-thumb": {
    height: 40,
    width: 40,
    borderRadius: "4px",
    backgroundColor: "rgba(253, 167, 57, 0.8)",
    border: "2px solid #FDA739",
  },
  "& .MuiSlider-thumb.Mui-focusVisible, & .MuiSlider-thumb:hover": {
    boxShadow: "none !important",
  },
  "& .MuiSlider-track": {
    height: 40,
    background: "transparent",
    border: 0,
    borderRadius: 0,
    "&:after": {
      content: '""',
      position: "absolute",
      display: "block",
      width: "calc(100% + 40px)",
      height: 40,
      borderRadius: 4,
      background: "rgba(255, 227, 202, 0.2)",
      border: "1px solid #A1A1A1",
      transform: "translateX(-20px)",
      zIndex: -10000,
    },
  },
  "& .MuiSlider-rail": {
    color: "transparent",
    height: 40,
    "&:after": {
      content: '""',
      position: "absolute",
      display: "block",
      width: "calc(100% + 40px)",
      height: 40,
      borderRadius: 4,
      background: "transparent",
      border: "1px solid #A1A1A1",
      transform: "translateX(-20px)",
      zIndex: -10000,
    },
  },
  "& .MuiSlider-markLabel": {
    color: "#A1A1A1",
  },
  "& .MuiSlider-markLabelActive": {
    color: "#FDA739",
  },
}));

interface AirbnbThumbComponentProps extends React.HTMLAttributes<unknown> {}

function AirbnbThumbComponent(props: AirbnbThumbComponentProps) {
  const { children, ...other } = props;
  return (
    <SliderThumb {...other}>
      <MenuSVG />
    </SliderThumb>
  );
}

type Props = {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  marks?: any[];
  onChange?: (value: number) => void;
};

export default function CustomizedSlider({
  value,
  min,
  max,
  step,
  onChange,
  marks,
}: Props) {
  return (
    <div className="flex flex-col px-5">
      <AirbnbSlider
        slots={{ thumb: AirbnbThumbComponent }}
        value={value}
        min={min}
        max={max}
        step={step}
        marks={marks}
        onChange={(_, val) => {
          if (onChange) {
            onChange(val as number);
          }
        }}
      />
    </div>
  );
}
