// 玩家存档查询
const cloudbase = require("@cloudbase/node-sdk");
const app = cloudbase.init({
  env:"test01-4g72ubhh097872ce",
});
const db = app.database();
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
    if(obj.steamId==null){
    return {msg:"steamId不能为空",code:400}
    }
    const res = await db.collection("player").where({
      "steamId":obj.steamId
    }).get()
    return {
      msg:"操作成功",
      code:200,
      data:res.data[0]
    }
};