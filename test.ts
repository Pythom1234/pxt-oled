// initialize oled display
oled.init()
// make line (float position is allowed, it will be rounded)
for (let i = 0; i < 20; i++) {
    oled.setPx(i, i / 2, true)
}
// show changes
oled.draw()
// draw a rectangle across the screen (like when you invert the screen)
oled.drawRect(0, 0, 127, 64, true, true, true)
// show changes
oled.draw()
basic.pause(500)
// draw cross
oled.drawLine(0, 20, 72, 28, false, false)
oled.drawLine(0, 28, 72, 20, false, false)
// show changes
oled.draw()
basic.pause(500)
// draw image
oled.drawImage(images.createImage(`
. . . . .
. # . # .
. . # . .
. # . # .
. . . . .
`), 50, 50, true, true, false)
// show changes
oled.draw()