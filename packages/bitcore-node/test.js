const TronWeb = require('tronweb');

var Web3 = require("web3");
web3 = new Web3(new Web3.providers.WebsocketProvider("wss://rinkeby.infura.io/ws/v3/4889fed1249f42d1bb6b66c7be01f71b"));


// let fullNode = '52.82.14.63:8090';
// let solidityNode = '52.82.14.63:8090';
// let eventServer = '52.82.14.63:8090';

var test = false;
var fullNode = 'https://api.trongrid.io';
var solidityNode = 'https://api.trongrid.io';
var eventServer = 'https://api.trongrid.io';
if (test){
  fullNode = 'https://api.shasta.trongrid.io';
  solidityNode = 'https://api.shasta.trongrid.io';
  eventServer = 'https://api.shasta.trongrid.io';
}
let sideOptions = {
  fullNode: '',
  solidityNode: '',
  eventServer: '',
  mainGatewayAddress: '',
  sideGatewayAddress: '',
  sideChainId: ''
}
const privateKey = '219b8142c94887ed1233cbbb0f6e532ee71fefb54983b65734047bc1eb388615';

// const tronWeb = new TronWeb(fullNode,solidityNode,eventServer,sideOptions,privateKey);
const tronWeb = new TronWeb(fullNode,solidityNode,eventServer,privateKey);


/*
const fullNode = 'https://testhttpapi.tronex.io';
const solidityNode = 'https://testhttpapi.tronex.io';
const eventServer = 'https://testhttpapi.tronex.io';
const sideOptions = {
  fullNode: 'https://testhttpapi.tronex.io',
  solidityNode: 'https://testhttpapi.tronex.io',
  eventServer: 'https://testhttpapi.tronex.io',
  // fullNode: 'https://suntest.tronex.io',
  // solidityNode: 'https://suntest.tronex.io',
  // eventServer: 'https://suntest.tronex.io',
  mainGatewayAddress: 'TFLtPoEtVJBMcj6kZPrQrwEdM3W3shxsBU',
  sideGatewayAddress: 'TRDepx5KoQ8oNbFVZ5sogwUxtdYmATDRgX',
  sideChainId: '413AF23F37DA0D48234FDD43D89931E98E1144481B'
}

const tronWeb = new TronWeb(
  fullNode,
  solidityNode,
  eventServer,
  {
    fullNode: sideOptions.fullNode,
    solidityNode: sideOptions.solidityNode,
    eventServer: sideOptions.eventServer,
    mainGatewayAddress: sideOptions.mainGatewayAddress,
    sideGatewayAddress: sideOptions.sideGatewayAddress,
    sideChainId: sideOptions.sideChainId
  }
);
*/

// console.log(tronWeb.trx);

console.log("#####bbbb:", tronWeb.address.fromPrivateKey('53419dd04cbad62e70aaf289b840bab2e1cf9ed68528ffb8818c39b0af3b2350'));
console.log("#####bbbb1:", tronWeb.address.fromPrivateKey('44962c143ab94f49c53f49fa0813f132afda4c10117f819d302e20e94c44790e'));


console.log("address**1:", tronWeb.address.fromHex("411a2c3f28857695f81bd4eb2ccf90b7154cb84eca"));
console.log("address**2:", tronWeb.address.fromHex("41d6a6a24abb6aa5d954b0d60b26598f987927d8df"));
console.log("address**3:", tronWeb.address.fromHex("410e6734fa49fa5cada81bd0f03a2d69013df32fe9"));
console.log("address**4:", tronWeb.address.fromHex("41734c2f23ab41c52308d1206c4eb5fe8e124e6898"));
console.log("address**5:", tronWeb.address.fromHex("41658c747a8953dbab4d57d68d341a88fe2d39e7e2"));
console.log("address**6:", tronWeb.address.fromHex("41a77312ec18d4e7d3b0ab93bb13e95825aed73e35"));
console.log("address**7:", tronWeb.address.fromHex("41e5ee8a57a4288d99a396658e3e6b5e4730a8ca61"));
console.log("address**8:", tronWeb.address.fromHex("41b869c00ebc3f2cf4996ca0fac9b3bcbfcc2159c7"));
console.log("address**9:", tronWeb.address.fromHex("4169164ae828f0bbea47c3f8bba9efc1b9dd200d7b"));

