import * as React from "react";
import Slider, { SliderThumb } from "@mui/material/Slider";
import { styled } from "@mui/material/styles";
import MenuSVG from "@/assets/icons/menu.svg";

const AirbnbSlider = styled(Slider)((component) => {
  const size = component.size === "small" ? 28 : 40;
  return {
    "& .MuiSlider-thumb": {
      height: size,
      width: size,
      borderRadius: "4px",
      backgroundColor: component.disabled
        ? "rgba(161, 161, 161, 0.8)"
        : "rgba(253, 167, 57, 0.8)",
      border: component.disabled ? "2px solid #A1A1A1" : "2px solid #FDA739",
    },
    "& .MuiSlider-thumb.Mui-focusVisible, & .MuiSlider-thumb.Mui-active, & .MuiSlider-thumb:hover":
      {
        boxShadow: "none !important",
      },
    "& .MuiSlider-track": {
      height: size,
      background: "transparent",
      border: 0,
      borderRadius: 0,
      "&:after": {
        content: '""',
        position: "absolute",
        display: "block",
        width: `calc(100% + ${size}px)`,
        height: size,
        borderRadius: 4,
        background: component.disabled
          ? "rgba(161, 161, 161, 0.2)"
          : "rgba(255, 227, 202, 0.2)",
        border: "1px solid #A1A1A1",
        transform: `translateX(-${size / 2}px)`,
        zIndex: -10000,
      },
    },
    "& .MuiSlider-rail": {
      color: "transparent",
      height: size,
      "&:after": {
        content: '""',
        position: "absolute",
        display: "block",
        width: `calc(100% + ${size}px)`,
        height: size,
        borderRadius: 4,
        background: "transparent",
        border: "1px solid #A1A1A1",
        transform: `translateX(-${size / 2}px)`,
        zIndex: -10000,
      },
    },
    "& .MuiSlider-markLabel": {
      color: "#A1A1A1",
    },
    "& .MuiSlider-markLabelActive": {
      color: "#FDA739",
    },
  };
});

interface AirbnbThumbComponentProps extends React.HTMLAttributes<unknown> {}

function AirbnbThumbComponent(props: AirbnbThumbComponentProps) {
  const { children, ...other } = props;
  return (
    <SliderThumb {...other}>
      {children}
      <MenuSVG />
    </SliderThumb>
  );
}

type Props = {
  value: number;
  disabled?: boolean;
  size?: "small" | "medium";
  min?: number;
  max?: number;
  step?: number;
  marks?: any[];
  onChange?: (value: number) => void;
};

export default function CustomizedSlider({
  value,
  disabled,
  size,
  min,
  max,
  step,
  onChange,
  marks,
}: Props) {
  const _size = size === "small" ? 28 : 40;
  return (
    <div className="relative flex flex-col px-5" style={{padding: `0 ${_size / 2}px`}}>
      <AirbnbSlider
        slots={{ thumb: AirbnbThumbComponent }}
        value={value}
        min={min}
        max={max}
        step={step}
        marks={marks}
        size={size}
        disabled={disabled}
        onChange={(_, val) => {
          if (onChange) {
            onChange(val as number);
          }
        }}
      />
      {max !== undefined && value < max && (
        <button
          className={`text-xs absolute right-2.5 top-1/2 transform -translate-y-1/2 ${
            disabled
              ? "text-gray-200"
              : "text-orange-900 text-shadow-orange-900"
          }`}
          disabled={disabled}
          onClick={() => {
            if (onChange && max !== undefined) {
              onChange(max);
            }
          }}
        >
          MAX
        </button>
      )}
    </div>
  );
}
