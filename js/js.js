(function() {
    /**
     * 
     */
    window.sSlider = function(imgArr, parentNode, width, cellWidth, cellHeight) {
        if (!imgArr || !imgArr.length) throw new Error("imgArr is must.");
        if (!parentNode) throw new Error("parentNode is must.");
        this.init({imgArr, parentNode, width: width || 800, cellWidth: cellWidth || 400, cellHeight: cellHeight || 300});
    }
    sSlider.prototype.init = function(options) { 
        var self = this;
        this.root = document.createElement("div");
        this.root.className = "s-slider";
        options.parentNode.appendChild(this.root);

        self.imgNodeArr = [];
        for (let imgPath of options.imgArr) {
            let imgNode = document.createElement("img");
            imgNode.src = imgPath;
            imgNode.style.border = 0;
            imgNode.style.width = "100%";
            imgNode.style.height = "100%";
            self.imgNodeArr.push(imgNode);
        }
        // 将末位两张图片移动到前面
        self.imgNodeArr.unshift(self.imgNodeArr.pop());
        self.imgNodeArr.unshift(self.imgNodeArr.pop());

        var CELL_NUM = 5;

        var container = document.createElement("div");
        this.root.appendChild(container);
        
        container.style.width = "100%";
        container.style.height = "100%";
        container.style.display = "flex";
        container.style.transitionProperty = "transform";
        container.style.boxSizing = "content-box";
        
        this.initX = (options.width - options.cellWidth) / 2 - options.cellWidth*2;
        this.moveX = 0;
        container.style.transform = `translate3d(${this.initX}px,0,0)`;
        this.sliderIndex = 0;

        container.addEventListener("touchstart", function (e) {
            self.startX = e.touches[0].clientX;
            container.style.transitionDuration = "0ms";
        });
        container.addEventListener("touchmove", function(e) {
            var changeX =  e.touches[0].clientX - self.startX;
            var upNum = Math.round(changeX / options.cellWidth);
            if (upNum != 0) {
                self.startX += upNum * options.cellWidth;
                changeX -= upNum * options.cellWidth;

                while (upNum > 0) {
                    self.imgNodeArr.unshift(self.imgNodeArr.pop());
                    --upNum;
                }
                while (upNum < 0) {
                    self.imgNodeArr.push(self.imgNodeArr.shift());
                    ++upNum;
                }
                for (var i = 0; i < CELL_NUM; ++i) {
                    if (self.nodes[i].firstChild) self.nodes[i].removeChild(self.nodes[i].firstChild);
                    self.nodes[i].appendChild(self.imgNodeArr[i]);
                }
            }
            self.nowX = self.initX + changeX;
            container.style.transform = `translate3d(${self.nowX}px,0,0)`;
        });
        container.addEventListener("touchend", function(e) {
            if (self.nowX !== self.initX) {
                container.style.transitionDuration = "100ms";
                container.style.transform = `translate3d(${self.initX}px,0,0)`;
            }
        });
        container.addEventListener("touchcancel", function(e) {
            if (self.nowX !== self.initX) {
                container.style.transitionDuration = "100ms";
                container.style.transform = `translate3d(${self.initX}px,0,0)`;
            }
        });
        
        this.root.style.width = `${options.width}px`;
        this.root.style.height = `${options.cellHeight}px`;
        this.root.style.overflow = "hidden";
        this.root.style.position = "relative";
        this.root.style.display = "block";
        this.root.style.margin = "0 auto";
        this.root.style.padding = "0";
        this.root.style.zIndex = 1;
        
        this.nodes = [];
        
        for (var i = 0; i < 5; ++i) {
            var child = document.createElement("div");
            child.className = "s-slider-child";
            child.style.display = "flex";
            child.style.width = `${options.cellWidth}px`;
            child.style.height = `${options.cellHeight}px`;
            child.style.flexShrink = 0;
            child.appendChild(self.imgNodeArr[i]);
            this.nodes.push(child);
            container.appendChild(child);
        }

    }
})();