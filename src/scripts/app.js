import jquery from '../../node_modules/jquery/dist/jquery';

class App {
    constructor() {
        this.$ = jquery;
    }
}

window.app = new App();