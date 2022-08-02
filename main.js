const getEl = (selector) => {
   return document.querySelector(selector);
};

const search = getEl('#search');
const shuffle = getEl('.btn-shuffle');
const searchElement = getEl('#meals');
const randomElement = getEl('#meal-random');
const searchText = getEl('.input-search');
const searchResults = getEl('#search-results');


search.addEventListener('submit', searchMeals);
shuffle.addEventListener('click', mealRandom);

// handle meal details
function mealDetails() {
   let mealElement = getEl('#meals');
   mealElement.addEventListener('click', e => {
      if (e.target.classList.value.includes('meal-name')) {
         let mealId = e.target.getAttribute('data-mealid');
         fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
            .then(response => response.json())
            .then(data => {
               let meal = data.meals[0];
               if (meal) {
                  searchResults.innerText = '';
                  searchElement.innerText = '';
                  randomElement.innerHTML = mealHTML(meal);
               } 
            });
      }
   });
}

// get meals by filter
function searchMeals(e) {
   e.preventDefault();
   let searchValue = searchText.value.trim();
   if (searchValue) {
      let url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchValue}`;
      randomElement.innerText = '';
      fetch(url)
         .then(response => response.json())
         .then(data => {
            let mealsArr = data.meals;
            if (mealsArr) {
               searchText.value = '';
               searchResults.innerText = `Search results for '${searchValue}':`;
               searchElement.innerHTML = mealItem(mealsArr);
               mealDetails();
            } else {
               searchResults.innerText = 'There are no search results. Try again!';
               searchElement.innerText = '';
            }
         });
   }
}

// get meal random
function mealRandom() {
   fetch('https://www.themealdb.com/api/json/v1/1/random.php')
      .then(response => response.json())
      .then(data => {
         let meal = data.meals[0];
         if (meal) {
            console.log(meal);
            searchResults.innerText = '';
            searchElement.innerText = '';
            randomElement.innerHTML = mealHTML(meal);
         } 
      });
}

// meal item html
const mealItem = (arr) => {
   let mealHTML = arr.map(meal => {
      return `
      <div class="meal">
         <img src="${meal.strMealThumb}" alt="">
         <div class="meal-name" data-mealid="${meal.idMeal}">
            ${meal.strMeal}
         </div>
      </div>
      `
   }).join('');
   return mealHTML;
}

// meal details html
const mealHTML = (meal) => {
   // get ingredient
   let arrIngredient = [];
   for (let i = 1; i < 30; i++) {
      var nameIngredient = meal[`strIngredient${i}`];
      if (nameIngredient) {
         arrIngredient.push(`${nameIngredient} - ${meal[`strMeasure${i}`]}`);
      } else { break; }
   }
   let ingredientHTML = arrIngredient.map(ingredient => {
      return `
         <li>${ingredient}</li>
      `;
   }).join('');

   return `
      <div class="meal-random">
         <h1 class="mt-0">${meal.strMeal}</h1>
         <img src="${meal.strMealThumb}" alt="">
         <div class="meal-category m-4 p-2">
            ${meal.strCategory ? `<span>${meal.strCategory}</span>` : ''}
            ${meal.strArea ? `<apan>${meal.strArea}</apan>` : ''}
         </div>
         <div class="meal-instructions m-4">
          <p>Heat 2 tsp of the oil in a large saucepan and cook the spring onions over a low heat for 3 minutes or until beginning to soften. Add the spinach, cover with a tight-fitting lid and cook for a further 2–3 minutes or until tender and wilted, stirring once or twice. Tip the mixture into a sieve or colander and leave to drain and cool. Using a saucer as a guide, cut out 24 rounds about 12.5 cm (5 in) in diameter from the filo pastry, cutting 6 rounds from each sheet. Stack the filo rounds in a pile, then cover with cling film to prevent them from drying out. When the spinach mixture is cool, squeeze out as much excess liquid as possible, then transfer to a bowl. Add the tuna, eggs, hot pepper sauce, and salt and pepper to taste. Mix well. Preheat the oven to 200°C (400°F, gas mark 6). Take one filo round and very lightly brush with some of the remaining oil. Top with a second round and brush with a little oil, then place a third round on top and brush with oil. Place a heaped tbsp of the filling in the middle of the round, then fold the pastry over to make a half-moon shape. Fold in the edges, twisting them to seal, and place on a non-stick baking sheet. Repeat with the remaining pastry and filling to make 8 briks in all. Lightly brush the briks with the remaining oil. Bake for 12–15 minutes or until the pastry is crisp and golden brown. Meanwhile, combine the tomatoes and cucumber in a bowl and sprinkle with the lemon juice and seasoning to taste. Serve the briks hot with this salad and the chutney.</p>
         </div>
         <div class="meal-ingredients m-4">
            <h2>Ingredients</h2>
            <ul>
               ${ingredientHTML}
            </ul>
         </div>
      </div>         
   `;
};