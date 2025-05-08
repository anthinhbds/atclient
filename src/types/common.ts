import { IUserItem } from "./user";

export enum IFormKey {
  HOME = "home",
  USR = "usr",
  HIS = "his",
  PROJECT = "project",
  APARTMENT = "apartment",
  CUSTOMER = "customer",
  CUSTOMERJOURNEY = "customerjourney",
  REVENUE = "revenue",
  EXPENSE = "expense",
  RP_BCTC = "rp_bctc",
  RP_APARTMENTSTATICTIS = "rp_apartmentstatictis",
  RP_VIEWSTATISTIC = "rp_viewstatistic"
}

export enum IFormText {
  HOME = "Trang chủ",
  USR = "Nhân viên",
  HIS = "Lịch sử thao tác",
  PROJECT = "Dự án",
  APARTMENT = "Chính chủ",
  CUSTOMER = "Khách hàng",
  CUSTOMERJOURNEY = "Lịch dẫn khách",
  REVENUE = "Phiếu thu",
  EXPENSE = "Phiếu chi",
  RP_BCTC = "Tổng quan thu chi",
  RP_APARTMENTSTATICTIS = "Thống kê chính chủ",
  RP_VIEWSTATISTIC = "Thống kê lượt xem"
}

export enum IThemeMode {
  MAIN = "main",
  LIGHT = "light",
  DARK = "dark",
}

export enum IHeaderButton {
  NOTICE = "notice",
  HOME = "home",
}

export const menus = [
  {
    key: "apartment",
    text: "Chính chủ",
    icon: "C",
    single: true,
  },
  {
    key: "customer",
    text: "Khách hàng",
    icon: "K",
    single: true,
  },
  {
    key: "customerjourney",
    text: "Lịch dẫn khách",
    icon: "L",
    single: true,
  },
  {
    key: "dm",
    text: "Danh mục",
    icon: "D",
    items: [
      {
        key: "project",
        text: "Dự án",
      }
    ],
  },
  {
    key: "dtcp",
    text: "Doanh thu/Chi phí",
    icon: "H",
    items: [
      {
        key: "revenue",
        text: "Phiếu thu",
      },
      {
        key: "expense",
        text: "Phiếu chi",
      },
    ],
  },
  {
    key: "reports",
    text: "Báo cáo",
    icon: "B",
    items: [
      {
        key: "rp_bctc",
        text: "Tổng quan thu chi",
      },
      {
        key: "rp_apartmentstatictis",
        text: "Thống kê chính chủ",
      },
      {
        key: "rp_viewstatistic",
        text: "Thống kê lượt xem",
      },
    ],
  },
  {
    key: "settings",
    text: "Cài đặt",
    icon: "S",
    items: [
      {
        key: "usr",
        text: "Danh sách nhân viên",
      },
      {
        key: "his",
        text: "Lịch sử thao tác",
      },
    ],
  },
];

export interface IAssignmentLog {
  id?: string;
  referenceId?: string;
  date?: string;
  assignee?: string;
  user?: IUserItem
}