'use strict';

const get = require('lodash/fp/get');
const invariant = require('fbjs/lib/invariant');
const TransactionResult = require('../TransactionResult');
const BN = require('bignumber.js');
const toHex = require('../utils/to-hex');

const getBalance = get('c[0]');
const GAS_LIMIT_DEFAULT = 100000;
const GAS_PRICE_MAX = new BN(100000000000);

class Account {
  constructor({ gethClient, address0x, contracts, limitGasPrice = GAS_PRICE_MAX, throwGasPriceError = false }) {

    invariant(gethClient, 'gethClient is not defined');
    invariant(contracts.token && contracts.token.constructor.name === "TruffleContract", 'Token contract is not valid');
    invariant(address0x, 'address is not defined');
    invariant(address0x.startsWith('0x'), 'address should starts with 0x');

    this.throwGasPriceError = throwGasPriceError;
    this.limitGasPrice = new BN(limitGasPrice);
    this.geth = gethClient;
    this.contracts = contracts;
    this.address = address0x;
  }

  async getBalance() {
    const result = await this.geth.method('getBalance')(this.getAddress());

    return result
      ? String(result)
      : result;
  }

  async getTokenBalance() {
    const result = await this.contracts.token.balanceOf(this.address);

    return getBalance(result);
  }

  getAddress() {
    return this.address;
  }

  getGasLimit() {
    return GAS_LIMIT_DEFAULT;
  }

  async getGasPrice() {
    let result = await this.geth.method('getGasPrice')();

    if (result.gt(this.limitGasPrice)) {
      if (this.throwGasPriceError) {
        throw new Error('Too much gas price ' + result.toFormat());
      }
      result = GAS_PRICE_MAX;
    }

    return result;
  }

  async sendTokens(to, amount) {
    const qty = toHex(amount);
    const gasLimit = toHex(await this.getGasLimit());
    const gasPrice = toHex(await this.getGasPrice());

    const resultPromise =  this.contracts.token.transfer(
      this.normalizeTarget(to),
      qty,
      {
        from: this.getAddress(),
        gasLimit,
        gasPrice,
      }
    );

    return new TransactionResult(resultPromise, this.geth);
  }

  async sendEther(to, amount) {
    const gasLimit = toHex(await this.getGasLimit());
    const gasPrice = toHex(await this.getGasPrice());
    const value = toHex(amount);

    const tx = {
      from: this.getAddress(),
      gasLimit,
      gasPrice,
      value,
      to: this.normalizeTarget(to),
    };

    return this.geth.sendTransaction(tx);
  }

  normalizeTarget(to) {
    return to instanceof Account
      ? to.address
      : to; 
  }
}

module.exports = Account;