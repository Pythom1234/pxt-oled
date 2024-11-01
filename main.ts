/**
 * MakeCode extension for controlling OLED display using BBC micro:bit.
 * License: MIT
 * Maintainer: Pythom1234
 * https://github.com/Pythom1234/pxt-oled
 */

//% icon="\uf26c" color=#0000ff block="OLED"
namespace oled {
    const ADDR = 0x3C
    let screen = pins.createBuffer(1025)
    let charset: string[] = []
    let charsetIndex: string[] = []

    // From microbit/micropython Chinese community
    function cmd1(cmd1: number): void {
        let buffer = pins.createBuffer(2)
        buffer[0] = 0x00
        buffer[1] = cmd1
        pins.i2cWriteBuffer(ADDR, buffer)
    }
    // From microbit/micropython Chinese community
    function cmd2(cmd1: number, cmd2: number): void {
        let buffer = pins.createBuffer(3)
        buffer[0] = 0x00
        buffer[1] = cmd1
        buffer[2] = cmd2
        pins.i2cWriteBuffer(ADDR, buffer)
    }
    // From microbit/micropython Chinese community
    function cmd3(cmd1: number, cmd2: number, cmd3: number): void {
        let buffer = pins.createBuffer(4)
        buffer[0] = 0x00
        buffer[1] = cmd1
        buffer[2] = cmd2
        buffer[3] = cmd3
        pins.i2cWriteBuffer(ADDR, buffer)
    }
    function setPos(col: number = 0, page: number = 0) {
        pins.i2cWriteNumber(ADDR, (0xB0 | page) % 256, NumberFormat.UInt16BE);
        pins.i2cWriteNumber(ADDR, (0x00 | (col % 16)) % 256, NumberFormat.UInt16BE);
        pins.i2cWriteNumber(ADDR, (0x10 | (col >> 4)) % 256, NumberFormat.UInt16BE);
    }
    function showbit(bit: number, shift: number): number {
        if (bit & (1 << shift)) { }
        else {
            bit += 1 << shift
        }
        return bit
    }
    function hidebit(bit: number, shift: number): number {
        if (bit & (1 << shift)) {
            bit -= 1 << shift
        }
        return bit
    }
    function getbit(bits: number, shift: number): number {
        return (bits >> shift) & 1;
    }
    /**
     * Initialize OLED display, this command must be called at the start of the program.
     */
    //% block="init OLED display"
    //% weight=101
    export function init(): void {
        screen = pins.createBuffer(1025)
        cmd1(0xAE)
        cmd1(0xA4)
        cmd2(0xD5, 0xF0)
        cmd2(0xA8, 0x3F)
        cmd2(0xD3, 0x00)
        cmd1(0x0)
        cmd2(0x8D, 0x14)
        cmd2(0x20, 0x00)
        cmd3(0x21, 0x0, 0x7F)
        cmd3(0x22, 0x0, 0x3F)
        cmd1(0xa0 | 0x1)
        cmd1(0xC8)
        cmd2(0xDA, 0x12)
        cmd2(0x81, 0xFF)
        cmd2(0xD9, 0xF1)
        cmd2(0xDB, 0x40)
        cmd1(0xA6)
        cmd2(0xD6, 0x0)
        cmd1(0xAF)
        clear(false)
        draw()
    }
    /**
     * Sets the luminance level to the specified value.
     * @param contrast luminance level, eg: 255
     */
    //% block="set contrast $contrast"
    //% contrast.defl=255
    //% contrast.min=0
    //% contrast.max=255
    //% weight=100
    export function setContrast(contrast: number): void {
        cmd2(0x81, contrast)
    }
    /**
     * Fills the display buffer with specified color.
     * You need to call `draw` to see the changes.
     * @param color filling color (usually `false`)
     */
    //% block="clear $color"
    //% color.defl=false
    //% weight=99
    export function clear(color: boolean): void {
        screen.fill((color) ? 0xFF : 0)
    }
    /**
     * Sends buffer to OLED display.
     * This command must be called whenever you want to show something on the OLED display.
     */
    //% block="draw"
    //% weight=98
    export function draw(): void {
        setPos()
        screen[0] = 0x40
        pins.i2cWriteBuffer(ADDR, screen, false)
    }
    /**
     * Sets pixel at x y to specified color color.
     * You need to call `draw` to see the changes.
     * @param x coordinate x (increases towards the right)
     * @param y coordinate y (increases downwards)
     * @param color color of pixel
     */
    //% block="set pixel at x $x y $y to $color"
    //% color.defl=true
    //% weight=97
    export function setPx(x: number, y: number, color: boolean): void {
        const index = Math.round(Math.floor(y / 8) * 128 + x + 1)
        if ((index < 1025) && (index > -1) && (x < 128) && (x > -1) && (y > -1) && (y < 128)) {
            screen[index] = (color) ? showbit(screen[index], (y % 8)) : hidebit(screen[index], (y % 8))
        }
    }
    /**
     * Toggles pixel at x y, it means that `true` will be `false` and vice versa.
     * You need to call `draw` to see the changes.
     * @param x coordinate x (increases towards the right)
     * @param y coordinate y (increases downwards)
     */
    //% block="toggle pixel at x $x y $y"
    //% weight=96
    export function togglePx(x: number, y: number): void {
        const index = Math.round(Math.floor(y / 8) * 128 + x + 1)
        if ((index < 1025) && (index > -1) && (x < 128) && (x > -1) && (y > -1) && (y < 128)) {
            screen[index] = (!px(x, y)) ? showbit(screen[index], (y % 8)) : hidebit(screen[index], (y % 8))
        }
    }
    /**
     * Returns color of pixel at x y in buffer.
     * @param x coordinate x (increases towards the right)
     * @param y coordinate y (increases downwards)
     */
    //% block="pixel at x $x y $y"
    //% weight=95
    export function px(x: number, y: number): boolean {
        const index = Math.round(Math.floor(y / 8) * 128 + x + 1)
        if ((index < 1025) && (index > -1) && (x < 128) && (x > -1) && (y > -1) && (y < 128)) {
            return getbit(screen[index], (y % 8)) == 1
        } else {
            return false
        }
    }
    /**
     * Draws text with upper left corner at x y.
     * Text has fixed width (8 px).
     * You need to call `draw` to see the changes.
     * @param text text to draw (not all characters are implemented yet)
     * @param x coordinate x of upper left corner of text (increases towards the right)
     * @param y coordinate y of upper left corner of text (increases downwards)
     * @param color color of text
     * @param toggle sets whether to use pixel switching instead of setting the pixel to a specific color (if `true`, `color` means nothing)
     */
    //% block="draw text $text at|x $x|y $y|color $color|toggle $toggle"
    //% color.defl=true
    //% toggle.defl=false
    //% weight=94
    export function drawText(text: string, x: number, y: number, color: boolean, toggle: boolean): void {
        const font = [
            "2,0 3,0 1,1 4,1 0,2 5,2 0,3 5,3 0,4 1,4 2,4 3,4 4,4 5,4 0,5 5,5 0,6 5,6 0,7 5,7",
            "0,0 1,0 2,0 3,0 4,0 0,1 5,1 0,2 5,2 0,3 1,3 2,3 3,3 4,3 0,4 5,4 0,5 5,5 0,6 5,6 0,7 1,7 2,7 3,7 4,7",
            "1,0 2,0 3,0 4,0 0,1 5,1 0,2 0,3 0,4 0,5 0,6 5,6 1,7 2,7 3,7 4,7",
            "0,0 1,0 2,0 3,0 4,0 0,1 5,1 0,2 5,2 0,3 5,3 0,4 5,4 0,5 5,5 0,6 5,6 0,7 1,7 2,7 3,7 4,7",
            "0,0 1,0 2,0 3,0 4,0 0,1 0,2 0,3 1,3 2,3 3,3 0,4 0,5 0,6 0,7 1,7 2,7 3,7 4,7",
            "0,0 1,0 2,0 3,0 4,0 0,1 0,2 0,3 0,4 1,4 2,4 3,4 0,5 0,6 0,7",
            "1,0 2,0 3,0 4,0 0,1 5,1 0,2 0,3 3,3 4,3 5,3 0,4 5,4 0,5 5,5 0,6 5,6 1,7 2,7 3,7 4,7",
            "0,0 5,0 0,1 5,1 0,2 5,2 0,3 1,3 2,3 3,3 4,3 5,3 0,4 5,4 0,5 5,5 0,6 5,6 0,7 5,7",
            "0,0 1,0 2,0 3,0 4,0 2,1 2,2 2,3 2,4 2,5 2,6 0,7 1,7 2,7 3,7 4,7",
            "2,0 3,0 4,0 5,0 4,1 4,2 4,3 4,4 4,5 0,6 4,6 1,7 2,7 3,7",
            "0,0 4,0 0,1 3,1 0,2 2,2 0,3 1,3 0,4 1,4 0,5 2,5 0,6 3,6 0,7 4,7",
            "0,0 0,1 0,2 0,3 0,4 0,5 0,6 0,7 1,7 2,7 3,7 4,7",
            "0,0 6,0 0,1 1,1 5,1 6,1 0,2 2,2 4,2 6,2 0,3 2,3 4,3 6,3 0,4 3,4 6,4 0,5 3,5 6,5 0,6 6,6 0,7 6,7",
            "0,0 5,0 0,1 1,1 5,1 0,2 2,2 5,2 0,3 2,3 5,3 0,4 3,4 5,4 0,5 3,5 5,5 0,6 4,6 5,6 0,7 5,7",
            "1,0 2,0 3,0 4,0 0,1 5,1 0,2 5,2 0,3 5,3 0,4 5,4 0,5 5,5 0,6 5,6 1,7 2,7 3,7 4,7",
            "0,0 1,0 2,0 3,0 4,0 0,1 5,1 0,2 5,2 0,3 5,3 0,4 1,4 2,4 3,4 4,4 0,5 0,6 0,7",
            "1,0 2,0 3,0 4,0 0,1 5,1 0,2 5,2 0,3 5,3 0,4 5,4 0,5 2,5 5,5 0,6 3,6 5,6 1,7 2,7 3,7 4,7 5,8",
            "0,0 1,0 2,0 3,0 4,0 0,1 5,1 0,2 5,2 0,3 5,3 0,4 1,4 2,4 3,4 4,4 0,5 3,5 0,6 4,6 0,7 5,7",
            "1,0 2,0 3,0 4,0 0,1 5,1 0,2 1,3 2,3 3,3 4,3 5,4 5,5 0,6 5,6 1,7 2,7 3,7 4,7",
            "0,0 1,0 2,0 3,0 4,0 2,1 2,2 2,3 2,4 2,5 2,6 2,7",
            "0,0 5,0 0,1 5,1 0,2 5,2 0,3 5,3 0,4 5,4 0,5 5,5 0,6 5,6 1,7 2,7 3,7 4,7",
            "0,0 6,0 0,1 6,1 1,2 5,2 1,3 5,3 2,4 4,4 2,5 4,5 3,6 3,7",
            "0,0 6,0 0,1 6,1 0,2 6,2 0,3 3,3 6,3 0,4 3,4 6,4 0,5 3,5 6,5 0,6 3,6 6,6 1,7 2,7 4,7 5,7",
            "0,0 1,0 5,0 6,0 1,1 5,1 2,2 4,2 3,3 3,4 2,5 4,5 1,6 5,6 0,7 1,7 5,7 6,7",
            "0,0 6,0 0,1 6,1 1,2 5,2 2,3 4,3 3,4 3,5 3,6 3,7",
            "0,0 1,0 2,0 3,0 4,0 5,0 5,1 4,2 3,3 2,4 1,5 0,6 0,7 1,7 2,7 3,7 4,7 5,7",
            "1,2 2,2 3,2 4,2 5,3 1,4 2,4 3,4 4,4 5,4 0,5 5,5 0,6 5,6 1,7 2,7 3,7 4,7 6,7",
            "0,0 0,1 0,2 2,2 3,2 4,2 0,3 1,3 5,3 0,4 5,4 0,5 5,5 0,6 5,6 0,7 1,7 2,7 3,7 4,7",
            "1,2 2,2 3,2 4,2 0,3 5,3 0,4 0,5 0,6 5,6 1,7 2,7 3,7 4,7",
            "5,0 5,1 1,2 2,2 3,2 5,2 0,3 4,3 5,3 0,4 5,4 0,5 5,5 0,6 5,6 1,7 2,7 3,7 4,7 5,7",
            "1,2 2,2 3,2 4,2 0,3 5,3 0,4 1,4 2,4 3,4 4,4 5,4 0,5 0,6 5,6 1,7 2,7 3,7 4,7",
            "2,0 3,0 4,0 1,1 1,2 0,3 1,3 2,3 3,3 1,4 1,5 1,6 1,7",
            "4,1 1,2 2,2 3,2 0,3 4,3 0,4 4,4 1,5 2,5 3,5 0,6 1,7 2,7 3,7 4,7 0,8 5,8 1,9 2,9 3,9 4,9",
            "0,0 0,1 0,2 2,2 3,2 4,2 0,3 1,3 5,3 0,4 5,4 0,5 5,5 0,6 5,6 0,7 5,7",
            "2,0 0,2 1,2 2,2 2,3 2,4 2,5 2,6 0,7 1,7 2,7 3,7 4,7",
            "4,0 2,2 3,2 4,2 4,3 4,4 4,5 4,6 4,7 0,8 4,8 1,9 2,9 3,9",
            "0,0 0,1 0,2 4,2 0,3 3,3 0,4 1,4 2,4 0,5 3,5 0,6 4,6 0,7 5,7",
            "0,0 1,0 2,0 2,1 2,2 2,3 2,4 2,5 2,6 0,7 1,7 2,7 3,7 4,7",
            "0,2 1,2 2,2 4,2 5,2 0,3 3,3 6,3 0,4 3,4 6,4 0,5 3,5 6,5 0,6 6,6 0,7 6,7",
            "0,2 2,2 3,2 4,2 0,3 1,3 5,3 0,4 5,4 0,5 5,5 0,6 5,6 0,7 5,7",
            "1,2 2,2 3,2 4,2 0,3 5,3 0,4 5,4 0,5 5,5 0,6 5,6 1,7 2,7 3,7 4,7",
            "0,2 2,2 3,2 4,2 0,3 1,3 5,3 0,4 5,4 0,5 5,5 0,6 5,6 0,7 1,7 2,7 3,7 4,7 0,8 0,9",
            "1,2 2,2 3,2 4,2 5,2 0,3 5,3 0,4 5,4 0,5 5,5 0,6 4,6 5,6 1,7 2,7 3,7 5,7 5,8 5,9",
            "0,2 1,2 3,2 4,2 5,2 1,3 2,3 5,3 1,4 1,5 1,6 1,7",
            "1,2 2,2 3,2 4,2 0,3 5,3 1,4 2,4 3,4 4,4 5,5 0,6 5,6 1,7 2,7 3,7 4,7",
            "1,0 1,1 0,2 1,2 2,2 3,2 1,3 1,4 1,5 1,6 4,6 2,7 3,7",
            "0,2 5,2 0,3 5,3 0,4 5,4 0,5 5,5 0,6 4,6 5,6 1,7 2,7 3,7 5,7",
            "0,2 4,2 0,3 4,3 1,4 3,4 1,5 3,5 2,6 2,7",
            "0,2 6,2 0,3 6,3 0,4 3,4 6,4 0,5 3,5 6,5 0,6 3,6 6,6 1,7 2,7 4,7 5,7",
            "0,2 1,2 4,2 5,2 1,3 4,3 2,4 3,4 2,5 3,5 1,6 4,6 0,7 1,7 4,7 5,7",
            "0,2 1,2 5,2 6,2 1,3 5,3 1,4 5,4 2,5 4,5 3,6 4,6 3,7 0,8 3,8 1,9 2,9",
            "0,2 1,2 2,2 3,2 4,2 5,2 4,3 3,4 2,5 1,6 0,7 1,7 2,7 3,7 4,7 5,7",
            "1,0 2,0 3,0 0,1 4,1 0,2 4,2 0,3 4,3 0,4 4,4 0,5 4,5 0,6 4,6 1,7 2,7 3,7",
            "2,0 1,1 2,1 0,2 2,2 2,3 2,4 2,5 2,6 0,7 1,7 2,7 3,7 4,7",
            "1,0 2,0 3,0 0,1 4,1 4,2 3,3 2,4 1,5 0,6 0,7 1,7 2,7 3,7 4,7",
            "1,0 2,0 3,0 0,1 4,1 4,2 2,3 3,3 4,4 4,5 0,6 4,6 1,7 2,7 3,7",
            "3,0 2,1 3,1 1,2 3,2 1,3 3,3 0,4 3,4 0,5 1,5 2,5 3,5 4,5 3,6 3,7",
            "0,0 1,0 2,0 3,0 4,0 0,1 0,2 0,3 1,3 2,3 3,3 0,4 4,4 4,5 0,6 4,6 1,7 2,7 3,7",
            "2,0 3,0 1,1 0,2 0,3 1,3 2,3 3,3 0,4 4,4 0,5 4,5 0,6 4,6 1,7 2,7 3,7",
            "0,0 1,0 2,0 3,0 4,0 4,1 3,2 2,3 2,4 1,5 1,6 1,7",
            "1,0 2,0 3,0 0,1 4,1 0,2 4,2 1,3 2,3 3,3 0,4 4,4 0,5 4,5 0,6 4,6 1,7 2,7 3,7",
            "1,0 2,0 3,0 0,1 4,1 0,2 4,2 0,3 4,3 1,4 2,4 3,4 4,4 4,5 3,6 1,7 2,7",
            "",
            "1,6 1,7 0,8",
            "1,1 2,1 3,1 0,2 4,2 3,3 2,4 2,5 2,7",
            "1,7",
            "1,1 1,2 1,3 1,4 1,5 1,7",
            "3,1 2,2 1,3 0,4 1,5 2,6 3,7",
            "0,1 1,2 2,3 3,4 2,5 1,6 0,7",
            "3,0 2,1 2,2 2,3 1,4 1,5 1,6 0,7 0,8",
            "0,2 0,3 0,6 0,7",
            "2,0 0,1 2,1 4,1 1,2 2,2 3,2 1,3 2,3 3,3 0,4 2,4 4,4 2,5",
            "0,4 1,4 2,4 3,4 4,4 5,4",
            "2,2 2,3 0,4 1,4 2,4 3,4 4,4 2,5 2,6",
            "0,3 1,3 2,3 3,3 4,3 5,3 0,5 1,5 2,5 3,5 4,5 5,5"]

        const fontIndex = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ' ', ',', '?', '.', '!', '<', '>', '/', ':', '*', '-', '+', '=']

