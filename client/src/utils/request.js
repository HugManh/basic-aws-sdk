import axios from 'axios';

let debug;
let baseURL = process.env.API_URL|| 'http://localhost:8333';

let headers = {
};
export default function (options) {
    if (debug) {
        options.params = options.params || {};
        options.params.debug = true;
    }
    return new Promise((resolve, reject) => {
        axios({
            baseURL,
            headers,
            ...options
        }).then(({ data }) => {
            if (!data.success) {
                reject({
                    code: data.code,
                    message: data.error.message
                });
                return;
            }

            let result = data.data;
            if (data.file) {
                // Do api upload file có trả thêm trường file ngoài trường data
                result.file = data.file;
            }

            resolve(result);
        }).catch((error) => {
            let { response } = error;

            if (response && response.data && response.data.error) {
                reject(response.data.error);
                return;
            }

            reject({
                code: 0,
                message: 'Có lỗi xảy ra, bạn vui lòng thử lại'
            });
        });
    });

}
