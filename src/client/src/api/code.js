import { request } from "../utils";

export function getCode(language, filename) {
    return request({
        method: 'GET',
        url: `/code/${language}/show?filename=${filename}`,
    });
};

