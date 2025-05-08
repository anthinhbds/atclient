import { useDispatch, useSelector } from "react-redux";
import {
  getRevenueMonthlyByUserRequest,
} from "store/home/reducer";
import {
  loading,
  error,
  saving,
  deleting,
  restored,
  revenuesMonthly,
} from "store/home/selector";
// import { IAction, ITransactionItem, IQueryParam } from "types";

export function useHome() {
  const dispatch = useDispatch();
  const reveneUserData = useSelector(revenuesMonthly);
  const isSaving = useSelector(saving);
  const errorInfo = useSelector(error);
  const isLoading = useSelector(loading);
  const isDeleting = useSelector(deleting);
  const isRestored = useSelector(restored);

  const getRevenueMonthlyByUser = (params: { userId: string, month: number }) => {
    dispatch(getRevenueMonthlyByUserRequest(params));
  };


  return {
    reveneUserData,
    errorInfo,
    isLoading,
    isDeleting,
    isSaving,
    isRestored,
    getRevenueMonthlyByUser
  };
}
