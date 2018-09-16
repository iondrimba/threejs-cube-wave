import Hello from './scripts/hello';

let app = new Hello();
app.greetings();

if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept('./scripts/hello.js', function () {
    console.log('Accepting the updated module!');
    app = new Hello();
    app.greetings();
  })
}
