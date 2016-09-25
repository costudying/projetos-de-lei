import json
import sys

from unidecode import unidecode

vereadores = {}


def flatten(aList):
	t = []
	for i in aList:
		if not isinstance(i, list):
			t.append(i)
		else:
			t.extend(flatten(i))
	return t


with open(sys.argv[1], "r+") as data_file:
	data = json.load(data_file)

for lei in data:
	for autor in flatten(lei["author"].strip().split(",")):
		autor = unidecode(autor)
		if unidecode(autor) not in vereadores:
			vereadores[autor] = {"leis-num": 0,
					"tipos": {"Abastecimento Industria Comercio e Agricultura": 0,
						"Administracao e Assuntos Ligados ao Servidor Publico": 0,
						"Assuntos Urbanos": 0,
						"Ciencia Tecnologia Comunicacao e Informatica": 0,
						"Defesa Civil": 0,
						"Defesa da Mulher": 0,
						"Defesa dos Direitos Humanos": 0,
						"Direitos da Crianca e do Adolescente": 0,
						"Direitos da Pessoa com Deficiencia": 0,
						"Direitos dos Animais": 0,
						"Educacao e Cultura": 0,
						"Esportes e Lazer:": 0,
						"Financas Orcamento e Fiscalizacao Financeira": 0,
						"Higiene Saude Publica e Bem-Estar Social": 0,
						"Idoso": 0,
						"Justica e Redacao": 0,
						"Meio Ambiente": 0,
						"Defesa do Consumidor": 0,
						"Obras Publicas e Infraestrutura": 0,
						"Prevencao as Drogas": 0,
						"Trabalho e Emprego": 0,
						"Transportes e Transito": 0,
						"Turismo": 0},
					"leis": {}}

			vereadores[autor]["leis-num"] += 1
		vereadores[autor]["leis"][lei["id"]] = {"date": lei["date"],
				"description": unidecode(lei["description"]),
				"upvotes": 0,
				"downvotes": 0}
		for tipo in vereadores[autor]["tipos"]:
			if (tipo in unidecode(lei["description"])):
				vereadores[autor]["tipos"][tipo] += 1

with open(sys.argv[2], "w") as post_file:
	json.dump(vereadores, post_file, sort_keys=True, indent=4)
