
import { StyleSheet } from 'react-native';
import Colors from './Colors';

// Common styles used by different screens
const GlobalStyling = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 20,
  },

  heading: {
    fontFamily: 'Poppins-Bold',
    fontSize: 25,
    color: Colors.text,
  },

  text: {
    fontFamily: 'Roboto-Regular',
    fontSize: 14,
    color: Colors.text,
  },

  input: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    padding: 12,
    marginVertical: 8,
    fontFamily: 'Roboto-Regular',
    color: Colors.text,
  },

  card: {
    backgroundColor: Colors.white,
    padding: 15,
    borderRadius: 15,
    marginVertical: 8,
  },
});

export default GlobalStyling;
