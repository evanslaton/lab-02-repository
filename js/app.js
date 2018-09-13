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

// Creates Handlebars template
HornedAnimals.prototype.render = function() {
  const $source = $('#horns-template').html();
  const compileSource = Handlebars.compile($source);
  return compileSource(this);
};

// Gets JSON, passes it through HornedAnimals and pushes new instances into allHornedAnimals array
HornedAnimals.readJSON = (json) => {
  $.get(json)
    .then((data) => {
      data.forEach((hornedAnimal) => {
        HornedAnimals.allHornedAnimals.push(new HornedAnimals(hornedAnimal));
      })
    }, 'json')
    .then(HornedAnimals.loadHornedAnimals)
    .then(addOptionsToSelect)
}

// Loops through allHornedAnimals and calls the render method immediately after JSON is loaded
HornedAnimals.loadHornedAnimals = () => {
  HornedAnimals.allHornedAnimals.forEach((hornedAnimals) => $('main').append(hornedAnimals.render()));
}

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

// Adds the options to the select element
const addOptionsToSelect = () => {
  const optionsToAdd = getUniqueOptions();

  optionsToAdd.forEach((hornedAnimal) => {
    $('select').append(`<option value="${hornedAnimal}">${hornedAnimal}</option>`);
  })
}

// Loads JSON data on page load
$(() => HornedAnimals.readJSON('data/page-1.json'));

// Gets the value of the select input
const getValueOfSelect = () => $('select').val();

// Renders instances
const renderUserSelection = () => {
  $('main').html('');
  const userSelection = getValueOfSelect();
  const userInput = getWhatUserWantsToFilterBy();

  $('option:not(:first-child)').remove();
  addOptionsToSelect();

  if (userInput === 'title') {
    HornedAnimals.allHornedAnimals.forEach((hornedAnimals) => {
      if (hornedAnimals.keyword === userSelection) {
        $('main').append(hornedAnimals.render());
      }
    })
  } else if (userInput === 'number-of-horns') {
    HornedAnimals.allHornedAnimals.forEach((hornedAnimals) => {
      if (hornedAnimals.horns === parseInt(userSelection)) {
        $('main').append(hornedAnimals.render());
      }
    })
  }
}

// Gets user input from filter-by radio buttons
const getWhatUserWantsToFilterBy = () => {
  const radioButtonValue = $('input[name="filter-by"]:checked').val();
  return radioButtonValue;
};

// Event listener for sort by
$('#viewing-options').on('change', (event) => {
  const userInputValue = $(event.target).val();
  if (userInputValue) {
    renderUserSelection();
  }
})

// Event listener for page options
$('#page-options').on('change', (event) => {
  const userInputValue = $(event.target).val();
  if (userInputValue) {
    HornedAnimals.allHornedAnimals = [];

    if (userInputValue === 'page-1') {
      HornedAnimals.readJSON('data/page-1.json');
    } else if (userInputValue === 'page-2') {
      HornedAnimals.readJSON('data/page-2.json');
    }
    renderUserSelection();
  }
})

$('main').on('click', (event) => {
  const userInputValue = $(event.target).parent();
  const image = userInputValue.find($('img')).attr('src');
  const paragraph = userInputValue.find($('p')).text();
  $('#detail-view').addClass('detail-view');
  $('#detail-view').append(`<div id="style-div"></div>`);
  $('#style-div').append(`<img src="${image}" alt="" />`);
  $('#style-div').append(`<p>${paragraph}</p>`);
})

$('#detail-view').on('click', (event) => {
  $('#detail-view').html('');
  $('#detail-view').removeClass();
})