#AdminX2#
----------

###AdminX2 (AdminSquared) - Bootstrap based Admin Theme###
----------

###Demo###
----------
There should be a demo available on the web soon.

----------

This is an **Admin** theme based on <a href="http://www.getbootstrap.com">Twitter Bootstrap</a>



#####Goals of Project#####
The AdminX2 admin theme is currently under development for another opensource project but it was decided to release it as an opensource project of it's own with the hope that it may be useful to others and also that this may encourage further development. As it is a number of goals were set in the design:

1. The design should be significantly less padded than what is typically seen in Bootstrap themes. The padding is nice on smaller applications but we feel it comes at the cost of making larger applications with more data on a page more difficult to use. As such inputs, navigation, etc all yield somewhat reduced padding.
2. Side navigation which is hidden automatically when on a mobile device instead of the default slide down menu seen on bootstrap.
3.  Easy to use incorporation of a few existing JS plugins. To this end the goal is for the primary JS file to be the only one required and to have additional required plugin JS to be added automatically if and only if an element on the page requires it. This way unnecessary JS is not embedded in the HTML and during individual page design it doesn't become necessary to carefully ensure all external JS files are properly referenced.  
4.  Minimal size. AdminX2 utilizes Fontello to generate a font icon set which meets it's specific needs. We did not incorporate any additional icons other than the one's which were needed. If you choose to use this theme we encourage you to take the same approach. Icon fonts are unnecessary weight when most of the icons will never be used. As of this writing the current icon font file is 7KB instead 128K or more for a full icon font library.

#####Customizing#####
The majority of the design is CSS, JS and HTML. Only a very small number of images are utilized. As a result customizations should be for the most part quite easy. Currently this is pure CSS with no use of less, sass or similar but most of the CSS is simply for changing colors, fonts, padding, etc so changes aren't difficult despite the lack of a CSS compiler. If there is interest, creating a less file for the css may be considered.

