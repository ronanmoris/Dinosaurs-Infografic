export const fetchDinos = async () => {
  const response = await fetch("./dino.json");
  return response.json();
}

export const getImageSource = (species, index) => {
  const name = index === 4 ? 'human' : species.toLowerCase();
  return `./images/${name}.png`
}

export const difference = (a, b) => Math.abs(a - b);

export const hide = (element) => element.classList.add('hidden');

export const inchesToFeet = inches => (inches * 0.083333).toFixed(2);
export const feetToInches = feet => feet * 12;