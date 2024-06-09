OLED.init()
OLED.clear(false)
for (let i = 0; i < 20; i++) {
    OLED.setPx(i, i, true)
    OLED.draw()
}
OLED.drawText("some text", 0, 20, true, false)
OLED.draw()
OLED.drawRect(0, 0, 32, 16, true, true, true)
OLED.draw()
basic.pause(100)
OLED.drawLine(20, 0, 30, 30, false, false)
OLED.draw()