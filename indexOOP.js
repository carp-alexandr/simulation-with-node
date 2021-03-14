(function () { // Anonymous function encapsulating all code as per the module pattern.
  'use strict'; // Ensures code is much more secure and optimized by making fewer assumptions.

  // www.npmjs.com/package/prompt
  const prompt = require('prompt');
  prompt.start();

  class Terminal {
    constructor() {
      let completed = false;
    }
    request() {
      return prompt.get({
        name: 'header',
        pattern: /[0-9 ]{3,4}/,
        message: 'Introduce 4 numbers please',
        required: true
      })
    }
    exit() {
      this.completed = "true";
    }
    getCommands() {
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
    setCommands(commands) {
      for (let command of commands) {
        parseInt(command)

        if (command === "0") {
          this.exit();
          break
        } else if (command === "1") {
          if (Point.checkFalling()) {
            this.exit();
            break;
          }
        } else if (command === "2") {
          if (Point.checkFalling()) {
            this.exit();
            break;
          }
        } else {
          return;
        }
      }
    }
    getCompleted() {
      return this.completed;
    }
  }

  class Point {
    constructor(resolve) {
      let header = resolve.header.split(" ");
      header = header.filter(entry => entry.trim() != '');
      if (header.lenght == 3) {
        let xSpace = header[0];
        let ySpace = header[0];
      } else if (header.lenght == 4) {
        let xSpace = header[0];
        let ySpace = header[1];
      }
      this.x = parseInt(header[header.length - 2]);
      this.y = parseInt(header[header.length - 1]);
      let output = [this.x, this.y];
      this.dir = "north";
    }
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
    static checkFalling() {
      if (this.x < 0 || this.y < 0 || this.x > this.xSpace || this.y > this.ySpace) {
        this.setOutput([-1, -1])
        return true;
      } else {
        return false;
      }
    }
    makeMovements(movements) {
      for (let movement of movements) {
        parseInt(movement)

        if (movement === "0") {
          console.log(this.getOutput());
        } else if (movement === "1") {
          this.move("forward");
          this.setOutput([this.x, this.y]);
        } else if (movement === "2") {
          this.move("backward");
          this.setOutput([this.x, this.y]);
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
  }

  let terminal = new Terminal();

  function makeRequests(point) {
    terminal.getCommands()
      .then(function (result) {
        const commands = result.commands.split(" ");
        point.makeMovements(commands)
        terminal.setCommands(commands)

        if (!commands.includes('0') && !terminal.getCompleted()) {
          makeRequests(point);
        }
      })
      .catch(function (err) {
        console.log(err);
        return
      });
  }

  terminal.request()
    .then(function (resolve) {
      let point = new Point(resolve);
      makeRequests(point);
      return
    })
    .catch(function (err) {
      console.log(err);
      return
    });

})();
