Extension for OLED display control.

## Documentation
**\<color\>** is the color of pixel on the OLED display. The `true` means that the pixel will be on, `false` means that the pixel will be off.

**\<x\>** and **\<y\>** are the x and y positions. Point 0,0 is in the upper left corner of the display. The display is 128 pixels wide (x) and 64 pixels high (y). This means that **\<x\>** can be from 0 to 127 and **\<y\>** can be from 0 to 63.
- ### init OLED display (<kbd>OLED.init()</kbd>)
  Initalize OLED display connected at address 60 on I2C. Must be called when the program starts.
- ### clear \<color\> (<kbd>OLED.clear(false)</kbd>):
  Fills the display with \<color\>.
- ### draw (<kbd>OLED.draw()</kbd>)
  Sends data to the OLED display. You have to call it whenever you want to update the display.
- ### invert display (<kbd>OLED.invert()</kbd>)
  It changes the colour of each pixel on the display to a different colour. This means that if a pixel is on, it will be turned off, and if a pixel is off, it will be on. After this function you don't have to call **draw** function.
- ### set pixel at x \<x\> y \<y\> to \<color\> (<kbd>OLED.setPx(0, 0, true)</kbd>)
  Sets the pixel color at position \<x\> \<y\> to \<color\>.
- ### add text \<text\> at x \<x\> y \<y\> color \<color\> (<kbd>OLED.text("", 0, 0, true)</kbd>)
  Draws the text \<text\>, which has the upper left corner at position \<x\> \<y\>. The color of the text is determined by \<color\>.
- ### draw rect at x1 \<x1\> y1 \<y1\> x2 \<x2\> y2 \<y2\> color \<color\> fill \<fill\> (<kbd>OLED.drawRect(0, 0, 0, 0, true, false)</kbd>)
  Draws a rectangle with the upper left vertex at position \<x1> \<y1> and the lower right vertex at position \<x2> \<y2>. The \<fill> option specifies whether the rectangle will be filled with the \<color> color. If `false`, then only the outline is drawn.
- ### draw line from x \<x1> y \<y1> to x \<x1> y \<y1> color \<color> (<kbd>OLED.drawLine(0, 0, 0, 0, true)</kbd>)
  Draws a line from position <x1> <y1> to position <x2> <y2>.
- ### show image \<image> x \<x> y \<y> color \<color> background \<background> (<kbd>OLED.drawImage(null, 0, 0, true, false)</kbd>)
  Show <image> of type Image at position <x> <y>. Fields filled in white in the image are drawn in <color> on the OLED display. The <background> determines whether fields that are not filled with white are also drawn. The **_Imageio_** library is useful for this command: [https://github.com/Pythom1234/pxt-imageio](https://github.com/Pythom1234/pxt-imageio)


## Supported targets
- for PXT/microbit
