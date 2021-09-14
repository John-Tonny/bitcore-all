import AbiDecoder from 'abi-decoder';
import TronWeb from 'tronweb';
import { LoggifyClass } from '../../../decorators/Loggify';
import { ERC20Abi } from '../abi/erc20';
import { ERC721Abi } from '../abi/erc721';

AbiDecoder.addABI(ERC20Abi);
AbiDecoder.addABI(ERC721Abi);

if (Symbol['asyncIterator'] === undefined) (Symbol as any)['asyncIterator'] = Symbol.for('asyncIterator');

export interface TokenTransferResponse {
  name?: 'transfer';
  params?: Array<{ name: string; value: string; type: string }>;
}
/*
interface Callback<ResultType> {
  (error: Error): void;
  (error: null, val: ResultType): void;
}

interface JsonRPCRequest {
  jsonrpc: string;
  method: string;
  params: any[];
  id: number;
}
interface JsonRPCResponse {
  jsonrpc: string;
  id: number;
  result?: any;
  error?: string;
}
*/

@LoggifyClass
export class ParityRPC {
  tronWeb: TronWeb;

  constructor(tronWeb: TronWeb) {
    this.tronWeb = tronWeb;
  }

  public getBlock(blockNumber: number) {
    return this.tronWeb.trx.getBlockByNumber(blockNumber);
  }

  private async traceBlock(blockNumber: number) {
    return this.tronWeb.trx.getTransactionFromBlock(blockNumber);
  }

  public async getTransactionsFromBlock(blockNumber: number) {
    return (await this.traceBlock(blockNumber)) || [];
  }

  public async getTransactionInfo(id: string) {
    try {
      return await this.tronWeb.trx.getUnconfirmedTransactionInfo(id);
    } catch (ex) {
      console.log(ex);
    }
    return {};
  }

  public async getTransactionInfoByBlockNum(blockNumber: number) {
    try {
      return await this.tronWeb.trx.getTransactionInfoByBlockNum(blockNumber);
    } catch (ex) {
      console.log(ex);
    }
    return {};
  }

  /*
  public send<T>(data: JsonRPCRequest) {
    return new Promise<T>((resolve, reject) => {
      const provider = this.web3.eth.currentProvider as any; // Import type HttpProvider web3-core
      provider.send(data, function(err, data) {
        if (err) return reject(err);
        resolve(data.result as T);
      } as Callback<JsonRPCResponse>);
    });
  }
  */
}
