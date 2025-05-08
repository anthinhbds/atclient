import React, { memo } from "react";
import {
    Box,
    Container,
} from "@mui/material";
import UserHome from './pages/User'
import { TbarLocal } from "components";
import { IModeForm } from "types";

const HomePage = () => {
    return (
        <Box width={1} height={1} sx={{ backgroundColor: 'rgb(238, 238, 238)' }}>
            <TbarLocal
                formMode={IModeForm.VIEW}
                title={"Trang chủ"}
                buttons={[]}
            />
            <Container>
                <UserHome />
            </Container >
        </Box>

    );
}

export default memo(HomePage);