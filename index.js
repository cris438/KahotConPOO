class Jugador {
    #nombre
    #puntaje
    #respuestasCorrectas
    constructor(nombre) {
        this.nombre = nombre
        this.#puntaje = 0
        this.#respuestasCorrectas = 0
    }
    get nombre() {
        return this.#nombre
    }
    set nombre(value) {
        this.#nombre = value
    }

    get puntaje() {
        return `Tienes ${this.#puntaje} puntos`
    }
    set puntaje(value) {
        this.#puntaje = value
    }
    get respuestasCorrectas() {
        return this.#respuestasCorrectas
    }
    set respuestasCorrectas(value) {
        this.#respuestasCorrectas = value
    }

    get puntos() {
        return this.#puntaje
    }


    sumarPuntos(puntos) {
        this.#puntaje = this.#puntaje + puntos
    }
    aumentarCorrectas() {
        this.respuestasCorrectas = this.respuestasCorrectas + 1

    }
    reiniciar() {
        this.nombre = ''
        this.puntaje = 0
        this.respuestasCorrectas = 0
    }
}

class Pregunta {
    #texto
    #opciones
    #respuestaCorrecta
    #puntos
    constructor(texto, opciones, respuestaCorrecta, puntos) {
        this.texto = texto
        this.opciones = opciones
        this.respuestaCorrecta = respuestaCorrecta
        this.puntos = puntos
    }


    get texto() {
        return this.#texto
    }
    set texto(value) {
        this.#texto = value
    }

    get opciones() {
        return this.#opciones
    }
    set opciones(value) {
        if (Array.isArray(value)) {
            this.#opciones = value
        } else {
            throw new Error('No se aceptan valores diferentes')
        }
    }

    get respuestaCorrecta() {
        return this.#respuestaCorrecta
    }
    set respuestaCorrecta(value) {
        this.#respuestaCorrecta = value
    }

    get puntos() {
        return this.#puntos
    }
    set puntos(value) {
        this.#puntos = value
    }

    validarRespuesta(respuesta) {
        return respuesta == this.#respuestaCorrecta
    }
}

class Quiz {
    #preguntas
    #preguntaActual
    #jugador
    #indice
    constructor(preguntas, jugador) {
        this.preguntas = preguntas
        this.jugador = jugador
        this.#indice = 0
    }
    get preguntas() {
        return this.#preguntas
    }
    set preguntas(value) {
        this.#preguntas = value
    }

    get preguntaActual() {
        return this.#preguntaActual
    }
    set preguntaActual(value) {
        this.#preguntaActual = value
    }

    get jugador() {
        return this.#jugador
    }
    set jugador(value) {
        this.#jugador = value
    }

