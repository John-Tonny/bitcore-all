import { Transform } from 'stream';
import { MongoBound } from '../../../models/base';
import { ITrxTransaction } from '../types';
import { TRX } from './csp';

export class PopulateReceiptTransform extends Transform {
  constructor() {
    super({ objectMode: true });
  }

  async _transform(tx: MongoBound<ITrxTransaction>, _, done) {
    try {
      tx = await TRX.populateReceipt(tx);
    } catch (e) {}
    this.push(tx);
    return done();
  }
}
