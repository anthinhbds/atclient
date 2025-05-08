export interface IHistoryItem {
    logId?: string;
    actiondate?: string;
    actiontype?: string;
    formId?: string
    referenceId?: string
    contentlog?: string
    userId?: number;
}

// export const initHistoryRecord: IHistoryItem = {
//     projectId: "",
//     projectname: "",
//     status: "",
//     arearange: "",
//     owner: "",
//     streetId: -1,
//     wardId: -1,
//     districtId: -1,
//     archived: 0,
// };