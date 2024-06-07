import { extendTheme, theme as base } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';

const styles = {
  global: (props) => ({
    body: {
      bg: mode('brand.light', 'brand.dark')(props),
    },
    p: {
      color: mode('gray.900', 'white')(props),
    },
  }),
};

const colors = {
  brand: {
    500: '#69D3FA',

    dark: '#18191A',

    light: 'whitesmoke',
  },
};

const fonts = {
  heading: `Josefin Sans, ${base.fonts.heading}`,
};

const components = {
  Button: {
    baseStyle: {
      borderRadius: '0px',
      backgroundColor: '#69D3FA',
    },
  },
};

const config = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

const theme = extendTheme({ config, styles, colors, fonts, components });
export default theme;
