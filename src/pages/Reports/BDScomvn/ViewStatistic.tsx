import React, { memo, useMemo, useEffect, useCallback } from "react";
import {
    Box,
    Container,
    Divider,
    Grid2,
    Paper,
    Typography,
} from "@mui/material";
import { TbarLocal } from "components";
import { IModeForm } from "types";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";
import { Line } from 'react-chartjs-2';
import { useReport } from 'hooks';
// import dayjs from "dayjs";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);
const ViewStatisticPage = () => {

    const { getTotalView, viewStatisticData } = useReport();

    useEffect(() => {
        getTotalView();
    }, []);

    const optionDistricts = useMemo(() => {
        const max = viewStatisticData.length > 0 ? viewStatisticData.reduce((acc, item) => item.totalview > acc.totalview ? item : acc, viewStatisticData[0]).totalview : 0;
        return {
            responsive: true,
            plugins: {
                legend: {
                    display: false,
                }
            },
            y: {
                min: 0,
                max: Math.ceil(max / 1000) * 1000,
                ticks: {
                    stepSize: 1000,
                },

            }
        };
    }, [viewStatisticData]);

    const dataDistrict = useMemo(() => ({
        labels: viewStatisticData ? viewStatisticData.filter(f => f.type === 'D').map((item) => item.objectId) : [],
        datasets: [
            {
                label: 'Lượt xem',
                data: viewStatisticData.filter(f => f.type === 'D').map(item => item.totalview),
                borderColor: 'gray',
                backgroundColor: 'gray',
            },

        ],
    }), [viewStatisticData]);

    const projectGroupLabel = useMemo(() => {
        const groups: string[] = []
        viewStatisticData.forEach((i) => {
            if (i.type === 'P' && groups.indexOf(i.parentId) === -1) {
                groups.push(i.parentId)
            }
        });
        return groups;
    }, [viewStatisticData]);

    const optionProjects = useCallback((parentId: string) => {
        const max = viewStatisticData.length > 0 ? viewStatisticData.filter(f => f.parentId === parentId).reduce((acc, item) => item.totalview > acc.totalview ? item : acc, viewStatisticData[0]).totalview : 0;
        return {
            responsive: true,
            plugins: {
                legend: {
                    display: false,
                }
            },
            y: {
                min: 0,
                max: Math.ceil(max / 500) * 500,
                ticks: {
                    stepSize: 500,
                },

            }
        };
    }, [viewStatisticData]);

    const dataProject = useCallback((parentId: string) => ({
        labels: viewStatisticData ? viewStatisticData.filter(f => f.parentId === parentId).map((item) => item.objectId) : [],
        datasets: [
            {
                label: 'Lượt xem',
                data: viewStatisticData.filter(f => f.parentId === parentId).map(item => item.totalview),
                borderColor: 'gray',
                backgroundColor: 'gray',
            },

        ],
    }), [viewStatisticData]);

    return (
        <Box width={1} height={1} sx={{ backgroundColor: 'rgb(238, 238, 238)' }}>
            <TbarLocal
                formMode={IModeForm.VIEW}
                title={"Thống kê lượt xem 7 ngày qua"}
                buttons={[]}
            />
            <Container maxWidth='xl' sx={{ overflowY: 'auto', height: `${window.innerHeight - 87}px` }}>
                <Grid2 container spacing={3} p={3}>
                    <Grid2 size={6}>
                        <Paper sx={{ px: 3, py: 2 }}>
                            <Box display={'flex'}>
                                <Typography my={1} color='#A31D1D' variant="h6">
                                    Lượt xem theo Quận
                                </Typography>
                            </Box>
                            <Divider sx={{ my: 1 }} />
                            <Line options={{ ...optionDistricts, }} data={dataDistrict} />
                        </Paper>
                    </Grid2>
                    {projectGroupLabel && projectGroupLabel.map((item, idx) => (
                        <Grid2 size={6} key={idx}>
                            <Paper sx={{ px: 3, py: 2 }}>
                                <Box display={'flex'}>
                                    <Typography my={1} color='#A31D1D' variant="h6">
                                        {`Lượt xem dự án Quận ${item}`}
                                    </Typography>
                                </Box>
                                <Divider sx={{ my: 1 }} />
                                <Line options={{ ...optionProjects(item), }} data={dataProject(item)} />
                            </Paper>
                        </Grid2>
                    ))}
                </Grid2>
            </Container >
        </Box>

    );
}

export default memo(ViewStatisticPage);