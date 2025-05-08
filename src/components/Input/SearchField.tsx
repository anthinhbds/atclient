import React, { memo, useRef, useState, useEffect } from "react";
import { Box, Stack, TextField, Popover, MenuItem } from "@mui/material";
import { ArrowDropDown, Clear } from "@mui/icons-material";
import { debounce } from "utils";
import { IUserSearchProfileItem } from "types";
// import createStyles from "./styles";

interface ISearchField {
  currentProfile?: IUserSearchProfileItem;
  profiles?: IUserSearchProfileItem[];
  placeHolder?: string;
  handleSearchChange: (v?: string | IUserSearchProfileItem) => void;
}

const SearchField = ({
  currentProfile,
  profiles = [],
  placeHolder = "Search Field",
  handleSearchChange,
}: ISearchField) => {
  // const [openAdvSearch, setOpenAdvSearch] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const textFieldRef = useRef(null);
  const [textFieldPos, setTextFieldPos] = useState({ left: 0, top: 0 });
  const [value, setValue] = useState<string>();

  const handleChange = (v: string | IUserSearchProfileItem) => {
    handleSearchChange(v);
    setValue(v as string);
  };

  const handleSelect = (profile: IUserSearchProfileItem) => {
    setValue(profile.profileName);
    handleSearchChange(profile);
    if (textFieldRef.current)
      (textFieldRef.current as HTMLInputElement).value =
        profile.profileName ?? "";
  };

  const debouncedSearch = debounce(handleChange, 700);
  useEffect(() => {
    currentProfile && handleSelect(currentProfile);
  }, [currentProfile]);
  return (
    <Stack margin={"auto 16px auto auto"} direction={"row"}>
      <TextField
        // value={value}
        name={'searchvalue'}
        inputRef={textFieldRef}
        sx={{
          width: "280px",
          borderRadius: '4px',
          border: "1px solid hsl(220, 20%, 25%)",
          "& .MuiInputBase-root": { pr: "3px !important" },
          "& input": {
            "&::placeholder": { fontSize: "12px" },
            fontSize: "14px",
            lineHeight: "22px",
            p: "8px",
          },
        }}
        placeholder={placeHolder}
        variant="outlined"
        onChange={(e) => {
          const v = e.target.value;
          debouncedSearch(v as any);
        }}
        slotProps={{
          input: {
            endAdornment: (
              <React.Fragment>
                {value && (
                  <Clear
                    sx={{ color: "red", fontSize: "12px", cursor: "pointer" }}
                    onClick={() => {
                      if (textFieldRef.current)
                        (textFieldRef.current as HTMLInputElement).value = "";
                      setValue("");
                      handleSearchChange();
                    }}
                  />
                )}
                {profiles && profiles.length > 0 && (
                  <ArrowDropDown
                    sx={{ cursor: "pointer" }}
                    onClick={() => {
                      if (textFieldRef.current) {
                        setAnchorEl(textFieldRef.current);
                        const el = textFieldRef.current as HTMLInputElement;
                        const rect = el.getBoundingClientRect();
                        setTextFieldPos({
                          top: rect.top + 35,
                          left: rect.left,
                        });
                      }
                    }}
                  />
                )}
              </React.Fragment>
            ),
          }
        }}
      />
      {anchorEl && (
        <Popover
          open={true}
          anchorEl={anchorEl}
          anchorReference="anchorPosition"
          anchorPosition={{
            top: textFieldPos.top,
            left: textFieldPos.left,
          }}
          onClose={() => {
            setAnchorEl(null);
          }}>
          <Box
            sx={{
              width: "320px",
              bgcolor: "background.paper",
            }}>
            {profiles.map((r) => (
              <MenuItem
                key={r.id}
                value={r.id}
                onClick={() => {
                  handleSelect(r);
                  setAnchorEl(null);
                }}>
                {r.profileName}
              </MenuItem>
            ))}
          </Box>
        </Popover>
      )}
    </Stack>
  );
};

export default memo(SearchField);
