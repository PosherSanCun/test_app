// 玩家存档查询
const cloudbase = require("@cloudbase/node-sdk");
const app = cloudbase.init({
  env:"test01-4g72ubhh097872ce",
});
const db = app.database();
const _ = db.command;
const sale_task = []
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
    if(obj.exchangeId==null){
      return {msg:"exchangeId不能为空",code:400}
    }
    const result = await db.collection("exchange").where({
        exchange_id:obj.exchangeId
    }).get()
    const exchange = result.data[0]
     if(exchange.status!=2){
            return {msg:"领取的物品必须是已经卖出的物品",code:400,data:exchange}
     }else if(exchange.status==2){
            await db.collection("exchange").where({
                "exchange_id":obj.exchangeId
            }).update({
                status:_.set(4)
            })
            const count = await db.collection("exchange").where({steamId:obj.steamId,status:4}).count()
                if(count.total>10){
                    const playerExchange = await db.collection("exchange")
                                    .aggregate()
                                    .match({steamId:obj.steamId,status:4})
                                    .sort({timestamp:1})
                                    .limit(count.total-10).end()
                    playerExchange.data.forEach(item=>{
                        sale_task.push(excuteSale(item.exchange_id))
                    })
                await Promise.all(sale_task)
            }
            return {msg:"操作成功",code:200,data:{exchangeId:obj.exchangeId,status:4}}
    }
};

function excuteSale(exchangeId){
    return db.collection("exchange").where({
       "exchange_id":exchangeId
   }).remove()
}