// 玩家存档查询
const cloudbase = require("@cloudbase/node-sdk");
const app = cloudbase.init({
  env:"test01-4g72ubhh097872ce",
});
const db = app.database();
const _ = db.command;
const { v4: uuidv4 } = require('uuid');
exports.main = async (event, context) => {
    const obj = JSON.parse(event.body)
    const data_key = await db.collection("auth").where({
      "uuid":"auth"
    }).get()
    const key  = data_key.data[0].auth_key
    if(obj.key!=key){
      return {msg:"非法操作！！",code:400,data:{}}
    }
    delete obj['key']
    const uuid = uuidv4()
    obj.status = 0
    obj.timestamp = new Date().getTime()
    obj.exchange_id = uuid
    await db.collection("exchange").add(obj)
    return {msg:"操作成功",code:200,data:obj}
};
