// import BN from 'bn.js';

import { ITransaction } from '../../models/baseTransaction';
import { IBlock } from '../../types/Block';
import { TokenTransferResponse } from './p2p/parityRpc';
import {ITrxTransaction} from "../tron/types";

// john
enum AccountType {
  Normal = 0,
  AssetIssue = 1,
  Contract = 2
}

// AccountId, (name, address) use name, (null, address) use address, (name, null) use name,
export interface AccountId {
  name: string;
  address: string;
}

// vote message
export interface Vote {
  // the super rep address
  vote_address: string;
  // the vote num to this super rep.
  vote_count: number;
}

// Proposal
enum State_Proposal {
  PENDING = 0,
  DISAPPROVED = 1,
  APPROVED = 2,
  CANCELED = 3
}
export interface Proposal {
  proposal_id: number;
  proposer_address: string;
  parameters: Array<{first:number, second:number}>;
  expiration_time: number;
  create_time: number;
  approvals: Array<string>;
  state: State_Proposal;
}

// Exchange
export interface Exchange {
  exchange_id: number;
  creator_address: string;
  create_time: number;
  first_token_id: string;
  first_token_balance: number;
  second_token_id: string;
  second_token_balance: number;
}

// market
enum State_MarketOrder {
  ACTIVE = 0,
  INACTIVE = 1,
  CANCELED = 2
}
export interface MarketOrder {
  order_id: string;
  owner_address: string;
  create_time: number;
  sell_token_id: string;
  sell_token_quantity: number;
  buy_token_id: string;
  buy_token_quantity: number; // min to receive
  sell_token_quantity_remain: number;
  // When state != ACTIVE and sell_token_quantity_return !=0,
  //it means that some sell tokens are returned to the account due to insufficient remaining amount
  sell_token_quantity_return: number;

  state: State_MarketOrder;

  prev: string;
  next: string;
}

export interface MarketOrderPair{
  sell_token_id: string;
  buy_token_id: string;
}

export interface MarketOrderList {
  orders: Array<MarketOrder>;
}

export interface MarketOrderPairList {
  orderPair: Array<MarketOrderPair>;
}

export interface MarketAccountOrder {
  owner_address: string;
  orders: Array<string>; // order_id list
  count: number; // active count
  total_count: number;
}

export interface MarketPrice {
  sell_token_quantity: number;
  buy_token_quantity: number;
}

export interface MarketPriceList {
  sell_token_id: string;
  buy_token_id: string;
  prices: Array<MarketPrice>;
}

export interface MarketOrderIdList {
  head: string;
  tail: string;
}

export interface ChainParameter {
  key: string;
  value: number;
}
export interface ChainParameters {
  chainParameter: Array<ChainParameter>;
}

/* Account */
export interface Frozen {
  frozen_balance: number; // the frozen trx balance
  expire_time: number; // the expire time
}

export interface AccountResource {
  // energy resource, get from frozen
  energy_usage: number;
  // the frozen balance for energy
  frozen_balance_for_energy: Frozen;
  latest_consume_time_for_energy: number;

  //Frozen balance provided by other accounts to this account
  acquired_delegated_frozen_balance_for_energy: number;
  //Frozen balances provided to other accounts
  delegated_frozen_balance_for_energy: number;

  // storage resource, get from market
  storage_limit: number;
  storage_usage: number;
  latest_exchange_storage_time: number;
}

enum PermissionType {
  Owner = 0,
  Witness = 1,
  Active = 2
}

export interface Permission {
  type: PermissionType;
  id: number; //Owner id=0, Witness id=1, Active id start by 2
  permission_name: string;
  threshold: number;
  parent_id: number;
  operations: string; //1 bit 1 contract
  keys: Array<Key>;
}

export interface Account {
  /* frozen balance */
  // account nick name
  account_name: string;
  type: AccountType;
  // the create address
  address: string;
  // the trx balance
  balance: number;
  // the votes
  votes: Array<Vote>;
  // the other asset owned by this account
  asset:Array<{first:string, second:number}>  ;

