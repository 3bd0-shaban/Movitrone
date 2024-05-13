import { ThemeConfig } from 'antd';

export const LightTheme: ThemeConfig = {
  token: {
    colorBgBase: '#001260',
    colorTextBase: '#ffffff',
  },
  components: {
    Input: {
      colorBgContainer: 'rgba(255, 255, 255, 0)',
      hoverBorderColor: 'rgb(3, 74, 161)',
      algorithm: true,
      activeBg: 'rgba(255, 255, 255, 0)',
    },
    Select: {
      algorithm: true,
      optionSelectedBg: 'rgb(2, 79, 139)',
    },
    Layout: {
      bodyBg: 'rgba(223, 51, 51, 0)',
      footerBg: 'rgba(245, 245, 245, 0)',
      headerBg: 'rgba(0, 21, 41, 0)',
      headerColor: 'rgba(0, 0, 0, 0)',
      lightSiderBg: 'rgba(255, 255, 255, 0)',
      lightTriggerBg: 'rgba(255, 255, 255, 0)',
      siderBg: 'rgba(0, 21, 41, 0.01)',
      triggerColor: 'rgba(255, 255, 255, 0)',
      triggerBg: 'rgba(0, 33, 64, 0)',
    },
    Menu: {
      horizontalItemSelectedColor: 'rgba(22, 119, 255, 0.5)', // Blue with 50% opacity
      itemActiveBg: 'rgba(230, 244, 255, 0.5)', // Light blue with 50% opacity
      itemBg: 'rgba(255, 255, 255, .1)', // White with 1% opacity (almost transparent)
      horizontalItemHoverColor: 'rgba(22, 119, 255, 0.5)', // Blue with 50% opacity
      itemSelectedBg: 'rgba(143, 165, 183, 0.31)', // Greyish-blue with 31% opacity
      activeBarBorderWidth: 0, // No border
    },
  },
};
export const DarkTheme: ThemeConfig = {
  components: {
    Button: {
      algorithm: true,
    },
    Input: {
      colorBgContainer: 'rgba(255, 255, 255, 0)',
      activeBg: 'rgba(0, 0, 0, 0)',
    },
  },
  token: {
    colorPrimary: '#f51a26',
    colorInfo: '#f51a26',
    colorPrimaryBg: '#fdebeb',
    fontSize: 16,
    wireframe: false,
    colorBgBase: '#021777',
    colorTextBase: '#ffffff',
  },
};
