import dayjs from "dayjs";

export enum ITransactionType {
    PMGB = 'PMGB',
    PMGT = 'PMGT',
    PGT = 'PGT',
    CTL = 'CTL',
    CTH = 'CTH',
    CTD = 'CTD',
    CK = 'CK',
}
export const SourceTransactionType: {
    id: ITransactionType,
    text: string,
    type: string
}[] = [
        { id: ITransactionType.PMGB, text: 'Thu phí MG bán căn hộ', type: 'T' },
        { id: ITransactionType.PMGT, text: 'Thu phí MG cho thuê căn hộ', type: 'T' },
        { id: ITransactionType.PGT, text: 'Thu phí làm giấy tờ', type: 'T' },
        { id: ITransactionType.CTL, text: 'Chi tiền lương', type: 'C' },
        { id: ITransactionType.CTH, text: 'Chi tiền hoa hồng', type: 'C' },
        { id: ITransactionType.CTD, text: 'Chi thưởng đạt doanh số', type: 'C' },
        { id: ITransactionType.CK, text: 'Chi khác', type: 'C' },
    ];

export enum ITransactionStatus {
    P = 'P',
    D = 'D',
    H = 'H',
}
export const SourceTransactionStatus: {
    id: ITransactionStatus,
    text: string
}[] = [
        { id: ITransactionStatus.P, text: 'Đang thanh toán' },
        { id: ITransactionStatus.D, text: 'Đã thanh toán' },
        { id: ITransactionStatus.H, text: 'Hủy' },
    ];

export interface ITransactionDetail {
    transId?: string;
    linenum?: number;
    date?: string;
    amount?: number;
    notes?: string;
    deleted?: boolean;
}
export interface ITransactionMember {
    transId?: string;
    linenum?: number;
    userId?: string;
    rate?: number;
    notes?: string;
    deleted?: boolean;
}

export interface ITransactionItem {
    transId?: string | null;
    transno?: string;
    transtype?: ITransactionType;
    transdate?: string
    status?: string;
    description?: string
    notes?: string
    objectId?: string;
    customerId?: string;
    totalamount?: number;
    details?: ITransactionDetail[];
    members?: ITransactionMember[];
}
export const initTransactionRecord: ITransactionItem = {
    transId: null,
    transno: "",
    transtype: undefined,
    transdate: dayjs().format("YYYY-MM-DD"),
    status: "P",
    description: "",
    notes: "",
    objectId: "",
    details: [{
        linenum: 1,
        date: dayjs().format("YYYY-MM-DD"),
        amount: 0,
        notes: "",
    }],
    members: []
};

