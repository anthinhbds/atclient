import React, {
  memo,
  useEffect,
  useState,
  forwardRef,
  useRef,
  useCallback,
} from "react";
import {
  TextField,
  Autocomplete as MuiAutocomplete,
  AutocompleteProps,
  createFilterOptions,
} from "@mui/material/";
import {
  debounce,
  //  emptyGuid 
} from "utils";
import {
  IFilterItem,
  // EAutoCompleteAddPopup
} from "types";
import { GridEditInputCellProps, GridApi } from "@mui/x-data-grid";
import { unstable_useEnhancedEffect as useEnhancedEffect } from "@mui/utils";
import { updateRow } from "utils";
import { useDatatable, useAutocomplete } from "hooks";
// import { useTranslation } from "react-i18next";
import createStyle from "./styles";

interface IFilter {
  [key: string]: any;
  inputValue?: string;
}
const filter = createFilterOptions<IFilter>();

type ICellEditAutocomplete = GridEditInputCellProps &
  Omit<
    AutocompleteProps<any, boolean, boolean, any>,
    "options" | "renderInput"
  > & {
    apiRef: React.MutableRefObject<GridApi>;
    rowId: any;
    field: string;
    idField?: string;
    textField?: string;
    createFilterField?: string;
    logKey?: string;
    // addPopup?: {
    //   title: string;
    //   formId: EAutoCompleteAddPopup;
    // };
    store: {
      data?: any[];
      params?: any;
      fnGetData?: (params: any, onSuccess?: any) => void;
      mode?: "local" | "remote";
    };
    handleChange?: (selectedRecord: any, rowId: any, field?: any) => void;
  };

const CellEditAutocomplete = forwardRef<
  HTMLInputElement,
  ICellEditAutocomplete
