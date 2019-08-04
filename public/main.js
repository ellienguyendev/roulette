function wheelSpin() {
  let result = Math.floor(Math.random() * 36)
  let arr = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36] // represents red numbers
  if (result === 0) { // Green
    document.querySelector('.wheelOutcome').innerHTML = 'Green ' + result
    return 'Green ' + result
  } else if (arr.includes(result)) { //Red
    document.querySelector('.wheelOutcome').innerHTML = 'Red ' + result
    return 'Red ' + result
  } else { //Black
    document.querySelector('.wheelOutcome').innerHTML = 'Black ' + result
    return 'Black ' + result
  }
}

var balance = parseFloat(document.querySelector('.casino').innerHTML)
var userWin = parseFloat(document.querySelector('.userWin').innerHTML)
var userLose = parseFloat(document.querySelector('.userLose').innerHTML)
//checks if Win or Lose
function winOrLose() {
  var userBet = parseFloat(document.getElementsByClassName('bet')[0].value)
  var userColor = document.querySelector('.color').value
  var userNum = document.querySelector('.num').value
  let ortegaResult = wheelSpin()
  let wheelColor = ortegaResult.split(' ')[0]
  let wheelNum = parseInt(ortegaResult.split(' ')[1])

  if (userColor === 'Red' && userNum === 'x' && userColor === wheelColor) {
    console.log("inside the Bet");
    balance = balance - userBet
    userWin += userBet
    document.getElementsByClassName('outcome')[0].innerHTML = 'win'
  } else if (userColor === 'Black' && userNum === 'x' && userColor === wheelColor) {
    balance = balance - userBet
    userWin += userBet
    document.getElementsByClassName('outcome')[0].innerHTML = 'win'
  } else if (userColor === 'Green' && userNum === 'x' && userColor === wheelColor) {
    balance = balance - userBet
    userWin += userBet
    document.getElementsByClassName('outcome')[0].innerHTML = 'win'
  } else if (userNum === wheelNum && userColor === 'x') {
    balance = balance - (userBet * 35)
    userWin += userBet * 35
    document.getElementsByClassName('outcome')[0].innerHTML = 'win'
  } else if (userColor !== 'x' && userNum !== 'x') {
    document.getElementsByClassName('outcome')[0].innerHTML = 'please enter only color or number'
  } else {
    balance = balance + userBet
    userLose += userBet
    document.getElementsByClassName('outcome')[0].innerHTML = 'lose'
  }

  document.querySelector('.casino').innerHTML = balance
  document.querySelector('.userWin').innerHTML = userWin
  document.querySelector('.userLose').innerHTML = userLose


  fetch('updateBank', {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        'userWin': userWin,
        'userLose': userLose,
        'totalMoney': balance
      })
    })
    .then(response => {
      if (response) return response
    })
    .then(data => {
      console.log(data)
      window.location.reload(true)
    })
    .catch(err => console.log("Unexpected Responce", err))
}
// fetch('updateBank', {
//     method: 'put',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({
//       'userWin': userWin,
//       'userLose': userLose,
//       'totalMoney': balance
//     })
//   })
//   .then(response => response.json())
//   .then(response => {
//     console.log(response)
//     window.location.reload(true)
//   }).catch(err => console.log("Unexpected Responce", err))
// }
var runGame = document.querySelector(".playGame")
runGame.addEventListener('click', function() {
  winOrLose()
})
