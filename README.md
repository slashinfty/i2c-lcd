# i2c-lcd
Kaluma library for liquid crystal display with PCF8574 I2C port expander (LCM1602 module)

## Prerequisite
[Get Kaluma](https://kalumajs.org/docs/getting-started)

## Install
```
npm install https://github.com/slashinfty/i2c-lcd
```

## Usage
Assuming the following wiring (and powered by USB):
| Pico | LCM1602 |
|------|---------|
| VBUS | VCC     |
| GND  | GND     |
| GP2  | SDA     |
| GP3  | SCL     |

```js
const { LCD } = require('i2c-lcd');
const lcd = new LCD();
lcd.begin();
```

## Examples
Coming soon.

## API - Class: LCD
### Constructor
- `new LCD(busNumber, address, cols, rows)`

| Name      | Default | Description                    |
|-----------|---------|--------------------------------|
| busNumber | 1       | bus number of the i2c device   |
| address   | 0x27    | address of the i2c device      |
| cols      | 16      | character width of the display |
| rows      | 2       | number of lines in the display  |
### Properties (read-only)
- `busNumber`
    - the bus number declared when instantiating the LCD object
- `address`
    - the i2c address declared when instantiating the LCD object
- `cols`
    - the number of characters width declared when instantiating the LCD object
- `rows`
    - the number of lines declared when instantiating the LCD object
- `began`
    - `true` if the LCD has been initialized, `false` if not
### Instance Methods
- `begin()`
    - initializes the interface to the LCD screen
    - must be called before any command
- `clear()`
    - clears the LCD screen and positions the cursor in the upper-left corner
- `home()`
    - positions the cursor in the upper-left of the LCD
- `setCursor(col, row)`
    - positions the LCD cursor to the specified location
- `print(str)`
    - prints text to the LCD at the cursor location
- `printLine(line, str)`
    - prints text to the LCD on the specified line
- `cursor()`
    - displays the LCD cursor (underscore line)
- `noCursor()`
    - hides the LCD cursor
- `blink()`
    - displays the blinking LCD cursor (white block)
- `noBlink()`
    - turns off the blinking LCD cursor
- `display()`
    - turns on the LCD display
- `noDisplay()`
    - turns off the LCD display
- `scrollDisplayLeft()`
    - scrolls the contents of the display (text and cursor) one space to the left
- `scrollDisplayRight()`
    - scrolls the contents of the display (text and cursor) one space to the right
- `leftToRight()`
    - sets the direction for text written to the LCD to left-to-right (default)
- `rightToLeft()`
    - sets the direction for text written to the LCD to right-to-left
- `createChar(id, data)`
    - creates a custom character (glyph) for use on the LCD
    - up to eight characters of 5x8 pixels are supported (id 0 to 7)
    - the appearance of each custom character is specified by an array of eight bytes, one for each row
    - the five least significant bits of each byte determine the pixels in that row
    - to display a custom character on the screen, use `print(LCD.getChar(id))`
    - for more information on creating characters, check out [this tool](https://www.quinapalus.com/hd44780udg.html)
### Static Methods
- `getChar(id)`
    - gets the custom character stored at the specified id

## Inspiration
- [raspberrypi-liquid-crystal](https://github.com/kevincastejon/js-raspberrypi-liquid-crystal) (npm package)
- [lcd](https://github.com/niklauslee/lcd) (Kaluha library)
