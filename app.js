import { difference, feetToInches, fetchDinos, getImageSource, hide, inchesToFeet } from './utils.js';

const dinoCompareForm = document.querySelector('#dino-compare');
const gridContainer = document.querySelector('#grid');
const compareBtn = dinoCompareForm.querySelector('#btn');
const nameInput = dinoCompareForm.querySelector('#name');

function Dino({ species, src, fact, diet, height, weight }) {
  const facts = [fact];

  const compareDiet = human => {
    const dietFact = diet === human.diet
      ? `The ${species} and the ${human.species} are both ${diet}s.`
      : `The ${species} is a ${diet} animal, unlike ${human.species} that is a ${human.diet}.`;
    facts.push(dietFact);
  };

  const compareWeight = human => {
    const weightDiff = difference(weight, human.weight);
    const weightFact = `The ${species} weighs ${weight} pounds and is ${weightDiff} pounds ${weight > human.weight ? 'heavier' : 'lighter'} than ${human.species}.`;
    facts.push(weightFact);
  };

  const compareHeight = human => {
    const { feet = 0, inches = 0, species: humanSpecies = 'Human' } = human;
    const measure = inches ? `${inches} (${inchesToFeet(inches)} feet)` : `${feetToInches(feet)} (${feet} feet)`;
    const heightFact = `The ${species} is ${height} inches (${inchesToFeet(height)} feet) tall whereas ${humanSpecies} is ${measure}.`;
    facts.push(heightFact);
  }

  const getRandomFact = () => facts[Math.floor(Math.random() * facts.length)];

  return {
    species,
    src,
    fact,
    diet,
    compareDiet,
    compareHeight,
    compareWeight,
    getRandomFact,
  };
}

const getHumanData = () => {
  return (function () {
    const [name, feet, inches, weight] = dinoCompareForm.querySelectorAll('input');
    const diet = dinoCompareForm.querySelector('#diet');

    return {
      species: name.value,
      feet: feet.value,
      inches: inches.value,
      weight: weight.value,
      diet: diet.value.toLowerCase(),
    };
  })();
}

const renderTiles = ({ species, src, fact }) => {
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
}

const formatDinoTile = ({ species, fact, getRandomFact }, index) => {
  let specialFact;
  if (species === 'Pigeon') {
    specialFact = fact;
  } else if (index === 4) {
    specialFact = null;
  } else {
    specialFact = getRandomFact();
  }

  return { species, src: getImageSource(species, index), fact: specialFact }
}

const handleClick = async () => {
  const { Dinos: dinos } = await fetchDinos();
  const human = getHumanData();

  hide(dinoCompareForm);

  dinos.splice(4, 0, human);

  dinos.forEach(({ species, fact, diet, height, weight }, index) => {
    const dino = Dino({ species, fact, diet, height, weight });

    dino.compareWeight(human);
    dino.compareDiet(human);
    dino.compareHeight(human);

    renderTiles(formatDinoTile(dino, index));
  });
}

compareBtn.addEventListener('click', handleClick);
