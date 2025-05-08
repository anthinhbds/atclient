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
import { debounce } from "utils";
import { IAutocompleteMultiple } from "types";
// import { AddDialog } from "components";
import createStyle from "../styles";

interface IFilter {
  [key: string]: any;
  inputValue?: string;
}
const filter = createFilterOptions<IFilter>();

const AutocompleteMultiple = forwardRef<
  HTMLInputElement,
  IAutocompleteMultiple
>(function Input(
  {
    defaultValue = [],
    label = "",
    // addPopup,
    name = "",
    idField = "id",
    textField = "text",
    store,
    onChange,
    onBlur,
    autoFocus,
    // getValues,
    // keyField = "id",
    // useI18n = true,
    // textField = "text",
    required = false,
    // renderOption,

    ...props
  },
  ref
) {
  const { mode } = store;
  const styles = createStyle();
  // const addText = useRef("");
  const defaultRef = useRef<any>({
    reason: "",
    timeoutRef: "",
    totalCount: 0,
  }).current;
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const pageSize = 7;

  const [ipValue, setIpValue] = useState<any[]>([]);
  const inputRef = useRef<HTMLInputElement>();
  const [loading, setLoading] = useState(false);
  const [autoHighlight, setAutoHighlight] = useState(false);

  const handleChange: AutocompleteProps<
    any,
    true,
    undefined,
    undefined
  >["onChange"] = (_e, values: any, _details) => {
    if (values === null) {
      setIpValue(values);
      setAutoHighlight(false);
      return;
    }
    if (values["inputValue"]) {
      // setOpenDialog(true);
      return;
    }
    setIpValue(values);
    onChange({
      target: {
        name,
        value: values.map((v: any) => v[idField]),
        text: values.map((v: any) => v[textField]),
      },
    } as any);
  };

  const handleInputChange = (e: any) => {
    const { value } = e.target;
    const { fnGetData, params } = store;
    if (fnGetData) {
      setLoading(true);
      let filter: any = [];
      if (params && params.filter) filter = [...params.filter];
      if (value) filter.push({ property: textField, value, method: "like" });
      fnGetData(
        { ...params, filter, page: 0, pageSize },
        (result: any) => {
          setLoading(false);
          if (result.data) {
            const { data, total } = result.data;
            if (data && Array.isArray(data)) setOptions(data);
            defaultRef.totalCount = total;
          }
        }
      );
      setPage(0);
    }
  };
  const debouncedHandleInputChange = debounce(handleInputChange, 300);

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
          const ps = { ...params, page: page + 1, pageSize };
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
            const value = options[Number(idx)];
            const values = [...ipValue, value];
            setIpValue(values);
            onChange({
              target: {
                name,
                value: values.map((v) => v[idField]),
              },
            } as any);
          }
        }
      }
    },
    [options, idField, textField, ipValue]
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
        if (defaultValue) {
          // const searchString = defaultValue ? defaultValue : null;
          const searchString = "";
          const filter = params && params.filter ? params.filter : [];
          filter.push({ property: idField, value: defaultValue, method: "in" });
          setLoading(true);
          fnGetData({ ...params, filter, searchString, page, pageSize }, (result: any) => {
            setLoading(false);
            if (result.data) {
              const { data, total } = result.data;
              if (data && Array.isArray(data)) setOptions(data);
              defaultRef.totalCount = total;
              const items = data.filter((i: any) =>
                defaultValue.includes(i[idField])
              );
              setIpValue(items);
            }
          });
        } else {
          setLoading(true);
          fnGetData({ ...params, page, pageSize }, (result: any) => {
            setLoading(false);
            if (result.data) {
              const { data, total } = result.data;
              if (data && Array.isArray(data)) setOptions(data);
              defaultRef.totalCount = total;
            }
          });
          setIpValue([]);
        }
      }
    } else {
      if (store.data) {
        setOptions(store.data);
        if (defaultValue) {
          const v = store.data.filter((d) => defaultValue.includes(d[idField]));
          v ? setIpValue(v) : setIpValue([]);
        } else {
          setIpValue([]);
        }
      }
    }
  }, [JSON.stringify(defaultValue)]);

  return (
    <React.Fragment>
      <MuiAutocomplete
        ref={ref}
        {...(props as any)}
        sx={{
          "& .MuiInputBase-root": { pr: "0px !important" },
          "& .MuiInputBase-root .MuiChip-root": {
            maxWidth: "44%",
          },
        }}
        open={open}
        defaultValue={defaultValue}
        value={ipValue}
        onChange={handleChange}
        onBlur={onBlur}
        selectOnFocus
        clearOnBlur
        handleHomeEndKeys
        options={options}
        multiple
        disableCloseOnSelect
        limitTags={2}
        getOptionLabel={(option: any) => {
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
        }}
        filterOptions={(options: IFilter[], params) => {
          const filtered = filter(options, params);
          if (!loading) {
            const { inputValue } = params;
            if (inputValue) setAutoHighlight(true);
            return filtered;
          }
          return filtered;
        }}
        getOptionSelected={(option: any, value: any) => {
          return option[textField] === value[textField];
        }}
        slotProps={{
          paper: {
            sx: {
              backgroundColor: 'transparent',
              color: 'hsl(220, 30%, 7%)'
            }
          },
          listbox: {
            onScroll: handleScroll,
            id: "autocompleteListbox",
            sx: {
              maxHeight: "235px",
              mt: '5px',
              backgroundColor: '#FFF',
              // '& .MuiAutocomplete-option': {
              //   backgroundColor: 'transparent !important'
              // },
              // '& .MuiAutocomplete-option.Mui-focused': {
              //   color: 'hsl(220, 30%, 7%)'
              // }
            },
          }
        }}
        onKeyDown={handleKeyDown}
        onClose={handleToggleDropDown(false)}
        onOpen={handleToggleDropDown(true)}
        clearIcon={null}
        autoHighlight={autoHighlight}
        renderInput={(params) => {
          return (
            <TextField
              {...params}
              variant="standard"
              required={required}
              label={label}
              inputRef={inputRef}
              autoFocus={autoFocus}
              sx={{
                ...styles.labelDefault,
                '& .MuiChip-label': {
                  color: 'hsl(220, 30%, 7%)'
                },
                '& .MuiChip-deleteIcon': {
                  fontSize: '12px',
                  color: 'hsl(220, 30%, 7%)',
                  '&:hover': {
                    color: 'hsl(220, 30%, 7%)',
                  }
                },
                '& svg': {
                  color: 'hsl(220, 30%, 7%)'
                }
              }}
              onChange={(e) => {
                debouncedHandleInputChange(e);
              }}
            />
          );
        }}
      />
    </React.Fragment>
  );
});

export default memo(AutocompleteMultiple);
