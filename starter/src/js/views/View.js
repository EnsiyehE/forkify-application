import icons from 'url:../../img/icons.svg';

export default class View{
    _data ;
    render(data,render=true){
       if(!data || (Array.isArray(data) && data.length === 0)) return this.renderError();

        this._data = data ;
        const markup = this._generateMarkup()
        if(!render) return markup;
        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin' , markup)
    }

    update(data){
     

      this._data = data ;
      const newMarkup = this._generateMarkup();

      // convert the string to real Dom node object 
      const newDOM = document.createRange().createContextualFragment(newMarkup);
      const newElements = Array.from(newDOM.querySelectorAll('*'));
      const curElements = Array.from(this._parentElement.querySelectorAll('*'));

      newElements.forEach((newEl , i)=>{
        const curEl = curElements[i]
        //console.log(newEl.isEqualNode(curEl))

        // Updates change Text
        if(!newEl.isEqualNode(curEl)&& newEl.firstChild?.nodeValue.trim() !== ''){
          curEl.textContent = newEl.textContent
        }
        // Updates change attributes
        if(!newEl.isEqualNode(curEl)){
          Array.from(newEl.attributes).forEach(attr => 
            curEl.setAttribute(attr.name , attr.value))
        }
      })
    }


    _clear(){
        console.log(this._parentElement)
        this._parentElement.innerHTML = '';   
    }

    renderSpinner(){
        const markup = `
         <div class="spinner">
                <svg>
                  <use href="${icons}#icon-loader"></use>
                </svg>
              </div> ` ;
      
              this._clear();
              this._parentElement.insertAdjacentHTML('afterbegin' , markup)
      }


    renderError(message = this._errorMessage){
      const markup = `
        <div class="error">
            <div>
              <svg>
                <use href="${icons}#icon-alert-triangle"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div> `
          this._clear();
          this._parentElement.insertAdjacentHTML('afterbegin' , markup)  
    }

    renderMessage(message = this._message){
      const markup = `
        <div class="message">
            <div>
              <svg>
                <use href="${icons}#icon-smile"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div> `
          this._clear();
          this._parentElement.insertAdjacentHTML('afterbegin' , markup)  
    }
}