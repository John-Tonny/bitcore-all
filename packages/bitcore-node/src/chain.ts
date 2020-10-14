module.exports = {
  BTC: {
    lib: require('bitcore-lib'),
    p2p: require('bitcore-p2p')
  },
  BCH: {
    lib: require('bitcore-lib-cash'),
    p2p: require('bitcore-p2p-cash')
  },
  // john
  VCL: {
    lib: require('vircle-lib'),
    p2p: require('vircle-p2p')
  }  
};
