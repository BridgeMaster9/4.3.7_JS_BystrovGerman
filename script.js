const app = document.getElementById('app')

//функция для создания элемента с атрибутами и размещением
function creatElem(elementTag, elementClass, elementContent, elementParent = app){
  const elem = document.createElement(elementTag)
  if(elementClass)
    elem.classList.add(elementClass)
  if(elementContent)
    elem.textContent = elementContent
  elementParent.append(elem)
  return elem
}
//создание основного макета
const wrapper = creatElem('div', 'wrapper')
const inner = creatElem('div', 'inner', null, wrapper)
const searchLine= creatElem('div', 'search-line', null, inner)
const firstList = creatElem('ul', 'search-list', null, inner)
const searchInput = creatElem('input', 'input', null, searchLine);
const secondList = creatElem('ul', 'result-list', null, inner)

//функция вызова запроса
async function searchUserBeta(){
  return await fetch(`https://api.github.com/search/repositories?q=${searchInput.value}`).then((res)=>{
    if(res.ok){
      res.json().then(res=>{
        firstList.innerHTML = ''
        for(let i = 0; i<5; i++){
          let elem = creatElem('li', 'search-list__item', res.items[i].name, firstList)
          elem.repository = res.items[i];
        }
      })
    }
    else{
      if(res.status === 422)
        alert('по вашему запросу ничего не найдено, попробуйте снова')
      alert('что-то пошло не так')
    }

  })  
}

//функция debounce для обработки вызовов запросов
const debounce = (fn, ms) => {
  let timer;
  return function(...args){
    clearTimeout(timer)
    timer = setTimeout(()=>{
      fn.apply(this, args)
    }, ms)
  }
}

const searchUsers = debounce(searchUserBeta, 500)
//слушатель на ввод в input
searchInput.addEventListener('keyup', (event)=>{
  if(event.keyCode === 32)                                                      //если вводим пробел - то игнорируем
    return 
  if(searchInput.value === ''){                                                //если input пустой, то чистим список поиска
    firstList.innerHTML = ''
  }
  else{
    searchUsers();}                                                             //если input не пустой, то делам запрос
})

//создание списка репозиториев по клику
firstList.addEventListener('click', function(event){
  let target = event.target
  creatItemListRepo(target.repository)
  searchInput.value = ''                                                       //если сохраняем репозиторий, то чистим input
})

//функция создания элемента списка сохраненных репозиториев
function creatItemListRepo(repo){
  const elem = creatElem('li', 'result-list__item', null, secondList)
  elem.insertAdjacentHTML("beforeend", 
  `<div class = 'about-repo'>
    <span>Name: ${repo.name} </span>
    <span>Owner: ${repo.owner.login}</span>
    <span>Stars: ${repo.stargazers_count}</span>
  </div>
  <div class='close'></div>`)
  elem.querySelector('.close').addEventListener('click', function die(){
    this.parentNode.remove(); 
    this.removeEventListener('click', die)
  })
}
