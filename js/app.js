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
}

HornedAnimals.loadHornedAnimals = () => {
  console.log(HornedAnimals.allHornedAnimals);
  updateTemplate();
}

HornedAnimals.readJSON();

// create jQuery template
const $template = $('#photo-template').html();

// get JSON data, loop through data and add data to template
const updateTemplate = () => {
  HornedAnimals.allHornedAnimals.forEach((arrayInstance) => {
    $template.find('h2').text(arrayInstance.title);
    $template.find('img').attr('src', arrayInstance.img_url);
    $template.find('img').attr('alt', arrayInstance.title);
    $template.find('p').text(arrayInstance.description);
    render();
  })
}

const render = () => {
  $('main').append($template);
}
