// import { IHistoryItem } from "types";
import {
  // handlePost,
  handleGet,
} from "../utils";



const getTotalView = () => {
  return handleGet(`Report/getTotalView`, null);
};


export { getTotalView };