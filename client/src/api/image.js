import { request } from "../utils";

export function uploadImage(bucketname, data) {
    return request({
        method: 'POST',
        url: `/api/${bucketname}/image/upload`,
        data,
    });
};

export function getListImage(bucketname) {
    return request({
        method: 'GET',
        url: `/api/${bucketname}/image/list`,
    });
};

export function getImage(bucketname, objectkey) {
    return request({
        method: 'GET',
        url: `/${bucketname}/${objectkey}`,
    });
};

