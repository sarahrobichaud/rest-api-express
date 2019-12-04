const fs = require('fs');
const uuid_v1 = require('uuid/v1');
const colors = require('colors');

const options = {
  number: 6,
  size: 52,
  suits: ['heart', 'diamond', 'club', 'spade'],
  names: [
    { value: 1, name: 'A' },
    { value: 11, name: 'J' },
    { value: 12, name: 'Q' },
    { value: 13, name: 'K' }
  ]
};

let set;
const genCards = options => {
  //Deconstruction
  const { size, number, suits, names } = options;
  set = [];
  if (size % suits.length !== 0) {
    console.log('Options not valid');
    return;
  }
  console.log(`Card number`);
  console.log(
    `Generating deck with options: ${JSON.stringify(options, null, 2)}`
  );

  for (let n = 1; n <= number; n++) {
    for (let i = 1; i <= size / suits.length; i++) {
      //Suits
      for (let j = 1; j <= suits.length; j++) {
        let card = {};
        card.id = uuid_v1();
        card.value = i;
        card.suit = suits[j - 1];
        card.name = i;

        // Renaming
        names.forEach(item => {
          if (item.value === card.value) {
            card.name = item.name;
          }
        });

        set.push(card);
      }
    }
  }
};

genCards(options);
console.log('Total cards: ', set.length);
fs.writeFileSync(`../data/set.json`, JSON.stringify(set));
// console.log(JSON.stringify(deck, null, 2));
