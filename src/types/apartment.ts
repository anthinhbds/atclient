import { IProjectItem } from "./project";

export const SourceBedroom: {
    id: number,
    text: string
}[] = [
        { id: 1, text: '1' },
        { id: 2, text: '2' },
        { id: 3, text: '3' },
        { id: 4, text: '4' },
        { id: 5, text: '5' },
    ];


export enum IApartmentDemand {
    B = 'B',
    T = 'T',
    BT = 'BT',
    KN = 'KN',
}
export const SourceApartmentDemand: {
    id: IApartmentDemand,
    text: string
}[] = [
        { id: IApartmentDemand.B, text: 'Bán' },
        { id: IApartmentDemand.T, text: 'Cho thuê' },
        { id: IApartmentDemand.BT, text: 'Bán và cho thuê' },
        { id: IApartmentDemand.KN, text: 'Không nhu cầu' },
    ];

export enum IApartmentStatus {
    HD = 'HD',
    CT = 'CT',
    CM = 'CM',
    DB = 'DB',
    CXN = 'CXN',
}
export const SourceApartmentStatus: {
    id: IApartmentStatus,
    text: string
    disabled?: boolean
}[] = [
        { id: IApartmentStatus.HD, text: 'Hoạt động' },
        { id: IApartmentStatus.CXN, text: 'Chờ xác nhận' },
        { id: IApartmentStatus.CT, text: 'Đã cho thuê' },
        { id: IApartmentStatus.DB, text: 'Đã bán' },
        { id: IApartmentStatus.CM, text: 'Chính chủ mới', disabled: true },
    ];

export enum IDirection {
    B = 'B',
    DB = 'DB',
    D = 'D',
    DN = 'DN',
    N = 'N',
    TN = 'TN',
    T = 'T',
    TB = 'TB',

}
export const SourceApartmentDirection: {
    id: IDirection,
    text: string
}[] = [
        { id: IDirection.B, text: 'Bắc' },
        { id: IDirection.DB, text: 'Đông Bắc' },
        { id: IDirection.D, text: 'Đông' },
        { id: IDirection.DN, text: 'Đông Nam' },
        { id: IDirection.N, text: 'Nam' },
        { id: IDirection.TN, text: 'Tây Nam' },
        { id: IDirection.T, text: 'Tây' },
        { id: IDirection.TB, text: 'Tây Bắc' },
    ];

export interface IApartmentNote {
    apartmentId?: string;
    linenum?: number;
    type?: 'E' | 'N'; //E: Expired, N: None
    entrydate?: string;
    notes?: string;
    deleted?: boolean;
}


export interface IApartmentItem {
    apartmentId?: string;
    demand?: IApartmentDemand;
    priority?: 'Y' | 'N';
    projectId?: string;
    address?: string;
    project?: IProjectItem;
    salesprice?: number
    rentprice?: number;
    salesfee?: number;
    rentfee?: number;
    area?: number;
    bedroom?: number;
    apartmentview?: IDirection | "";
    status?: IApartmentStatus;
    apartmentno?: string;
    owner?: string;
    telephone?: string;
    telephone2?: string;
    telephone3?: string;
    telephone4?: string;
    telephone5?: string;
    lookupcode?: string;
    furniture?: string;
    banconyview?: string;
    userId?: string;
    previoususerId?: string;
    ispartner?: 'Y' | 'N';
    partnername?: string;
    partnertelephone?: string;
    notes?: string;
    details?: IApartmentNote[];
    isExpired?: boolean;
}

export const initApartmentRecord: IApartmentItem = {
    apartmentId: "",
    demand: IApartmentDemand.B,
    priority: 'N',
    projectId: "",
    address: "",
    salesprice: 0,
    rentprice: 0,
    salesfee: 0,
    rentfee: 0,
    area: 0,
    bedroom: 0,
    apartmentview: "",
    status: IApartmentStatus.HD,
    apartmentno: "",
    owner: "",
    telephone: "",
    telephone2: "",
    telephone3: "",
    telephone4: "",
    telephone5: "",
    lookupcode: "",
    furniture: "",
    banconyview: "",
    userId: "",
    previoususerId: "",
    ispartner: "N",
    partnername: "",
    partnertelephone: "",
    notes: "",
    details: [],
};