console.log("address##1:", tronWeb.address.toHex("TCMbaMxA5gYSxmABJjwt4cAHELRYDZrVA1"));
console.log("address##2:", tronWeb.address.toHex("TXdL7ahFgj2vWL53vugfxNp7b8yX1Pgpjt"));
console.log("address##3:", tronWeb.address.toHex("TLUqyV9rGYXZ2E8kXe6J3P1rvYV1Au1Goe"));
console.log("address##4:", tronWeb.address.toHex("THnSDgi6Do7Kvqhys7PndZvPVGzGRN4Y7c"));
console.log("address##5:", tronWeb.address.toHex("TS9xcBsRBtzWDb8XiUBZPiNcQy3uYXH3CZ"));
console.log("address##6:", tronWeb.address.toHex("TNjt5fShPVJ4YpsLuU4THuBbg58g2bZoLk"));
console.log("address##7:", tronWeb.address.toHex("THnSDgi6Do7Kvqhys7PndZvPVGzGRN4Y7c"));
// tronWeb.trx.getAccount('TCMbaMxA5gYSxmABJjwt4cAHELRYDZrVA1').then(result => console.log("get account TCMbaMxA5gYSxmABJjwt4cAHELRYDZrVA1:", result));
// tronWeb.trx.getAccount('TXdL7ahFgj2vWL53vugfxNp7b8yX1Pgpjt')
//  .then(result => console.log("get account from TXdL7ahFgj2vWL53vugfxNp7b8yX1Pgpjt:", result));

// tronWeb.trx.getBlock(12345).then(result => {console.log(result)});
// tronWeb.trx.getCurrentBlock().then(result=>console.log(result));
// tronWeb.trx.listProposals().then(result => {console.log(result)});
// tronWeb.trx.listTokens(2,0).then(result => {console.log(result)});

/*
tronWeb.transactionBuilder.freezeBalance(tronWeb.toSun(100), 3, "ENERGY", "TXdL7ahFgj2vWL53vugfxNp7b8yX1Pgpjt", "TXdL7ahFgj2vWL53vugfxNp7b8yX1Pgpjt", 1, function(err,result){
    console.log("freezeBalance:", result);
    tronWeb.trx.sign(result.raw_data_hex, '8404381e8c513c1d83d73bb90f48ce69a241b2947e8de136c3ede9af35444309', function(err, result){
      console.log("sign:", result);
    });
});
*/

var hash = tronWeb.sha3("some string to be hashed");
console.log("hash:", hash);
var hashOfHash = tronWeb.sha3(hash,{encoding:'hex'});
console.log("hashOfHash:", hashOfHash);
tronWeb.setAddress('TCMbaMxA5gYSxmABJjwt4cAHELRYDZrVA1');

console.log("is address:", tronWeb.isAddress('TNQx24b7xgJjV9MhxsRteiFYczpgeJuC5Y'));

if(false){
  tronWeb.trx.getTransaction('719089a0d0b728e136cb951a0bbe831f5445199ef10cb2ac4fffed178af3111a',function(error, result){
    if (error) {
      console.log("get transaction err:", error);
    } else {
      console.log("get transaction:", result);
      console.log("transaction1:", result.raw_data.contract);
      console.log("transaction2:", result.raw_data.contract[0].parameter.value);
    }
  });
}


// tronWeb.trx.getCurrentBlock().then(result=>console.log(result))

if(false){
tronWeb.transactionBuilder.sendTrx("TXdL7ahFgj2vWL53vugfxNp7b8yX1Pgpjt", 11000, "TCMbaMxA5gYSxmABJjwt4cAHELRYDZrVA1", 1, function(err,result){
  if ( err) {
    console.log("build:", err);
  } else {
    tronWeb.trx.sign(result, '53419dd04cbad62e70aaf289b840bab2e1cf9ed68528ffb8818c39b0af3b2350', function(err, result){
      if ( err) {
        console.log("sign:", err);
      } else {
        // console.log("rawTx:", result); 
        tronWeb.trx.sendRawTransaction(result, function(err, result){
          if ( err) {
    	    console.log("send:", err);
  	  } else {
	    console.log("contract:", result.transaction.raw_data.contract);
	    console.log("contract:", result.transaction.raw_data.contract[0].parameter.value);
            console.log("send:", result);
          }
        });
      }
    })
  }
});
}

