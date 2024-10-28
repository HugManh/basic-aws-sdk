import awsConfig from './aws';

const NODE_ENV = process.env.NODE_ENV || 'development';
console.info('NODE_ENV =', NODE_ENV);
if (['localhost', 'development', 'production'].indexOf(NODE_ENV) < 0) throw new Error('NODE_ENV env invalid!');

const isProd = NODE_ENV === 'production'

const aws = awsConfig[NODE_ENV];

// function loadConfig() {
//     try {
//         // Tạo thư mục nếu chưa tồn tại
//         fs.mkdir(DIR_LIB_AWS, { recursive: true }, (err, result) => {
//             if (err)
//                 throw new Error(`Có lỗi khi tạo thư mục: ${err.message}`);
//             console.log('Thư mục đã tồn tại hoặc vừa được tạo thành công.', result);
//         });
//     } catch (err) {
//         throw new Error(`Có lỗi khi tạo thư mục: ${err.message}`);
//     }
// }

// loadConfig()

export {
    isProd,
    aws
}
