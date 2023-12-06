// styles.js
import { StyleSheet } from "react-native";

export const theme = {
  dark1: "#003f5c",
  dark2: "#58508d",
  highlight1: "#bc5090",
  highlight2: "#ff6361",
  highlight3: "#ffa600",
  titleText: "#f0f0f0",
  subTitleText: "#f0f0f0",
  bodyText: "#d8d8d8",
};

export const commonStyles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
  },
  detailsView: {
    paddingLeft: 20,
    width: "80%",
    alignSelf: "flex-start",
    alignItems: "flex-start",
  },
  horzBar: {
    height: 3,
    borderRadius: 1,
    marginVertical: 10,
    width: "100%",
    backgroundColor: theme.highlight3,
  },
  horzBar2: {
    marginLeft: 10,
    marginRight: 10,
    height: 3,
    borderRadius: 1,
    marginVertical: 10,
    width: "90%",
    backgroundColor: theme.highlight2,
  },
  horzBar3: {
    marginLeft: 10,
    marginRight: 10,
    height: 3,
    borderRadius: 1,
    marginVertical: 10,
    width: "90%",
    backgroundColor: theme.highlight1,
  },
  listText: {
    fontSize: 16,
    color: theme.bodyText,
    alignSelf: "flex-start",
  },
  bodyText: {
    fontSize: 16,
    color: theme.bodyText,
  },
  subTitle: {
    fontSize: 26,
    alignSelf: "flex-start",
    color: theme.subTitleText,
    paddingTop: 10,
  },
  title: {
    fontSize: 40,
    color: theme.titleText,
  },
  appContainer: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 20,
    alignItems: "center",
  },
  scroll: {
    flex: 1,
    width: "100%",
  },
  scrollContent: {
    alignItems: "center",
  },
  app: {
    flex: 1,
    paddingTop: 35,
    paddingBottom: 20,
    backgroundColor: theme.dark1,
    alignItems: "center",
  },
});

export default {
  theme,
  commonStyles,
};
