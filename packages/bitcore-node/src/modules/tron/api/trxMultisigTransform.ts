import { Transform } from 'stream';
import Web3 from 'tronweb';
import { MongoBound } from '../../../models/base';
import { ITrxTransaction } from '../types';

export class TrxMultisigRelatedFilterTransform extends Transform {
  constructor(private web3: Web3, private multisigContractAddress: string, private tokenAddress: string) {
    super({ objectMode: true });
  }

  async _transform(tx: MongoBound<ITrxTransaction>, _, done) {
    if (tx.internal && tx.internal.length > 0 && !this.tokenAddress) {
      const walletRelatedIncomingInternalTxs = tx.internal.filter(
        (internalTx: any) => this.multisigContractAddress === this.web3.isAddress(internalTx.transferTo_address)
      );
      const walletRelatedOutgoingInternalTxs = tx.internal.filter(
        (internalTx: any) => this.multisigContractAddress === this.web3.isAddress(internalTx.caller_address)
      );
      walletRelatedIncomingInternalTxs.forEach(internalTx => {
        const _tx = Object.assign({}, tx);
        _tx.value = Number(internalTx.callValueInfo[0].callValue);
        _tx.to = this.web3.isAddress(internalTx.transferTo_address);
        if (internalTx.caller_address) _tx.from = this.web3.isAddress(internalTx.caller_address);
        this.push(_tx);
      });
      walletRelatedOutgoingInternalTxs.forEach(internalTx => {
        const _tx = Object.assign({}, tx);
        _tx.value = Number(internalTx.callValueInfo[0].callValue);
        _tx.to = this.web3.isAddress(internalTx.transferTo_address);
        if (internalTx.caller_address) _tx.from = this.web3.utils.toChecksumAddress(internalTx.caller_address);
        this.push(_tx);
      });
      if (walletRelatedIncomingInternalTxs.length || walletRelatedOutgoingInternalTxs.length) return done();
    } else if (
      tx.abiType &&
      tx.abiType.type === 'ERC20' &&
      tx.abiType.name === 'transfer' &&
      this.tokenAddress &&
      tx.to.toLowerCase() === this.tokenAddress.toLowerCase()
    ) {
      tx.value = tx.abiType!.params[1].value as any;
      tx.to = this.web3.isAddress(tx.abiType!.params[0].value);
    } else if (tx.to !== this.multisigContractAddress || (tx.to === this.multisigContractAddress && tx.abiType)) {
      return done();
    }
    this.push(tx);
    return done();
  }
}
