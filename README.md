Extension for control [SSD1306 OLED display 128×64](https://www.elecfreaks.com/learn-en/microbitOctopus/output/octopus_ef03155.html).

## Blocks
<ins>***color***</ins> argument is the color of pixel on the OLED display. The `true` means that the pixel will be on, `false` means that the pixel will be off.

<ins>***x***</ins> and <ins>***y***</ins> arguments are the x and y positions. Point 0,0 is in the upper left corner of the display. The display is 128 pixels wide (x) and 64 pixels high (y). This means that <ins>***x***</ins> can be from 0 to 127 and <ins>***y***</ins> can be from 0 to 63.

<ins>***toggle***</ins> argument sets whether pixel inversion is used instead of pixel redrawing.


```block
OLED.init()
```
Initalize OLED display connected at address 60 (0x3C) on I2C. Must be called when the program starts.


```block
OLED.setContrast(255)
```
Sets contrast of display (0 to 255).


```block
OLED.clear(false)
```
Fills the display with <ins>***color***</ins>.


```block
OLED.draw()
```
Sends data to the OLED display. You have to call it whenever you want to update the display.


```block
OLED.setPx(0, 0, true)
```
Sets the pixel color at position <ins>***x***</ins> <ins>***y***</ins> to <ins>***color***</ins>.


```block
OLED.togglePx(0, 0)
```
Toggles the pixel color at position <ins>***x***</ins> <ins>***y***</ins>.


```block
OLED.px(0, 0)
```
Returns the pixel color at position <ins>***x***</ins> <ins>***y***</ins>.


```block
OLED.drawText("text", 0, 0, true, false)
```
Draws the text <ins>***text***</ins>, which has the upper left corner at position <ins>***x***</ins> <ins>***y***</ins>. The color of the text is determined by <ins>***color***</ins>.


```block
OLED.drawRect(0, 0, 10, 10, true, false, false)
```
Draws a rectangle with the upper left vertex at position <ins>***x1***</ins> <ins>***y1***</ins> and the lower right vertex at position <ins>***x2***</ins> <ins>***y2***</ins>. The <ins>***fill***</ins> option specifies whether the rectangle will be filled with the <ins>***color***</ins> color. If `false`, then only the outline is drawn.


```block
OLED.drawLine(0, 0, 10, 10, true, false)
```
Draws a line from position <ins>***x1***</ins> <ins>***y1***</ins> to position <ins>***x2***</ins> <ins>***y2***.


```block
OLED.drawImage(null, 0, 0, true, false, false)
```
Show <ins>***image***</ins> of type Image at position <ins>***x***</ins> <ins>***y***</ins>. Fields filled in white in the image are drawn in <ins>***color***</ins> on the OLED display. The <ins>***background***</ins> determines whether fields that are not filled with white are also drawn. You can add image from the **_Images_** category or import **_Imageio_** library: [https://github.com/Pythom1234/pxt-imageio](https://github.com/Pythom1234/pxt-imageio)

## Examples
I also made a extension that uses OLED display (it's is still in development): [https://github.com/Pythom1234/pxt-games](https://github.com/Pythom1234/pxt-games)

## License
MIT

## Supported targets
* for PXT/microbit
