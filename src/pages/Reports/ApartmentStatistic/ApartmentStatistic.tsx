import React, { memo } from "react";
import {
    Box,
    Container,
    Grid2,
    Paper,
    Typography,
} from "@mui/material";
import { TbarLocal } from "components";
import { IModeForm } from "types";

const ApartmentStatistic = () => {

    return (
        <Box width={1} height={1} sx={{ backgroundColor: 'rgb(238, 238, 238)' }}>
            <TbarLocal
                formMode={IModeForm.VIEW}
                title={"Thống kê chính chủ"}
                buttons={[]}
            />
            <Container>
                <Grid2 container>
                    <Grid2 size={6}>
                        <Box p={2}>
                            <Paper sx={{ px: 3, py: 2 }}>
                                <Box display={'flex'}>
                                    <Typography my={1} color='#A31D1D' variant="h6">{`Quận Tân Phú`}</Typography>

                                </Box>

                            </Paper>
                        </Box >
                    </Grid2>
                    <Grid2 size={6}>
                        <Box p={2}>
                            <Paper sx={{ px: 3, py: 2 }}>
                                <Box display={'flex'}>
                                    <Typography my={1} color='#A31D1D' variant="h6">{`Quận Bình Tân`}</Typography>
                                </Box>

                            </Paper>
                        </Box >
                    </Grid2>
                    <Grid2 size={6}>
                        <Box p={2}>
                            <Paper sx={{ px: 3, py: 2 }}>
                                <Box display={'flex'}>
                                    <Typography my={1} color='#A31D1D' variant="h6">{`Quận Tân Bình`}</Typography>
                                </Box>

                            </Paper>
                        </Box >
                    </Grid2>
                    <Grid2 size={6}>
                        <Box p={2}>
                            <Paper sx={{ px: 3, py: 2 }}>
                                <Box display={'flex'}>
                                    <Typography my={1} color='#A31D1D' variant="h6">{`Quận Gò Vấp`}</Typography>
                                </Box>

                            </Paper>
                        </Box >
                    </Grid2>
                    <Grid2 size={6}>
                        <Box p={2}>
                            <Paper sx={{ px: 3, py: 2 }}>
                                <Box display={'flex'}>
                                    <Typography my={1} color='#A31D1D' variant="h6">{`Quận 12`}</Typography>
                                </Box>

                            </Paper>
                        </Box >
                    </Grid2>
                    <Grid2 size={6}>
                        <Box p={2}>
                            <Paper sx={{ px: 3, py: 2 }}>
                                <Box display={'flex'}>
                                    <Typography my={1} color='#A31D1D' variant="h6">{`Quận 11`}</Typography>
                                </Box>

                            </Paper>
                        </Box >
                    </Grid2>
                    <Grid2 size={6}>
                        <Box p={2}>
                            <Paper sx={{ px: 3, py: 2 }}>
                                <Box display={'flex'}>
                                    <Typography my={1} color='#A31D1D' variant="h6">{`Quận 6`}</Typography>
                                </Box>

                            </Paper>
                        </Box >
                    </Grid2>
                </Grid2>
            </Container >
        </Box>

    );
}

export default memo(ApartmentStatistic);