// 玩家存档初始化，当没有存档是初始化一个steamId存档，有存档时不做操作
const cloudbase = require("@cloudbase/node-sdk");
const app = cloudbase.init({
  env: "test01-4g72ubhh097872ce",
});
const db = app.database();
exports.main = async (event, context) => {
  const obj = JSON.parse(event.body)
  const result = await db.collection("auth").where({
    "uuid":"auth"
  }).get()
  const key  = result.data[0].auth_key
  if(obj.key!=key){
    return {msg:"非法操作！！",code:400,data:{}}
  }
  delete obj['key']
  if(obj.steamId==null){
  return {msg:"steamId不能为空",code:400}
  }
   const res = await db.collection("player").where({
    steamId:obj.steamId
   }).get().then(res=>{
      if(res.data.length==0){
        return new Promise((resolve)=>{
          db.collection("player").add({
            steamId:obj.steamId
          }).then(res=>{
            resolve({msg:"操作成功",code:200,data:{
                "msg": "初始化成功",
                "type": "1"
            }})
          })
        })
      }else{
        return {msg:"操作成功",code:200,data:{
            "msg": "无需初始化",
            "type": "0"
        }}
      }
   })
   return res
};
