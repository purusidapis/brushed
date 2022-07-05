function initialize(canvas) {
    var is_touch_device = 'ontouchstart' in document.documentElement;
    var ctx = canvas.getContext('2d');

    if (is_touch_device) {
        // create a drawer which tracks touch movements
        var drawer = {
            isDrawing: false,
            touchstart: function (coors) {
                ctx.beginPath();
                ctx.moveTo(coors.x, coors.y);
                this.isDrawing = true;
            },
            touchmove: function (coors) {
                if (this.isDrawing) {
                    ctx.lineTo(coors.x, coors.y);
                    ctx.stroke();
                }
            },
            touchend: function (coors) {
                if (this.isDrawing) {
                    this.touchmove(coors);
                    this.isDrawing = false;
                }
            }
        };

        // create a function to pass touch events and coordinates to drawer
        function draw(event) {

            // get the touch coordinates.  Using the first touch in case of multi-touch
            var coors = {
                x: event.targetTouches[0].pageX,
                y: event.targetTouches[0].pageY
            };

            // Now we need to get the offset of the canvas location
            var obj = canvas;

            if (obj.offsetParent) {
                // Every time we find a new object, we add its offsetLeft and offsetTop to curleft and curtop.
                do {
                    coors.x -= obj.offsetLeft;
                    coors.y -= obj.offsetTop;
                }
                // The while loop can be "while (obj = obj.offsetParent)" only, which does return null
                // when null is passed back, but that creates a warning in some editors (i.e. VS2010).
                while ((obj = obj.offsetParent) != null);
            }

            // pass the coordinates to the appropriate handler
            drawer[event.type](coors);
        }


        // attach the touchstart, touchmove, touchend event listeners.
        canvas.addEventListener('touchstart', draw, false);
        canvas.addEventListener('touchmove', draw, false);
        canvas.addEventListener('touchend', draw, false);

        // prevent elastic scrolling
        canvas.addEventListener('touchmove', function (event) {
            event.preventDefault();
        }, false);
    } else {
        var ctx = canvas.getContext("2d");

        let prevX = null;
        let prevY = null;

        ctx.lineWidth = 5;

        let draw = false;

        canvas.addEventListener("mousedown", (e) => draw = true);
        canvas.addEventListener("mouseup", (e) => draw = false);

        canvas.addEventListener("mousemove", (e) => {
            if (prevX == null || prevY == null || !draw) {
                prevX = e.clientX - canvas.offsetLeft;
                prevY = e.clientY - canvas.offsetTop;
                return;
            }

            let currentX = e.clientX - canvas.offsetLeft;
            let currentY = e.clientY - canvas.offsetTop;

            ctx.beginPath();
            ctx.moveTo(prevX, prevY);
            ctx.lineTo(currentX, currentY);
            ctx.stroke();

            prevX = currentX;
            prevY = currentY;
        })
    }
}
