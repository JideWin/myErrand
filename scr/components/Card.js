// src/components/Card.js
import React from "react";
import { View, TouchableOpacity } from "react-native";
import { colors } from "./CustomText";

const Card = ({ children, variant = "elevated", onPress, style }) => {
  const Container = onPress ? TouchableOpacity : View;

  const getCardStyles = () => {
    const base = {
      borderRadius: 16,
      backgroundColor: colors.white,
      padding: 16,
    };

    const variants = {
      elevated: {
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
      },
      outlined: {
        borderWidth: 1,
        borderColor: colors.gray200,
      },
      filled: {
        backgroundColor: colors.gray50,
      },
    };

    return { ...base, ...variants[variant] };
  };

  return (
    <Container style={[getCardStyles(), style]} onPress={onPress}>
      {children}
    </Container>
  );
};

export default Card;