if(false){
  const trc_options = {
             name : "jlwcoin",//token名称,string格式
             abbreviation : "jlw",//token简称,  string格式
             description : "jlwcoin token",//Token 说明,  string格式
             url : "www.jlwcoin.com",//Token 发行方的官网，string格式
             totalSupply : 100000,//Token发行总量
             trxRatio : 1, // 定义token和trx的最小单位兑换比
             tokenRatio : 1, // 定义token和trx的最小单位兑换比
             saleStart : 1606551000000,//开启时间
             saleEnd : 1764313572000,//结束时间
             freeBandwidth : 10000, // 是Token的总的免费带宽 
             freeBandwidthLimit : 100, // 是每个token拥护者能使用本token的免费带宽 
             frozenAmount : 0, //是token发行者可以在发行的时候指定冻结的token的数量
             frozenDuration : 0,
             // 是token发行者可以在发行的时候指定冻结的token的时间
             precision : 6,//发行token的精度
             permission_id : 1//可选用于多重签名
         }
  var issuerAddress = '41ed90629bdf5499f6b0936e0952519332e73be2cb';
  tronWeb.transactionBuilder.createAsset(trc_options, issuerAddress, function(error, result){
    if (error) {
      console.log("send err:", error);
    } else {
      console.log("send:", result);
      console.log("contract1:", result.raw_data.contract);
      console.log("contract2:", result.raw_data.contract[0].parameter.value);
      tronWeb.trx.sign(result, '8404381e8c513c1d83d73bb90f48ce69a241b2947e8de136c3ede9af35444309', function(err, result){
        if ( err) {
          console.log("sign:", err);
        } else {
          // console.log("rawTx:", result);
          tronWeb.trx.sendRawTransaction(result, function(err, result){
            if ( err) {
              console.log("send:", err);
            } else {
              console.log("contract3:", result.transaction.raw_data.contract);
              console.log("contract4:", result.transaction.raw_data.contract[0].parameter.value);
              console.log("send5:", result);
            }
          });
        }
      })
    }
  });
}

async function getTransactionInfo(txid){
  var aaa =  await tronWeb.trx.getTransactionInfo(txid);
  console.log("txInfo:", aaa);
  return aaa;
}

async function getBlocks(num){
  var result = await tronWeb.trx.getBlockByNumber(0);
  for(const tx of result.transactions) {
    console.log("tx:", tx);
    await getTransactionInfo(tx.txID);
    console.log("end");
  }
}

//getBlocks(0);
console.log("sssssssssssssssssssssssssss");

// tronWeb.trx.getBalance('41ed90629bdf5499f6b0936e0952519332e73be2cb').then(result=>console.log("balance:", result));

function requireUncached(module) {
  delete require.cache[require.resolve(module)];
  return require(module);
}

