const express = require("express");
const router = express.Router();

const pool = require('../database');
const {isLoggedIn} = require('../lib/auth');

router.get("/", (req, res) => {
  res.redirect("/profile");
});



router.get('/debit', isLoggedIn,  async (req,res) => {
  const {id } = req.user;
  const userInfo= await pool.query('SELECT * FROM users WHERE id = ?', [id])
  res.render('./links/debit', {userInfo: userInfo[0]});
})

router.get('/credit', isLoggedIn,  async (req,res) => {
  const {id } = req.user;
  const userInfo= await pool.query('SELECT * FROM users WHERE id = ?', [id])
  res.render('./links/credit', {userInfo: userInfo[0]});
})

router.get('/payCredit', isLoggedIn,  async (req,res) => {
  const {id } = req.user;
  const userInfo= await pool.query('SELECT * FROM users WHERE id = ?', [id])
  res.render('./links/payCredit', {userInfo: userInfo[0]});
})

router.post('/withdrawDebit', isLoggedIn,  async (req,res) => {
  const {id} = req.user;
  const debit = await pool.query('SELECT debit FROM users WHERE id = ?', [id]);
  const newDebit = parseFloat(debit[0].debit) - parseFloat(req.body.debit);
  if(newDebit>=0){
    await pool.query('UPDATE users set debit = ? WHERE id = ?', [newDebit, id]);
    req.flash('success', 'Debit withdraw successfully')
  }else{
    req.flash('message', 'Not enough founds in debit card');
  }

  res.redirect('/profile');
})

router.post('/depositDebit', isLoggedIn,  async (req,res) => {
  const {id} = req.user;
  const debit = await pool.query('SELECT debit FROM users WHERE id = ?', [id]);
  const newDebit = parseFloat(debit[0].debit) + parseFloat(req.body.debit);
  await pool.query('UPDATE users set debit = ? WHERE id = ?', [newDebit, id]);
  req.flash('success', 'Debit deposited successfully')
  res.redirect('/profile');
})

router.post('/withdrawCredit', isLoggedIn,  async (req,res) => {
  const {id} = req.user;
  const credit = await pool.query('SELECT credit FROM users WHERE id = ?', [id]);
  const debt = (parseFloat(req.body.credit) * 1.05);
  const newCredit = parseFloat(credit[0].credit) - debt;
  console.log(debt);

  if(newCredit>=0){
    await pool.query('UPDATE users set credit_debt = ? WHERE id = ?', [debt, id]);
    await pool.query('UPDATE users set credit = ? WHERE id = ?', [newCredit, id]);
    req.flash('success', 'Debit withdraw successfully')
  }else{
    req.flash('message', 'Not enough founds in credit card');
  }

  res.redirect('/profile');
})

router.post('/payCredit', isLoggedIn,  async (req,res) => {
  const {id} = req.user;
  const creditDebt = await pool.query('SELECT credit_debt FROM users WHERE id = ?', [id]);
  const creditPaid = parseFloat(req.body.creditPaid);
  const newCreditDebt = parseFloat(creditDebt[0].credit_debt) - creditPaid;

  if(newCreditDebt>=0){
    await pool.query('UPDATE users set credit_debt = ? WHERE id = ?', [newCreditDebt, id]);
    req.flash('success', 'Debit withdraw successfully')
  }else{
    req.flash('message', 'Select an amount less than your debt');
  }

  res.redirect('/profile');
})
  

module.exports = router;