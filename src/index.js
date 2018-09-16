import App from './scripts/app';

let app = new App();
app.init();

if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept('./scripts/app.js', function () {
    app = new App();
    app.init();
  })
}
