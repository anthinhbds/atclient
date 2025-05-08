import React, { memo, useMemo } from 'react';
import { SxProps, Typography as MuiTypography, TypographyProps, TypographyVariant } from '@mui/material';


interface ITitle {
    text: React.ReactNode;
    sx?: SxProps;
    variant?: TypographyVariant;
    handleClick?: () => void;
}

const Typography: React.FC<ITitle> = ({ text, sx, variant = 'body1', handleClick }) => {

    const props = useMemo(() => {
        const props: TypographyProps = {
        };
        return props;
    }, [variant]);

    return (
        <MuiTypography onClick={handleClick} variant={variant} {...props} sx={{
            color: 'hsl(0,0%,95%)',
            ...sx
        }}>
            {text}
        </MuiTypography>
    );



};

export default memo(Typography);