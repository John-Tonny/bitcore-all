import { IValidation } from '..';
const tronWeb = require('tronweb');

export class TrxValidation implements IValidation {
  validateAddress(_network: string, address: string): boolean {
    return tronWeb.isAddress(address);
  }

  validateUri(addressUri: string): boolean {
    if (!addressUri) {
      return false;
    }
    const address = this.extractAddress(addressUri);
    const tronixPrefix = /tronix/i.exec(addressUri);
    return !!tronixPrefix && tronWeb.isAddress(address);
  }

  private extractAddress(data) {
    const prefix = /^[a-z]+:/i;
    const params = /([\?\&](value|gas|gasPrice|gasLimit)=(\d+([\,\.]\d+)?))+/i;
    return data.replace(prefix, '').replace(params, '');
  }
}
