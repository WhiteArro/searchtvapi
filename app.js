const form = document.querySelector('#searchForm')
const container = document.querySelector('#container');

const onRequset = async (e) => {
   e.preventDefault();
   const inputVal = form.elements.q.value;
   console.log(inputVal);
   getMovieData(inputVal);
}

const getMovieData = async (inputVal) => {
   switch (inputVal) {
      case '':
         displayError('No title included...')
         break;
      default:
         manageOldCards('delete', '.preView', '.card');

         try {
            const req = await axios.get(`https://api.tvmaze.com/search/shows?q=${inputVal}`);
            console.log(req.data);
            makeNewPreViews(req.data);

         } catch (err) {
            displayError('Unable to find any movies...');
            manageOldCards('delete', '.preView');
         }
   }
   form.elements.q.value = "";
}

const manageOldCards = (action, ...arguments) => {
   for (let arg of arguments) {
      const items = document.querySelectorAll(arg);
      if (action === 'hide' || action === 'show') {
         for (let item of items) item.classList.toggle('hide')
      } else {
         for (let item of items) item.remove();
      }
   }
}


const makeNewPreViews = (data) => {
   switch (data.length) {
      case 0:
         displayError("No movies' data...")
         break;
      default:
         for (let n of data) appendPreView(n);
   }
}

const appendPreView = (data) => {
   if (data.show.image && data.show.name) {
      const newPreView = document.createElement('div');
      const preViewImg = document.createElement('div');
      const title = document.createElement('h3');


      preViewImg.classList.add('preViewImg')
      preViewImg.style.backgroundImage = `url('${data.show.image.medium}')`

      title.append(data.show.name);
      title.classList.add('preViewTitle')

      newPreView.append(preViewImg, title);
      newPreView.classList.add('preView');
      container.append(newPreView);

      listenAndCreateCard(newPreView, data);
   }
}

const listenAndCreateCard = (el, data) => {

   el.addEventListener('click', () => {
      manageOldCards('hide', '.preView');

      const card = document.createElement('div');
      const cardContent = document.createElement('div');
      const img = document.createElement('div');
      const info = document.createElement('div');
      const title = document.createElement('h3');
      const score = document.createElement('h4');
      const description = document.createElement('div');
      const link = document.createElement('a');
      const returnBtn = document.createElement('button');


      img.style.backgroundImage = `url(${data.show.image.original})`;
      img.classList.add('cardImg');

      title.append(data.show.name);
      title.classList.add('cardTitle');

      link.append('Direct to Webpage');
      link.setAttribute('target', '_blank');
      link.setAttribute('href', data.show.url);

      description.innerHTML = data.show.summary;
      description.append(link);
      description.classList.add('cardDescription');

      score.append('Global Rating: ', `${Math.floor(data.score) * 5}%`);
      score.classList.add('cardScore');

      info.append(title, score, description);
      info.classList.add('cardInfo');

      returnBtn.append('Go back');
      returnBtn.setAttribute('id', 'returnBtn')

      cardContent.append(img, info);
      cardContent.classList.add('cardContent');

      card.append(returnBtn, cardContent);
      card.classList.add('card', 'c');
      container.append(card)

      settingUpReturnBtn();
   })
}

const settingUpReturnBtn = () => {
   returnBtn.addEventListener('click', function () {
      manageOldCards('show', '.preView');
      manageOldCards('delete', '.card');
   })
}

const displayError = (msg) => {
   manageOldCards('delete', '.error');
   const error = document.createElement('div');

   error.innerHTML = [
      `
         <p>ERROR:  ${msg}</p>
         <button id="closeError">
         <sup>X</sup></button>`
   ];
   error.classList.add('error');
   container.append(error);

   error.addEventListener('click', function () {
      fadeOutHideError(this);
   })
   setTimeout(() => {
      fadeOutHideError(error);

   }, 7000);
}

const fadeOutHideError = (el) => {
   el.style.opacity = '0';
   setTimeout(() => {
      el.remove();
   }, 700);
}

form.addEventListener('submit', onRequset);