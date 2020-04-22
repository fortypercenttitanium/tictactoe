const Gameboard = (() => {
    const square = {
        mark: ''
    }
    let board = [];
    for (let i = 1; i <= 9; i++) {
        board.push(square)
    }
    const render = board.forEach(square => {
        const child = document.createElement('div');
        child.className = 'square';
        child.innerHTML = `<span>${square.mark}</span>`
        document.querySelector('.gameboard').appendChild(child)
    });
    return {
        board,
        render
    };
})()

const Player = (marker) => {
    const markSquare = (e) => {
        e.target.innerHTML = '<span>' + marker + '</span>';
    }
    return {
        markSquare
    };
}

const playerX = Player('X')
const playerO = Player('O')

const squares = Array.from(document.querySelectorAll('.square'));

squares.
    forEach(square => {
        addEventListener('click', e => {
            playerX.markSquare(e);
        })
    })