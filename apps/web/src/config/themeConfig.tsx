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
