import {difference, feetToInches, fetchDinos, getImageSource, hide, inchesToFeet} from './utils.js';

const dinoCompareForm = document.querySelector('#dino-compare');
const gridContainer = document.querySelector('#grid');
const compareBtn = dinoCompareForm.querySelector('#btn');

// Dino class
class Dino {
  constructor(species, fact, diet, height, weight, src) {
    this.facts = [fact];
    this.species = species;
    this.diet = diet;
    this.height = height;
    this.weight = weight;
    this.fact = fact;
    this.src = src;
  }
  compareDiet(human) {
    const dietFact =
      this.diet === human.diet
        ? `The ${this.species} and the ${human.name} are both ${this.diet}s.`
        : `The ${this.species} is a ${this.diet} animal, unlike ${human.name} that is a(n) ${human.diet}.`;
    this.facts.push(dietFact);
  }
  compareWeight(human) {
    const weightDiff = difference(this.weight, human.weight);
    const weightFact = `The ${this.species} weighs ${this.weight} pounds and is ${weightDiff} pounds ${
      this.weight > human.weight ? 'heavier' : 'lighter'
    } than ${human.name}.`;
    this.facts.push(weightFact);
  }
  compareHeight(human) {
    const {feet = 0, inches = 0, name} = human;
    const measure = inches ? `${inches} (${inchesToFeet(inches)} feet)` : `${feetToInches(feet)} (${feet} feet)`;
    const heightFact = `The ${this.species} is ${this.height} inches (${inchesToFeet(
      this.height,
    )} feet) tall whereas ${name} is ${measure}.`;
    this.facts.push(heightFact);
  }
  // Dino always renders a random fact
  generateRandomFact() {
    return this.facts[Math.floor(Math.random() * this.facts.length)];
  }
}

// Human class doesn't have a fact(super's second argument)
class Human extends Dino {
  constructor(name, diet, feet, inches, weight, src) {
    super(name, null, diet, inches, weight, src);
  }
}

// Retrieves data from form
const getHumanData = () => {
  return (function () {
    const [name, feet, inches, weight] = dinoCompareForm.querySelectorAll('input');
    const diet = dinoCompareForm.querySelector('#diet');

    return {
      name: name.value,
      species: 'Human',
      feet: feet.value,
      inches: inches.value,
      weight: weight.value,
      diet: diet.value.toLowerCase(),
    };
  })();
};

// Creates and appends the elements to the dom
const renderTiles = ({species, src, fact}) => {
  const tileContainer = document.createElement('div');
  tileContainer.setAttribute('class', 'grid-item');

  const title = document.createElement('h3');
  title.textContent = species;

  const characterImage = document.createElement('img');
  characterImage.setAttribute('src', src);

  const factParagraph = document.createElement('p');
  factParagraph.textContent = fact;

  tileContainer.append(title, characterImage, factParagraph);
  gridContainer.appendChild(tileContainer);
};

// It hides the form and handles the infografic rendering
const handleClick = async () => {
  const {Dinos: creatures} = await fetchDinos();
  const human = getHumanData();

  hide(dinoCompareForm);

  creatures.splice(4, 0, human);

  creatures.forEach(({species, name, fact, diet, height, feet, inches, weight}, index) => {
    let tile;
    const src = getImageSource(species, index);

    if (species === 'Human') {
      tile = new Human(name, diet, feet, inches, weight, src);
    } else if (species === 'Pigeon') {
      tile = new Dino(species, fact, diet, height, weight, src);
    } else {
      const dino = new Dino(species, fact, diet, height, weight, src);
      dino.compareDiet(human);
      dino.compareHeight(human);
      dino.compareWeight(human);
      dino.fact = dino.generateRandomFact();
      tile = dino;
    }
    renderTiles(tile);
  });
};

compareBtn.addEventListener('click', handleClick);
