import random

class SorteioModel:

    def __init__(self):
        self.ultimos_resultados = []

    def sortear(self, nomes):
        if not nomes:
            return None
        vencedor = random.choice(nomes)
        self.ultimos_resultados.append(vencedor)
        return vencedor

    def limpar_historico(self):
        self.ultimos_resultados.clear()

    def obter_historico(self):
        return list(self.ultimos_resultados)
