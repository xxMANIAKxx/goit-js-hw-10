import './css/styles.css';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import { fetchCountries } from './js/fetchCountries';

const formInput = document.querySelector('input');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

const DEBOUNCE_DELAY = 300;

//event listener
formInput.addEventListener(
  'input',
  debounce(onSearchedCountry, DEBOUNCE_DELAY)
);

//functions

function clearAtrributes() {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
}

function onSearchedCountry(event) {
  const countryToFind = event.target.value.trim();
  if (!countryToFind) {
    clearAtrributes();
    return;
  }

  fetchCountries(countryToFind)
    .then(country => {
      if (country.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        clearAtrributes();
        return;
      } else if (country.length === 1) {
        clearAtrributes(countryList.innerHTML);
        renderCountryInfo(country);
      } else if (country.length >= 2 && country.length <= 10) {
        clearAtrributes(countryInfo.innerHTML);
        renderCountryList(country);
      }
    })

    .catch(error => {
      Notiflix.Notify.failure('Oops, there is no country with that name');
      clearAtrributes();
      return error;
    });
}

//rendering
function renderCountryList(country) {
  const markup = country
    .map(({ name, flags }) => {
      return `<li><img src="${flags.svg}" alt="${name.official}" width="100" height="60">${name.official}</li>`;
    })
    .join('');
  countryList.innerHTML = markup;
}

function renderCountryInfo(country) {
  const markupInfo = country
    .map(({ name, capital, population, flags, languages }) => {
      return `<h1><img src="${flags.svg}" alt="${
        name.official
      }" width="100" height="60">${name.official}</h1>
      <p><span>Capital: </span>${capital}</p>
      <p><span>Population:</span> ${population}</p>
      <p><span>Languages:</span> ${Object.values(languages)}</p>`;
    })
    .join('');
  countryInfo.innerHTML = markupInfo;
}
