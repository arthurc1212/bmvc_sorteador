from bottle import template

class Application:
    def index(self):
        return template('index', titulo='Sorteador - Início')