  // the other asset owned by this account，key is assetId
  assetV2: Array<{first:string, second:number}>;

  // the frozen balance for bandwidth
  frozen: Array<Frozen>;
  // bandwidth, get from frozen
  net_usage: number;
  //Frozen balance provided by other accounts to this account
  acquired_delegated_frozen_balance_for_bandwidth: number;
  //Freeze and provide balances to other accounts
  delegated_frozen_balance_for_bandwidth: number;

  // this account create time
  create_time: number;
  // this last operation time, including transfer, voting and so on. //FIXME fix grammar
  latest_opration_time: number;
  // witness block producing allowance
  allowance: number;
  // last withdraw time
  latest_withdraw_time: number;
  // not used so far
  code: string;
  is_witness: boolean;
  is_committee: boolean;
  // frozen asset(for asset issuer)
  frozen_supply: Array<Frozen>;
  // asset_issued_name
  asset_issued_name: string;
  asset_issued_ID: string;
  latest_asset_operation_time: Array<{first:string, second:number}>;
  latest_asset_operation_timeV2: Array<{first:string, second:number}>;
  free_net_usage: number;
  free_asset_net_usage: Array<{first:string, second:number}>;
  free_asset_net_usageV2: Array<{first:string, second:number}>;
  latest_consume_time: number;
  latest_consume_free_time: number;

  // the identity of this account, case insensitive
  account_id: string;

  account_resource: AccountResource;
  codeHash: string;
  owner_permission: Permission;
  witness_permission: Permission;
  active_permission: Array<Permission>;
}


export interface Key {
  address: string;
  weight: number;
}

export interface DelegatedResource {
  from: string;
  to: string;
  frozen_balance_for_bandwidth: number;
  frozen_balance_for_energy: number;
  expire_time_for_bandwidth: number;
  expire_time_for_energy: number;
}

export interface authority {
  account: AccountId;
  permission_name: string;
}


// Witness
export interface Witness {
  address: string;
  voteCount: number;
  pubKey: string;
  url: string;
  totalProduced: number;
  totalMissed: number;
  latestBlockNum: number;
  latestSlotNum: number;
  isJobs: boolean;
}

// Vote Change
export interface Votes {
  address: string;
  old_votes: Array<Vote>;
  new_votes: Array<Vote>;
}

// Transcation

export interface TXOutput {
  value: number;
  pubKeyHash: string;
}

export interface raw_TXInput {
  txID: string;
  vout: number;
  pubKey: string;
}

export interface TXInput {
  raw_data: raw_TXInput;
  signature: string;
}

export interface TXOutputs {
  outputs: Array<TXOutput>;
}

export interface ResourceReceipt {
  energy_usage?: number;
  energy_fee: number;
  origin_energy_usage?: number;
  energy_usage_total?: number;
  net_usage?: number;
  net_fee: number;
  result: ContractResult;
}

export interface MarketOrderDetail {
  makerOrderId: string;
  takerOrderId: string;
  fillSellQuantity: number;
  fillBuyQuantity: number;
}

export enum ContractType {
  AccountCreateContract = 0,
  TransferContract = 1,
  TransferAssetContract = 2,
  VoteAssetContract = 3,
  VoteWitnessContract = 4,
  WitnessCreateContract = 5,
  AssetIssueContract = 6,
  WitnessUpdateContract = 8,
  ParticipateAssetIssueContract = 9,
  AccountUpdateContract = 10,
  FreezeBalanceContract = 11,
  UnfreezeBalanceContract = 12,
  WithdrawBalanceContract = 13,
  UnfreezeAssetContract = 14,
  UpdateAssetContract = 15,
  ProposalCreateContract = 16,
  ProposalApproveContract = 17,
  ProposalDeleteContract = 18,
  SetAccountIdContract = 19,
  CustomContract = 20,
  CreateSmartContract = 30,
  TriggerSmartContract = 31,
  GetContract = 32,
  UpdateSettingContract = 33,
  ExchangeCreateContract = 41,
  ExchangeInjectContract = 42,
  ExchangeWithdrawContract = 43,
  ExchangeTransactionContract = 44,
  UpdateEnergyLimitContract = 45,
  AccountPermissionUpdateContract = 46,
  ClearABIContract = 48,
  UpdateBrokerageContract = 49,
  ShieldedTransferContract = 51,
  MarketSellAssetContract = 52,
  MarketCancelOrderContract = 53
}

