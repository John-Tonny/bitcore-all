import {EventEmitter} from 'events';
import Web3 from 'tronweb';
import logger, {timestamp} from '../../../logger';
import {StateStorage} from '../../../models/state';
import {ChainStateProvider} from '../../../providers/chain-state';
import {BaseP2PWorker} from '../../../services/p2p';
// import { valueOrDefault } from '../../../utils/check';
import {wait} from '../../../utils/wait';
import {TRXStateProvider} from '../api/csp';
import {TrxBlockModel, TrxBlockStorage} from '../models/block';
import {TrxTransactionModel, TrxTransactionStorage} from '../models/transaction';
import {ContractResult, ITrxBlock, ITrxTransaction, ParityBlock, Transaction} from '../types';
import {ParityRPC} from './parityRpc';
import * as _ from 'lodash';

export class TrxP2pWorker extends BaseP2PWorker<ITrxBlock> {
  protected chainConfig: any;
  protected syncing: boolean;
  protected initialSyncComplete: boolean;
  protected blockModel: TrxBlockModel;
  protected txModel: TrxTransactionModel;
  protected txSubscription: any;
  protected blockSubscription: any;
  protected rpc?: ParityRPC;
  protected provider: TRXStateProvider;
  protected web3?: Web3;
  protected invCache: any;
  protected invCacheLimits: any;
  public events: EventEmitter;
  public disconnecting: boolean;


  constructor({ chain, network, chainConfig, blockModel = TrxBlockStorage, txModel = TrxTransactionStorage }) {
    super({ chain, network, chainConfig, blockModel });
    this.chain = chain || 'TRX';
    this.network = network;
    this.chainConfig = chainConfig;
    this.syncing = false;
    this.initialSyncComplete = false;
    this.blockModel = blockModel;
    this.txModel = txModel;
    this.provider = new TRXStateProvider();
    this.provider.changeProvider(network);
    this.events = new EventEmitter();
    this.invCache = {};
    this.invCacheLimits = {
      TX: 100000
    };
    this.disconnecting = false;
  }

  cacheInv(type: 'TX', hash: string): void {
    if (!this.invCache[type]) {
      this.invCache[type] = [];
    }
    if (this.invCache[type].length > this.invCacheLimits[type]) {
      this.invCache[type].shift();
    }
    this.invCache[type].push(hash);
  }

  isCachedInv(type: 'TX', hash: string): boolean {
    if (!this.invCache[type]) {
      this.invCache[type] = [];
    }
    return this.invCache[type].includes(hash);
  }

  async setupListeners() {
    var curProvider;
    if (this.chainConfig.provider instanceof Array) {
        curProvider = this.chainConfig.provider[this.provider.confIndex];
    }else {
        curProvider = this.chainConfig.provider;
    }
    const { host, port } = curProvider;
    this.events.on('disconnected', async () => {
      logger.warn(
        `${timestamp()} | Not connected to peer: ${host}:${port} | Chain: ${this.chain} | Network: ${this.network}`
      );
    });
    /*
    this.events.on('connected', async () => {
      this.txSubscription = await this.web3!.eth.subscribe('pendingTransactions');
      this.txSubscription.subscribe(async (_err, txid) => {
        if (!txid) { return; }
        if (!this.isCachedInv('TX', txid)) {
          this.cacheInv('TX', txid);
          const tx = (await this.web3!.eth.getTransaction(txid)) as ParityTransaction;
          if (tx) {
            await this.processTransaction(tx);
            this.events.emit('transaction', tx);
          }
        }
      });
      this.blockSubscription = await this.web3!.eth.subscribe('newBlockHeaders');
      this.blockSubscription.subscribe((_err, block) => {
        this.events.emit('block', block);
        if (!this.syncing) {
          this.sync();
        }
      });
    });*/
  }

