import { useDispatch, useSelector } from "react-redux";
import {
  getTotalViewRequest,
} from "store/report/reducer";
import {
  loading,
  error,
  viewStatisticItems,
} from "store/report/selector";
// import { IAction, ITransactionItem, IQueryParam } from "types";

export function useReport() {
  const dispatch = useDispatch();
  const viewStatisticData = useSelector(viewStatisticItems);
  const errorInfo = useSelector(error);
  const isLoading = useSelector(loading);

  const getTotalView = () => {
    dispatch(getTotalViewRequest());
  };


  return {
    viewStatisticData,
    errorInfo,
    isLoading,
    getTotalView
  };
}
