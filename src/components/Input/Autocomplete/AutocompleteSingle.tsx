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
import { debounce, emptyGuid } from "utils";
import { IAutocomplete } from "types";
import { useAutocomplete } from "hooks";
import {
  addAppListener,
  useAppDispatch,
  UnsubscribeListener,
} from "store/listenerMiddleware";
import createStyle from "../styles";

interface IFilter {
  [key: string]: any;
  inputValue?: string;
}
const filter = createFilterOptions<IFilter>();

const AutocompleteSingle = forwardRef<HTMLInputElement, IAutocomplete>(
  function Input(
    {
      defaultValue = null,
      label = "",
      // addPopup,
      name = "",
      idField = "id",
      textField = "text",
      store,
      onChange,
      logKey = "",
      required = false,
      autoFocus,
      forceSelection = false,
      onInitDefaultRecord,
      reducerSyncStore,
      ...props
    },
    ref
  ) {
    const appDispatch = useAppDispatch();
    const { addRecord, dataByKey } = useAutocomplete();
    const logRecords = dataByKey(logKey);

    // const navigate = useNavigate();
    const { mode } = store;
    const styles = createStyle();
    const addText = useRef("");

    const inputRef = useRef<HTMLInputElement>();
    const listboxRef = useRef<HTMLInputElement>();

    const defaultRef = useRef<any>({
      reason: "",
      timeoutRef: "",
      totalCount: 0,
    }).current;
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState<any[]>([]);
    const [page, setPage] = useState(0);
    const pageSize = 7;

    const [ipValue, setIpValue] = useState<any>(null);
    const preForceValue = useRef<any>(null);
    // const [openDialog, setOpenDialog] = useState(false);
    const [loading, setLoading] = useState(false);
    const [autoHighlight, setAutoHighlight] = useState(false);

    // const [err, setErr] = useState({
    //   error: false,
    //   helperText: "",
    // });

    const handleChange: AutocompleteProps<
      any,
      true,
      undefined,
      undefined
    >["onChange"] = (_e, v: any, _details) => {
      if (v === null) {
        setIpValue(v);
        setAutoHighlight(false);
      } else {
        if (v["inputValue"]) {
          addText.current = v["inputValue"];
          // setOpenDialog(true);
          return;
        }
        setIpValue(v);
        preForceValue.current = v;

        logKey &&
          addRecord(logKey, [
            ...(Array.isArray(logRecords)
              ? logRecords.filter((l) => l.code !== v[idField])
              : []),
            { code: v[idField], name: v[textField] },
          ]);
      }
      onChange({
        target: {
          name,
          value: v ? v[idField] : null,
          rec: v,
        },
      } as any);
    };

    const handleInputChange = (e: any) => {
      const { value } = e.target;
      if (!value) {
        setIpValue(null);
      }
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
              searchString:
                (inputRef?.["current"] as HTMLInputElement)?.value || "",
              page: page + 1,
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
          if (listboxRef) {
            const ele = listboxRef.current?.querySelector("li.Mui-focused");
            if (ele) {
              const v = options.find((f) => f[textField] === ele.textContent);
              if (v) {
                setIpValue(v);
                onChange({
                  target: {
                    name,
                    value: v ? v[idField] : null,
                    rec: v,
                  },
                } as any);
                preForceValue.current = v;
              }
            }
          }
        }
      },
      [options, idField, textField]
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
            const searchString =
              defaultValue && defaultValue !== emptyGuid ? defaultValue : null;
            let filter: any = [];
            if (params && params.filter) filter = [...params.filter];
            if (searchString) {
              // if (isValidUUID(searchString)) filter.push({ property: idField, value: searchString, method: "eq" });
              // else filter.push({ property: textField, value: searchString, method: "like" });
              filter.push({ property: idField, value: searchString, method: "eq" });
            }
            setLoading(true);
            fnGetData({ ...params, filter, page, pageSize }, (result: any) => {
              setLoading(false);
              if (result.data) {
                const { data, total } = result.data;
                if (data && Array.isArray(data)) setOptions(data);
                defaultRef.totalCount = total;
                const item = data.filter((i: any) => i[idField] === defaultValue);
                if (item.length > 0) {
                  setIpValue(item[0]);
                  preForceValue.current = item[0];
                  onInitDefaultRecord?.(item[0]);

                  logKey &&
                    addRecord(logKey, [
                      ...(Array.isArray(logRecords)
                        ? logRecords.filter((l) => l !== item[0][idField])
                        : []),
                      { code: item[0][idField], name: item[0][textField] },
                    ]);
                } else setIpValue(null);
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
            setIpValue(null);
          }
        }
      } else {
        if (store.data) {
          setOptions(store.data);
          if (defaultValue) {
            const v = store.data.find((d) => d[idField] === defaultValue);
            if (v) {
              setIpValue(v);
              preForceValue.current = v;
            } else setIpValue(null);
          } else {
            setIpValue(null);
          }

          if (logKey) {
            addRecord(
              logKey,
              store.data.map((r) => ({ code: r[idField], name: r[textField] }))
            );
          }
        }
      }
    }, [defaultValue]);

    //Change Store fixed
    useEffect(() => {
      if (store.mode === "local" && Array.isArray(store.data)) {
        setOptions(store.data);
      }
    }, [JSON.stringify(store)]);

    useEffect(() => {
      if (reducerSyncStore) {
        const unsubscribe = appDispatch(
          addAppListener({
            actionCreator: reducerSyncStore,
            effect: () => {
              // do some useful logic here
              // const { actionKey, data, requestPayload } = payload;
              const { fnGetData, params } = store;
              if (!ipValue && fnGetData) {
                fnGetData({ ...params, page, pageSize }, (result: any) => {
                  setLoading(false);
                  if (result.data) {
                    const { data, total } = result.data;
                    if (data && Array.isArray(data)) setOptions(data);
                    defaultRef.totalCount = total;
                  }
                });
              }
            },
          })
        );
        return unsubscribe as unknown as UnsubscribeListener;
      }
    }, [ipValue]);

    return (
      <React.Fragment>
        <MuiAutocomplete
          ref={ref}
          name={name}
          {...(props as any)}
          open={open}
          defaultValue={defaultValue === "" ? null : defaultValue}
          value={ipValue}
          onChange={handleChange}
          selectOnFocus
          clearOnBlur
          handleHomeEndKeys
          options={options}
          getOptionDisabled={(option: any) => option.disabled}
          getOptionLabel={(option: any) => {
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
          filterOptions={(ops: IFilter[], params) => {
            const filtered = filter(ops, params);
            if (!loading) {
              const { inputValue } = params;
              if (inputValue) setAutoHighlight(true);
              // const isExisting = ops.some(
              //   (option) => inputValue === option[textField]
              // );
              // if (addPopup?.formId && inputValue !== "" && !isExisting) {
              //   filtered.push({
              //     inputValue: inputValue,
              //     [textField]: addPopup?.title
              //       ? `${t("button.add")} ${t(addPopup.title)} "${inputValue}"`
              //       : `${t("button.add")} ${t(
              //         addPopup?.formId.toUpperCase() + ".title"
              //       )} "${inputValue}"`,
              //   });
              // }

              return filtered;
            }
            return filtered;
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
              ref: listboxRef,
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
                  '& svg': {
                    color: 'hsl(220, 30%, 7%)'
                  }
                }}
                onChange={(e) => {
                  debouncedHandleInputChange(e);
                }}
                onBlur={(_e) => {
                  if (forceSelection && !ipValue) {
                    const v = preForceValue.current;
                    setIpValue(v);
                    onChange({
                      target: {
                        name,
                        value: v ? v[idField] : null,
                        rec: v,
                      },
                    } as any);
                  }
                }}
                error={props.error}
                helperText={props.helperText}
              />
            );
          }}
        />
        {/* {openDialog && addPopup?.formId && (
          <AddDialog
            formId={addPopup?.formId}
            addText={addText.current}
            title={addPopup?.title}
            field={name}
            // api={addPopup?.api}
            handleOk={(type, data) => {
              if (type === "add") {
                if (data) {
                  const { fnGetData, params } = store;
                  if (fnGetData) {
                    const searchString = data[idField];
                    setLoading(true);
                    fnGetData(
                      { ...params, searchString, page, pageSize },
                      (result) => {
                        setLoading(false);
                        if (result.data) {
                          const { data: rsData, total } = result.data;
                          if (rsData && Array.isArray(rsData))
                            setOptions(rsData);
                          defaultRef.totalCount = total;
                          const item = rsData.filter(
                            (i) => i[idField] === searchString
                          );
                          if (item.length > 0) {
                            setIpValue(item[0]);
                            onChange({
                              target: {
                                name,
                                value: item[0][idField],
                                rec: item[0],
                              },
                            } as any);
                          }
                        }
                      }
                    );
                  }
                }
              }
              if (type === "detail") {
                addPopup?.formId &&
                  navigate(`${addPopup?.formId}?id=${data[idField]}`);
              }
              setOpenDialog(false);
            }}
            handleClose={() => {
              setOpenDialog(false);
            }}
          />
        )} */}
      </React.Fragment>
    );
  }
);

export default memo(AutocompleteSingle);
