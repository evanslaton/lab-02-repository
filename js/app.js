'use strict';

// Constructor function
function HornedAnimals(hornedAnimals) {
  this.image_url = hornedAnimals.image_url;
  this.title = hornedAnimals.title;
  this.description = hornedAnimals.description;
  this.keyword = hornedAnimals.keyword;
  this.horns = hornedAnimals.horns;
}

// Passed JSON data into HornedAnimals
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
}

HornedAnimals.loadHornedAnimals = () => {
  console.log(HornedAnimals.allHornedAnimals);
}

HornedAnimals.readJSON();

// create jQuery template
const $template = $('main').html();

// get JSON data, loop through data and add data to template

