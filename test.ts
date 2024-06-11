// initialize OLED display
OLED.init()
// make line (float position is allowed, it will be rounded)
for (let i = 0; i < 20; i++) {
    OLED.setPx(i, i / 2, true)
}
// show changes
OLED.draw()
// draw text "some text"
OLED.drawText("some text", 0, 20, true, false)
// show changes
OLED.draw()
// draw a rectangle across the screen (like when you invert the screen)
OLED.drawRect(0, 0, 127, 64, true, true, true)
// show changes
OLED.draw()
basic.pause(500)
// strike out text
OLED.drawLine(0, 20, 72, 28, false, false)
OLED.drawLine(0, 28, 72, 20, false, false)
// show changes
OLED.draw()
basic.pause(500)
// draw image
OLED.drawImage(imageio.createImage5x5(`
. . . . .
. # . # .
. . # . .
. # . # .
. . . . .
`), 50, 50, true, true, false)
// show changes
OLED.draw()