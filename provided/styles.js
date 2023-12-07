// styles.js

import { StyleSheet } from 'react-native';

export const theme = {
  dark1: "#003f5c",
  dark2: "#58508d",
  highlight1: "#bc5090",
  highlight2: "#ff6361",
  highlight3: "#ffa600",
  titleText: "#f0f0f0",
  subTitleText: "#f0f0f0",
  bodyText: "#d8d8d8",
  horzBarColor: "#58508d",  
};

export const commonStyles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: theme.dark1,
  },
  appContainer: {
    flex: 1,
    margin: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: theme.titleText,
  },
  bodyText: {
    fontSize: 16,
    textAlign: 'center',
    color: theme.bodyText,
  },
  subTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: theme.subTitleText,
  },
  listText: {
    fontSize: 14,
    color: theme.bodyText,
  },
  horzBar: {
    borderBottomColor: theme.horzBarColor,
    borderBottomWidth: 1,
    marginVertical: 10,
  },
  horzBar2: {
    height: 1,
    backgroundColor: theme.subTitleText,
    marginVertical: 8,
  },
  horzBar3: {
    height: 1,
    backgroundColor: theme.subTitleText,
    marginVertical: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 16,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  sectionContainer: {
    flex: 1,
    margin: 20,
    padding: 20,
    borderRadius: 10,
    backgroundColor: theme.dark2,
    borderWidth: 2,
    borderColor: theme.horzBarColor,  
  },
  suggestionsSection: {
    flex: 1,
    backgroundColor: theme.dark2,
    margin: 10,
    padding: 10,
    borderRadius: 10,
  },  
  detailsView: {
    // Add your details view styles here
  },
  goBackButton: {
    backgroundColor: theme.highlight3,
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignSelf: 'flex-start',
  },
});