>(function Input(
  {
    // defaultValue = "",
    idField = "id",
    textField = "text",
    createFilterField = textField,
    addPopup,
    store,
    handleChange,
    logKey = "",
    onBlur,
    apiRef,
    rowId,
    field,
    hasFocus,
    disabled,
    ...props
  },
  ref
) {
  // const { t } = useTranslation();
  const { mode } = store;
  const styles = createStyle();
  const inputRef = useRef<HTMLInputElement>();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [autoHighlight, setAutoHighlight] = useState(false);
  const addText = useRef("");
  // const [openDialog, setOpenDialog] = useState(false);

  const defaultRef = useRef<any>({
    reason: "",
    timeoutRef: "",
    totalCount: 0,
    cellModeModel: {},
  }).current;

  const [options, setOptions] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const pageSize = 7;

  const [value, setValue] = useState<any>(null);

  const { callDialogAdd, dialogAddFailure, record: newRecord } = useDatatable();
  const { addRecord, dataByKey } = useAutocomplete();
  const logRecords = dataByKey(logKey);

  useEffect(() => {
    if (newRecord === "-1") {
      dialogAddFailure({ newRecord: null });
      setValue(null);
      updateValue({});
      return;
    }
    if (newRecord !== null) {
      dialogAddFailure({ newRecord: null });
      const { fnGetData, params } = store;
      if (fnGetData) {
        const searchString = newRecord[idField];
        setLoading(true);
        fnGetData({ ...params, searchString, page, pageSize }, (result: any) => {
          setLoading(false);
          if (result.data) {
            const { data, total } = result.data;
            if (data && Array.isArray(data)) setOptions(data);
            defaultRef.totalCount = total;
            const item = data.filter((i: any) => i[idField] === searchString);
            if (item.length > 0) {
              setValue(item[0]);
              updateValue(item[0]);
              handleChange?.(item[0], rowId, field);
            }
          }
        });
      }
    }
  }, [JSON.stringify(newRecord)]);

  useEnhancedEffect(() => {
    if (hasFocus) {
      if (value) {
        setTimeout(() => {
          inputRef.current?.focus();
          inputRef.current?.select();
        }, 50);
      } else inputRef.current?.focus();
    }
  }, [hasFocus, value]);

  const updateValue = useCallback(
    (record: any) => {
      const v = record && record[idField] ? record[idField] : null;
      const text = record && record[textField] ? record[textField] : "";
      apiRef.current.setEditCellValue({
        id: rowId,
        field,
        value: v,
      });

      updateRow(apiRef, rowId, { [textField]: text, [field]: v });

      if (v !== null) {
        addRecord(logKey, [
          ...(Array.isArray(logRecords)
            ? logRecords.filter((l) => l !== v)
            : []),
          { code: v, name: text },
        ]);
      }
    },
    [apiRef, rowId, field]
  );

  const handleInputChange = (e: any) => {
    const v = e.target.value;
    const { fnGetData, params } = store;
    if (fnGetData) {
      setLoading(true);
      fnGetData({ ...params, searchString: v, page: 0, pageSize }, (result: any) => {
        if (result.data) {
          setLoading(false);
          const { data, total } = result.data;
          if (data && Array.isArray(data)) setOptions(data);
          defaultRef.totalCount = total;
        }
      });
      setPage(0);
    }
  };
  const debouncedHandleInputChange = debounce(handleInputChange, 700);

  const handleScroll = useCallback(
    (event: any) => {
      const { params, fnGetData } = store;
      const listboxNode = event.currentTarget;
      const { scrollHeight } = listboxNode;
      const position = listboxNode.scrollTop + listboxNode.clientHeight;
      if (defaultRef.timeoutRef) clearTimeout(defaultRef.timeoutRef);

      defaultRef.timeoutRef = setTimeout(() => {
        if (
          scrollHeight - position <= 1 &&
          (page + 1) * 7 < defaultRef.totalCount
        ) {
          const ps = {
            ...params,
            page: page + 1,
            searchString: inputRef?.current?.value || "",
            pageSize,
          };
          fnGetData?.(ps, (result: any) => {
            const { data, total } = result.data;
            if (data && Array.isArray(data))
              setOptions((ops) => {
                return [...ops, ...data];
              });
            defaultRef.totalCount = total;
          });
          setPage((old) => old + 1);
        }
      }, 300);
    },
    [store, page]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "ArrowDown") setOpen((s) => !s || true);
      if (e.key === "Tab") {
        const ele = document
          .getElementById("autocompleteListbox")
          ?.querySelector("li.Mui-focused");
        if (ele) {
          const idx = ele.getAttribute("data-option-index") || -1;
          if (idx !== -1) {
            const v = options[parseInt(idx)];
            updateValue(v);
            handleChange?.(v, rowId, field);
          }
        }
      }
    },
    [options, idField, textField, apiRef, rowId, field]
  );

  const handleToggleDropDown = useCallback(
    (v?: boolean) => () => {
      setOpen((isO) => v ?? !isO);
    },
    []
  );

  useEffect(() => {
    if (mode === undefined || mode === "remote") {
      const { fnGetData, params } = store;
      if (fnGetData) {
        const v = apiRef.current.getRow(rowId)[field];
        const searchString = v;
        fnGetData({ ...params, searchString, page, pageSize }, (result: any) => {
          if (result.data) {
            const { data, total } = result.data;
            if (data.length > 0) {
              setOptions(data);
              defaultRef.totalCount = total;
              if (v) {
                const items = data.filter((item: any) => item[idField] === v);
                items.length > 0 && setValue(items[0]);
              }
            } else setValue(null);
          }
        });
      }
    } else {
      setOptions(store.data || []);
    }
  }, []);

  return (
    <MuiAutocomplete
      ref={ref}
      {...(props as any)}
      sx={styles.baseInputEdit}
      disabled={disabled}
      open={open}
      componentsProps={{
        paper: {
          sx: {
            width: "fit-content",
            whiteSpace: "nowrap",
            maxWidth: "450px",
          },
        },
      }}
      autoHighlight={autoHighlight}
      value={value}
      onChange={(_e: any, v: any) => {
        if (typeof v === "object" && v?.["inputValue"]) {
          addText.current = v?.["inputValue"];
          apiRef.current["dialogActive"] = true;
          callDialogAdd(addPopup?.formId, field, v?.["inputValue"]);
          return;
        }

        updateValue(v);
        setOpen(false);
        handleChange?.(v, rowId, field);
        if (v === null) setAutoHighlight(false);
      }}
      onBlur={onBlur}
      selectOnFocus
      clearOnBlur
      // handleHomeEndKeys
      options={options}
      getOptionLabel={(option: IFilterItem | any) => {
        // Value selected with enter, right from the input
        if (typeof option === "string") {
          return option;
        }
        if (option["inputValue"]) {
          return `${option[textField]}`;
        }
        if (typeof option === "object") {
          return option ? option[textField] : "";
        }
        return "";
        // Add "xxx" option created dynamically

        // Regular option
        // return toption[textField];
      }}
      filterOptions={(options: IFilter[], params) => {
        const filtered = filter(options, params);
        if (!loading) {
          const { inputValue } = params;
          if (inputValue) setAutoHighlight(true);
          // Suggest the creation of a new value
          // const isExisting = options.some(
          //   (option) => inputValue === option[createFilterField]
          // );
          // if (addPopup?.formId && inputValue !== "" && !isExisting) {
          //   filtered.push({
          //     inputValue: inputValue,
          //     [textField]: `${t("button.add")} ${field.indexOf("anal") !== -1
          //       ? ""
          //       : addPopup?.formId.toUpperCase() + ".title"} "${inputValue}"`,
          //   });
          // }

          return filtered;
        }
        return filtered;
      }}
      getOptionSelected={(option: any, value: any) =>
        option[textField] === value[textField]
      }
      ListboxProps={{
        onScroll: handleScroll,
        id: "autocompleteListbox",
        sx: {
          maxHeight: "185px",
          fontSize: "14px",
        },
      }}
      onKeyDown={handleKeyDown}
      onClose={handleToggleDropDown(false)}
      onOpen={handleToggleDropDown(true)}
      clearIcon={null}
      renderInput={(params) => {
        return (
          <TextField
            {...params}
            inputRef={inputRef}
            variant="outlined"
            onChange={(e) => {
              debouncedHandleInputChange(e);
            }}
          />
        );
      }}
    />
  );
});

// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top

export default memo(CellEditAutocomplete);
