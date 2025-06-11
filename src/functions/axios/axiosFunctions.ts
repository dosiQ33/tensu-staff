import { axiosRequest } from './axiosApis';
import { ENDPOINTS } from './endpoints';
import type { CreateStuffRequest } from './requests';
import type { CreateStuffResponse } from './responses';

export const stuffApi = {
    getList: (token: string) =>
        axiosRequest<CreateStuffResponse[]>(ENDPOINTS.STUFF.BASE, 'GET', token),

    getById: (userId: string, token: string) =>
        axiosRequest<CreateStuffResponse>(ENDPOINTS.STUFF.BY_ID(userId), 'GET', token),

    getByTelegram: (tgId: string | null, token: string | null) =>
        axiosRequest<CreateStuffResponse>(ENDPOINTS.STUFF.BY_TELEGRAM(tgId), 'GET', token),

    create: (data: CreateStuffRequest, token: string) =>
        axiosRequest<CreateStuffResponse>(ENDPOINTS.STUFF.BASE, 'POST', token, data),

    update: (data: CreateStuffRequest, token: string) =>
        axiosRequest<CreateStuffResponse>(ENDPOINTS.STUFF.BASE, 'PUT', token, data),

    updatePrefs: (prefs: unknown, token: string) =>
        axiosRequest<unknown>(ENDPOINTS.STUFF.PREFERENCES, 'PUT', token, prefs),

    getPref: (tgId: string, key: string, token: string) =>
        axiosRequest<unknown>(ENDPOINTS.STUFF.PREFERENCE(tgId, key), 'GET', token),
};

export const clubsApi = {
    getList: (token: string) => axiosRequest(ENDPOINTS.CLUBS.BASE, 'GET', token),
    getMy: (token: string) => axiosRequest(ENDPOINTS.CLUBS.MY, 'GET', token),
    getById: (id: string, token: string) =>
        axiosRequest(ENDPOINTS.CLUBS.BY_ID(id), 'GET', token),
    create: (data: unknown, token: string) =>
        axiosRequest(ENDPOINTS.CLUBS.BASE, 'POST', token, data),
    update: (id: string, data: unknown, token: string) =>
        axiosRequest(ENDPOINTS.CLUBS.UPDATE(id), 'PUT', token, data),
    delete: (id: string, token: string) =>
        axiosRequest<void>(ENDPOINTS.CLUBS.BY_ID(id), 'DELETE', token),
    checkPerm: (id: string, token: string) =>
        axiosRequest<boolean>(ENDPOINTS.CLUBS.CHECK_PERMISSION(id), 'GET', token),
};