const Erc20Decoder = requireUncached('abi-decoder');
const ERC20Abi = [
/*  {
    constant: false,
    inputs: [
      {
        name: '_to',
        type: 'address'
      },
      {
        name: '_value',
        type: 'uint256'
      }
    ],
    name: 'transfer',
    outputs: [
      {
        name: 'success',
        type: 'bool'
      }
    ],
    payable: false,
    type: 'function'
  },	
  {
	outputs: [
	  {
	     type: 'uint256'
	  }
	],
	constant: true,
	inputs: [
	  {
	    type:'uint256'
	  }
	],
	name: 'winBonusArray',
	stateMutability: 'View',
	type: 'Function'
  },
  {
	outputs: [
	  {
	    type: 'address'
	  }
	],
        inputs: [],
	constant: true,
	name: 'getOraclizeAddr',
	stateMutability: 'View',
	type: 'Function'
  },
  {
        // constant: true,
	inputs: [
	  {
	    name: '_amount',
	    type: 'uint256'
	  }
	],
        outputs: [],
	name: 'withdrawTrx',
	stateMutability: 'Nonpayable',
	type: 'Function'
  }*/

{"outputs":[{"type":"uint256"}],"constant":true,"inputs":[{"type":"uint256"}],"name":"winBonusArray","stateMutability":"View","type":"Function"},{"outputs":[{"type":"address"}],"inputs":[],"constant":true,"name":"getOraclizeAddr","stateMutability":"View","type":"Function"},{"inputs":[{"name":"_amount","type":"uint256"}],"outputs":[],"name":"withdrawTrx","stateMutability":"Nonpayable","type":"Function"},{"inputs":[{"name":"_index","type":"uint256"},{"name":"_rate","type":"uint256"}],"outputs":[],"name":"setMaxWinRate","stateMutability":"Nonpayable","type":"Function"},{"outputs":[{"type":"uint64"}],"outputs":[],"constant":true,"name":"promotionRate","stateMutability":"View","type":"Function"},{"inputs":[{"name":"_addr","type":"address"}],"outputs":[],"name":"setOraclizeAddr","stateMutability":"Nonpayable","type":"Function"},{"name":"doUnpause","stateMutability":"Nonpayable","type":"Function","outputs":[],"inputs":[]},{"inputs":[{"name":"_addr","type":"address"}],"outputs":[],"name":"setReferralshipAddr","stateMutability":"Nonpayable","type":"Function"},{"outputs":[{"type":"bool"}],"constant":true,"inputs":[{"type":"address"}],"name":"bettorMap","stateMutability":"View","type":"Function"},{"inputs":[{"name":"_start","type":"uint64"},{"name":"_end","type":"uint64"},{"name":"_rate","type":"uint64"}],"outputs":[],"name":"setMiningPromotion","stateMutability":"Nonpayable","type":"Function"},{"inputs":[{"name":"_addr","type":"address"},{"name":"_useful","type":"bool"}],"outputs":[],"name":"setOperator","stateMutability":"Nonpayable","type":"Function"},
/*{"inputs":[{"name":"_bettor","type":"address"},{"name":"_result","type":"uint256"}],"name":"__callback","stateMutability":"Nonpayable","type":"Function"},{"name":"doPause","stateMutability":"Nonpayable","type":"Function"},{"inputs":[{"name":"_trxCount","type":"uint256"}],"name":"setMinBetAmount","stateMutability":"Nonpayable","type":"Function"},{"outputs":[{"name":"bettor","type":"address"},{"name":"trxAmount","type":"uint64"},{"name":"orderId","type":"uint64"},{"name":"direction","type":"uint64"},{"name":"number","type":"uint64"},{"name":"roll","type":"uint64"}],"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"getOrder","stateMutability":"View","type":"Function"},{"inputs":[{"name":"_newAdmin","type":"address"}],"name":"setAdmin","stateMutability":"Nonpayable","type":"Function"},{"outputs":[{"type":"uint256"}],"constant":true,"inputs":[{"type":"uint256"}],"name":"maxWinRateArray","stateMutability":"View","type":"Function"},{"inputs":[{"name":"_rateArray","type":"uint256[100]"}],"name":"initMaxWinRates","stateMutability":"Nonpayable","type":"Function"},{"outputs":[{"type":"uint64"}],"constant":true,"name":"promotionEnd","stateMutability":"View","type":"Function"},{"inputs":[{"name":"_addr","type":"address"}],"name":"setTronBetPoolAddr","stateMutability":"Nonpayable","type":"Function"},{"payable":true,"inputs":[{"name":"_number","type":"uint256"},{"name":"_direction","type":"uint256"}],"name":"GoodLuck","stateMutability":"Payable","type":"Function"},{"payable":true,"inputs":[{"name":"_number","type":"uint256"},{"name":"_direction","type":"uint256"},{"name":"_rcode","type":"string"}],"name":"WelcomeToTronBet","stateMutability":"Payable","type":"Function"},{"name":"initWinBonus","stateMutability":"Nonpayable","type":"Function"},{"outputs":[{"type":"bool"}],"constant":true,"name":"isPaused","stateMutability":"View","type":"Function"},{"outputs":[{"name":"bettorArray","type":"address[]"},{"name":"trxAmountArray","type":"uint64[]"},{"name":"orderIdArray","type":"uint64[]"},{"name":"directionArray","type":"uint64[]"},{"name":"numberArray","type":"uint64[]"},{"name":"rollArray","type":"uint64[]"}],"constant":true,"inputs":[{"name":"_ownerArray","type":"address[]"}],"name":"getOrderByIdArray","stateMutability":"View","type":"Function"},{"inputs":[{"name":"_rate","type":"uint256"}],"name":"setMentorRate","stateMutability":"Nonpayable","type":"Function"},{"outputs":[{"type":"address"}],"constant":true,"name":"getTronBetPoolAddr","stateMutability":"View","type":"Function"},{"outputs":[{"type":"uint256"}],"constant":true,"name":"mentorRate","stateMutability":"View","type":"Function"},{"outputs":[{"type":"uint64"}],"constant":true,"name":"promotionStart","stateMutability":"View","type":"Function"},{"inputs":[{"name":"_bettor","type":"address"}],"name":"refund","stateMutability":"Nonpayable","type":"Function"},{"outputs":[{"type":"uint256"}],"constant":true,"name":"minBetAmount","stateMutability":"View","type":"Function"},{"outputs":[{"type":"address"}],"constant":true,"name":"getReferralshipAddr","stateMutability":"View","type":"Function"},{"stateMutability":"Nonpayable","type":"Constructor"},{"inputs":[{"indexed":true,"name":"_orderId","type":"uint256"},{"indexed":true,"name":"_bettor","type":"address"},{"indexed":true,"name":"_mentor","type":"address"},{"name":"_number","type":"uint64"},{"name":"_direction","type":"uint64"},{"name":"_amount","type":"uint256"},{"name":"_roll","type":"uint64"},{"name":"_winAmount","type":"uint256"},{"name":"_referralAmount","type":"uint256"}],"name":"DiceResult","type":"Event"},{"inputs":[{"indexed":true,"name":"_orderId","type":"uint256"},{"indexed":true,"name":"_bettor","type":"address"},{"name":"_number","type":"uint64"},{"name":"_direction","type":"uint64"},{"name":"_amount","type":"uint256"}],"name":"DiceRefund","type":"Event"}
*/
];

