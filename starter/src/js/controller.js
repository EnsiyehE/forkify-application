
import * as model from  './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';

import addRecipeView from './views/addRecipeView.js';

//if(module.hot){
  //module.hot.accept();
//}

const recipeContainer = document.querySelector('.recipe');

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipes = async function (){

  try{
    // gives us the entire URL window.location
    const id = window.location.hash .slice(1);
    console.log(id)

    if(!id) return;

    recipeView.renderSpinner()

    // 0)) Update results view  to mark selected search result 

      resultsView.update(model.getSearchResultsPage())
      
         
      // 1)) Update bookmarks view  to mark selected search result 
      bookmarksView.update(model.state.bookmarks)
      
      // 2) Loading recipe 
      await model.loadRecipe(id);
      
      
      
      // 3) Rendering recipe 
      recipeView.render(model.state.recipe);
      
   
    }
    
    catch(err){
  //alert (err)
  recipeView.renderError()
}

}


const controlSearchResults = async function (){
  try{
     resultsView.renderSpinner();
    // 1)Get search Query 
    const query = searchView.getQuery();
    if(!query) return ;

    //2) Load Search
    await model.loadSearchResults(query)

    //3)) Render results 

   //console.log(model.state.search.results)
    //resultsView.render(model.state.search.results)
    resultsView.render(model.getSearchResultsPage())

    // 4) Render Initial Pagination Buttons
         paginationView.render(model.state.search)
   
  }

  catch(err){
    console.log(err);
  }
}

const controlPagination = function(goToPage){
   console.log(goToPage)
   //1)) Render  NEW results 
    resultsView.render(model.getSearchResultsPage(goToPage))

  // 4) Render New Pagination Buttons
     paginationView.render(model.state.search)
}


const controlServings = function(newServings){
  // Update the recipe servings (in state)
   model.updateServings(newServings)

  // Update the recipe view
  //recipeView.render(model.state.recipe);
  // update method does not render the entire view 
  recipeView.update(model.state.recipe);

}

const controlAddBookmark = function(){
  //1) Add / remove bookmark 
  if(!model.state.recipe.bookmarked)model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  //console.log(model.state.recipe);

  //2) Update recipe view 
  recipeView.update(model.state.recipe)

  //3) Render bookmarks
     bookmarksView.render(model.state.bookmarks)
}

const ControlBoookmarks = function (){
  bookmarksView.render(model.state.bookmarks)
}

const controlAddRecipe =async function(newRecipe){
  console.log(newRecipe)
  try{
  //Show Loading spinner
   addRecipeView.renderSpinner()

  //upload the new recipe data 
  await model.uploadRecipe(newRecipe)
   console.log(model.state.recipe)

   // Render recipe
   recipeView.render(model.state.recipe)

   //Render the success Message 
    addRecipeView.renderMessage();

    // Render bookmark view 
    bookmarksView.render(model.state.bookmarks)

    // Change ID in Url 
    // change the url whenever a new recipe we upload
    // first argument is state , second is title , third is the url 
    window.history.pushState(null , '' , `#${model.state.recipe.id}` )
    
    // automatically going back or forth with history api 

    // window.history.back()
    
   //Close the form window 
    setTimeout(function(){
      addRecipeView.toggleWindow()
    },MODAL_CLOSE_SEC*1000)
  }
  catch(err){
    console.error('💣' , err);
    addRecipeView.renderError(err.message)
  }
}



const init = function () {
bookmarksView.addHandlerRender(ControlBoookmarks)
 recipeView.addHandlerRender(controlRecipes)
 recipeView.addHandlerUpdateServings(controlServings)
 recipeView.addHandlerAddBookmark(controlAddBookmark)
 searchView.addHandlerSearch(controlSearchResults)
 paginationView.addHandlerClick(controlPagination)
 addRecipeView.addHandlerUpload(controlAddRecipe)


}

init();


const clearBookmarks = function (){
  localStorage.clear('bookmarks');
}
//clearBookmarks();
//window.addEventListener('hashchange' , controlRecipes )
//window.addEventListener('load' , controlRecipes)