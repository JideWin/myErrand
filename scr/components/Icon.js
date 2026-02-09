// scr/components/Icon.js
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "./theme";

const Icon = ({ name, size = 24, color = "primary", style }) => {
  const iconColor = colors[color] || color;

  return <Ionicons name={name} size={size} color={iconColor} style={style} />;
};

export default Icon;