export interface Value_ParaMeter {
  asset_name?: string; // this field is token name before the proposal ALLOW_SAME_TOKEN_NAME is active, otherwise it is token id and token is should be in string format.
  owner_address?: string;
  to_address?: string;
  amount?: number;

  contract_address?: string;
  call_token_value?: number;
  call_value?: number;
  data?: string;
}

export interface ParaMeter {
  value: any;
  type_url: string;
}

export interface Contract {
  type: string;
  parameter: any;
  provider?: string;
  ContractName?: string;
  Permission_id?: number;
}

export enum code_Result {
  SUCESS = 0,
  FAILED = 1
}

export enum ContractResult {
  DEFAULT = 0,
  SUCCESS = 1,
  REVERT = 2,
  BAD_JUMP_DESTINATION = 3,
  OUT_OF_MEMORY = 4,
  PRECOMPILED_CONTRACT = 5,
  STACK_TOO_SMALL = 6,
  STACK_TOO_LARGE = 7,
  ILLEGAL_OPERATION = 8,
  STACK_OVERFLOW = 9,
  OUT_OF_ENERGY = 10,
  OUT_OF_TIME = 11,
  JVM_STACK_OVER_FLOW = 12,
  UNKNOWN = 13,
  TRANSFER_FAILED = 14
}

export interface  Result_Transaction {
  fee?: number;
  ret?: code_Result;
  contractRet: ContractResult;

  assetIssueID?: string;
  withdraw_amount?: number;
  unfreeze_amount?: number;
  exchange_received_amount?: number;
  exchange_inject_another_amount?: number;
  exchange_withdraw_another_amount?: number;
  exchange_id?: number;
  shielded_transaction_fee?: number;

  orderId?: string;
  orderDetails?: Array<MarketOrderDetail>;
}

export interface raw_Transaction {
  ref_block_bytes: string;
  ref_block_num: number;
  ref_block_hash: string;
  expiration: number;
  auths?: Array<authority>;
  //only support size = 1,  repeated list here for extension
  contract: Array<Contract>;
  timestamp?: number;
  fee_limit?: number;
}

export interface Transaction {
  txID: string;
  raw_data: raw_Transaction;
  raw_data_hex: string;
  // only support size = 1,  repeated list here for muti-sig extension
  signature: Array<string>;
  ret: Array<Result_Transaction>;
}

enum code_status {
  SUCESS = 0,
  FAILED = 1
}

export interface Log {
  address: string;
  topics: Array<string>;
  data: string;
}

export interface TransactionInfo {
  id: string;
  fee: number;
  blockNumber: number;
  blockTimeStamp: number;
  contractResult: Array<ContractResult>;
  contract_address?: string;
  receipt: ResourceReceipt;
  log?: Array<Log>;
  result?: code_status;
  resMessage?: string;

  assetIssueID?: string;
  withdraw_amount?: number;
  unfreeze_amount?: number;
  internal_transactions?: Array<InternalTransaction>;
  exchange_received_amount?: number;
  exchange_inject_another_amount?: number;
  exchange_withdraw_another_amount?: number;
  exchange_id?: number;
  shielded_transaction_fee?: number;

  orderId?: string;
  orderDetails?: Array<MarketOrderDetail>;
}

export interface TransactionRet {
  blockNumber: number;
  blockTimeStamp: number;
  transactioninfo: Array<TransactionInfo>;
}

