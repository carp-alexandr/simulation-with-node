(function () { // Anonymous function encapsulating all code as per the module pattern.
  'use strict';

  // www.npmjs.com/package/prompt
  const prompt = require('prompt');

  class Terminal {
    constructor(name) {
      this.name = name;
      this.name.start();
    }
    request() {
      return this.name.get({
        name: 'header',
        // RegExp for 3 or 4 numbers
        // For different shapes could get more numbers
        pattern: /[0-9 ]{5,7}/,
        message: 'Introduce 3 or 4 numbers please',
        required: true
      })
    }
    getCommands() {
      return this.name.get({
        name: 'commands',
        // RegExp for commands 0 to 4 with empty spaces in between
        pattern: /([0-4](?= ) )+[0-4]|([0-4])/,
        message: `Only commands: 
           0 = quit
           1 = move forward one step
           2 = move backwards one step
           3 = rotate clockwise
           4 = rotate counterclockwise`
      })
    }
  }
  let terminal = new Terminal(prompt);

  class Point {
    constructor(resolve) {
      // string from console in array
      let header = resolve.header.split(" ");
      // Cutting empty elements
      header = header.filter(entry => entry.trim() != '');
      // If only 3 numbers then table will be square
      if (header.length == 3) {
        this.xSpace = header[0];
        this.ySpace = header[0];
      } else if (header.length == 4) {
        this.xSpace = header[0];
        this.ySpace = header[1];
      }
      // For different shapes will need more numbers
      // else if (header.length == 6) {
      //  building custom shape
      // }

      // Location of the point taken from the last two numbers
      this.x = parseInt(header[header.length - 2]);
      this.y = parseInt(header[header.length - 1]);
      let output = [this.x, this.y];
      this.dir = "north";
      let completed = false;
    }
    // Moves the point
    move(course) {
      if (course === "forward" && this.dir === "north" || course === "backward" && this.dir === "south") {
        this.y--;
      } else if (course === "forward" && this.dir === "east" || course === "backward" && this.dir === "west") {
        this.x++;
      } else if (course === "forward" && this.dir === "south" || course === "backward" && this.dir === "north") {
        this.y++;
      } else if (course === "forward" && this.dir === "west" || course === "backward" && this.dir === "east") {
        this.x--;
      }
    }
    // Changes the dir variable
    rotate(changeDir) {
      switch (this.dir) {
        case "north":
          if (changeDir === "clockwise") {
            this.dir = "east";
          } else if (changeDir === "counterClockwise") {
            this.dir = "west";
          }
          break;
        case "west":
          if (changeDir === "clockwise") {
            this.dir = "north";
          } else if (changeDir === "counterClockwise") {
            this.dir = "south";
          }
          break;
        case "east":
          if (changeDir === "clockwise") {
            this.dir = "south";
          } else if (changeDir === "counterClockwise") {
            this.dir = "north";
          }
          break;
        case "south":
          if (changeDir === "clockwise") {
            this.dir = "west";
          } else if (changeDir === "counterClockwise") {
            this.dir = "east";
          }
          break;
        default:
          break;
      }
    }
    // checking if the point is in the table
    checkFalling() {
      if (this.x < 0 || this.y < 0 || this.x > this.xSpace || this.y > this.ySpace) {
        this.setOutput([-1, -1])
        return true;
      } else {
        return false;
      }
    }
    // Getting commands and executing them
    makeMovements(movements) {
      for (let movement of movements) {
        parseInt(movement)

        if (movement === "0") {
          this.exit();
          break
        } else if (movement === "1") {
          this.move("forward");
          this.setOutput([this.x, this.y]);
          if (this.checkFalling()) {
            this.exit();
            break;
          }
        } else if (movement === "2") {
          this.move("backward");
          this.setOutput([this.x, this.y]);
          if (this.checkFalling()) {
            this.exit();
            break;
          }
        } else if (movement === "3") {
          this.rotate("clockwise");
        } else if (movement === "4") {
          this.rotate("counterClockwise");
        } else {
          return;
        }
      }
    }
    getOutput() {
      return this.output;
    }
    setOutput(newValue) {
      return this.output = newValue;
    }
    getCompleted() {
      return this.completed;
    }
    exit() {
      this.completed = "true";
      console.log(this.getOutput());
    }
  }
  // I assumed that I will need more than one request of commands because the result is being showed only with command 0 and when the point is falling from the table
  function makeRequests(point) {
    // Stdin for commands
    terminal.getCommands()
      // Promise to make requests consecutive
      .then(function (result) {
        // Transforming string of commands in array
        const commands = result.commands.split(" ");
        // Executing commands
        point.makeMovements(commands)
        // Checking if need more commands
        if (!commands.includes('0') && !point.getCompleted()) {
          // Recursive function to make enaugh requests to get result
          makeRequests(point);
        }
      })
  }
  // First request
  terminal.request()
    .then(function (resolve) {
      // Creating point
      let point = new Point(resolve);
      // Requesting commands
      makeRequests(point);
      return
    })

})();
