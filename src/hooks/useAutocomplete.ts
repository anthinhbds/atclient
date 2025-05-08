import { useDispatch, useSelector } from "react-redux";
import { addRecordRequest } from "store/autocomplete/reducer";
import { getDataByKey } from "store/autocomplete/selector";

export function useAutocomplete() {
  const dispatch = useDispatch();

  const dataByKey = (k: any) => {
    return useSelector(getDataByKey(k));
  };

  const addRecord = (
    formId: string,
    record: { code: string; name: string }[]
  ) => {
    dispatch(addRecordRequest({ formId, record }));
  };
  return {
    addRecord,
    dataByKey,
  };
}
