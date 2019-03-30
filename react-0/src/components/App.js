import React, { Component } from 'react';
import Navbar from './Navbar'
import RecipeItem from './RecipeItem'
import recipes from '../sample_data/recipes.json'

class App extends Component {
  constructor(props) {
    super(props);
    this.recipes = recipes.results;
    this.search = '';
    this.state = {
      searchString: this.search,
      receitasFiltradas: this.recipes
    };
  }


  filtrarReceitas = (receitaFiltro) => {
    this.setState({searchString:receitaFiltro});
    let receitasFiltradas = this.recipes;
    receitasFiltradas = receitasFiltradas.filter((receita) => {
      let receitaTitulo = receita.title.toLowerCase();
      let receitaIngredientes = receita.ingredients.toLowerCase();
      return (receitaTitulo.indexOf(
        receitaFiltro.toLowerCase()) !== -1 ||
        receitaIngredientes.indexOf(
          receitaFiltro.toLowerCase()) !== -1)
    })
    this.setState({receitasFiltradas})
  }

  render() {
    return (
      <div className="App">
        <Navbar search={this.state.searchString} onChange={this.filtrarReceitas} />
        <div className="container mt-10">
          <div className="row">
            {this.state.receitasFiltradas.map((recipe) =>
              <RecipeItem title={recipe.title} ingredients={recipe.ingredients} thumbnail={recipe.thumbnail}  />)}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
