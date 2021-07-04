const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const img = new Image();
img.src = './media/flappy-bird-set.png';


// general setting // 

let gamePlaying = false;

const gravity = 0.7;
const speed = 5.8;
const size = [51, 36];
const jump = -13;
const Ctenth = (canvas.width / 10);


// tuyaux parametre  // 

const pipeWidth = 78;
const pipeGap = 270;
const pipeLoc = () => (Math.random() * ((canvas.height - (pipeGap + pipeWidth)) -
    pipeWidth)) + pipeWidth;

//-----------------/



let index = 0,
    bestScore = 0,
    currentScore = 0,
    pipes = [],
    flight,
    flyHeight;


// permet de manipuler les tuyaux /

const setup = () => {
    currentScore = 0;
    flight = jump;
    flyHeight = (canvas.height / 2) - (size[1] / 2);

    pipes = Array(3).fill().map((a, i) => [canvas.width +
        (i * (pipeGap + pipeWidth)),
        pipeLoc()
    ]);

}

const render = () => {

    index++;


    //Permet d'animer le Background 1 //

    ctx.drawImage(img, 0, 0, canvas.width, canvas.height, -((index * (speed / 2)) %
        canvas.width) + canvas.width, 0, canvas.width, canvas.height);

    //Permet d'animer le Background 2 //

    ctx.drawImage(img, 0, 0, canvas.width, canvas.height, -((index * (speed / 2)) %
        canvas.width), 0, canvas.width, canvas.height);


    if (gamePlaying) {

        //permet d'animer l'oiseau au lancer //

        ctx.drawImage(img, 432, Math.floor((index % 9) / 3) * size[1],
            ...size, Ctenth, flyHeight, ...size);
        flight += gravity;
        flyHeight = Math.min(flyHeight + flight, canvas.height - size[1])

    } else {


        //Permet d'animer l'oiseau //

        ctx.drawImage(img, 432, Math.floor((index % 9) / 3) * size[1], ...size,
            ((canvas.width / 2) - size[0] / 2), flyHeight, ...size);

        flyHeight = (canvas.height / 2) - (size[1] / 2);


        //Affiche le Meilleur Score et le cliquez pour jouez //

        ctx.fillText(`Meilleur score : ${bestScore}`, 55, 245);
        ctx.fillText("cliquez pour jouer", 48, 535);
        ctx.font = "bold 30px courier";

    }



    // Affichage des tuyaux //


    if (gamePlaying) {

        pipes.map(pipe => {

            pipe[0] -= speed;

            // Tuyaux du haut //

            ctx.drawImage(img, 432, 588 - pipe[1],
                pipeWidth, pipe[1], pipe[0], 0, pipeWidth, pipe[1])

            // tuyaux du bas //    

            ctx.drawImage(img, 432 + pipeWidth, 108, pipeWidth,
                canvas.height - pipe[1] + pipeGap, pipe[0], pipe[1] +
                pipeGap, pipeWidth, canvas.height - pipe[1] + pipeGap);

            // calcul le score et le bestScore //

            if (pipe[0] <= -pipeWidth) {

                currentScore++;
                bestScore = Math.max(bestScore, currentScore);

                // Remove tuyaux create new one  (...pipes) prend tout les données de pipes//

                pipes = [...pipes.slice(1), [pipes[pipes.length - 1][0] +
                    pipeGap + pipeWidth, pipeLoc()
                ]]

            }
            // si on touche un tuyaux c'est Perdu //

            if ([
                    pipe[0] <= Ctenth + size[0],
                    pipe[0] + pipeWidth >= Ctenth,
                    pipe[1] > flyHeight || pipe[1] + pipeGap < flyHeight + size[1]
                ].every(elem => elem)) {
                gamePlaying = false;
                setup();
            }


        })

    }


    document.getElementById("bestScore").innerHTML = `Meilleur : ${bestScore}`;
    document.getElementById("currentScore").innerHTML = `Actuel : ${currentScore}`;



    window.requestAnimationFrame(render);

}
setup();

img.onload = render;


// Permet de lancer le jeu et de crée le Jump //

document.addEventListener(`click`, () => gamePlaying = true)
window.onclick = () => flight = jump;