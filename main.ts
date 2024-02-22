
//% icon="\uf26c" color=#0000ff
namespace OLED {
    const ADDR = 0x3C
    let screen = pins.createBuffer(1025)

    function cmd1(cmd1: number): void {
        let buffer = pins.createBuffer(2)
        buffer[0] = 0x00
        buffer[1] = cmd1
        pins.i2cWriteBuffer(ADDR, buffer)
    }
    function cmd2(cmd1: number, cmd2: number): void {
        let buffer = pins.createBuffer(3)
        buffer[0] = 0x00
        buffer[1] = cmd1
        buffer[2] = cmd2
        pins.i2cWriteBuffer(ADDR, buffer)
    }
    function cmd3(cmd1: number, cmd2: number, cmd3: number): void {
        let buffer = pins.createBuffer(4)
        buffer[0] = 0x00
        buffer[1] = cmd1
        buffer[2] = cmd2
        buffer[3] = cmd3
        pins.i2cWriteBuffer(ADDR, buffer)
    }
    //% block="init OLED display"
    //% weight=100
    //% block.loc.cs="inicializovat OLED display"
    export function init(): void {
        cmd1(0xAE)
        cmd1(0xA4)
        cmd2(0xD5, 0xF0)
        cmd2(0xA8, 0x3F)
        cmd2(0xD3, 0x00)
        cmd1(0 | 0x0)
        cmd2(0x8D, 0x14)
        cmd2(0x20, 0x00)
        cmd3(0x21, 0, 127)
        cmd3(0x22, 0, 63)
        cmd1(0xa0 | 0x1)
        cmd1(0xc8)
        cmd2(0xDA, 0x12)
        cmd2(0x81, 0xCF)
        cmd2(0xd9, 0xF1)
        cmd2(0xDB, 0x40)
        cmd1(0xA6)
        cmd2(0xD6, 0)
        cmd1(0xAF)
        clear(false)
        draw()
    }
    function setPos(col: number = 0, page: number = 0) {
        pins.i2cWriteNumber(ADDR, (0xb0 | page) % 256, NumberFormat.UInt16BE);
        pins.i2cWriteNumber(ADDR, (0x00 | (col % 16)) % 256, NumberFormat.UInt16BE);
        pins.i2cWriteNumber(ADDR, (0x10 | (col >> 4)) % 256, NumberFormat.UInt16BE);
    }
    //% block="draw"
    //% weight=98
    //% block.loc.cs="vykreslit"
    export function draw(): void {
        setPos()
        screen[0] = 0x40
        pins.i2cWriteBuffer(ADDR, screen, false)
    }
    //% block="clear $color"
    //% weight=99
    //% color.defl=false
    //% block.loc.cs="vymazat barvou $color"
    export function clear(color: boolean): void {
        screen.fill((color) ? 0xFF : 0)
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
    //% block="set pixel at x $x y $y to $color"
    //% color.defl=true
    //% weight=96
    //% block.loc.cs="nastavit pixel na x $x y $y na barvu $color"
    export function setPx(x: number, y: number, color: boolean): void {
        const index = Math.floor(y / 8) * 128 + x + 1
        if ((index < 1025) && (x < 128) && (x > -1)) {
            screen[index] = (color) ? showbit(screen[index], (y % 8)) : hidebit(screen[index], (y % 8))
        }
    }
    //% block="add text $text at|x $x|y $y|color $color"
    //% color.defl=true
    //% weight=95
    //% block.loc.cs="přidat text $text na|x $x|y $y|barva $color"
    export function text(text: string, x: number, y: number, color: boolean): void {
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

        function getFont(index: number): Array<Array<number>> {
            let out: Array<Array<number>> = []
            for (const tuple of font[index].split(' ')) {
                const add = tuple.split(',')
                out.push([parseInt(add[0]), parseInt(add[1])])
            }
            return out
        }
        
        const splitted_text: string[] = [];
        for (let i = 0; i < text.length; i += 16) {
            splitted_text.push(text.slice(i, i + 16));
        }
        for (const text of splitted_text) {
            let iteration = 0
            for (const letter of text) {
                if (fontIndex.some(l => l === letter)) {
                    for (const pos of getFont(fontIndex.indexOf(letter))) {
                        setPx(x + pos[0] + (iteration * 8), y + pos[1], color)
                    }
                    iteration++
                }
            }
            y += 11
        }
    }
    function invertBits(num: number): number {
        let invert = 1
        for (let i = 1; i < 8; i++) {
            invert = (invert << 1) | 1
        }
        return invert ^ num
    }
    //% block="draw rect at|x1 $x1|y1 $y1|x2 $x2|y2 $y2|color $color|fill $fill"
    //% color.defl=true
    //% weight=94
    //% block.loc.cs="nakreslit čtyřúhelník na|x1 $x1|y1 $y1|x2 $x2|y2 $y2|barva $color|vyplnit $fill"
    export function drawRect(x1: number, y1: number, x2: number, y2: number, color: boolean, fill: boolean): void {
        let pixels = []
        if (fill) {
            for (let x = x1; x <= x2; x++) {
                for (let y = y1; y <= y2; y++) {
                    pixels.push([x, y])
                }
            }
        }
        else {
            for (let x = x1; x <= x2; x++) {
                pixels.push([x, y1])
                pixels.push([x, y2])
            }
            for (let y = y1 + 1; y < y2; y++) {
                pixels.push([x1, y])
                pixels.push([x2, y])
            }
        }
        for (const pixel of pixels) {
            setPx(pixel[0], pixel[1], color)
        }
    }
    //% block="invert display"
    //% weight=97
    //% block.loc.cs="obrátit display"
    export function invert(): void {
        for (let i = 0; i <= screen.length; i++) {
            screen[i] = invertBits(screen[i])
        }
        cmd1(0xA5)
        draw()
        cmd1(0xA4)
    }
    //% block="draw line from|x $x1|y $y1|to|x $x2|y $y2|color $color"
    //% color.defl=true
    //% weight=93
    //% block.loc.cs="nakreslit čáru z|x1 $x1|y1 $y1|x2 $x2|y2 $y2|barva $color"
    export function drawLine(x1: number, y1: number, x2: number, y2: number, color: boolean): void {
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
            setPx(pixel[0], pixel[1], color)
        }
    }
    //% block="show image|$image|x $x|y $y|color $color|background $bg"
    //% color.defl=true
    //% weight=92
    //% block.loc.cs="nakreslit obrázek|$image|x$x|y $y|barva $color|překreslit pozadí $bg"
    export function drawImage(image: Image, x: number, y: number, color: boolean, bg: boolean): void {
        for (let img_x = 0; img_x < image.width(); img_x++) {
            for (let img_y = 0; img_y < image.width(); img_y++) {
                let c = image.pixel(img_x, img_y)
                if ((bg && !c) || (c)) {
                    if (!color) {
                        c = !c
                    }
                    setPx(x + img_x, y + img_y, c)
                }
            }
        }
    }
}
