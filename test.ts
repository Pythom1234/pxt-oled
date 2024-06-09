OLED.init()
OLED.clear(false)
for (let i = 0; i < 20; i++) {
    OLED.setPx(i, i / 2, true)
}
OLED.draw()
OLED.drawText("some text", 0, 20, true, false)
OLED.draw()
OLED.drawRect(0, 0, 127, 64, true, true, true)
OLED.draw()
basic.pause(500)
OLED.drawLine(0, 20, 72, 28, false, false)
OLED.drawLine(0, 28, 72, 20, false, false)
OLED.draw()
basic.pause(500)
OLED.drawImage(imageio.createImage5x5(`
. . . . .
. # . # .
. . # . .
. # . # .
. . . . .
`), 50, 50, true, true, false)
OLED.draw()