  async disconnect() {
    this.disconnecting = true;
    try {
      if (this.txSubscription) {
        this.txSubscription.unsubscribe();
      }
      if (this.blockSubscription) {
        this.blockSubscription.unsubscribe();
      }
    } catch (e) {
      console.error(e);
    }
  }

  async getWeb3() {
    return this.provider.getWeb3(this.network);
  }

  async handleReconnects() {
    this.disconnecting = false;
    let firstConnect = true;
    let connected = false;
    let disconnected = false;
    const { host, port } = this.chainConfig.provider[0];
    while (!this.disconnecting && !this.stopping) {
      try {
        if (!this.web3) {
          const { web3 } = await this.getWeb3();
          this.web3 = web3;
          this.rpc = new ParityRPC(this.web3);
        }
        try {
          let connect_status = await this.web3.isConnected();
          if ( connect_status.fullNode ){
            connected = true;
          }
        } catch (e) {
          connected = false;
          logger.error("error aaa:", e);
        }
        if (connected) {
          if (disconnected || firstConnect) {
            this.events.emit('connected');
          }
        } else {
          const { web3 } = await this.getWeb3();
          this.web3 = web3;
          this.rpc = new ParityRPC(this.web3);
          this.events.emit('disconnected');
        }
        if (disconnected && connected && !firstConnect) {
          logger.warn(
            `${timestamp()} | Reconnected to peer: ${host}:${port} | Chain: ${this.chain} | Network: ${this.network}`
          );
        }
        if (connected && firstConnect) {
          firstConnect = false;
          logger.info(
            `${timestamp()} | Connected to peer: ${host}:${port} | Chain: ${this.chain} | Network: ${this.network}`
          );
        }
        disconnected = !connected;
      } catch (e) {}
      await wait(2000);
    }
  }

  async connect() {
    this.handleReconnects();
  }

  public async getBlock(height: number) {
    return (this.rpc!.getBlock(height) as unknown) as ParityBlock;
  }

  public async getTransactionInfo(id: string) {
    return (await this.rpc!.getTransactionInfo(id)) ;
  }

  public async getTransactionInfoByBlockNum(blockNumber: number) {
    return (await this.rpc!.getTransactionInfoByBlockNum(blockNumber)) ;
  }

  async processBlock(block: ITrxBlock, transactions: ITrxTransaction[]): Promise<any> {
    await this.blockModel.addBlock({
      chain: this.chain,
      network: this.network,
      forkHeight: this.chainConfig.forkHeight,
      parentChain: this.chainConfig.parentChain,
      initialSyncComplete: this.initialSyncComplete,
      block,
      transactions
    });
    if (!this.syncing) {
      logger.info(`Added block ${block.hash}`, {
        chain: this.chain,
        network: this.network
      });
    }
  }

  /*  john
  async processTransaction(tx: Transaction) {
    const now = new Date();
    const convertedTx = await this.convertTx(tx);
    this.txModel.batchImport({
      chain: this.chain,
      network: this.network,
      txs: [convertedTx],
      height: -1,
      mempoolTime: now,
      blockTime: now,
      blockTimeNormalized: now,
      initialSyncComplete: true
    });
  }
  */

