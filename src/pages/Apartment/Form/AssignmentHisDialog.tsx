import React, { memo, useEffect, useState } from "react";
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
} from "@mui/material";
import { Timeline, TimelineConnector, TimelineContent, TimelineDot, TimelineItem, TimelineOppositeContent, timelineOppositeContentClasses, TimelineSeparator } from '@mui/lab';
import defaultStyle from "utils/styles";
import { Clear } from "@mui/icons-material";
import { IApartmentItem, IAssignmentLog } from "types";
import { getAssigment } from 'services/api/apartment'
import dayjs from "dayjs";

interface IAssignmentHisDialog {
  data: IApartmentItem
  handleClose: () => void;
}
const AssignmentHisDialog = ({
  data,
  handleClose,
}: IAssignmentHisDialog) => {
  const dStyles = defaultStyle();

  const [items, setItems] = useState<IAssignmentLog[]>([])

  useEffect(() => {
    if (data && data.apartmentId) {
      getAssigment(data.apartmentId, (rp) => {
        const rs = rp.data;
        if (rs) {
          setItems(rs.data);
        }
      });
    }
  }, [data]);


  return (
    <React.Fragment>
      <Dialog
        sx={{
          "& .MuiPaper-root": {
            // width: "500px",
            minWidth: "400px",
            maxHeight: "550px",
            ...dStyles.dialogPaper,
          },
        }}
        // PaperComponent={PaperComponent}
        open={true}>
        <Box display={"flex"} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.12)' }}>
          <DialogTitle
            sx={dStyles.dialogTitleLabel}>
            Lịch sử chuyển giao
          </DialogTitle>
          <Clear sx={dStyles.dialogTitleButton} onClick={handleClose} />
        </Box>
        <DialogContent sx={{ p: 2 }}>
          <Box>
            <Typography sx={{ fontSize: '16px', fontWeight: 700, color: '#A31D1D' }}>{`Căn hộ: ${data.apartmentno} - ${data.owner} - ${data.telephone}`}</Typography>
          </Box>
          <Timeline
            sx={{
              [`& .${timelineOppositeContentClasses.root}`]: {
                flex: 1,
              },
            }}
          >
            {items && items.map(
              (item, idx) => (
                <TimelineItem key={idx}>
                  <TimelineOppositeContent color="hsl(0,0%,65%)">
                    {dayjs(item.date).format('DD-MM-YYYY')}
                  </TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineDot />
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent color="#A31D1D">{item.user?.name}</TimelineContent>
                </TimelineItem>
              )
            )}
          </Timeline>
        </DialogContent>
      </Dialog>

    </React.Fragment>
  );
};

export default memo(AssignmentHisDialog);