/*  {
    constant: true,
    inputs: [],
    name: 'name',
    outputs: [
      {
        name: '',
        type: 'string'
      }
    ],
    payable: false,
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: '_spender',
        type: 'address'
      },
      {
        name: '_value',
        type: 'uint256'
      }
    ],
    name: 'approve',
    outputs: [
      {
        name: 'success',
        type: 'bool'
      }
    ],
    payable: false,
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'totalSupply',
    outputs: [
      {
        name: '',
        type: 'uint256'
      }
    ],
    payable: false,
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: '_from',
        type: 'address'
      },
      {
        name: '_to',
        type: 'address'
      },
      {
        name: '_value',
        type: 'uint256'
      }
    ],
    name: 'transferFrom',
    outputs: [
      {
        name: 'success',
        type: 'bool'
      }
    ],
    payable: false,
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [
      {
        name: '',
        type: 'uint8'
      }
    ],
    payable: false,
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'version',
    outputs: [
      {
        name: '',
        type: 'string'
      }
    ],
    payable: false,
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      {
        name: '_owner',
        type: 'address'
      }
    ],
    name: 'balanceOf',
    outputs: [
      {
        name: 'balance',
        type: 'uint256'
      }
    ],
    payable: false,
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'symbol',
    outputs: [
      {
        name: '',
        type: 'string'
      }
    ],
    payable: false,
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: '_to',
        type: 'address'
      },
      {
        name: '_value',
        type: 'uint256'
      }
    ],
    name: 'transfer',
    outputs: [
      {
        name: 'success',
        type: 'bool'
      }
    ],
    payable: false,
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: '_spender',
        type: 'address'
      },
      {
        name: '_value',
        type: 'uint256'
      },
      {
        name: '_extraData',
        type: 'bytes'
      }
    ],
    name: 'approveAndCall',
    outputs: [
      {
        name: 'success',
        type: 'bool'
      }
    ],
    payable: false,
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      {
        name: '_owner',
        type: 'address'
      },
      {
        name: '_spender',
        type: 'address'
      }
    ],
    name: 'allowance',
    outputs: [
      {
        name: 'remaining',
        type: 'uint256'
      }
    ],
    payable: false,
    type: 'function'
  },
  {
    inputs: [
      {
        name: '_initialAmount',
        type: 'uint256'
      },
      {
        name: '_tokenName',
        type: 'string'
      },
      {
        name: '_decimalUnits',
        type: 'uint8'
      },
      {
        name: '_tokenSymbol',
        type: 'string'
      }
    ],
    type: 'constructor'
  },
  {
    payable: false,
    type: 'fallback'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: '_from',
        type: 'address'
      },
      {
        indexed: true,
        name: '_to',
        type: 'address'
      },
      {
        indexed: false,
        name: '_value',
        type: 'uint256'
      }
    ],
    name: 'Transfer',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: '_owner',
        type: 'address'
      },
      {
        indexed: true,
        name: '_spender',
        type: 'address'
      },
      {
        indexed: false,
        name: '_value',
        type: 'uint256'
      }
    ],
    name: 'Approval',
    type: 'event'
  }
];*/

