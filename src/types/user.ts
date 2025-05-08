export enum EClaimType {
    ADMIN = 'ADMIN',
    EMPLOYEE = 'EMPLOYEE'
}

export enum EClaimValue {
    STANDARD = 'STANDARD',
    MANAGER_USER = 'MANAGER_USER',
    LEADER = 'LEADER'
}

export interface IUserClaimItem {
    userId?: string;
    claimId?: EClaimType;
    claimvalue?: EClaimValue;
}
export interface IUserSearchProfileItem {
    id?: string;
    userId?: string;
    formId?: string;
    profileName?: string
    searchingContent?: string;
}
export interface IUserItem {
    userId?: string;
    name?: string;
    telephone?: string;
    email?: string
    archived?: number;
    claims?: IUserClaimItem[]
}

export interface IUser {
    userId?: string;
    name?: string;
    claimType?: EClaimType[];
    claimValue?: EClaimValue[];
}

export const initUserRecord: IUserItem = {
    userId: '',
    name: "",
    telephone: "",
    email: "",
    archived: 0,
    claims: [],
};

export interface IChangePwd {
    userId: string;
    oldpassword: string;
    newpassword: string;
    confirmpasssword: string;
}