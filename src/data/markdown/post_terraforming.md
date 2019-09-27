<!--
  id: 291
  date: 2007-03-05T12:16:54
  modified: 2012-07-03T09:29:31
  slug: terraforming
  type: post
  categories: code, Flash, image, ActionScript
  tags: Filter Forge
-->

# terraforming

![terraforming](https://res.cloudinary.com/dn1rmdjs5/image/upload/v1566568756/rv/Terraformer.jpg) Putting things together: some [Filter Forge](http://www.filterforge.com) stuff into [PaperVision3D](http://www.papervision3d.org/). I’ve made a nice [terraforming filter](http://www.filterforge.com/filters/2199.html) and wrapped the result around a sphere. ~~~Click here~~~ to see the planet and use your mousewheel to zoom in and out.  
I’m now trying to give the sun some lens flares but I’m still having a bit of trouble getting the 2D data from the 3D. Right now the flare is just a sprite on top of the 3D scene, the correct way of course would be to create a particle primitive. A particle is a bit different than a normal primitive. Let’s see if I can hack my way in there and cook one up.