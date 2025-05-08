export interface IProjectItem {
    projectId?: string;
    projectname?: string;
    status?: string;
    arearange?: string
    owner?: string
    streetId?: number;
    wardId?: number;
    districtId?: number;
    archived?: number;
}

export const initProjectRecord: IProjectItem = {
    projectId: "",
    projectname: "",
    status: "",
    arearange: "",
    owner: "",
    streetId: -1,
    wardId: -1,
    districtId: -1,
    archived: 0,
};