        function getChar(char: string): number[][] {
            let out: number[][] = []
            if (charsetIndex.indexOf(char) != -1) {
                for (const tuple of charset[charsetIndex.indexOf(char)].split(' ')) {
                    const add = tuple.split(',')
                    out.push([parseInt(add[0]), parseInt(add[1])])
                }
            } else if (fontIndex.indexOf(char) != -1) {
                for (const tuple of font[fontIndex.indexOf(char)].split(' ')) {
                    const add = tuple.split(',')
                    out.push([parseInt(add[0]), parseInt(add[1])])
                }
            }
            return out
        }

        let iteration = 0
        for (const letter of text) {
            for (const pos of getChar(letter)) {
                if (toggle) {
                    togglePx(x + pos[0] + (iteration * 8), y + pos[1])
                } else {
                    setPx(x + pos[0] + (iteration * 8), y + pos[1], color)
                }
            }
            iteration++
        }
    }
    /**
     * Draws rectangle.
     * You need to call `draw` to see the changes.
     * @param x1 coordinate x of upper left corner of rectangle (increases towards the right)
     * @param y1 coordinate y of upper left corner of rectangle (increases downwards)
     * @param x2 coordinate x of lower right corner of rectangle (increases towards the right)
     * @param y2 coordinate y of lower right corner of rectangle (increases downwards)
     * @param color color of rectangle
     * @param fill sets whether only the outline or also the fill of the rectangle is drawn
     * @param toggle sets whether to use pixel switching instead of setting the pixel to a specific color (if `true`, `color` means nothing)
     */
    //% block="draw rect at|x1 $x1|y1 $y1|x2 $x2|y2 $y2|color $color|fill $fill|toggle $toggle"
    //% color.defl=true
    //% fill.defl=false
    //% toggle.defl=false
    //% weight=93
    export function drawRect(x1: number, y1: number, x2: number, y2: number, color: boolean, fill: boolean, toggle: boolean): void {
        if (fill) {
            for (let x = x1; x <= x2; x++) {
                for (let y = y1; y <= y2; y++) {
                    if (toggle) {
                        togglePx(x, y)
                    } else {
                        setPx(x, y, color)
                    }
                }
            }
        }
        else {
            for (let x = x1; x <= x2; x++) {
                if (toggle) {
                    togglePx(x, y1)
                } else {
                    setPx(x, y1, color)
                }
            }
            for (let y = y1 + 1; y < y2; y++) {
                if (toggle) {
                    togglePx(x1, y)
                } else {
                    setPx(x1, y, color)
                }
            }
            for (let x = x1; x <= x2; x++) {
                if (toggle) {
                    togglePx(x, y2)
                } else {
                    setPx(x, y2, color)
                }
            }
            for (let y = y1 + 1; y < y2; y++) {
                if (toggle) {
                    togglePx(x2, y)
                } else {
                    setPx(x2, y, color)
                }
            }
        }
    }
    /**
     * Draws line.
     * You need to call `draw` to see the changes.
     * @param x1 coordinate x of start of line (increases towards the right)
     * @param y1 coordinate y of start of line (increases downwards)
     * @param x2 coordinate x of end of line (increases towards the right)
     * @param y2 coordinate y of end of line (increases downwards)
     * @param color color of line
     * @param toggle sets whether to use pixel switching instead of setting the pixel to a specific color (if `true`, `color` means nothing)
     */
    //% block="draw line from|x $x1|y $y1|to|x $x2|y $y2|color $color|toggle $toggle"
    //% color.defl=true
    //% toggle.defl=false
    //% weight=92
    export function drawLine(x1: number, y1: number, x2: number, y2: number, color: boolean, toggle: boolean): void {
        const line = []
        const dx = Math.abs(x2 - x1)
        const dy = Math.abs(y2 - y1)
        const sx = x1 < x2 ? 1 : -1
        const sy = y1 < y2 ? 1 : -1
        let err = dx - dy
        while (true) {
            line.push([x1, y1])
            if (x1 === x2 && y1 === y2) {
                break
            }
            const e2 = 2 * err;
            if (e2 > -dy) {
                err -= dy
                x1 += sx
            }
            if (e2 < dx) {
                err += dx
                y1 += sy
            }
        }
        for (const pixel of line) {
            if (toggle) {
                togglePx(pixel[0], pixel[1])
            } else {
                setPx(pixel[0], pixel[1], color)
            }
        }
    }
    /**
     * Draws image.
     * You need to call `draw` to see the changes.
     * @param image image to draw (can be `images.createImage()` or image from extension `imageio`)
     * @param x coordinate x of upper left corner of image (increases towards the right)
     * @param y coordinate y of upper left corner of image (increases downwards)
     * @param color color of image (if `true`, pixel `true` in image will be drawn as `true`)
     * @param bg sets whether empty pixels of the image are drawn (drawn with `not color`)
     * @param toggle sets whether to use pixel switching instead of setting the pixel to a specific color (if `true`, `color` means nothing)
     */
    //% block="show image|$image|x $x|y $y|color $color|background $bg|toggle $toggle"
    //% color.defl=true
    //% bg.defl=false
    //% toggle.defl=false
    //% weight=100
    //% advanced=true
    export function drawImage(image: Image, x: number, y: number, color: boolean, bg: boolean, toggle: boolean): void {
        if ((image != null) && (image != undefined)) {
            for (let img_x = 0; img_x < image.width(); img_x++) {
                for (let img_y = 0; img_y < image.height(); img_y++) {
                    let c = image.pixel(img_x, img_y)
                    if ((bg && !c) || (c)) {
                        if (!color) {
                            c = !c
                        }
                        if (toggle) {
                            togglePx(x + img_x, y + img_y)
                        } else {
                            setPx(x + img_x, y + img_y, c)
                        }
                    }
                }
            }
        }
    }
    /**
     * Add character for function `draw text`.
     * For example, if you add character "_" and call `draw text "a_b"`, it will draw "a", then your custom character, then "b".
     * Drag `character image` from the same category into field `image`.
     * @param image character image to add to custom charset
     * @param char character name
     */
    //% block="add character $char $image"
    //% advanced=true
    //% weight=99
    export function addChar(image: Image, char: string): void {
        if (char != "" && image != null && image != undefined) {
            char = char[0]
            let compressedChar = ""
            for (let x = 0; x < 8; x++) {
                for (let y = 0; y < 10; y++) {
                    if (image.pixel(x, y)) {
                        if (!(compressedChar == "")) {
                            compressedChar += " "
                        }
                        compressedChar += x.toString() + "," + y.toString()
                    }
                }
            }
            charset.push(compressedChar)
            charsetIndex.push(char)
        }
    }
    /**
     * Create image for `add character` function.
     */
    //% block="character image"
    //% advanced=true
    //% weight=98
    //% shim=images::createImage
    //% imageLiteral=1 imageLiteralRows=10 imageLiteralColumns=8
    export function charImage(leds: string): Image {
        return <Image><any>leds
    }
}
