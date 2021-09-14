import { Transform } from 'stream';
import Web3 from 'tronweb';
import { MongoBound } from '../../../models/base';
import { IWalletAddress, WalletAddressStorage } from '../../../models/walletAddress';
import { ITrxTransaction } from '../types';

export class InternalTxRelatedFilterTransform extends Transform {
  private walletAddresses: IWalletAddress[] = [];
  constructor(private web3: Web3, private walletId) {
    super({ objectMode: true });
    this.web3;
  }

  async _transform(tx: MongoBound<ITrxTransaction>, _, done) {
    if (tx.internal && tx.internal.length > 0) {
      const walletAddresses = await this.getWalletAddresses(tx);
      const walletAddressesArray = walletAddresses.map(walletAddress => this.web3.address.toHex(walletAddress.address));
      const walletRelatedIncomingInternalTxs = tx.internal.filter((internalTx: any) =>
          walletAddressesArray.includes(internalTx.caller_address)
      );
      const walletRelatedOutgoingInternalTxs = tx.internal.filter((internalTx: any) =>
          walletAddressesArray.includes(internalTx.transferTo_address)
      );
      const _tx = Object.assign({}, tx);
      for (const internalTx of walletRelatedIncomingInternalTxs){
        _tx.value = 0;
        if ( internalTx.callValueInfo && internalTx.callValueInfo.length > 0){
          for ( const valueInfo of internalTx.callValueInfo) {
            if(!valueInfo.callValue){
              continue;
            }
              _tx.value = Number(internalTx.callValueInfo[0].callValue);
            if (valueInfo.tokenId) {
              _tx.assetName = valueInfo.tokenId;
            }
          }
        }

        _tx.to = internalTx.transferTo_address;
        _tx.from = internalTx.caller_address;
        _tx.status = internalTx.rejected || false;
        this.push(_tx);
      };
      for (const internalTx of walletRelatedOutgoingInternalTxs){
        _tx.value = 0;
        if ( internalTx.callValueInfo && internalTx.callValueInfo.length > 0){
          for ( const valueInfo of internalTx.callValueInfo) {
            if(!valueInfo.callValue){
              continue;
            }
            _tx.value = Number(internalTx.callValueInfo[0].callValue);
            if (valueInfo.tokenId) {
              _tx.assetName = valueInfo.tokenId;
            }
          }
        }

        _tx.to = internalTx.transferTo_address;
        _tx.from = internalTx.caller_address;
        _tx.status = internalTx.rejected || false;
        this.push(_tx);
      };
      if (walletRelatedIncomingInternalTxs.length || walletRelatedOutgoingInternalTxs.length) return done();
    }
    this.push(tx);
    return done();
  }

  async getWalletAddresses(tx) {
    if (!this.walletAddresses.length) {
      this.walletAddresses = await WalletAddressStorage.collection
        .find({ chain: tx.chain, network: tx.network, wallet: this.walletId })
        .toArray();
    }
    return this.walletAddresses;
  }
}
