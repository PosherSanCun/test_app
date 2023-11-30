// 返回输入参数
const cloudbase = require("@cloudbase/node-sdk");
const app = cloudbase.init({});
const db = app.database();

//查询数据库
queryDB = async ()=> {
    return await db.collection('player').doc('123455').get()
}

exports.main = async (event) => {
    app.logger().log(typeof event.body)
    return JSON.stringify(event.body)
}
// return JSON.stringify(event)
//解析传入的参数
// const {param1, param2} = event.queryStringParameters
// return {
//     statusCode: 200,
//     body: JSON.stringify({
//         param1,
//         param2
//     })
// }
// return await queryDB()
