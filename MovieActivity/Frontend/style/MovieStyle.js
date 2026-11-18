
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#101827',
  },

  gold: {
    color: '#D9B77E',
  },

  // SPLASH
  splash: {
    flex: 1,
    backgroundColor: '#101827',
    justifyContent: 'center',
    alignItems: 'center',
  },

  splashIcon: {
    width: 85,
    height: 85,
    borderRadius: 25,
    backgroundColor: '#202C3C',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 22,
  },

  splashTitle: {
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: 'bold',
    letterSpacing: 4,
  },

  splashSub: {
    color: '#D9B77E',
    fontSize: 10,
    letterSpacing: 3,
    marginTop: 12,
  },

  // HEADER
  header: {
    marginTop: 25,
    paddingHorizontal: 22,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  welcome: {
    color: '#A0A9B8',
    fontSize: 10,
    letterSpacing: 2,
  },

  logo: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 5,
  },

  headerIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#202C3C',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },

  intro: {
    color: '#B2B9C5',
    fontSize: 13,
    marginHorizontal: 22,
    marginTop: 12,
    marginBottom: 27,
  },

  // SECTION
  sectionHeading: {
    marginHorizontal: 22,
    marginBottom: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: 'bold',
  },

  sectionNumber: {
    color: '#D9B77E',
    fontSize: 11,
  },

  // FEATURED
  featuredCard: {
    marginHorizontal: 22,
    backgroundColor: '#202C3C',
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 27,
  },

  featuredPoster: {
    width: '100%',
    height: 230,
  },

  featuredInfo: {
    padding: 17,
  },

  featuredLabel: {
    color: '#D9B77E',
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 2,
  },

  featuredTitle: {
    color: '#FFFFFF',
    fontSize: 23,
    fontWeight: 'bold',
    marginTop: 9,
  },

  featuredYear: {
    color: '#A0A9B8',
    fontSize: 11,
    marginTop: 7,
  },

  featuredButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 17,
    gap: 12,
  },

  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    backgroundColor: '#D9B77E',
    paddingHorizontal: 17,
    paddingVertical: 12,
    borderRadius: 8,
  },

  nextText: {
    color: '#101827',
    fontWeight: 'bold',
    fontSize: 10,
  },

  heartButton: {
    width: 42,
    height: 42,
    backgroundColor: '#303B4B',
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // SEARCH
  searchBox: {
    height: 52,
    marginHorizontal: 22,
    marginBottom: 28,
    backgroundColor: '#202C3C',
    borderRadius: 11,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },

  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    marginLeft: 10,
    fontSize: 13,
  },

  movieCount: {
    color: '#929EAF',
    fontSize: 11,
    marginTop: 5,
  },

  // MOVIE GRID
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 22,
  },

  movieCard: {
    width: '47%',
    marginBottom: 23,
  },

  posterContainer: {
    width: '100%',
    height: 205,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#202C3C',
    position: 'relative',
  },

  poster: {
    width: '100%',
    height: '100%',
  },

  favoriteIcon: {
    position: 'absolute',
    top: 9,
    right: 9,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  movieTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 10,
  },

  movieDetails: {
    color: '#A0A9B8',
    fontSize: 10,
    marginTop: 5,
  },

  emptyText: {
    color: '#D9B77E',
    textAlign: 'center',
    marginVertical: 40,
  },

  footer: {
    color: '#687487',
    textAlign: 'center',
    fontSize: 9,
    letterSpacing: 2,
    marginTop: 15,
    marginBottom: 25,
  },

  // BOTTOM NAV
  bottomNav: {
    height: 67,
    backgroundColor: '#172234',
    borderTopWidth: 1,
    borderTopColor: '#303D50',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },

  navButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },

  navText: {
    color: '#858D9B',
    fontSize: 9,
    fontWeight: 'bold',
  },

  activeNav: {
    color: '#D9B77E',
  },

});

export default styles;
