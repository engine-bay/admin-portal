import { CreateParams, DeleteManyParams, DeleteParams, GetListParams, GetManyParams, GetManyReferenceParams, GetOneParams, UpdateManyParams, UpdateParams, fetchUtils } from 'react-admin';
import { stringify } from 'query-string';

const apiUrl = 'http://localhost:5050';
const httpClient = fetchUtils.fetchJson;

export const dataProvider = {
    getList: async (resource: string, params: GetListParams) => {
        const { page, perPage } = params.pagination;
        // const { field, order } = params.sort;

        const skip = (page - 1) * perPage;
        const limit = perPage;
        // const sortBy = "";
        // const sortOrder = 0;
        const query = {
            skip,
            limit,
            // sortBy,
            // sortOrder
        };
        console.log("params.filter: ", params.filter)
        // const query = {
        //     sort: JSON.stringify([field, order]),
        //     range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
        //     filter: JSON.stringify(params.filter),
        // };
        const url = `${apiUrl}/${resource}?${stringify(query)}`;
        const { json } = await httpClient(url, {
            user: {
                authenticated: localStorage.getItem("isAuthenticated") === "true",
                token: localStorage.getItem("token") || ""
            }
        });
        return json;
    },

    getOne: async (resource: string, params: GetOneParams) => {
        const url = `${apiUrl}/${resource}/${params.id}`
        const { json } = await httpClient(url, {
            user: {
                authenticated: localStorage.getItem("isAuthenticated") === "true",
                token: localStorage.getItem("token") || ""
            }
        });
        return { data: json };
    },

    getMany: async (resource: string, params: GetManyParams) => {
        const query = {
            filter: JSON.stringify({ ids: params.ids }),
        };
        const url = `${apiUrl}/${resource}?${stringify(query)}`;
        const { json } = await httpClient(url, {
            user: {
                authenticated: localStorage.getItem("isAuthenticated") === "true",
                token: localStorage.getItem("token") || ""
            }
        });
        return { data: json };
    },

    getManyReference: async (resource: string, params: GetManyReferenceParams) => {
        const { page, perPage } = params.pagination;
        const { field, order } = params.sort;
        const query = {
            sort: JSON.stringify([field, order]),
            range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
            filter: JSON.stringify({
                ...params.filter,
                [params.target]: params.id,
            }),
        };
        const url = `${apiUrl}/${resource}?${stringify(query)}`;
        const { json } = await httpClient(url, {
            user: {
                authenticated: localStorage.getItem("isAuthenticated") === "true",
                token: localStorage.getItem("token") || ""
            }
        });
        return json;
    },

    create: async (resource: string, params: CreateParams) => {
        const { json } = await httpClient(`${apiUrl}/${resource}`, {
            method: 'POST',
            body: JSON.stringify(params.data),
            user: {
                authenticated: localStorage.getItem("isAuthenticated") === "true",
                token: localStorage.getItem("token") || ""
            }
        })
        return { data: json };
    },

    update: async (resource: string, params: UpdateParams) => {
        const url = `${apiUrl}/${resource}/${params.id}`;
        const { json } = await httpClient(url, {
            method: 'PUT',
            body: JSON.stringify(params.data),
            user: {
                authenticated: localStorage.getItem("isAuthenticated") === "true",
                token: localStorage.getItem("token") || ""
            }
        })
        return { data: json };
    },

    updateMany: async (resource: string, params: UpdateManyParams) => {
        const query = {
            filter: JSON.stringify({ id: params.ids }),
        };
        const url = `${apiUrl}/${resource}?${stringify(query)}`;
        const { json } = await httpClient(url, {
            method: 'PUT',
            body: JSON.stringify(params.data),
            user: {
                authenticated: localStorage.getItem("isAuthenticated") === "true",
                token: localStorage.getItem("token") || ""
            }
        })
        return { data: json };
    },

    delete: async (resource: string, params: DeleteParams) => {
        const url = `${apiUrl}/${resource}/${params.id}`;
        const { json } = await httpClient(url, {
            method: 'DELETE',
            user: {
                authenticated: localStorage.getItem("isAuthenticated") === "true",
                token: localStorage.getItem("token") || ""
            }
        });
        return { data: json };
    },

    deleteMany: async (resource: string, params: DeleteManyParams) => {
        const query = {
            filter: JSON.stringify({ id: params.ids }),
        };
        const url = `${apiUrl}/${resource}?${stringify(query)}`;
        const { json } = await httpClient(url, {
            method: 'DELETE',
            user: {
                authenticated: localStorage.getItem("isAuthenticated") === "true",
                token: localStorage.getItem("token") || ""
            }
        });
        return { data: json };
    },
};