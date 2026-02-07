import React, { useContext } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { AuthContext } from "../../context/AuthContext";
import { CustomText } from "../../components/CustomText";
import Button from "../../components/Button";
import { colors, spacing, shadows } from "../../components/theme";

const JobDetailsScreen = ({ navigation, route }) => {
  const { user } = useContext(AuthContext);
  const { job } = route.params || {};

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.gray50 }}>
      <View style={[styles.mainCard, shadows.medium]}>
        <CustomText type="h2" color="primary">
          {job?.title}
        </CustomText>
        <CustomText style={styles.desc}>{job?.description}</CustomText>
        <View style={styles.divider} />
        <CustomText type="title">
          Budget: ₦{job?.price || job?.budget}
        </CustomText>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Start Live Stream"
          onPress={() =>
            navigation.navigate("LiveStream", { channelName: job.id })
          }
          style={{ backgroundColor: colors.primary }}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  mainCard: {
    backgroundColor: colors.white,
    margin: spacing.md,
    padding: spacing.lg,
    borderRadius: 15,
  },
  desc: {
    marginTop: 10,
    lineHeight: 22,
    color: colors.gray800,
  },
  divider: {
    height: 1,
    backgroundColor: colors.gray200,
    marginVertical: 15,
  },
  buttonContainer: {
    padding: spacing.md,
  },
});

export default JobDetailsScreen;
