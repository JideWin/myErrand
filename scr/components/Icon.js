// src/components/Icon.js
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "./theme"; // <-- ADD THIS LINE

const Icon = ({ name, size = 24, color = "gray600", style }) => {
  return (
    <Ionicons
      name={name}
      size={size}
      color={colors[color] || color}
      style={style}
    />
  );
};

export default Icon;