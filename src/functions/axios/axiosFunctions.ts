import { axiosRequest } from './axiosApis';
import { ENDPOINTS } from './endpoints';
import type { CreateClubRequest, CreateStaffRequest } from './requests';
import type { CreateClubResponse, CreateStaffResponse, GetMyClubsResponse } from './responses';

export const staffApi = {
    getList: (token: string) =>
        axiosRequest<CreateStaffResponse[]>(ENDPOINTS.STUFF.BASE, 'GET', token),

    getById: (userId: string, token: string) =>
        axiosRequest<CreateStaffResponse>(ENDPOINTS.STUFF.BY_ID(userId), 'GET', token),

    getMe: (token: string | null) =>
        axiosRequest<CreateStaffResponse>(ENDPOINTS.STUFF.ME, 'GET', token),

    create: (data: CreateStaffRequest, token: string) =>
        axiosRequest<CreateStaffResponse>(ENDPOINTS.STUFF.BASE, 'POST', token, data),

    update: (data: CreateStaffRequest, token: string) =>
        axiosRequest<CreateStaffResponse>(ENDPOINTS.STUFF.BASE, 'PUT', token, data),

    updatePrefs: (prefs: unknown, token: string) =>
        axiosRequest<unknown>(ENDPOINTS.STUFF.PREFERENCES, 'PUT', token, prefs),

    getPref: (tgId: string, key: string, token: string) =>
        axiosRequest<unknown>(ENDPOINTS.STUFF.PREFERENCE(tgId, key), 'GET', token),
};

export const clubsApi = {
    getList: (token: string) => axiosRequest(ENDPOINTS.CLUBS.BASE, 'GET', token),
    getMy: (token: string) => axiosRequest<GetMyClubsResponse>(ENDPOINTS.CLUBS.MY, 'GET', token),
    getById: (id: string, token: string) =>
        axiosRequest(ENDPOINTS.CLUBS.BY_ID(id), 'GET', token),
    create: (data: CreateClubRequest, token: string) =>
        axiosRequest<CreateClubResponse>(ENDPOINTS.CLUBS.BASE, 'POST', token, data),
    update: (id: string, data: unknown, token: string) =>
        axiosRequest(ENDPOINTS.CLUBS.UPDATE(id), 'PUT', token, data),
    delete: (id: string, token: string) =>
        axiosRequest<void>(ENDPOINTS.CLUBS.BY_ID(id), 'DELETE', token),
    checkPerm: (id: string, token: string) =>
        axiosRequest<boolean>(ENDPOINTS.CLUBS.CHECK_PERMISSION(id), 'GET', token),
};

export const sectionsApi = {
    getMy: (token: string) => axiosRequest(ENDPOINTS.SECTIONS.MY, 'GET', token),
};