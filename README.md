> open this page in [app](https://pythom1234.github.io/pxt-oled/)

Extension for [OLED](https://www.elecfreaks.com/learn-en/microbitOctopus/output/octopus_ef03155.html) display control.

## Documentation
<ins>***color***</ins> is the color of pixel on the OLED display. The `true` means that the pixel will be on, `false` means that the pixel will be off.

<ins>***x***</ins> and <ins>***y***</ins> are the x and y positions. Point 0,0 is in the upper left corner of the display. The display is 128 pixels wide (x) and 64 pixels high (y). This means that <ins>***x***</ins> can be from 0 to 127 and <ins>***y***</ins> can be from 0 to 63.

<ins>***toggle***</ins> sets whether pixel inversion is used instead of pixel redrawing.

### init OLED display (`OLED.init()`)
  Initalize OLED display connected at address 60 (0x3C) on I2C. Must be called when the program starts.
### set contrast <ins>***contrast***</ins> (`OLED.setContrast`)
  Sets contrast of display (0 to 255).
### clear <ins>***color***</ins> (`OLED.clear(false)`)
  Fills the display with <ins>***color***.
### draw (`OLED.draw()`)
  Sends data to the OLED display. You have to call it whenever you want to update the display.
### set pixel at x <ins>***x***</ins> y <ins>***y***</ins> to <ins>***color***</ins> (`OLED.setPx(0, 0, true)`)
  Sets the pixel color at position <ins>***x***</ins> <ins>***y***</ins> to <ins>***color***</ins>.
### toggle pixel at x <ins>***x***</ins> y <ins>***y***</ins> (`OLED.togglePx(0, 0, true)`)
  Toggles the pixel color at position <ins>***x***</ins> <ins>***y***</ins>.
### pixel at x <ins>***x***</ins> y <ins>***y***</ins> (`OLED.px(0, 0, true)`)
  Returns the pixel color at position <ins>***x***</ins> <ins>***y***.
### draw text <ins>***text***</ins> at x <ins>***x***</ins> y <ins>***y***</ins> color <ins>***color***</ins> toggle <ins>***toggle***</ins> (`OLED.drawText("", 0, 0, true)`)
  Draws the text <ins>***text***, which has the upper left corner at position <ins>***x***</ins> <ins>***y***. The color of the text is determined by <ins>***color***.
### draw rect at x1 <ins>***x1***</ins> y1 <ins>***y1***</ins> x2 <ins>***x2***</ins> y2 <ins>***y2***</ins> color <ins>***color***</ins> fill <ins>***fill***</ins> toggle <ins>***toggle***</ins> (`OLED.drawRect(0, 0, 0, 0, true, false)`)
  Draws a rectangle with the upper left vertex at position <ins>***x1*** <ins>***y1***</ins> and the lower right vertex at position <ins>***x2*** <ins>***y2***</ins>. The <ins>***fill***</ins> option specifies whether the rectangle will be filled with the <ins>***color***</ins> color. If `false`, then only the outline is drawn.
### draw line from x <ins>***x1***</ins> y <ins>***y1***</ins> to x <ins>***x1***</ins> y <ins>***y1***</ins> color <ins>***color***</ins> toggle <ins>***toggle***</ins> (`OLED.drawLine(0, 0, 0, 0, true)`)
  Draws a line from position <ins>***x1***</ins> <ins>***y1***</ins> to position <ins>***x2***</ins> <ins>***y2***.
### show image <ins>***image***</ins> x <ins>***x***</ins> y <ins>***y***</ins> color <ins>***color***</ins> background <ins>***background***</ins> toggle <ins>***toggle***</ins> (`OLED.drawImage(null, 0, 0, true, false)`)
  Show <ins>***image***</ins> of type Image at position <ins>***x***</ins> <ins>***y***. Fields filled in white in the image are drawn in <ins>***color***</ins> on the OLED display. The <ins>***background***</ins> determines whether fields that are not filled with white are also drawn. The **_Imageio_** library is useful for this command: [https://github.com/Pythom1234/pxt-imageio](https://github.com/Pythom1234/pxt-imageio)

## Supported targets
- for PXT/microbit