  async sync() {
    if (this.syncing) {
      return false;
    }
    const { chain, chainConfig, network } = this;
    const { parentChain, forkHeight } = chainConfig;
    this.syncing = true;
    const state = await StateStorage.collection.findOne({});
    this.initialSyncComplete =
      state && state.initialSyncComplete && state.initialSyncComplete.includes(`${chain}:${network}`);
    let tip = await ChainStateProvider.getLocalTip({ chain, network });
    if (parentChain && (!tip || tip.height < forkHeight)) {
      let parentTip = await ChainStateProvider.getLocalTip({ chain: parentChain, network });
      while (!parentTip || parentTip.height < forkHeight) {
        logger.info(`Waiting until ${parentChain} syncs before ${chain} ${network}`);
        await new Promise(resolve => {
          setTimeout(resolve, 5000);
        });
        parentTip = await ChainStateProvider.getLocalTip({ chain: parentChain, network });
      }
    }

    const startHeight = tip ? tip.height : 0;
    const startTime = Date.now();
    try {
      let currentBlock = await this.web3!.trx.getCurrentBlock();
      let bestBlock = currentBlock.block_header.raw_data.number;
      let lastLog = 0;
      let currentHeight = tip ? tip.height : 0;
      logger.info(`Syncing ${bestBlock - currentHeight} blocks for ${chain} ${network}`);
      while (currentHeight <= bestBlock) {
	console.time("getBlock");
        const block = await this.getBlock(currentHeight);
	console.timeEnd("getBlock");
        if (!block) {
          await wait(1000);
          continue;
	}
	console.time("convertBlock");
	const { convertedBlock, convertedTxs } = await this.convertBlock(block);
	console.timeEnd("convertBlock");
	console.time("processBlock");
        await this.processBlock(convertedBlock, convertedTxs);
	console.timeEnd("processBlock");
        if (currentHeight === bestBlock) {
          currentBlock = await this.web3!.trx.getBlockByNumber(currentHeight);
          bestBlock = currentBlock.block_header.raw_data.number;
        }
        tip = await ChainStateProvider.getLocalTip({ chain, network });
        currentHeight = tip ? tip.height + 1 : 0;

        const oneSecond = 1000;
        const now = Date.now();
        if (now - lastLog > oneSecond) {
          const blocksProcessed = currentHeight - startHeight;
          const elapsedMinutes = (now - startTime) / (60 * oneSecond);
          logger.info(
            `${timestamp()} | Syncing... | Chain: ${chain} | Network: ${network} |${(blocksProcessed / elapsedMinutes)
              .toFixed(2)
              .padStart(8)} blocks/min | Height: ${currentHeight.toString().padStart(7)}`
          );
          lastLog = Date.now();
        }
        // throw new Error('An error occurred');
      }
    } catch (err) {
      logger.error(`Error syncing ${chain} ${network}`, err.message);
      await wait(2000);
      this.syncing = false;
      return this.sync();
    }
    logger.info(`${chain}:${network} up to date.`);
    this.syncing = false;
    StateStorage.collection.findOneAndUpdate(
      {},
      { $addToSet: { initialSyncComplete: `${chain}:${network}` } },
      { upsert: true }
    );
    this.events.emit('SYNCDONE');
    return true;
  }

  async syncDone() {
    return new Promise(resolve => this.events.once('SYNCDONE', resolve));
  }

  async convertedTxs (transactions: Transaction[], block) {
    var arr: ITrxTransaction[] = [];
    if (transactions) {
      for (const tx of transactions) {
        var tx1 = await this.convertTx(tx, block);
        arr.push(tx1);
      }
    }
    return arr;
  }

  async convertedTxs_1 (transactions: Transaction[], block) {
    try {
      var arr: ITrxTransaction[] = [];
      if (transactions) {
        console.time("getInfo");
        var transactionInfos = await this.getTransactionInfoByBlockNum(block.height)
        console.timeEnd("getInfo");
        for (const tx of transactions) {
          let key = _.findKey(transactionInfos, ['txid', tx.txID]);
          let txInfo = {};
          if (typeof key !== 'undefined') {
            txInfo = transactionInfos[key];
          }
          var tx1 = await this.convertTx_1(tx, block, txInfo);
          arr.push(tx1);
        }
      }
      return arr;
    }catch(e) {
      console.log(e);
    }
    return [];
  }

