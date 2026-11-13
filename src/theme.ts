import type { ThemeConfig } from "antd";

export const horseTheme: ThemeConfig = {
  token: {
    colorPrimary: "#2F6BFF",
    colorInfo: "#2F6BFF",
    colorText: "#12151C",
    colorTextSecondary: "#5C6570",
    colorBorder: "#E6E8EE",
    colorBgLayout: "#F5F6F8",
    borderRadius: 10,
    fontFamily: "Manrope, sans-serif",
    fontSize: 14,
  },
  components: {
    Layout: {
      headerBg: "#ffffff",
      siderBg: "#DDE0E6",
      bodyBg: "#F5F6F8",
      headerHeight: 64,
    },
    Menu: {
      itemBg: "#DDE0E6",
      itemBorderRadius: 8,
      itemSelectedBg: "#ffffff",
      itemSelectedColor: "#2F6BFF",
      itemHoverBg: "#E8EBF1",
    },
    Card: {
      headerFontSize: 15,
    },
    Button: {
      controlHeight: 38,
      fontWeight: 600,
    },
  },
};
