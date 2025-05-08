import React, { memo, useState } from "react";
import { Box, List, ListItem, Stack, TextField, Typography } from "@mui/material";
import { debounce, number2String } from "utils";
import { Search } from "@mui/icons-material";
import { getAll } from 'services/api/apartment';
import { SourceApartmentDemand, IApartmentItem, IApartmentDemand } from "types";



const MobilePage = () => {
  // const inputRef = useRef<HTMLInputElement>(null);
  const pageSize = 100;
  const [rows, setRows] = useState<IApartmentItem[]>([]);
  const handleChange = (searchString: string) => {
    if (searchString) {
      getAll({ searchString, page: 1, pageSize }, (rp) => {
        const rs = rp.data;
        if (rs && rs.success) {
          setRows((prevRows) => [...prevRows, ...rs.data]);
        }
      });
    }
  };
  const debouncedSearch = debounce(handleChange, 900);
  return (
    <Box width={1} height={1} py={4} px={2} sx={{ overflow: 'hidden' }}>
      <Box display={'flex'}>
        <TextField
          sx={{
            '& input': {
              p: '10px',
              fontSize: '14px',
            }
          }}
          fullWidth
          placeholder="Nhập tên căn hộ, số điện thoại, chủ hộ, ghi chú..."
          onChange={(e => {
            const v = e.target.value;
            debouncedSearch(v as any);
          })}
        />
        <Box display={'flex'} alignItems={'center'} ml={1} >
          <Search />
        </Box>
      </Box>
      <Box my={1}>
        <Typography variant="subtitle2" fontSize={'16px'} color='#A31D1D'>{'Danh sách chính chủ tìm được:'}</Typography>
      </Box>
      <List sx={{
        maxHeight: 'calc(100vh - 100px)',
        overflowY: 'auto'
      }}>
        {rows.length > 0 && rows.map((row, index) => {
          const projectname = row.project?.projectname;
          const price = row.demand === IApartmentDemand.B ? number2String(row.salesprice ?? 0)
            : row.demand === IApartmentDemand.T ? number2String(row.rentprice ?? 0)
              : row.demand === IApartmentDemand.BT ? `${number2String(row.salesprice ?? 0)} - ${number2String(row.rentprice ?? 0)}` : '-';
          return (
            <ListItem key={index} sx={{
              display: 'block',
              my: 1,
              px: 1,
              py: 0.5,
              borderBottom: '1px solid hsl(0,0%,65%)'
            }}>
              <Stack rowGap={0.5}>
                <Typography
                  variant="subtitle2"
                  fontSize={'14px'}
                  color='#A31D1D'
                >
                  {projectname}
                </Typography>
                <Stack direction={'row'} width={1} >
                  <Typography variant="subtitle2" fontSize={'14px'} >{`${row.owner} - ${row.telephone}`}</Typography>
                  <Typography ml={'auto'} variant="subtitle2" fontSize={'14px'} color={'rgb(102,179,255)'} >
                    {SourceApartmentDemand.filter(f => f.id === row.demand)[0].text}
                  </Typography>
                </Stack>
                <Stack>
                  <Typography variant="subtitle2" fontSize={'14px'} >
                    {`DT: ${row.area}m - Giá: ${price}`}</Typography>
                </Stack>
                <Stack>
                  <Typography variant="subtitle2" fontSize={'14px'} >
                    {`Số phòng ngủ: ${row.bedroom}`}</Typography>
                </Stack>
              </Stack>

            </ListItem>
          );
        })}
      </List>
    </Box>
  );
};

export default memo(MobilePage);