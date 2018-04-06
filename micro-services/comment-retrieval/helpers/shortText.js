let sentiment = require('sentiment');



let shortTextAnalyzer = (text) => {
  let analysis = sentiment(text);
  //console.log('raw analysis is ', analysis)
  let adjust = 0;
  let result = 0;
  let goodWords = analysis.positive;
  let badWords = analysis.negative;
  let allWords = analysis.words;

  //turn positive and negative into sets and use .has
  
  if (goodWords.length === badWords.length && allWords.length > 1 && badWords.includes(allWords[0])) {
  	adjust = -3 
  }
  else if (goodWords.length === badWords.length && allWords.length > 1 && goodWords.includes(allWords[0])) {
  	adjust += 3
  } 
  result = analysis.score + adjust;
  console.log('result is ', result)
  return result;  
}

let output = shortTextAnalyzer('nice job idiot');
console.log('output is ', output);


module.exports = shortTextAnalyzer