// 玩家存档查询
const cloudbase = require("@cloudbase/node-sdk");
const app = cloudbase.init({
  env:"test01-4g72ubhh097872ce",
});
const db = app.database();
const _ = db.command;
const $ = db.command.aggregate
const { neq,gte,lte,and} = db.command.aggregate

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
    const pageSize = obj.page.pageSize
    const pageNum = obj.page.pageNum-1
    const now = new Date().getTime()
    let match = {
        steamId:_.neq(obj.steamId),
        status:0
        // timestamp:_.lte(now-100000)
    }
    if(obj.match){
        if(obj.match.type!=null){
            match["type"] = obj.match.type
        }
        if(obj.match.level!=null){
            const level_arr = obj.match.level.split(",")
            const num_level = []
            level_arr.forEach(item=>{
                num_level.push(Number(item))
            })
            match["level"] = _.and(_.gte(num_level[0]), _.lte(num_level[1]))
        }
        if(obj.match.quality!=null){
            match["quality"] = obj.match.quality
        }
    }
    // return match
    const total = await db.collection("exchange").where(match).get()
    const res = await db.collection("exchange").aggregate().match(match).sort(obj.sort).skip(pageNum*pageSize).limit(pageSize).end()
    return {msg:"操作成功",code:200,total:total.data.length,data:res.data}
};