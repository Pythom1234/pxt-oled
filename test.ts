OLED.init()
basic.forever(function() {
    OLED.clear(false)
    for (let i = 0; i < 20; i++) {
        OLED.setPx(i, i, true)
        OLED.draw()
    }
    OLED.drawText("some text", 0, 20, true, false)
    OLED.draw()
    OLED.drawRect(0, 0, 127, 63, true, true, true)
    OLED.draw()
    OLED.drawLine(20, 0, 30, 30, false, false)
    OLED.draw()
})