  async convertBlock(block: ParityBlock) {
    var blockTime = 0;
    if (block.block_header.raw_data.timestamp) {
      blockTime = Number(block.block_header.raw_data.timestamp);
    }
    var blockTime1 = new Date(blockTime);
    
    const hash = block.blockID;
    var height = 0;
    if (block.block_header.raw_data.number) {
      height = block.block_header.raw_data.number;
    }
    let reward = block.block_header.raw_data.version || 0;

    var transactionCounts = 0;
    if (block.transactions) {
      transactionCounts = block.transactions.length;
    }

    const witndessId = block.block_header.raw_data.witness_id!;
    var witnessAddress;
    if (block.block_header.raw_data.witness_address) {
      witnessAddress = Buffer.from(block.block_header.raw_data.witness_address);
    }
    var accountStateRoot;
    if (block.block_header.raw_data.accountStateRoot) {
      accountStateRoot = Buffer.from(block.block_header.raw_data.accountStateRoot);
    }
    var witnessSignature;
    if (block.block_header.witness_signature) {
      witnessSignature = Buffer.from(block.block_header.witness_signature);
    }

    const convertedBlock: ITrxBlock = {
      chain: this.chain,
      network: this.network,
      height,
      hash,
      time: blockTime1,
      timeNormalized: blockTime1,
      previousBlockHash: block.block_header.raw_data.parentHash,
      nextBlockHash: '',
      transactionCount: transactionCounts,
      size: 0,
      reward,
      processed: false,
      txTrieRoot: Buffer.from(block.block_header.raw_data.txTrieRoot),
      witnessId: witndessId,
      witnessAddress: witnessAddress,
      accountStateRoot: accountStateRoot,
      witnessSignature: witnessSignature
    };
    const transactions = block.transactions;
    var convertedTxs = await this.convertedTxs_1(transactions, convertedBlock); // transactions.map( t => this.convertTx(t, convertedBlock));

    return { convertedBlock, convertedTxs };
  }

