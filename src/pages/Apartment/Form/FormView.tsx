import React, {
  memo,
  useEffect,
  useState,
} from "react";
import {
  Box,
  // Box,
  Button,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import defaultStyle from "utils/styles";
import {
  IApartmentDemand,
  IApartmentItem,
  IApartmentNote,
} from "types";
import { useTranslation } from "react-i18next";
import { getNotes } from 'services/api/apartment';
import { date2Srting, number2String } from 'utils';
import DisplayField from "./DisplayField";


interface IFormView {
  record: IApartmentItem;
  keyNum?: number;
}
const Form = ({ record, keyNum = 0 }: IFormView) => {
  const dStyles = defaultStyle();
  const { t } = useTranslation();

  const [details, setDetails] = useState<IApartmentNote[]>([]);

  useEffect(() => {
    if (record && record.apartmentId) {
      getNotes(record.apartmentId, (rp) => {
        const rs = rp.data;
        if (rs.success) {
          setDetails(rs.data);
        }
      });
    }
  }, [record]);

  return (
    <Container key={keyNum} sx={dStyles.container}>
      <Stack>
        <Stack direction={'row'} columnGap={1} mb={2}>
          <Typography variant="h6" color='#A31D1D'>
            {record.project?.projectname}
          </Typography>
          <Button variant="contained" sx={{
            backgroundColor: 'rgb(1,87,155)',
            fontSize: '10px', py: '4px'
          }}>
            {t(`MAP.src_demand.${record.demand}`)}
          </Button>
        </Stack>

        <Stack direction={'row'} columnGap={3} mb={1.5}>
          <DisplayField label={'Tên liên hệ'} value={record.owner} />
          <DisplayField label={'Số điện thoại'} value={record.telephone} />
          {record.telephone2 && (<DisplayField label={'Số điện thoại 2'} value={record.telephone2} />)}
          {record.telephone3 && (<DisplayField label={'Số điện thoại 3'} value={record.telephone3} />)}
          {record.telephone4 && (<DisplayField label={'Số điện thoại 4'} value={record.telephone4} />)}
          {(record.demand === IApartmentDemand.B || record.demand === IApartmentDemand.BT) && (<DisplayField label={'Giá bán'} value={number2String(record.salesprice ?? 0)} />)}
          {(record.demand === IApartmentDemand.B || record.demand === IApartmentDemand.BT) && (<DisplayField label={'Phí bán'} value={number2String(record.salesfee ?? 0)} />)}
          {(record.demand === IApartmentDemand.T || record.demand === IApartmentDemand.BT) && (<DisplayField label={'Giá cho thuê'} value={number2String(record.rentprice ?? 0)} />)}
          {(record.demand === IApartmentDemand.T || record.demand === IApartmentDemand.BT) && (<DisplayField label={'Phí cho thuê'} value={number2String(record.rentfee ?? 0)} />)}
        </Stack>

        <Typography variant="subtitle1" fontWeight={700}>
          Đặc điểm căn hộ
        </Typography>
        <Stack direction={'row'} columnGap={3} mb={0.5}>
          <DisplayField label={'Mã căn hộ'} value={record.apartmentno} />
          <DisplayField label={'Diện tích'} value={`${record.area}m²`} />
          <DisplayField label={'Số phòng ngủ'} value={record.bedroom} />
          {record.banconyview && (<DisplayField label={'Nội thất'} value={record.furniture} />)}
          {record.apartmentview && (<DisplayField label={'Hướng cửa'} value={t(`MAP.src_direction.${record.apartmentview}`)} />)}
          {record.banconyview && (<DisplayField label={'Hướng ban công'} value={t(`MAP.src_direction.${record.banconyview}`)} />)}
          {(record.demand === IApartmentDemand.B || record.demand === IApartmentDemand.BT) && (<DisplayField label={'Giá bán'} value={number2String(record.salesprice ?? 0)} />)}
          {(record.demand === IApartmentDemand.T || record.demand === IApartmentDemand.BT) && (<DisplayField label={'Giá cho thuê'} value={number2String(record.rentprice ?? 0)} />)}
        </Stack>
        <Box mb={2}>
          <DisplayField label={'Ghi chú'} value={record.notes} />
        </Box>
      </Stack>
      {details.length > 0 && (
        <React.Fragment>
          <Typography variant="subtitle1" fontWeight={700}>
            Nội dung liên hệ
          </Typography>
          <Stack direction={'row'} columnGap={5}>
            <Box minWidth={'100px'}  >
              <Typography variant="subtitle2">{'Ngày'}</Typography>
            </Box>
            <Box width={1}>
              <Typography variant="subtitle2">{'Nội dung'}</Typography>
            </Box>
          </Stack>
          {details.map((item, idx) => (
            <Stack key={idx} direction={'row'} columnGap={5} mb={0.5}>
              <Box minWidth={'100px'}  >
                <Typography>{date2Srting(item.entrydate ?? '')}</Typography>
              </Box>
              <Box width={1}>
                <Typography>{item.notes}</Typography>
              </Box>
            </Stack>
          ))}

        </React.Fragment>
      )}
    </Container>
  );
};

export default memo(Form);
