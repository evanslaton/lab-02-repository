'use strict';

// Constructor function
function HornedAnimals(hornedAnimals) {
  this.image_url = hornedAnimals.image_url;
  this.title = hornedAnimals.title;
  this.description = hornedAnimals.description;
  this.keyword = hornedAnimals.keyword;
  this.horns = hornedAnimals.horns;
}

// Array that holds instances of HornedAnimals
HornedAnimals.allHornedAnimals = [];

// Gets JSON, passes it through HornedAnimals and pushes new instances into allHornedAnimals array
HornedAnimals.readJSON = () => {
  $.get('data/page-1.json')
    .then((data) => {
      data.forEach((hornedAnimal) => {
        HornedAnimals.allHornedAnimals.push(new HornedAnimals(hornedAnimal));
      })
    }, 'json')
    .then(HornedAnimals.loadHornedAnimals)
    .then(addOptionsToSelect)
}

// Loops through allHornedAnimals and calls the render method
HornedAnimals.loadHornedAnimals = () => {
  HornedAnimals.allHornedAnimals.forEach((hornedAnimals) => hornedAnimals.render())
}

// Renders to screen
HornedAnimals.prototype.render = function() {
  $('main').append('<section class="clone"></section>');
  const $hornedAnimalClone = $('section[class="clone"]');

  // Creates jQuery template
  const $template = $('#photo-template').html();

  // Set HTML of hornedAnimalClone
  $hornedAnimalClone.html($template);

  // Adds content to the cloned template
  $hornedAnimalClone.find('h2').text(this.title);
  $hornedAnimalClone.find('img').attr('src', this.image_url);
  $hornedAnimalClone.find('img').attr('alt', this.title);
  $hornedAnimalClone.find('p').text(this.description);
  $hornedAnimalClone.removeClass('clone');
  $hornedAnimalClone.addClass(this.keyword);
};

// Creates an array of unique keywords
const getUniqueOptions = () => {
  const optionsToBeAdded = [];
  const userInput = getWhatUserWantsToFilterBy();
  const IS_NOT_IN_ARRAY = -1;

  if (userInput === 'title') {
    HornedAnimals.allHornedAnimals.forEach((hornedAnimals) => {
      if (optionsToBeAdded.indexOf(hornedAnimals.keyword) === IS_NOT_IN_ARRAY) {
        optionsToBeAdded.push(hornedAnimals.keyword);
      }
    })
  } else if (userInput === 'number-of-horns') {
    HornedAnimals.allHornedAnimals.forEach((hornedAnimals) => {
      if (optionsToBeAdded.indexOf(hornedAnimals.horns) === IS_NOT_IN_ARRAY) {
        optionsToBeAdded.push(hornedAnimals.horns);
      }
    })
  }

  return optionsToBeAdded;
}

// Add the options to the select element
const addOptionsToSelect = () => {
  const optionsToAdd = getUniqueOptions();

  optionsToAdd.forEach((hornedAnimal) => {
    $('select').append(`<option value="${hornedAnimal}">${hornedAnimal}</option>`);
  })
}

$(() => HornedAnimals.readJSON());

const getValueOfSelect = () => $('select').val();

const deleteAllClones = () => {
  $('section:not(:first-child)').remove();
}

const renderUserSelection = () => {
  const userSelection = getValueOfSelect();
  const userInput = getWhatUserWantsToFilterBy();

  $('option:not(:first-child)').remove();
  addOptionsToSelect();

  if (userInput === 'title') {
    HornedAnimals.allHornedAnimals.forEach((hornedAnimals) => {
      if (hornedAnimals.keyword === userSelection) {
        hornedAnimals.render();
      }
    })
  } else if (userInput === 'number-of-horns') {
    HornedAnimals.allHornedAnimals.forEach((hornedAnimals) => {
      if (hornedAnimals.horns === parseInt(userSelection)) {
        hornedAnimals.render();
      }
    })
  }
}

const getWhatUserWantsToFilterBy = () => {
  const radioButtonValue = $('input[name="filter-by"]:checked').val();
  return radioButtonValue;
};

$('#viewing-options').on('change', (event) => {
  const userInputValue = $(event.target).val();
  if (userInputValue) {
    deleteAllClones();
    renderUserSelection();
  }
})
