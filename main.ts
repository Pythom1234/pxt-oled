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
    let charset: number[][] = []
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
        cmd1(0xa1)
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
        pins.i2cWriteNumber(ADDR, 0xB0, NumberFormat.UInt16BE)
        pins.i2cWriteNumber(ADDR, 0x00, NumberFormat.UInt16BE)
        pins.i2cWriteNumber(ADDR, 0x10, NumberFormat.UInt16BE)
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
            [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
            [0x00, 0x10, 0x10, 0x10, 0x10, 0x10, 0x00, 0x10, 0x10, 0x00, 0x00],
            [0x24, 0x24, 0x24, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
            [0x00, 0x24, 0x24, 0x7E, 0x24, 0x7E, 0x24, 0x24, 0x00, 0x00, 0x00],
            [0x00, 0x08, 0x1C, 0x2A, 0x18, 0x0C, 0x2A, 0x1C, 0x08, 0x00, 0x00],
            [0x00, 0x24, 0x5C, 0x28, 0x08, 0x10, 0x14, 0x2A, 0x24, 0x00, 0x00],
            [0x00, 0x10, 0x28, 0x28, 0x10, 0x2A, 0x44, 0x44, 0x3A, 0x00, 0x00],
            [0x08, 0x08, 0x10, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
            [0x04, 0x08, 0x08, 0x10, 0x10, 0x10, 0x10, 0x08, 0x08, 0x04, 0x00],
            [0x20, 0x10, 0x10, 0x08, 0x08, 0x08, 0x08, 0x10, 0x10, 0x20, 0x00],
            [0x00, 0x08, 0x2A, 0x1C, 0x1C, 0x2A, 0x08, 0x00, 0x00, 0x00, 0x00],
            [0x00, 0x00, 0x00, 0x08, 0x08, 0x3E, 0x08, 0x08, 0x00, 0x00, 0x00],
            [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x08, 0x08, 0x10, 0x00],
            [0x00, 0x00, 0x00, 0x00, 0x00, 0x7E, 0x00, 0x00, 0x00, 0x00, 0x00],
            [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x10, 0x10, 0x00, 0x00],
            [0x04, 0x04, 0x08, 0x08, 0x08, 0x10, 0x10, 0x10, 0x20, 0x20, 0x00],
            [0x00, 0x1C, 0x22, 0x22, 0x22, 0x22, 0x22, 0x22, 0x1C, 0x00, 0x00],
            [0x00, 0x08, 0x18, 0x28, 0x08, 0x08, 0x08, 0x08, 0x3E, 0x00, 0x00],
            [0x00, 0x1C, 0x22, 0x02, 0x04, 0x08, 0x10, 0x20, 0x3E, 0x00, 0x00],
            [0x00, 0x1C, 0x22, 0x02, 0x0C, 0x02, 0x02, 0x22, 0x1C, 0x00, 0x00],
            [0x00, 0x04, 0x0C, 0x14, 0x14, 0x24, 0x3E, 0x04, 0x04, 0x00, 0x00],
            [0x00, 0x3E, 0x20, 0x20, 0x3C, 0x22, 0x02, 0x22, 0x1C, 0x00, 0x00],
            [0x00, 0x0C, 0x10, 0x20, 0x3C, 0x22, 0x22, 0x22, 0x1C, 0x00, 0x00],
            [0x00, 0x3E, 0x02, 0x04, 0x08, 0x08, 0x10, 0x10, 0x10, 0x00, 0x00],
            [0x00, 0x1C, 0x22, 0x22, 0x1C, 0x22, 0x22, 0x22, 0x1C, 0x00, 0x00],
            [0x00, 0x1C, 0x22, 0x22, 0x22, 0x1E, 0x02, 0x04, 0x18, 0x00, 0x00],
            [0x00, 0x00, 0x00, 0x10, 0x10, 0x00, 0x00, 0x10, 0x10, 0x00, 0x00],
            [0x00, 0x00, 0x00, 0x10, 0x10, 0x00, 0x00, 0x10, 0x10, 0x20, 0x00],
            [0x00, 0x00, 0x04, 0x08, 0x10, 0x20, 0x10, 0x08, 0x04, 0x00, 0x00],
            [0x00, 0x00, 0x00, 0x00, 0x7E, 0x00, 0x7E, 0x00, 0x00, 0x00, 0x00],
            [0x00, 0x00, 0x20, 0x10, 0x08, 0x04, 0x08, 0x10, 0x20, 0x00, 0x00],
            [0x00, 0x38, 0x44, 0x08, 0x10, 0x10, 0x00, 0x10, 0x10, 0x00, 0x00],
            [0x00, 0x3C, 0x42, 0x4E, 0x52, 0x52, 0x4E, 0x40, 0x3C, 0x00, 0x00],
            [0x00, 0x18, 0x24, 0x42, 0x42, 0x7E, 0x42, 0x42, 0x42, 0x00, 0x00],
            [0x00, 0x7C, 0x42, 0x42, 0x7C, 0x42, 0x42, 0x42, 0x7C, 0x00, 0x00],
            [0x00, 0x3C, 0x42, 0x40, 0x40, 0x40, 0x40, 0x42, 0x3C, 0x00, 0x00],
            [0x00, 0x7C, 0x42, 0x42, 0x42, 0x42, 0x42, 0x42, 0x7C, 0x00, 0x00],
            [0x00, 0x3E, 0x20, 0x20, 0x3C, 0x20, 0x20, 0x20, 0x3E, 0x00, 0x00],
            [0x00, 0x3E, 0x20, 0x20, 0x20, 0x3C, 0x20, 0x20, 0x20, 0x00, 0x00],
            [0x00, 0x3C, 0x42, 0x40, 0x4E, 0x42, 0x42, 0x42, 0x3C, 0x00, 0x00],
            [0x00, 0x42, 0x42, 0x42, 0x7E, 0x42, 0x42, 0x42, 0x42, 0x00, 0x00],
            [0x00, 0x3E, 0x08, 0x08, 0x08, 0x08, 0x08, 0x08, 0x3E, 0x00, 0x00],
            [0x00, 0x1E, 0x04, 0x04, 0x04, 0x04, 0x04, 0x44, 0x38, 0x00, 0x00],
            [0x00, 0x22, 0x24, 0x28, 0x30, 0x30, 0x28, 0x24, 0x22, 0x00, 0x00],
            [0x00, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x3E, 0x00, 0x00],
            [0x00, 0x41, 0x63, 0x55, 0x55, 0x49, 0x49, 0x41, 0x41, 0x00, 0x00],
            [0x00, 0x42, 0x62, 0x52, 0x52, 0x4A, 0x4A, 0x46, 0x42, 0x00, 0x00],
            [0x00, 0x3C, 0x42, 0x42, 0x42, 0x42, 0x42, 0x42, 0x3C, 0x00, 0x00],
            [0x00, 0x7C, 0x42, 0x42, 0x42, 0x7C, 0x40, 0x40, 0x40, 0x00, 0x00],
            [0x00, 0x3C, 0x42, 0x42, 0x42, 0x42, 0x52, 0x4A, 0x3C, 0x02, 0x00],
            [0x00, 0x7C, 0x42, 0x42, 0x42, 0x7C, 0x48, 0x44, 0x42, 0x00, 0x00],
            [0x00, 0x3C, 0x42, 0x40, 0x3C, 0x02, 0x02, 0x42, 0x3C, 0x00, 0x00],
            [0x00, 0x3E, 0x08, 0x08, 0x08, 0x08, 0x08, 0x08, 0x08, 0x00, 0x00],
            [0x00, 0x42, 0x42, 0x42, 0x42, 0x42, 0x42, 0x42, 0x3C, 0x00, 0x00],
            [0x00, 0x41, 0x41, 0x22, 0x22, 0x14, 0x14, 0x08, 0x08, 0x00, 0x00],
            [0x00, 0x41, 0x41, 0x41, 0x49, 0x49, 0x49, 0x49, 0x36, 0x00, 0x00],
            [0x00, 0x63, 0x22, 0x14, 0x08, 0x08, 0x14, 0x22, 0x63, 0x00, 0x00],
            [0x00, 0x41, 0x41, 0x22, 0x14, 0x08, 0x08, 0x08, 0x08, 0x00, 0x00],
            [0x00, 0x7E, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x7E, 0x00, 0x00],
            [0x1C, 0x10, 0x10, 0x10, 0x10, 0x10, 0x10, 0x10, 0x10, 0x1C, 0x00],
            [0x20, 0x20, 0x10, 0x10, 0x10, 0x08, 0x08, 0x08, 0x04, 0x04, 0x00],
            [0x38, 0x08, 0x08, 0x08, 0x08, 0x08, 0x08, 0x08, 0x08, 0x38, 0x00],
            [0x00, 0x00, 0x00, 0x08, 0x14, 0x22, 0x00, 0x00, 0x00, 0x00, 0x00],
            [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x7E, 0x00, 0x00],
            [0x08, 0x08, 0x04, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
            [0x00, 0x00, 0x00, 0x3C, 0x02, 0x3E, 0x42, 0x42, 0x3D, 0x00, 0x00],
            [0x00, 0x40, 0x40, 0x5C, 0x62, 0x42, 0x42, 0x42, 0x7C, 0x00, 0x00],
            [0x00, 0x00, 0x00, 0x3C, 0x42, 0x40, 0x40, 0x42, 0x3C, 0x00, 0x00],
            [0x00, 0x02, 0x02, 0x3A, 0x46, 0x42, 0x42, 0x42, 0x3E, 0x00, 0x00],
            [0x00, 0x00, 0x00, 0x3C, 0x42, 0x7E, 0x40, 0x42, 0x3C, 0x00, 0x00],
            [0x00, 0x0E, 0x10, 0x10, 0x3C, 0x10, 0x10, 0x10, 0x10, 0x00, 0x00],
            [0x00, 0x00, 0x04, 0x38, 0x44, 0x44, 0x38, 0x40, 0x3C, 0x42, 0x3C],
            [0x00, 0x40, 0x40, 0x5C, 0x62, 0x42, 0x42, 0x42, 0x42, 0x00, 0x00],
            [0x08, 0x08, 0x00, 0x38, 0x08, 0x08, 0x08, 0x08, 0x3E, 0x00, 0x00],
            [0x04, 0x04, 0x00, 0x1C, 0x04, 0x04, 0x04, 0x04, 0x04, 0x44, 0x38],
            [0x00, 0x40, 0x40, 0x44, 0x48, 0x70, 0x48, 0x44, 0x42, 0x00, 0x00],
            [0x00, 0x38, 0x08, 0x08, 0x08, 0x08, 0x08, 0x08, 0x3E, 0x00, 0x00],
            [0x00, 0x00, 0x00, 0x76, 0x49, 0x49, 0x49, 0x41, 0x41, 0x00, 0x00],
            [0x00, 0x00, 0x00, 0x5C, 0x62, 0x42, 0x42, 0x42, 0x42, 0x00, 0x00],
            [0x00, 0x00, 0x00, 0x3C, 0x42, 0x42, 0x42, 0x42, 0x3C, 0x00, 0x00],
            [0x00, 0x00, 0x00, 0x5C, 0x62, 0x42, 0x42, 0x42, 0x7C, 0x40, 0x40],
            [0x00, 0x00, 0x00, 0x3E, 0x42, 0x42, 0x42, 0x46, 0x3A, 0x02, 0x02],
            [0x00, 0x00, 0x00, 0x6E, 0x32, 0x20, 0x20, 0x20, 0x20, 0x00, 0x00],
            [0x00, 0x00, 0x00, 0x3C, 0x42, 0x3C, 0x02, 0x42, 0x3C, 0x00, 0x00],
            [0x00, 0x10, 0x10, 0x3C, 0x10, 0x10, 0x10, 0x12, 0x0C, 0x00, 0x00],
            [0x00, 0x00, 0x00, 0x42, 0x42, 0x42, 0x42, 0x46, 0x3A, 0x00, 0x00],
            [0x00, 0x00, 0x00, 0x22, 0x22, 0x14, 0x14, 0x08, 0x08, 0x00, 0x00],
            [0x00, 0x00, 0x00, 0x41, 0x41, 0x49, 0x49, 0x49, 0x36, 0x00, 0x00],
            [0x00, 0x00, 0x00, 0x66, 0x24, 0x18, 0x18, 0x24, 0x66, 0x00, 0x00],
            [0x00, 0x00, 0x00, 0x63, 0x22, 0x22, 0x14, 0x0C, 0x08, 0x48, 0x30],
            [0x00, 0x00, 0x00, 0x7E, 0x04, 0x08, 0x10, 0x20, 0x7E, 0x00, 0x00],
            [0x0C, 0x10, 0x10, 0x08, 0x30, 0x08, 0x10, 0x10, 0x10, 0x0C, 0x00],
            [0x10, 0x10, 0x10, 0x10, 0x10, 0x10, 0x10, 0x10, 0x10, 0x10, 0x00],
            [0x30, 0x08, 0x08, 0x10, 0x0C, 0x10, 0x08, 0x08, 0x08, 0x30, 0x00],
            [0x00, 0x00, 0x00, 0x32, 0x4C, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]
        ]
        let line = 0
        let lineStart = 0
        for (let i = 0; i < text.length; i++) {
            if (text[i] == '\n') {
                line++
                lineStart = i + 1
            } else if (charsetIndex.indexOf(text[i]) !== -1) {
                for (let j = 0; j < 11; j++) {
                    for (let k = 0; k < 8; k++) {
                        if (charset[charsetIndex.indexOf(text[i])][j] & (0x01 << k)) {
                            if (toggle) {
                                togglePx(x + ((i - lineStart) * 8) + (8 - k), y + (line * 10) + j)
                            } else {
                                setPx(x + ((i - lineStart) * 8) + (8 - k), y + (line * 10) + j, color)
                            }
                        }
                    }
                }
            } else {
                for (let j = 0; j < 11; j++) {
                    for (let k = 0; k < 8; k++) {
                        if (font[text[i].charCodeAt(0) - 32][j] & (0x01 << k)) {
                            if (toggle) {
                                togglePx(x + ((i - lineStart) * 8) + (8 - k), y + (line * 10) + j)
                            } else {
                                setPx(x + ((i - lineStart) * 8) + (8 - k), y + (line * 10) + j, color)
                            }
                        }
                    }
                }
            }
            control.waitMicros(1)
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
                control.waitMicros(1)
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
            let compressedChar: number[] = []
            for (let y = 0; y < 11; y++) {
                let tmp = 0x00
                for (let x = 0; x < 8; x++) {
                    if (image.pixel(x, y)) {
                        tmp |= 0x01 << (8 - x)
                    }
                }
                compressedChar.push(tmp)
            }
            charset.unshift(compressedChar)
            charsetIndex.unshift(char)
        }
    }
    /**
     * Create image for `add character` function.
     */
    //% block="character image"
    //% advanced=true
    //% weight=98
    //% shim=images::createImage
    //% imageLiteral=1 imageLiteralRows=11 imageLiteralColumns=8
    export function charImage(leds: string): Image {
        return <Image><any>leds
    }
}