  async convertTx(tx: Transaction, block?: ITrxBlock) {
    if (!block) {
      const txid = tx.txID || '';
      var from = '';
      var to = '';
      var assetName;
      var value = 0;
      var data;
      var callValue  = 0;
      var status = false;
      var error;

      const receipt = await this.getTransactionInfo(txid);
      const fee = Number( receipt.fee! || 0);
      const internal = receipt.InternalTransaction!;
      if ( tx.ret ) {
        if ( tx.ret[0].ret ) {
          if ( !tx.ret[0].ret )
            status = true;
        }else {
          if ( tx.ret[0].contractRet == ContractResult.SUCCESS ){
            status = true;
          }else {
            error = 'user error';
          }
        }
      }else{
        status = true;
      }

      const type = tx.raw_data.contract[0].type;
      switch(type) {
        case 'AccountCreateContract':
          from = tx.raw_data.contract[0].parameter.value.owner_address;
          break;
        case 'TransferContract':
        case 'TransferAssetContract':
        case 'ParticipateAssetIssueContract':
          from = tx.raw_data.contract[0].parameter.value.owner_address;
          to = tx.raw_data.contract[0].parameter.value.to_address;
          assetName = tx.raw_data.contract[0].parameter.value.asset_name!;
          value = Number(tx.raw_data.contract[0].parameter.value.amount);
          break;
        case 'TriggerSmartContract':
          from = tx.raw_data.contract[0].parameter.value.owner_address;
          to = tx.raw_data.contract[0].parameter.value.contract_address;
          assetName = tx.raw_data.contract[0].parameter.value.token_id!;
          value = Number(tx.raw_data.contract[0].parameter.value.value! || 0);
          callValue = Number(tx.raw_data.contract[0].parameter.value.call_value! || 0);
          if (tx.raw_data.contract[0].parameter.value.data) {
            data = Buffer.from(tx.raw_data.contract[0].parameter.value.data);
          }
          break;

        case 'ExchangeInjectContract':
          from = tx.raw_data.contract[0].parameter.value.owner_address;
          assetName = tx.raw_data.contract[0].parameter.value.token_id!;
          value = Number(tx.raw_data.contract[0].parameter.value.quant);
          break;
        case 'ExchangeWithdrawContract':
          to = tx.raw_data.contract[0].parameter.value.owner_address;
          assetName = tx.raw_data.contract[0].parameter.value.token_id!;
          value = Number(tx.raw_data.contract[0].parameter.value.quant);
          break;
        /*
        case 'VoteAssetContract':
        case 'WitnessCreateContract':
        case 'AssetIssueContract':
        case 'WitnessUpdateContract':
        case 'AccountUpdateContract':
        case 'FreezeBalanceContract':
        case 'UnfreezeBalanceContract':
        case 'WithdrawBalanceContract':
        case 'UnfreezeAssetContract':
        case 'UpdateAssetContract':
        case 'ProposalCreateContract':
        case 'ProposalApproveContract':
        case 'ProposalDeleteContract':
        case 'SetAccountIdContract':
        case 'CustomContract':
        case 'CreateSmartContract':
        case 'GetContract':
        case 'UpdateSettingContract':
        case 'ExchangeCreateContract':
        case 'UpdateEnergyLimitContract':
        case 'AccountPermissionUpdateContract':
        case 'ClearABIContract':
        case 'UpdateBrokerageContract':
        case 'ExchangeTransactionContract':
        case 'ShieldedTransferContract':
        case 'MarketSellAssetContract':
        case 'MarketCancelOrderContract':
          from = tx.raw_data.contract[0].parameter.value.owner_address;
          break;*/
        default:
          from = tx.raw_data.contract[0].parameter.value.owner_address;
          break;
      }


      const abiType = this.txModel.abiDecode(tx.raw_data.contract[0].parameter.value.data!);
      const convertedTx: ITrxTransaction = {
        assetName: assetName,
        type: type,
        status: status,
        error: error,
        chain: this.chain,
        network: this.network,
        blockHeight: receipt.blockNumber,
        blockHash: receipt.id,
        data: data,
        txid,
        blockTime: new Date(),
        blockTimeNormalized: new Date(),
        fee,
        value,
        wallets: [],
        to,
        from,
        callValue: callValue,
        contract: tx.raw_data.contract,
        refBlockBytes: tx.raw_data.ref_block_bytes,
        refBlockNum: tx.raw_data.ref_block_num,
        refBlockHash: tx.raw_data.ref_block_hash,
        expiration: tx.raw_data.expiration,
        auths: tx.raw_data.auths || undefined,
        feeLimit: tx.raw_data.fee_limit,
        signature: tx.signature,
        internal: internal,

      }
      if (abiType) {
        convertedTx.abiType = abiType;
      }
      return convertedTx;
    } else {
      const { hash: blockHash, time: blockTime, timeNormalized: blockTimeNormalized, height } = block;
      const noBlockTx = await this.convertTx(tx);
      return {
        ...noBlockTx,
        blockHeight: height,
        blockHash,
        blockTime,
        blockTimeNormalized
      };
    }
  }

