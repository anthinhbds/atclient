import React from "react";
// import SvgIcon from "components/Buttons/SvgIcon";
// import { ISvgIcon } from "components/Buttons/SvgIcon";
import {
  Add,
  Edit,
  Save,
  SendSharp,
  Undo,
  Delete,
  Inventory,
  Restore,
  Close,
  Send,
  Approval,
  Print,
  Email,
  BookmarkAdd,
  BookmarkRemove,
  ContentCopy,
  AssignmentReturn,
  AttachFile,
  MoreVert,
  UploadFile,
  Download,
  Link,
  Storage,
  JoinLeft,
  CallSplit,
  Paid,
  ArrowDropUp,
  ArrowDropDown,
  CalendarMonth,
  NavigateNext,
  NavigateBefore,
  Search,
  PlayArrow,
  Settings,
  CleaningServices,
  CloudUpload,
  CloudDownload,
  Merge,
  Input,
  GroupAdd,
  GroupRemove,
  Notifications,
  DataSaverOn,
  Visibility,
  AssignmentInd,
} from "@mui/icons-material";

const Icons = {
  new: () => <Add />,
  add: () => <Add />,
  invite: () => <SendSharp />,
  edit: () => <Edit />,
  save: () => <Save />,
  cancel: () => <Undo />,
  delete: () => <Delete />,
  submit: () => <Send />,
  send: () => <Email />,
  approve: () => <Approval />,
  accept: () => <Approval />,
  return: () => <AssignmentReturn />,
  archive: () => <Inventory />,
  markasbilled: () => <BookmarkAdd />,
  unmarkasbilled: () => <BookmarkRemove />,
  markasinvoiced: () => <BookmarkAdd />,
  unmarkasinvoiced: () => <BookmarkRemove />,
  reject: () => <Close />,
  decline: () => <Close />,
  restore: () => <Restore />,
  clearsearch: () => <Close sx={{ color: "red" }} />,
  print: () => <Print />,
  email: () => <Email />,
  copy: () => <ContentCopy />,
  copyto: () => <ContentCopy />,
  attachment: () => <AttachFile />,
  more: () => <MoreVert />,
  upload: () => <UploadFile />,
  download: () => <Download />,
  link: () => <Link />,
  browse: () => <Storage />,
  adjust: () => <Add />,
  add_planneddate: () => <CalendarMonth />,
  add_togroup: () => <GroupAdd />,
  remove_fromgroup: () => <GroupRemove />,
  move_togroup: () => <Input />,
  merge_contact: () => <Merge />,
  delete_group: () => <Close />,
  update_group: () => <Edit />,
  assignment: () => <AssignmentInd />,
  // refresh: ({ width, height, viewBox, color }: ISvgIcon) => (
  //   <SvgIcon width={width} height={height} viewBox={viewBox} fill={color}>
  //     <path
  //       d="M0 7.63956L0 3.38956C0 3.16412 0.105357 2.94792 0.292893 2.78851C0.48043 2.62911 0.734784 2.53956 1 2.53956L16.586 2.53956L15.293 1.44051C15.1108 1.28019 15.01 1.06548 15.0123 0.842614C15.0146 0.619747 15.1198 0.406556 15.3052 0.248959C15.4906 0.0913624 15.7414 0.00196879 16.0036 3.21322e-05C16.2658 -0.00190452 16.5184 0.0837706 16.707 0.238605L19.707 2.78861C19.8468 2.90748 19.942 3.05892 19.9806 3.22378C20.0192 3.38864 19.9993 3.55952 19.9237 3.71481C19.848 3.87011 19.7199 4.00285 19.5555 4.09625C19.391 4.18965 19.1978 4.23952 19 4.23956L2 4.23956L2 7.63956C2 7.86499 1.89464 8.08119 1.70711 8.2406C1.51957 8.4 1.26522 8.48956 1 8.48956C0.734784 8.48956 0.48043 8.4 0.292893 8.2406C0.105357 8.08119 0 7.86499 0 7.63956ZM19 8.48956C18.7348 8.48956 18.4804 8.57911 18.2929 8.73851C18.1054 8.89792 18 9.11412 18 9.33956L18 12.7396L1 12.7396C0.80225 12.7396 0.608951 12.7895 0.444541 12.8829C0.280132 12.9763 0.151992 13.109 0.0763221 13.2643C0.000652038 13.4196 -0.019151 13.5905 0.0194166 13.7553C0.0579841 13.9202 0.153191 14.0716 0.293 14.1905L3.293 16.7405C3.38525 16.8217 3.49559 16.8864 3.6176 16.931C3.7396 16.9755 3.87082 16.999 4.0036 17C4.13638 17.0009 4.26806 16.9794 4.39095 16.9367C4.51385 16.894 4.6255 16.8308 4.7194 16.751C4.81329 16.6712 4.88754 16.5763 4.93782 16.4719C4.9881 16.3674 5.0134 16.2555 5.01225 16.1426C5.0111 16.0298 4.98351 15.9182 4.9311 15.8145C4.87869 15.7108 4.80251 15.617 4.707 15.5386L3.414 14.4396L19 14.4396C19.2652 14.4396 19.5196 14.35 19.7071 14.1906C19.8946 14.0312 20 13.815 20 13.5896L20 9.33956C20 9.11412 19.8946 8.89792 19.7071 8.73851C19.5196 8.57911 19.2652 8.48956 19 8.48956Z"
  //       fill={color}
  //     />
  //   </SvgIcon>
  // ),
  // home: ({ width, height, viewBox, color }: ISvgIcon) => (
  //   <SvgIcon width={width} height={height} viewBox={viewBox} fill={color}>
  //     <path
  //       d="M6.50008 12.1667H13.5001V19.1667H17.0001V8.66667L10.0001 3.41667L3.00008 8.66667V19.1667H6.50008V12.1667ZM0.666748 21.5V7.5L10.0001 0.5L19.3334 7.5V21.5H0.666748Z"
  //       fill={color}
  //     />
  //   </SvgIcon>
  // ),
  // notice: ({ width, height, viewBox, color }: ISvgIcon) => (
  //   <SvgIcon width={width} height={height} viewBox={viewBox} fill={color}>
  //     <path
  //       d="M7.77778 18.0952H12.2222C12.2222 19.1429 11.2222 20 10 20C8.77778 20 7.77778 19.1429 7.77778 18.0952ZM20 16.1905V17.1429H0V16.1905L2.22222 14.2857V8.57143C2.22222 5.61905 4.44444 3.04762 7.77778 2.19048V1.90476C7.77778 0.857143 8.77778 0 10 0C11.2222 0 12.2222 0.857143 12.2222 1.90476V2.19048C15.5556 3.04762 17.7778 5.61905 17.7778 8.57143V14.2857L20 16.1905ZM15.5556 8.57143C15.5556 5.90476 13.1111 3.80952 10 3.80952C6.88889 3.80952 4.44444 5.90476 4.44444 8.57143V15.2381H15.5556V8.57143Z"
  //       fill={color}
  //     />
  //   </SvgIcon>
  // ),
  // help: ({ width, height, viewBox, color }: ISvgIcon) => (
  //   <SvgIcon width={width} height={height} viewBox={viewBox} fill={color}>
  //     <path
  //       d="M9 16H11V14H9V16ZM10 0C8.68678 0 7.38642 0.258658 6.17317 0.761205C4.95991 1.26375 3.85752 2.00035 2.92893 2.92893C1.05357 4.8043 0 7.34784 0 10C0 12.6522 1.05357 15.1957 2.92893 17.0711C3.85752 17.9997 4.95991 18.7362 6.17317 19.2388C7.38642 19.7413 8.68678 20 10 20C12.6522 20 15.1957 18.9464 17.0711 17.0711C18.9464 15.1957 20 12.6522 20 10C20 8.68678 19.7413 7.38642 19.2388 6.17317C18.7362 4.95991 17.9997 3.85752 17.0711 2.92893C16.1425 2.00035 15.0401 1.26375 13.8268 0.761205C12.6136 0.258658 11.3132 0 10 0ZM10 18C5.59 18 2 14.41 2 10C2 5.59 5.59 2 10 2C14.41 2 18 5.59 18 10C18 14.41 14.41 18 10 18ZM10 4C8.93913 4 7.92172 4.42143 7.17157 5.17157C6.42143 5.92172 6 6.93913 6 8H8C8 7.46957 8.21071 6.96086 8.58579 6.58579C8.96086 6.21071 9.46957 6 10 6C10.5304 6 11.0391 6.21071 11.4142 6.58579C11.7893 6.96086 12 7.46957 12 8C12 10 9 9.75 9 13H11C11 10.75 14 10.5 14 8C14 6.93913 13.5786 5.92172 12.8284 5.17157C12.0783 4.42143 11.0609 4 10 4Z"
  //       fill={color}
  //     />
  //   </SvgIcon>
  // ),
  allocate: () => <JoinLeft />,
  unallocate: () => <CallSplit />,
  payment: () => <Paid />,
  up: (props: any) => <ArrowDropUp {...props} />,
  down: (props: any) => <ArrowDropDown {...props} />,
  remove: () => <Restore />,
  next: () => <NavigateNext />,
  back: () => <NavigateBefore />,
  search: () => <Search />,
  run: () => <PlayArrow />,
  setting: () => <Settings />,
  dispose: () => <CleaningServices />,
  import: () => <CloudUpload />,
  export: () => <CloudDownload />,
  change_date: () => <CalendarMonth />,
  reminder: () => <Notifications />,
  datasaver: () => <DataSaverOn />,
  preview: () => <Visibility />,
};

export default Icons;