    iniciar() {
        this.#indice = 0
        this.preguntaActual = this.preguntas[this.#indice]
    }
    mostrarPregunta() {
        return this.preguntaActual
    }
    responder(respuesta) {
        let res = this.preguntaActual.validarRespuesta(respuesta)
        if (res) {
            this.jugador.aumentarCorrectas()
            this.jugador.sumarPuntos(this.preguntaActual.puntos)
        }
    }
    siguientePregunta() {
        this.#indice++
        this.preguntaActual = this.preguntas[this.#indice]
    }

    estadoPregunta() {
        return `Pregunta ${this.#indice + 1} de ${this.#preguntas.length}`
    }
    estadoPreguntaPorcentaje() {
        let porcentaje = 100 / this.#preguntas.length
        return (this.#indice + 1) * porcentaje
    }

    finalizarQuiz() {
        return { nombre: this.jugador.nombre, puntaje: this.jugador.puntos, correctas: this.jugador.respuestasCorrectas }
    }

}

let formInicio = document.querySelector('#form-iniciar')
let pantalla1 = document.querySelector('#pantalla-inicio')
let pantalla2 = document.querySelector('#pantalla-quiz')
let estadoJugador = document.querySelector('#estado-jugador')
let estadoPuntaje = document.querySelector('#estado-puntaje')
let estadoCorrectas = document.querySelector('#estado-correctas')
let preguntaVisual = document.querySelector('#texto-pregunta')
let respuestaVisual = document.querySelector('#opciones-respuesta')
let feedBackRespuesta = document.querySelector('#feedback-respuesta')
let btnSiguiente = document.querySelector('#btn-siguiente')
let estadoPregunta = document.querySelector('#estado-pregunta')
let barraProgreso = document.querySelector('#barra-progreso')
let btnFinalizado = document.querySelector('#btn-finalizado')
let pantallaFinal = document.querySelector('#pantalla-final')
let resultadoPunteo = document.querySelector('#resultado-puntaje')
let resultadoJugador = document.querySelector('#resultado-jugador')
let resultadoCorrecto = document.querySelector('#resultado-correctas')
let btnReiniciar = document.querySelector('#btn-reiniciar')
let QuizOne;

const pregunta1 = new Pregunta('Cual es mi edad?', ['10', '20', '30', '50'], '30', 10)
const pregunta2 = new Pregunta('Cual es mi color favorito?', ['10', '20', '30', '50'], '30', 10)
const pregunta3 = new Pregunta('Cual es mi nose?', ['10', '20', '30', '50'], '30', 10)
const pregunta4 = new Pregunta('Cual es mi zzzz?', ['10', '20', '30', '50'], '30', 10)
const pregunta5 = new Pregunta('Cual es mi jdlfjoiasjoi?', ['10', '20', '30', '50'], '30', 10)
const ArregloDePreguntas = [pregunta1, pregunta2, pregunta3, pregunta4, pregunta5]

formInicio.addEventListener('submit', (event) => {
    event.preventDefault()
    let playerOne = new Jugador(event.target["nombre-jugador"].value)
    QuizOne = new Quiz(ArregloDePreguntas, playerOne)
    QuizOne.iniciar()
    formInicio.reset()
    renderizar(playerOne)
})
respuestaVisual.addEventListener('click', (event) => {
    if (event.target.disabled != undefined) {
        event.target.classList.add('active')
        let esCorrecta = QuizOne.preguntaActual.validarRespuesta(event.target.textContent)

        feedBackRespuesta.textContent = `Su respuesta ${esCorrecta ? 'correcta' : 'incorrecta'}`
        if (!esCorrecta) {
            feedBackRespuesta.classList.remove('alert-success')
            feedBackRespuesta.classList.add('alert-danger')
        }
        feedBackRespuesta.classList.remove('d-none')

        let btnsRespuesta = respuestaVisual.childNodes
        btnsRespuesta.forEach(btn => btn.disabled = true)


        QuizOne.responder(event.target.textContent)
        btnSiguiente.disabled = false
        if (!btnFinalizado.classList.contains('d-none')) {
            btnFinalizado.disabled = false
        }
    }

})

const renderizar = (playerOne) => {
    estadoPregunta.textContent = QuizOne.estadoPregunta()
    barraProgreso.style = `width: ${QuizOne.estadoPreguntaPorcentaje()}%`
    feedBackRespuesta.classList.add('d-none')
    feedBackRespuesta.classList.add('alert-success')
    feedBackRespuesta.classList.remove('alert-danger')
    estadoCorrectas.textContent = ''
    estadoJugador.textContent = ''
    estadoPuntaje.textContent = ''
    pantalla1.classList.add('d-none')
    pantalla2.classList.remove('d-none')
    estadoJugador.textContent = `Jugador: ${playerOne.nombre}`
    estadoPuntaje.textContent = playerOne.puntaje
    estadoCorrectas.textContent = `Correctas ${playerOne.respuestasCorrectas}`
    preguntaVisual.textContent = QuizOne.preguntaActual.texto
    respuestaVisual.innerHTML = ''
    QuizOne.preguntaActual.opciones.forEach(element => {
        let btnRespuesta = document.createElement('button')
        btnRespuesta.className = 'btn btn-outline-primary text-start py-3'
        btnRespuesta.textContent = element
        respuestaVisual.append(btnRespuesta)
    })

    if (QuizOne.estadoPreguntaPorcentaje() == 100) {
        btnFinalizado.classList.remove('d-none')
        btnSiguiente.classList.add('d-none')
    }
    btnSiguiente.disabled = true
}

btnSiguiente.addEventListener('click', () => {
    QuizOne.siguientePregunta()
    renderizar(QuizOne.jugador)

})

btnFinalizado.addEventListener('click', (event) => {
    pantalla2.classList.add('d-none')
    pantallaFinal.classList.remove('d-none')
    let fin = QuizOne.finalizarQuiz()
    resultadoJugador.textContent = fin.nombre
    resultadoCorrecto.textContent = fin.correctas
    resultadoPunteo.textContent = fin.puntaje
    btnFinalizado.classList.add('d-none')
    btnSiguiente.classList.remove('d-none')
})

btnReiniciar.addEventListener('click', (event) => {
    QuizOne.jugador.reiniciar()
    pantallaFinal.classList.add('d-none')
    pantalla1.classList.remove('d-none')
    btnFinalizado.disabled = true
})