import { Transform } from 'stream';
import { MongoBound } from '../../../models/base';
import { ITrxTransaction } from '../types';

export class TrxListTransactionsStream extends Transform {
  constructor(private walletAddresses: Array<string>) {
    super({ objectMode: true });
  }

  async _transform(transaction: MongoBound<ITrxTransaction>, _, done) {
    let sending = this.walletAddresses.includes(transaction.from);
    if (sending) {
      let sendingToOurself = this.walletAddresses.includes(transaction.to);
      if (!sendingToOurself) {
        this.push(
          JSON.stringify({
            id: transaction._id,
            txid: transaction.txid,
            fee: transaction.fee,
            category: 'send',
            satoshis: -transaction.value,
            height: transaction.blockHeight,
            from: transaction.from,
            address: transaction.to,
            blockTime: transaction.blockTimeNormalized,
            type: transaction.type,
            status: transaction.status,
            assetName: transaction.assetName
          }) + '\n'
        );
      } else {
        this.push(
          JSON.stringify({
            id: transaction._id,
            txid: transaction.txid,
            fee: transaction.fee,
            category: 'move',
            satoshis: transaction.value,
            height: transaction.blockHeight,
            from: transaction.from,
            address: transaction.to,
            blockTime: transaction.blockTimeNormalized,
            type: transaction.type,
            status: transaction.status,
            assetName: transaction.assetName
          }) + '\n'
        );
      }
    } else {
      const weReceived = this.walletAddresses.includes(transaction.to);
      if (weReceived) {
        this.push(
          JSON.stringify({
            id: transaction._id,
            txid: transaction.txid,
            fee: transaction.fee,
            category: 'receive',
            satoshis: transaction.value,
            height: transaction.blockHeight,
            from: transaction.from,
            address: transaction.to,
            blockTime: transaction.blockTimeNormalized,
            type: transaction.type,
            status: transaction.status,
            assetName: transaction.assetName
          }) + '\n'
        );
      }
    }
    return done();
  }
}
