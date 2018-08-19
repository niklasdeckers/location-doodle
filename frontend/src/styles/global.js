import { StyleSheet } from 'react-native';

export const BACKGROUND_PRIMARY = '#fff';
export const BACKGROUND_SECONDARY = '#2c2c34';
export const TEXT_COLOR = '#222';
export const TEXT_COLOR_DARK = '#1d1d25';

export const PRIMARY_BLUE_COLOR = '#00364f';
export const PRIMARY_RED_COLOR = '#FF3D3D';
export const PRIMARY_RED_COLOR_LIGHT = '#ff7d79';
export const PRIMARY_LIGHTBLUE_COLOR = '#249fba';

export const PRIMARY_ORANGE_COLOR = '#FF6A2B';
export const PRIMARY_DARK_COLOR = '#242424';
export const PRIMARY_GREEN_COLOR = '#22e984';
export const PRIMARY_DARKGREEN_COLOR = '#1de95a';
export const PRIMARY_BLUEGREY_COLOR = '#424250';

export const PRIMARY_LINK_COLOR = PRIMARY_LIGHTBLUE_COLOR;

export const HEADLINE_COLOR = '#ffffff';
export const HEADLINE_FONT_SIZE = 30;

export const PADDING_EXTRA_SMALL = 5;
export const PADDING_SMALL = 10;
export const PADDING_MEDIUM = 15;
export const PADDING_LARGE = 20;

export const MARGIN_EXTRA_SMALL = 5;
export const MARGIN_SMALL = 10;
export const MARGIN_MEDIUM = 15;
export const MARGIN_LARGE = 20;

export const DEFAULT_BORDER_RADIUS = 4;

export const COMMON = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: BACKGROUND_PRIMARY,
  },
  modal: {
    flex: 1,
    marginLeft: MARGIN_LARGE,
    marginRight: MARGIN_LARGE,
    marginTop: MARGIN_LARGE * 3,
    marginBottom: MARGIN_LARGE * 3,
  },
  text: {
    color: TEXT_COLOR,
    fontFamily: 'Helvetica Neue',
  },
  headline: {
    color: HEADLINE_COLOR,
    fontFamily: 'Helvetica Neue',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
    padding: PADDING_MEDIUM,
  },
  column: {
    flex: 1,
    flexDirection: 'column',
  },
  rowSmall: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
    paddingLeft: PADDING_MEDIUM,
    paddingRight: PADDING_MEDIUM,
    paddingTop: PADDING_EXTRA_SMALL,
    paddingBottom: PADDING_EXTRA_SMALL,
  },
  borderBottom: {
    borderColor: '#434350',
    borderWidth: 1,
    marginBottom: MARGIN_MEDIUM,
  },
  fullWidth: {
    alignSelf: 'stretch',
  },
  left: {
    alignItems: 'flex-start',
  },
  center: {
    alignItems: 'center',
  },
  right: {
    alignItems: 'flex-end',
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#1b7ed4',
    paddingLeft: PADDING_LARGE,
    paddingRight: PADDING_LARGE,
    paddingTop: PADDING_MEDIUM,
    paddingBottom: PADDING_MEDIUM,
    borderRadius: DEFAULT_BORDER_RADIUS,
  },
  link: {
    color: PRIMARY_LINK_COLOR,
    paddingLeft: PADDING_EXTRA_SMALL,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#222',
  }
});

export const TOAST = StyleSheet.create({
  toast: {
    height: 70,
    borderRadius: DEFAULT_BORDER_RADIUS,
    margin: MARGIN_MEDIUM,
    justifyContent: 'center',
  },
  toastPosition: {
    left: 0,
    bottom: 0,
    right: 0,
    position: 'absolute',
    zIndex: 35,
  },
  error: {
    backgroundColor: PRIMARY_RED_COLOR,
  },
  success: {
    backgroundColor: PRIMARY_GREEN_COLOR,
  },
  default: {
    backgroundColor: '#4B4B58',
  },
  text: {
    textAlign: 'center',
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold'
  }
});
