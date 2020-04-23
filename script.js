const Gameboard = ((container) => {

    const square = {
        mark: ''
    }

    const board = [];

    const newMarker = (mark, index) => {
        board[index] = {mark}
        render()
        console.log(board)
    }

    // page load
    const init = () => {
        for (let count = 1; count <= 9; count++) {
                board.push(square)
            }
        render()
    }

    // DOM grabbing module
    const DOM = {
        getSquares: function() {
            return container.querySelectorAll('.square')
        },
        newSquare: function(html) {
            const square = document.createElement('div')
            square.className = 'square' 
            square.innerHTML = html;
            return square;
        },
        newSquareInner: function(mark) {
            return `<span>${mark}</span>`
        }
    }

    const render = () => {
        // clear the board
        DOM.getSquares().forEach(square => {
            container.removeChild(square)
        })
        // repopulate the board with new squares
        board.forEach(square => {
            container.appendChild(DOM.newSquare(DOM.newSquareInner(square.mark)))
            console.log(square.mark)
        });
    }

    // make these available to other modules
    return {
        init,
        newMarker
    };

})(document.querySelector('.gameboard'))

const Controller = (() => {
    const DOM = {
        setupWindow: document.querySelector('.setup'),
    }

    const newPlayer = (marker, type) => {
        return {
            marker, type
        }
    }

    const player1 = newPlayer('X', 'human');
})()

//console.log(player1, player2)