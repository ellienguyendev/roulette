module.exports = function(app, passport, db) {

// normal routes ===============================================================

// show the home page (will also have our login links)
app.get('/', function(req, res) {
  db.collection('casino').find().toArray((err, result) => {
    if (err) return console.log(err)
    res.render('index.ejs', {
      casino: result
    })
  })
});


// PROFILE SECTION =========================
app.get('/profile', isLoggedIn, function(req, res) {
  db.collection('casino').find().toArray((err, result) => {
    if (err) return console.log(err)
    res.render('profile.ejs', {
      user: req.user,
      casino: result
    })
  })
});

// LOGOUT ==============================
app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

// message board routes
app.get('/updateBank', isLoggedIn, function(req, res) {
  db.collection('casino').find().toArray((err, result) => {
    if (err) return console.log(err)
    res.render('index.ejs', {
      user: req.user,
      casino: result
    })
  })
});


app.put('/updateBank', (req, res) => {
  console.log("money: ", req.body.totalMoney);
  db.collection('casino')
    .update({
      totalMoney: req.body.totalMoney
    }, {
      // $set: {
        totalMoney: req.body.totalMoney,
        userWin: req.body.userWin,
        userLose: req.body.userLose
      // }
    },
    // {
    //   sort: {
    //     _id: -1
    //   },
      {upsert: true},
     (err, result) => {
      if (err) return res.send(err)
      //console.log();
      res.send(result)
    })
    // res.redirect('/');
})



// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

// locally --------------------------------
// LOGIN ===============================
// show the login form
app.get('/login', function(req, res) {
  res.render('login.ejs', {
    message: req.flash('loginMessage')
  });
});

// process the login form
app.post('/login', passport.authenticate('local-login', {
  successRedirect: '/profile', // redirect to the secure profile section
  failureRedirect: '/login', // redirect back to the signup page if there is an error
  failureFlash: true // allow flash roulette
}));

// SIGNUP =================================
// show the signup form
app.get('/signup', function(req, res) {
  res.render('signup.ejs', {
    message: req.flash('signupMessage')
  });
});


// process the signup form
app.post('/signup', passport.authenticate('local-signup', {
  successRedirect: '/profile', // redirect to the secure profile section
  failureRedirect: '/signup', // redirect back to the signup page if there is an error
  failureFlash: true // allow flash roulette
}));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

// local -----------------------------------
app.get('/unlink/local', isLoggedIn, function(req, res) {
  var user = req.user;
  user.local.email = undefined;
  user.local.password = undefined;
  user.save(function(err) {
    res.redirect('/profile');
  });
});

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();

  res.redirect('/');
}