export interface Transactions {
  transactions: Array<Transaction>;
}

export interface TransactionSign {
  transaction: Transaction;
  privateKey: string;
}

export interface raw_BlockHeader {
  timestamp: number;
  txTrieRoot: string;
  parentHash: string;
  //bytes nonce = 5;
  //bytes difficulty = 6;
  number: number;
  witness_id?: number;
  witness_address?: string;
  version?: number;
  accountStateRoot?: string;
}

export interface BlockHeader {
  raw_data: raw_BlockHeader;
  witness_signature: string;
}

// block
export interface Block {
  transactions: Array<Transaction>;
  block_header: BlockHeader;
}

export interface BlockId {
  hash: string;
  number: number;
}

export interface ChainInventory {
  ids: Array<BlockId>;
  remain_num: number;
}

// Inventory
enum Type_BlockInventory {
  SYNC = 0,
  ADVTISE = 1,
  FETCH = 2
}
export interface BlockInventory {
  ids: Array<BlockId>;
  type: Type_BlockInventory;
}

enum InventoryType {
  TRX = 0,
  BLOCK = 1
}

export interface Inventory {
  type: InventoryType;
  ids: Array<string>;
}

enum ItemType {
  ERR = 0,
  TRX = 1,
  BLOCK = 2,
  BLOCKHEADER = 3
}

export interface Items {
  type: ItemType;
  blocks: Array<Block>;
  block_headers: Array<BlockHeader>;
  transactions: Array<Transaction>;
}

// DynamicProperties
export interface DynamicProperties {
  last_solidity_block_num: number;
}

enum ReasonCode {
  REQUESTED = 0x00,
  BAD_PROTOCOL = 0x02,
  TOO_MANY_PEERS = 0x04,
  DUPLICATE_PEER = 0x05,
  INCOMPATIBLE_PROTOCOL = 0x06,
  NULL_IDENTITY = 0x07,
  PEER_QUITING = 0x08,
  UNEXPECTED_IDENTITY = 0x09,
  LOCAL_IDENTITY = 0x0A,
  PING_TIMEOUT = 0x0B,
  USER_REASON = 0x10,
  RESET = 0x11,
  SYNC_FAIL = 0x12,
  FETCH_FAIL = 0x13,
  BAD_TX = 0x14,
  BAD_BLOCK = 0x15,
  FORKED = 0x16,
  UNLINKABLE = 0x17,
  INCOMPATIBLE_VERSION = 0x18,
  INCOMPATIBLE_CHAIN = 0x19,
  TIME_OUT = 0x20,
  CONNECT_FAIL = 0x21,
  TOO_MANY_PEERS_WITH_SAME_IP = 0x22,
  UNKNOWN = 0xFF
}

export interface DisconnectMessage {
  reason: ReasonCode;
}

export interface CallValueInfo {
  // trx (TBD: or token) value
  callValue: number;
  // TBD: tokenName, trx should be empty
  tokenId: string;
}

export interface InternalTransaction {
  // internalTransaction identity, the root InternalTransaction hash
  // should equals to root transaction id.
  hash: string;
  // the one send trx (TBD: or token) via function
  caller_address: string;
  // the one recieve trx (TBD: or token) via function
  transferTo_address: string;
  callValueInfo: Array<CallValueInfo>;
  note: string;
  rejected?: boolean;
}

export interface DelegatedResourceAccountIndex {
  account: string;
  fromAccounts: Array<string>;
  toAccounts: Array<string>;
}

export interface PeerInfo {
  lastSyncBlock: string;
  remainNum: number;
  lastBlockUpdateTime:number;
  syncFlag: boolean;
  headBlockTimeWeBothHave: number;
  needSyncFromPeer: boolean;
  needSyncFromUs: boolean;
  host: string;
  port: string;
  nodeId: string;
  connectTime: number;
  avgLatency: number;
  syncToFetchSize: number;
  syncToFetchSizePeekNum: number;
  syncBlockRequestedSize: number;
  unFetchSynNum: number;
  blockInPorcSize: number;
  headBlockWeBothHave: string;
  isActive: boolean;
  score: number;
  nodeCount: number;
  inFlow: number;
  disconnectTimes: number;
  localDisconnectReason: string;
  remoteDisconnectReason: string;
}

