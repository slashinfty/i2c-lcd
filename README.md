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
const {LCD} = require('lcd');
const lcd = new LCD();
lcd.begin();
```

## Examples
Coming soon.

## API - Class: LCD
- **constructor ( bus : int, address : int, width : int, height : int )**
### Properties (read-only)
- **busNumber** : int - The bus number declared when instantiating the LCD object (default: 1).
- **address** : int - The i2c address declared when instantiating the LCD object (default: 0x27).
- **cols** : int - The number of characters width declared when instantiating the LCD object (default: 16).
- **rows** : int - The number of lines declared when instantiating the LCD object (default: 2).
- **began** : boolean - True if the LCD has been initialized, false if not.
### Methods
- **begin ()** - Initializes the interface to the LCD screen. Has to be called before any command.
- **clear ()** - Clears the LCD screen and positions the cursor in the upper-left corner.
- **home ()** - Positions the cursor in the upper-left of the LCD.
- **setCursor ( col : int, row : int )** - Positions the LCD cursor.
- **print ( text : string )** - Prints text to the LCD.
- **printLine ( line : int, text : string )** - Prints text to the LCD on the specified line.
- **cursor ()** - Displays the LCD cursor (underscore line).
- **noCursor ()** - Hides the LCD cursor.
- **blink ()** - Displays the blinking LCD cursor (white block).
- **noBlink ()** - Turns off the blinking LCD cursor.
- **display ()** - Turns on the LCD display.
- **noDisplay ()** - Turns off the LCD display.
- **scrollDisplayLeft ()** - Scrolls the contents of the display (text and cursor) one space to the left.
- **scrollDisplayRight ()** - Scrolls the contents of the display (text and cursor) one space to the right.
- **leftToRight ()** - Sets the direction for text written to the LCD to left-to-right, the default.
- **rightToLeft ()** - Sets the direction for text written to the LCD to right-to-left.
- **createChar ( id : int, dots : array of int )** - Creates a custom character (glyph) for use on the LCD. Up to eight characters of 5x8 pixels are supported (id 0 to 7). The appearance of each custom character is specified by an array of eight bytes, one for each row. The five least significant bits of each byte determine the pixels in that row. To display a custom character on the screen, use `print(LCD.getChar(id))`. For more information on creating characters, check out [this tool](https://www.quinapalus.com/hd44780udg.html).

## Inspiration
- [raspberrypi-liquid-crystal](https://github.com/kevincastejon/js-raspberrypi-liquid-crystal) (npm package)
- [lcd](https://github.com/niklauslee/lcd) (Kaluha library)