async function getContract(address){
   let instance = await tronWeb.contract().at(address);
   // console.log(instance.abi);
   var arrs = instance.abi;
   for ( const arr of arrs) {
	if ( !arr.inputs ){
	  arr.inputs = [];
        }
	if ( !arr.outputs ){
	  arr.outputs = [];
        }
   }
   console.log(arrs);
   // console.log(ERC20Abi);
   Erc20Decoder.addABI(arrs);
   // Erc20Decoder.addABI(ERC20Abi);
   // var bbb = Erc20Decoder.decodeMethod('0xa9059cbb0000000000000000000000005502eaa043238486b261e14268f71060fc7a6bef000000000000000000000000000000000000000000000000000000000000272c'); 
  
   // var bbb = Erc20Decoder.decodeMethod('0xa3082be9000000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000001');
   // var bb = Erc20Decoder.decodeMethod('')
   var bbb = Erc20Decoder.decodeMethod('f3c0efe900000000000000000000000000000000000000000000000000000000000003e80000000000000000000000000000000000000000000000000000000000000293ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff000000000000000000000000000000000000000000000000000000005f91a35e00000000000000000000000055b776da4f19d5d476669b27f94923ef33f632080000000000000000000000006e2f3a7aac093298dd07e0c5fc16549007b2bc8e')
   console.log(bbb);
   // let res = await instance.name().call();
   // console.log("#############aaaa:", res);
}
// getContract('TDndaG9V79f3dVuVQHvGZjx3VWN9XxzGe9');
// getContract('TBKYAnVJdKWUJLdTYHuy1mmoL9ifYWTSAU');
getContract('41ed90629bdf5499f6b0936e0952519332e73be2cb');

// getContract('TEEXEWrkMFKapSMJ6mErg39ELFKDqEs6w3');
// getContract('TXdL7ahFgj2vWL53vugfxNp7b8yX1Pgpjt');
getContract('TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE');

tronWeb.trx.getContract("TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t").then(console.log)



// tronWeb.trx.getTokensIssuedByAddress('TKE9WRCPJzRyMoVUNK9tNY9mpvKosXKjFQ').then(console.log);

// tronWeb.trx.getTokensIssuedByAddress('TXdL7ahFgj2vWL53vugfxNp7b8yX1Pgpjt').then(result=>console.log("contract###:", result));
// tronWeb.trx.getTransactionInfo('bd072b596b90236720852bc5776321afa0cb8ada99261ec09f5b24b12ac3a1ea').then(result=>console.log("tran info###:", result));