  async convertTx_1(tx: Transaction,  block: ITrxBlock, txInfo?: any) {
    const txid = tx.txID || '';
    var from = '';
    var to = '';
    var assetName;
    var value = 0;
    var data;
    var callValue  = 0;
    var status = false;
    var error;

    var fee = 0;
    var internal = [];
    if(txInfo){
      fee = Number( txInfo.fee! || 0);
      internal = txInfo.InternalTransaction!;
    }
    if ( tx.ret ) {
      if ( tx.ret[0].ret ) {
        if ( !tx.ret[0].ret )
          status = true;
      }else {
        if ( tx.ret[0].contractRet == ContractResult.SUCCESS ){
          status = true;
        }else {
          error = 'user error';
        }
      }
    }else{
      status = true;
    }

    const type = tx.raw_data.contract[0].type;
    switch(type) {
      case 'AccountCreateContract':
        from = tx.raw_data.contract[0].parameter.value.owner_address;
        break;
      case 'TransferContract':
      case 'TransferAssetContract':
      case 'ParticipateAssetIssueContract':
        from = tx.raw_data.contract[0].parameter.value.owner_address;
        to = tx.raw_data.contract[0].parameter.value.to_address;
        assetName = tx.raw_data.contract[0].parameter.value.asset_name!;
        value = Number(tx.raw_data.contract[0].parameter.value.amount);
        break;
      case 'TriggerSmartContract':
        from = tx.raw_data.contract[0].parameter.value.owner_address;
        to = tx.raw_data.contract[0].parameter.value.contract_address;
        assetName = tx.raw_data.contract[0].parameter.value.token_id!;
        value = Number(tx.raw_data.contract[0].parameter.value.value! || 0);
        callValue = Number(tx.raw_data.contract[0].parameter.value.call_value! || 0);
        if (tx.raw_data.contract[0].parameter.value.data) {
          data = Buffer.from(tx.raw_data.contract[0].parameter.value.data);
        }
        break;

      case 'ExchangeInjectContract':
        from = tx.raw_data.contract[0].parameter.value.owner_address;
        assetName = tx.raw_data.contract[0].parameter.value.token_id!;
        value = Number(tx.raw_data.contract[0].parameter.value.quant);
        break;
      case 'ExchangeWithdrawContract':
        to = tx.raw_data.contract[0].parameter.value.owner_address;
        assetName = tx.raw_data.contract[0].parameter.value.token_id!;
        value = Number(tx.raw_data.contract[0].parameter.value.quant);
        break;
        /*
        case 'VoteAssetContract':
        case 'WitnessCreateContract':
        case 'AssetIssueContract':
        case 'WitnessUpdateContract':
        case 'AccountUpdateContract':
        case 'FreezeBalanceContract':
        case 'UnfreezeBalanceContract':
        case 'WithdrawBalanceContract':
        case 'UnfreezeAssetContract':
        case 'UpdateAssetContract':
        case 'ProposalCreateContract':
        case 'ProposalApproveContract':
        case 'ProposalDeleteContract':
        case 'SetAccountIdContract':
        case 'CustomContract':
        case 'CreateSmartContract':
        case 'GetContract':
        case 'UpdateSettingContract':
        case 'ExchangeCreateContract':
        case 'UpdateEnergyLimitContract':
        case 'AccountPermissionUpdateContract':
        case 'ClearABIContract':
        case 'UpdateBrokerageContract':
        case 'ExchangeTransactionContract':
        case 'ShieldedTransferContract':
        case 'MarketSellAssetContract':
        case 'MarketCancelOrderContract':
          from = tx.raw_data.contract[0].parameter.value.owner_address;
          break;*/
      default:
        from = tx.raw_data.contract[0].parameter.value.owner_address;
        break;
    }


    const abiType = this.txModel.abiDecode(tx.raw_data.contract[0].parameter.value.data!);
    const convertedTx: ITrxTransaction = {
      assetName: assetName,
      type: type,
      status: status,
      error: error,
      chain: this.chain,
      network: this.network,
      blockHeight: block.height,
      blockHash: block.hash,
      data: data,
      txid,
      blockTime: new Date(),
      blockTimeNormalized: new Date(),
      fee,
      value,
      wallets: [],
      to,
      from,
      callValue: callValue,
      contract: tx.raw_data.contract,
      refBlockBytes: tx.raw_data.ref_block_bytes,
      refBlockNum: tx.raw_data.ref_block_num,
      refBlockHash: tx.raw_data.ref_block_hash,
      expiration: tx.raw_data.expiration,
      auths: tx.raw_data.auths || undefined,
      feeLimit: tx.raw_data.fee_limit,
      signature: tx.signature,
      internal: internal,

    }
    if (abiType) {
      convertedTx.abiType = abiType;
    }
    return convertedTx;
  }

  async stop() {
    this.stopping = true;
    logger.debug(`Stopping worker for chain ${this.chain} ${this.network}`);
    await this.disconnect();
  }

  async start() {
    logger.debug(`Started worker for chain ${this.chain} ${this.network}`);
    this.connect();
    this.setupListeners();
    this.sync();
  }
}
