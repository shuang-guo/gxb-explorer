import express from 'express';
import GXChainService from '../services/GXChainService'
import LevelDBService from '../services/LevelDBService'
import jdenticon from 'jdenticon'
import crypto from 'crypto'

let router = express.Router();

/**
 * 供应查询
 */

router.get('/supply',function (req,res) {
  GXChainService.gxs_supply().then(function (gxs) {
    res.send({
      total_supply:gxs.current_supply/100000,
      circulating_supply:40510000
    })
  })
});

/**
 * 区块查询
 */
router.get('/block/:block_height', function (req, res) {
    GXChainService.fetch_block(req.params.block_height).then((block)=> {
        res.send(block)
    }).catch(ex=> {
        res.send({});
    })
})

/**
 * 交易记录查询
 */
router.get('/transaction/:tx_id', function (req, res) {
    LevelDBService.get(req.params.tx_id.toLowerCase()).then((transaction)=> {
        res.send(JSON.parse(transaction));
    }).catch(ex=> {
        res.send({});
    })
})

/**
 * 账户查询
 */
router.get('/account/:account_id_or_name', function (req, res) {
    GXChainService.fetch_account(req.params.account_id_or_name).then((account)=> {
        res.send(account.toJS());
    }).catch(ex=>{
        res.send({});
    })
})

/**
 * 账户余额查询
 */
router.get('/account_balance/:account_id_or_name', function (req, res) {
    GXChainService.fetch_account_balance(req.params.account_id_or_name).then((balances)=> {
        res.send(balances);
    }).catch(ex=>{
        res.send({});
    })
})

router.get('/header/:account_name',function (req,res) {
  var hash = crypto.createHash('sha256').update(req.params.account_name, 'utf8').digest('hex');
  let png = jdenticon.toPng(hash, 80);
  res.set('content-type','image/png');
  res.write(png);
  res.end();
})

module.exports = router;