export interface ConfigNodeInfo {
  codeVersion: string;
  p2pVersion: string;
  listenPort: number;
  discoverEnable: boolean;
  activeNodeSize: number;
  passiveNodeSize: number;
  sendNodeSize: number;
  maxConnectCount: number;
  sameIpMaxConnectCount: number;
  backupListenPort: number;
  backupMemberSize: number;
  backupPriority: number;
  dbVersion: number;
  minParticipationRate: number;
  supportConstant: boolean;
  minTimeRatio: number;
  maxTimeRatio: number;
  allowCreationOfContracts: number;
  allowAdaptiveEnergy: number;
}

export interface MemoryDescInfo {
  name: string;
  initSize: number;
  useSize: number;
  maxSize: number;
  useRate: number;
}

export interface DeadLockThreadInfo {
  name: string;
  lockName: string;
  lockOwner: string;
  state: string;
  blockTime: number;
  waitTime: number;
  stackTrace: string;
}

export interface MachineInfo {
  threadCount: number;
  deadLockThreadCount: number;
  cpuCount: number;
  totalMemory: number;
  freeMemory: number;
  cpuRate: number;
  javaVersion: string;
  osName: string;
  jvmTotalMemory: number;
  jvmFreeMemory: number;
  processCpuRate: number;
  memoryDescInfoList: Array<MemoryDescInfo>;
  deadLockThreadInfoList: Array<DeadLockThreadInfo>;
}

export interface NodeInfo {
  beginSyncNum: number;
  block: string;
  solidityBlock: string;
  //connect information
  currentConnectCount: number;
  activeConnectCount: number;
  passiveConnectCount: number;
  totalFlow: number;
  peerInfoList: Array<PeerInfo>;
  configNodeInfo: ConfigNodeInfo;
  machineInfo: MachineInfo;
  cheatWitnessInfoMap: Array<{first:string, second:string}>;
}

export interface NodeInfo {
  ip: string;
  nodeType: number;
  version: string;
  backupStatus: number;
}

export interface RateInfo {
  count: number;
  meanRate: number;
  oneMinuteRate: number;
  fiveMinuteRate: number;
  fifteenMinuteRate: number;
}

export interface Witness_BlockChainInfo {
  address: string;
  version: number;
}

export interface DupWitness_BlockChainInfo {
  address: string;
  blockNum: number;
  count: number;
}

export interface BlockChainInfo {
  headBlockNum: number;
  headBlockTimestamp: number;
  headBlockHash: string;
  forkCount: number;
  failForkCount: number;
  blockProcessTime: RateInfo;
  tps: RateInfo;
  transactionCacheSize: number;
  missedTransaction: RateInfo;
  witnesses: Array<Witness_BlockChainInfo>;
  failProcessBlockNum: number;
  failProcessBlockReason: string;
  dupWitness: Array<DupWitness_BlockChainInfo>;
}

export interface ApiDetailInfo {
  name: string;
  qps: RateInfo;
  failQps: RateInfo;
  outTraffic: RateInfo;
}
export interface ApiInfo {
  qps: RateInfo;
  failQps: RateInfo;
  outTraffic: RateInfo;
  detail: Array<ApiDetailInfo>;

}

export interface DisconnectionDetailInfo {
  reason: string;
  count: number;
}

export interface LatencyDetailInfo {
  witness: string;
  top99: number;
  top95: number;
  top75: number;
  count: number;
  delay1S: number;
  delay2S: number;
  delay3S: number;
}
export interface LatencyInfo {
  top99: number;
  top95: number;
  top75: number;
  totalCount: number;
  delay1S: number;
  delay2S: number;
  delay3S: number;
  detail: Array<LatencyDetailInfo>;
}

