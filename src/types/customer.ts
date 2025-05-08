export enum ICustomerDemand {
    M = 'M',
    T = 'T',
    MT = 'MT',
    KN = 'KN',
}
export const SourceCustomerDemand: {
    id: ICustomerDemand,
    text: string
}[] = [
        { id: ICustomerDemand.M, text: 'Mua' },
        { id: ICustomerDemand.T, text: 'Thuê' },
        { id: ICustomerDemand.T, text: 'Mua và thuê' },
        { id: ICustomerDemand.KN, text: 'Không nhu cầu' },
    ];

export const SourceCustomerBedroom: {
    id: string,
    text: string
}[] = [
        { id: '1', text: '1' },
        { id: '2', text: '2' },
        { id: '3', text: '3' },
        { id: '4', text: '4' },
        { id: '5', text: '5' },
    ];

export const SourceCustomerLeadsource: {
    id: string,
    text: string
}[] = [
        { id: '01', text: 'Bất động sản.com.vn' },
        { id: '02', text: 'Nhà tốt' },
        { id: '03', text: 'Mua bán' },
        { id: '99', text: 'Khác' },
    ];

export enum ICustomerStatus {
    HD = 'HD',
    DM = 'DM',
}

export interface ICustomerNote {
    linenum?: number;
    customerId?: string;
    entrydate?: string;
    notes?: string;
    deleted?: boolean;
}

export interface ICustomerItem {
    customerId?: string;
    customername?: string;
    status?: ICustomerStatus;
    demand?: ICustomerDemand;
    telephone?: string;
    telephone2?: string;
    telephone3?: string;
    telephone4?: string;
    arearange?: string;
    pricerange?: string;
    arrayBedroom?: string[];
    bedroom?: string;
    priority?: 'Y' | 'N';
    userId?: string;
    previoususerId?: string;
    notes?: string;
    leadsource?: string;
    leadsourceother?: string;
    arrayProject?: string[];
    project?: string;
    projectother?: string;
    details?: ICustomerNote[];
    isExpired?: boolean;
    furniture?: string;
}

export const initCustomerRecord: ICustomerItem = {
    customerId: "",
    customername: "",
    demand: ICustomerDemand.M,
    status: ICustomerStatus.HD,
    telephone: "",
    telephone2: "",
    telephone3: "",
    telephone4: "",
    arearange: "",
    pricerange: "",
    bedroom: '',
    priority: 'N',
    userId: "",
    previoususerId: "",
    leadsource: "N",
    leadsourceother: "",
    project: "",
    projectother: "",
    notes: "",
    furniture: "",
    details: [],
};

export enum ICustomerQuality {
    H = '01',
    M = '02',
    L = '03',
}
export const SourceCustomerQuality: {
    id: ICustomerQuality,
    text: string
}[] = [
        { id: ICustomerQuality.H, text: 'Cao' },
        { id: ICustomerQuality.M, text: 'Trung bình' },
        { id: ICustomerQuality.L, text: 'Thấp' },
    ];

export enum ICustomerJourneyStatus {
    DHL = 'DHL',
    DDK = 'DDK',
    DL = 'DL',
    HL = 'HL',
    BL = 'BL',
    F = 'F',
}

export const SourceCustomerJourneyStatus: {
    id: ICustomerJourneyStatus,
    text: string
}[] = [
        { id: ICustomerJourneyStatus.DHL, text: 'Đã hẹn lịch' },
        { id: ICustomerJourneyStatus.DDK, text: 'Đã dẫn khách' },
        { id: ICustomerJourneyStatus.DL, text: 'Dời lịch' },
        { id: ICustomerJourneyStatus.HL, text: 'Hủy lịch' },
        { id: ICustomerJourneyStatus.BL, text: 'Bùng lịch' },
        { id: ICustomerJourneyStatus.F, text: 'Khách không mua nữa' },
    ];


export interface ICustomerJourneyDetItem {
    id?: any;
    customerId?: string;
    journeydate?: string;
    project?: string;
    arrayProject?: string[];
    projectname?: string;
    notes?: string;
    feedback?: string;
    problem?: string;
    nextstep?: string;
    isNew?: boolean;
    deleted?: boolean;
}
export interface ICustomerJourneyItem {
    customerId?: string;
    status?: ICustomerJourneyStatus;
    userId?: string;
    demand?: string;
    finance?: string;
    searching?: string;
    comments?: string;
    quality?: string;
    details?: ICustomerJourneyDetItem[];
    isNew?: boolean;
}
export const initCustomerJourneyRecord: ICustomerJourneyItem = {
    customerId: "",
    details: [],
    isNew: true
}