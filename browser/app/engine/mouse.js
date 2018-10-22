
var mouse = {};

mouse.x = 0;
mouse.y = 0;
mouse.down = false;

// Pan
mouse.panX = 0;
mouse.panY = 0;
mouse.panStartX = 0;
mouse.panStartY = 0;
mouse.panStarted = false;

mouse.onMove = function(event)
{
	mouse.x = event.clientX;
	mouse.y = event.clientY;
  if (mouse.panStarted)
  {
    mouse.panX = mouse.x - mouse.panStartX;
    mouse.panY = mouse.y - mouse.panStartY;
  }
};

mouse.onClic = function(event)
{
	mouse.x = event.clientX;
	mouse.y = event.clientY;
	mouse.down = true;

  // Pan
  mouse.panStartX = mouse.x - mouse.panX;
  mouse.panStartY = mouse.y - mouse.panY;
  mouse.panStarted = true;
};

mouse.onmouseUp = function(event)
{
	mouse.down = false;
  mouse.panStarted = false;
};

export default mouse;