export interface NetInfo {
  errorProtoCount: number;
  api: ApiInfo;
  connectionCount: number;
  validConnectionCount: number;
  tcpInTraffic: RateInfo;
  tcpOutTraffic: RateInfo;
  disconnectionCount: number;
  disconnectionDetail: Array<DisconnectionDetailInfo>;
  udpInTraffic: RateInfo;
  udpOutTraffic: RateInfo;
  latency: LatencyInfo;
}

export interface MetricsInfo {
  interval: number;
  node: NodeInfo;
  blockchain: BlockChainInfo;
  net: NetInfo;
}

enum MsgType_PBFTMessage {
  VIEW_CHANGE = 0,
  REQUEST = 1,
  PREPREPARE = 2,
  PREPARE = 3,
  COMMIT = 4
}
enum DataType_PBFTMessage {
  BLOCK = 0,
  SRL = 1
}
export interface Raw_PBFTMessage {
  msg_type: MsgType_PBFTMessage;
  data_type: DataType_PBFTMessage;
  view_n: number;
  epoch: number;
  data: string;
}

export interface PBFTMessage {
  raw_data: Raw_PBFTMessage;
  signature: Array<string>;
}

export interface PBFTCommitResult {
  data: string;
  signature: Array<string>;
}

export interface SRL {
  srAddress: Array<string>;
}
// john

export interface ParityBlock {
  blockID: string;
  block_header: TronHeader;
  transactions: Array<Transaction>;
}
export interface ParityTransaction {
  txID: string;
  raw_data: raw_Transaction;
  raw_data_hex: string;
  // only support size = 1,  repeated list here for muti-sig extension
  signature: Array<string>;
  ret: Array<Result_Transaction>;
}

export type Networks = 'mainnet' | 'ropsten' | 'rinkeby' | 'goerli' | 'kovan';

export interface TronBlock {
  blockID: string;
  block_header: TronHeader;
  transactions: Array<Transaction>;
}

export interface TronHeader {
  raw_data: raw_BlockHeader;
  witness_signature?: string;
}

export type ITrxBlock = IBlock & {
  txTrieRoot: Buffer;
  witnessId?: number;
  witnessAddress: Buffer;
  accountStateRoot?: Buffer;

  witnessSignature?: Buffer;
};

export type ITrxTransaction = ITransaction & {
  refBlockBytes: string;
  refBlockNum: number;
  refBlockHash: string;
  expiration: number;
  auths?: Array<authority>;

  //only support size = 1,  repeated list here for extension
  contract: Array<Contract>;

  feeLimit?: number;

  status: boolean;
  error?: string;
  type?: string;

  assetName?: string;
  from: string;
  to: string;
  callValue: number;
  data?: Buffer;

  // only support size = 1,  repeated list here for muti-sig extension
  signature: Array<string>;

  abiType?: {
    type: string;
    name: string;
    params: Array<{ name: string; value: string; type: string }>;
  };
  internal?: Array<InternalTransaction>;
};

export interface TransactionJSON {
  txid: string;
  chain: string;
  network: string;
  blockHeight: number;
  blockHash?: string;
  blockTime: string;
  blockTimeNormalized: string;
  fee: number;
  size: number;
  value: number;
}

export interface AbiDecodedData {
  type: string;
  decodedData: TokenTransferResponse;
}

export interface TrxTransactionJSON {
  txid: string;
  chain: string;
  network: string;
  blockHeight: number;
  blockHash: string;
  blockTime: string;
  blockTimeNormalized: string;
  fee: number;
  value: number;
  to: string;
  from: string;
  decodedData?: AbiDecodedData;
  data: string;
  internal?: ITrxTransaction['internal'];
  assetName?: string;
  type?: string;
  status?: boolean;
  error?: string;
}


