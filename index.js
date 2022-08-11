// Load Kaluma i2c module
// Assumes you have Kaluma installed: https://kalumajs.org/docs/getting-started
const {I2C} = require('i2c');

module.exports = class LCD {
    constructor(busNumber = 1, address = 0x27, cols = 16, rows = 2) {
        this.displayPorts = { // unused display ports excluded
            E: 0x04,        
            CHR: 1,
            CMD: 0,        
            backlight: 0x08
        };

        // commands
        this.CLEARDISPLAY = 0x01;
        this.ENTRYMODESET = 0x04;
        this.DISPLAYCONTROL = 0x08;
        this.CURSORSHIFT = 0x10;
        this.SETCGRAMADDR = 0x40;
        this.SETDDRAMADDR = 0x80;

        //  flags for display entry mode
        this.ENTRYRIGHT = 0x00;
        this.ENTRYLEFT = 0x02;

        //  flags for display on/off control
        this.DISPLAYON = 0x04;
        this.DISPLAYOFF = 0x00;
        this.CURSORON = 0x02;
        this.CURSOROFF = 0x00;
        this.BLINKON = 0x01;
        this.BLINKOFF = 0x00;

        //  flags for display/cursor shift
        this.DISPLAYMOVE = 0x08;
        this.MOVERIGHT = 0x04;
        this.MOVELEFT = 0x00;

        // Line addresses.
        this.LINEADDRESS = [0x80, 0xC0, 0x94, 0xD4];

        this.BUSNUMBER = busNumber;
        this.ADDRESS = address;
        this.COLS = cols;
        this.ROWS = rows;
        this.I2C = null;
        this.BLINKING = false;
        this.CURSOR = false;
        this.BEGAN = false;
    }

    get busNumber() {
        return this.BUSNUMBER;
    }

    get address() {
        return this.ADDRESS;
    }

    get cols() {
        return this.COLS;
    }

    get rows() {
        return this.ROWS;
    }

    get began() {
        return this.BEGAN;
    }

    write(x, c) {
        this.write4(x, c);
        this.write4(x << 4, c);
    }

    write4(x, c) {
        const a = (x & 0xF0);
        this.I2C.write(new Uint8Array([a | this.displayPorts.backlight | c]), this.ADDRESS);
        this.I2C.write(new Uint8Array([a | this.displayPorts.E | this.displayPorts.backlight | c]), this.ADDRESS);
        this.I2C.write(new Uint8Array([a | this.displayPorts.backlight | c]), this.ADDRESS);
        delayMicroseconds(2000);
    }

    begin() {
        if (this.BEGAN) {
            throw new Error('The LCD is already initialized.');
        }
        this.I2C = new I2C(this.BUSNUMBER, { mode: I2C.MASTER });
        this.write4(0x33, this.displayPorts.CMD); // initialization
        this.write4(0x32, this.displayPorts.CMD); // initialization
        this.write4(0x06, this.displayPorts.CMD); // initialization
        this.write4(0x28, this.displayPorts.CMD); // initialization
        this.write4(0x01, this.displayPorts.CMD); // initialization
        this.write4(0x2C, this.displayPorts.CMD); // 4 bit - 2 line 5x7 matrix
        this.write(this.DISPLAYCONTROL | this.DISPLAYON, this.displayPorts.CMD); // turn cursor off 0x0E to enable cursor
        this.write(this.ENTRYMODESET | this.ENTRYLEFT, this.displayPorts.CMD); // shift cursor right
        this.write(this.displayPorts.backlight, this.displayPorts.CHR); // Turn on backlight
        this.write(this.CLEARDISPLAY, this.displayPorts.CMD); // LCD clear
        this.BEGAN = true;
    }

    close() {
        if (!this.BEGAN) {
            throw new Error('The LCD is not initialized. Must call begin() first.');
        }
        this.I2C.close();
        this.BEGAN = false;
    }

    clear() {
        if (!this.BEGAN) {
            throw new Error('The LCD is not initialized. Must call begin() first.');
        }
        this.write(this.CLEARDISPLAY, this.displayPorts.CMD);
    }

    home() {
        if (!this.BEGAN) {
            throw new Error('The LCD is not initialized. Must call begin() first.');
        }
        this.write(this.SETDDRAMADDR | 0x00, this.displayPorts.CMD);
    }

    setCursor(x, y) {
        if (!this.BEGAN) {
            throw new Error('The LCD is not initialized. Must call begin() first.');
        }
        this.write(this.SETDDRAMADDR | ([0x00, 0x40, 0x14, 0x54][y] + x), this.displayPorts.CMD);
    }

    print(s) {
        if (!this.BEGAN) {
            throw new Error('The LCD is not initialized. Must call begin() first.');
        }
        const str = s.toString();
        for (let i = 0; i < str.length; i++) {
            const c = str[i].charCodeAt(0);
            this.write(c, this.displayPorts.CHR);
        }
    }

    printLine(line, s) {
        if (!this.BEGAN) {
            throw new Error('The LCD is not initialized. Must call begin() first.');
        }
        const str = s.toString();
        if (line < this.ROWS) {
            this.write(this.LINEADDRESS[line], this.displayPorts.CMD);
        }
        this.print(str.substring(0, this.COLS));
    }

    cursor() {
        if (!this.BEGAN) {
            throw new Error('The LCD is not initialized. Must call begin() first.');
        }
        this.CURSOR = true;
        this.write(this.DISPLAYCONTROL | this.DISPLAYON | this.CURSORON | (this.BLINKING ? this.BLINKON : this.BLINKOFF), this.displayPorts.CMD);
    }

    noCursor() {
        if (!this.BEGAN) {
            throw new Error('The LCD is not initialized. Must call begin() first.');
        }
        this.CURSOR = false;
        this.write(this.DISPLAYCONTROL | this.DISPLAYON | this.CURSOROFF | (this.BLINKING ? this.BLINKON : this.BLINKOFF), this.displayPorts.CMD);
    }

    blink() {
        if (!this.BEGAN) {
            throw new Error('The LCD is not initialized. Must call begin() first.');
        }
        this.BLINKING = true;
        this.write(this.DISPLAYCONTROL | this.DISPLAYON | (this.CURSOR ? this.CURSORON : this.CURSOROFF) | this.BLINKON, this.displayPorts.CMD);
    }

    noBlink() {
        if (!this.BEGAN) {
            throw new Error('The LCD is not initialized. Must call begin() first.');
        }
        this.BLINKING = false;
        this.write(this.DISPLAYCONTROL | this.DISPLAYON | (this.CURSOR ? this.CURSORON : this.CURSOROFF) | this.BLINKOFF, this.displayPorts.CMD);
    }

    display() {
        if (!this.BEGAN) {
            throw new Error('The LCD is not initialized. Must call begin() first.');
        }
        this.displayPorts.backlight = 0x08;
        this.write(this.DISPLAYCONTROL | this.DISPLAYON, this.displayPorts.CMD);
    }

    noDisplay() {
        if (!this.BEGAN) {
            throw new Error('The LCD is not initialized. Must call begin() first.');
        }
        this.displayPorts.backlight = 0x00;
        this.write(this.DISPLAYCONTROL | this.DISPLAYOFF, this.displayPorts.CMD);
    }

    scrollDisplayLeft() {
        if (!this.BEGAN) {
            throw new Error('The LCD is not initialized. Must call begin() first.');
        }
        this.write(this.CURSORSHIFT | this.DISPLAYMOVE | this.MOVELEFT);
    }

    scrollDisplayRight() {
        if (!this.BEGAN) {
            throw new Error('The LCD is not initialized. Must call begin() first.');
        }
        this.write(this.CURSORSHIFT | this.DISPLAYMOVE | this.MOVERIGHT);
    }

    leftToRight() {
        if (!this.BEGAN) {
            throw new Error('The LCD is not initialized. Must call begin() first.');
        }
        this.write(this.ENTRYMODESET | this.ENTRYLEFT);
    }

    rightToLeft() {
        if (!this.BEGAN) {
            throw new Error('The LCD is not initialized. Must call begin() first.');
        }
        this.write(this.ENTRYMODESET | this.ENTRYRIGHT);
    }

    createChar(ch, data) {
        if (!this.BEGAN) {
            throw new Error('The LCD is not initialized. Must call begin() first.');
        }
        this.write(this.SETCGRAMADDR | ((ch & 7) << 3), this.displayPorts.CMD);
        for (let i = 0; i < 8; i++) {
            this.write(data[i], this.displayPorts.CHR);
        }
        this.write(this.SETDDRAMADDR, this.displayPorts.CMD);
    }

    static getChar(charId) {
        return (String.fromCharCode(charId));
    }
}