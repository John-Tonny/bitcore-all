var MongoClient = require('mongodb').MongoClient;
// var url = "mongodb://52.82.25.32:27017/";
var url = "mongodb://localhost:27017/";
 

var chain = 'ETH';
var network = 'testnet';
// var addressBatch = '0xadB5f999192c37F55b7BDCf3f2C90581e2965b6f';
var addressBatch = ['0x58763F1764358560e8F5dF35F0d1b36A29D9ffA0'];
var walletId = '5f8116a028f5a26d3fdf43f1-t6';

MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    var t1 = new Date().getTime();
    var dbo = db.db("bitcore");
    dbo.collection("transactions").find({chain: "VCL", network: "testnet", from: "0x58763F1764358560e8F5dF35F0d1b36A29D9ffA0"}).toArray(function(err, result) { 
        if (err) throw err;
        var t2 = new Date().getTime() - t1;
        console.log(result);
	console.log("############time:", t2); 
        db.close();
    });
   
    // var query = {$or: [{"chain": chain, "network": network, "from": addressBatch},{"chain": chain, "network": network, "to": addressBatch}]};

    var query = {
      $or: [
        { "chain":chain, "network":network, "from": { $in: addressBatch } },
        { "chain":chain, "network":network, "to": { $in: addressBatch }  },
        { "chain":chain, "network":network, 'internal.action.to': { $in: addressBatch.map(address => address.toLowerCase()) }  }
      ]
    };
   
    console.log("address:", addressBatch);
    console.log("query:", query);

    dbo.collection("transactions")
	.find(query)
        // .toArray(function(err, result) {
        .count(function(err, result) {
        if (err) throw err;
        var t2 = new Date().getTime() - t1;
        console.log(result);
	console.log("############time:", t2); 
        db.close();
    });
    
    var b1 = new Date().getTime();
    console.log("start query" );
    
    dbo.collection("transactions")
    .updateMany(query,
      { $addToSet: { wallets: walletId } }
      // { $set: { wallets: [] } }
    );
    

    var b2 = new Date().getTime() - b1;
    console.log("stop query:", b2);
});
