// www.npmjs.com/package/prompt
const prompt = require('prompt');
let header = [];
let dir = "north";
let completed = false;
let x, y;
let arr = [];
let output = [];

function getTable(getCommands) {
  return prompt.get({
    name: 'header',
    pattern: /[0-9 ]{3,4}/,
    message: 'Introduce 4 numbers please',
    required: true
  })
}
function getCommands() {
  return prompt.get({
    name: 'commands',
    pattern: /([0-4{1}] ?)+/,
    message: `Only commands: 
      0 = quit
      1 = move forward one step
      2 = move backwards one step
      3 = rotate clockwise
      4 = rotate counterclockwise`
  })
}
function shape(args) {
  const shapeBuilder = (lenght, arr) => ({
    1: Array(parseInt(arr[0])).fill().map(() => Array(parseInt(arr[0])).fill()),
    2: Array(parseInt(arr??[1])).fill().map(() => Array(parseInt(arr[0])).fill()),
    // Posibility to create different shapes(not working)
    3: "Creating nested arrays with different lengths",
  })[args.length]
  return shapeBuilder(args.length, args)
}
function setVariables(resolve) {
  header = resolve.header.split(" ");
  x = parseInt(header[header.length - 2]);
  y = parseInt(header[header.length - 1]);
  arr = shape(header.slice(0, -2));
  arr[y][x] = x + ", " + y;
  output = [x, y];
}
function executeCommands(commands) {
  for (let command of commands) {
    parseInt(command)

    if (command === "0") {
      exit();
      break
    } else if (command === "1") {
      move("forward");
      if (checkFalling()) {
        break;
      }
      refreshArr();
    } else if (command === "2") {
      move("backward");
      if (checkFalling()) {
        break;
      }
      refreshArr();
    } else if (command === "3") {
      rotate("clockwise");
    } else if (command === "4") {
      rotate("counterClockwise");
    } else {
      return;
    }
  }
}
function checkFalling() {
  if (x < 0 || y < 0 || x > arr[0].lenght || y > arr.lenght) {
    output = [-1, -1]
    exit();
    return true;
  } else {
    return false;
  }
}
function move(course) {
  arr[y][x] = undefined;

  if (course === "forward" && dir === "north" || course === "backward" && dir === "south") {
    y--;
  } else if (course === "forward" && dir === "east" || course === "backward" && dir === "west") {
    x++;
  } else if (course === "forward" && dir === "south" || course === "backward" && dir === "north") {
    y++;
  } else if (course === "forward" && dir === "west" || course === "backward" && dir === "east") {
    x--;
  }
}
function refreshArr() {
  arr[y][x] = x + ", " + y;
  output = [x, y];
}
function rotate(direction) {
  switch (dir) {
    case "north":
      if (direction === "clockwise") {
        dir = "east";
      } else if (direction === "counterClockwise") {
        dir = "west";
      }
      break;
    case "west":
      if (direction === "clockwise") {
        dir = "north";
      } else if (direction === "counterClockwise") {
        dir = "south";
      }
      break;
    case "east":
      if (direction === "clockwise") {
        dir = "south";
      } else if (direction === "counterClockwise") {
        dir = "north";
      }
      break;
    case "south":
      if (direction === "clockwise") {
        dir = "west";
      } else if (direction === "counterClockwise") {
        dir = "east";
      }
      break;
    default:
      break;
  }
}
function exit() {
  completed = "true";
  console.log(output);
  return
}
function execute() {
  getCommands()
    .then(function (result) {
      const commands = result.commands.split(" ");
      executeCommands(commands)

      if (!commands.includes(0) && !completed) {
        execute();
      }
    })
    .catch(function (err) {
      console.log(err);
      return
    });
}

prompt.start();
getTable()
  .then(function (resolve) {
    setVariables(resolve)
    return execute()
  })
  .catch(function (err) {
    console.log(err);
    return
  });
