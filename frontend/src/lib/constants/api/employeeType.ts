const BASE = '/emp-type'

export const EMP_TYPE_API = {
    LIST: BASE,
    CREATE: `${BASE}/create`,
    DELETE: (id: number) => `${BASE}/delete/${id}`,
    UPDATE: (id: number) => `${BASE}/update/${id}`,
}