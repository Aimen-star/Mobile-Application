
import { StyleSheet } from 'react-native';

export const GlobalStyles = StyleSheet.create({

  // GENERAL

  background: {
    flex: 1,
  },

  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },

  screenBackground: {
    backgroundColor: '#F7F9FC',
  },

  title: {
    fontSize: 36,
    fontFamily: 'MyFont',
    textAlign: 'center',
    marginBottom: 25,
    color: '#161616',
  },

  subtitle: {
    fontSize: 17,
    fontFamily: 'MyFont',
    textAlign: 'center',
    marginBottom: 25,
    color: '#555555',
  },

  button: {
    backgroundColor: '#4A6FA5',
    padding: 15,
    borderRadius: 12,
    marginVertical: 8,
    alignItems: 'center',
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
  },


  // PROFILE
  

  profileImage: {
    width: 160,
    height: 160,
    borderRadius: 80,
    alignSelf: 'center',
    marginBottom: 25,
  },

  inputContainer: {
    marginBottom: 12,
  },

  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5,
  },

  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 10,
    padding: 14,
    fontSize: 17,
  },

  infoBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginTop: 10,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },

  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },

  infoText: {
    fontSize: 17,
    marginVertical: 4,
    color: '#333333',
  },

safeArea: {
  flex: 1,
  backgroundColor: '#FFFFFF',
},

profileScroll: {
  flex: 1,
},

profileContent: {
  flexGrow: 1,
  paddingHorizontal: 20,
  paddingTop: 20,
  paddingBottom: 150,
},
  // SETTINGS

  darkContainer: {
    backgroundColor: '#222222',
  },

  darkText: {
    color: '#FFFFFF',
  },

  settingBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },

  darkSettingBox: {
    backgroundColor: '#333333',
    borderColor: '#444444',
  },

  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  settingText: {
    fontSize: 20,
    color: '#333333',
  },

  modeText: {
    fontSize: 17,
    marginTop: 18,
    color: '#555555',
  },


  // CONTACT

  contactSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666666',
    marginBottom: 25,
  },

  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 10,
    paddingHorizontal: 12,
    marginVertical: 10,
  },

  emailInput: {
    flex: 1,
    padding: 14,
    fontSize: 17,
    marginLeft: 8,
  },

});