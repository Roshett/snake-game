// constants
DIRECTIONS = {
  TOP: 0,
  RIGHT: 1,
  DOWN: 2,
  LEFT: 3,
};

init = function () {
  const canvas = document.getElementById("view");
  const ctx = canvas.getContext("2d");

  let snake = [
    { x: 100, y: 0, direction: DIRECTIONS.RIGHT },
    { x: 50, y: 0, direction: DIRECTIONS.RIGHT },
    { x: 0, y: 0, direction: DIRECTIONS.RIGHT },
  ];

  let food = {
    x: 200,
    y: 200,
  };

  // [top = 0, right = 1, down = 2, left = 3]
  let directions = [
    {
      dx: 0,
      dy: -50,
    },
    {
      dx: 50,
      dy: 0,
    },
    {
      dx: 0,
      dy: 50,
    },
    {
      dx: -50,
      dy: 0,
    },
  ];

  function checkCorrectDirection(directionIndex) {
    if (
      snake[0].x + directions[directionIndex].dx !== snake[1].x &&
      snake[0].y + directions[directionIndex].dy !== snake[1].y
    ) {
      return false;
    }

    return true;
  }

  function keyDownHandler(e) {
    // top
    if (e.keyCode === 87 && snake[0].direction !== DIRECTIONS.DOWN) {
      if (checkCorrectDirection(DIRECTIONS.TOP)) return;
      snake[0].direction = DIRECTIONS.TOP;
    }
    // right
    else if (e.keyCode === 68 && snake[0].direction !== DIRECTIONS.LEFT) {
      if (checkCorrectDirection(DIRECTIONS.RIGHT)) return;
      snake[0].direction = DIRECTIONS.RIGHT;
    }
    // down
    else if (e.keyCode === 83 && snake[0].direction !== DIRECTIONS.TOP) {
      if (checkCorrectDirection(DIRECTIONS.DOWN)) return;
      snake[0].direction = DIRECTIONS.DOWN;
    }
    // left
    else if (e.keyCode === 65 && snake[0].direction !== DIRECTIONS.RIGHT) {
      if (checkCorrectDirection(DIRECTIONS.LEFT)) return;
      snake[0].direction = DIRECTIONS.LEFT;
    }
  }

  document.addEventListener("keydown", keyDownHandler, false);

  function drawRectangle(x, y, color) {
    ctx.beginPath();
    ctx.rect(x, y, 50, 50);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
  }

  function drawSnake() {
    snake.forEach((item) => {
      drawRectangle(item.x, item.y, "#6930c3");
    });
  }

  function drawFood() {
    drawRectangle(food.x, food.y, "#64dfdf");
  }

  function checkCollisionWithFood() {
    return snake[0].x === food.x && snake[0].y === food.y;
  }

  function checkCollisionWithFieldArea() {
    return (
      snake[0].x < 0 || snake[0].x > 450 || snake[0].y < 0 || snake[0].y > 450
    );
  }

  function checkCollisionWithBody() {
      return snake.find((item, index) => index !== 0 && item.x === snake[0].x && item.y === snake[0].y)
  }

  function generateFood() {
    let field = [];
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        field.push({ x: i * 50, y: j * 50 });
      }
    }

    field = field.filter(
      (item) => !snake.find((body) => item.x === body.x && item.y === body.y)
    );
    food = field[getRandomInt(field.length)];
  }

  function moveSnake() {
    let newDirection = null;
    let snakeLastBody = JSON.parse(JSON.stringify(snake[snake.length - 1])); // потом

    snake.forEach((item) => {
      item.x += directions[item.direction].dx;
      item.y += directions[item.direction].dy;

      if (newDirection !== null) {
        let bufferDirection = item.direction;
        item.direction = newDirection;
        newDirection = bufferDirection;
      } else {
        newDirection = item.direction;
      }
    });

    if(checkCollisionWithFieldArea() || checkCollisionWithBody()) {
        clearInterval(renderScene)
        init();
    }

    if (checkCollisionWithFood()) {
      snake.push(snakeLastBody);
      generateFood();
    }
  }

  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawFood();
    drawSnake();
    moveSnake();
  }

  const renderScene = setInterval(render, 200);
};

init();

// helpers
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
