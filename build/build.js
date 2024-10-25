"use strict";
var CarromBoard = (function () {
    function CarromBoard() {
        this.allCarromMen = [];
        this.holes = [];
        this.allCarromMen.push(new CarromMan(Vector2D.random(150, 450), Math.random() < 0.5 ? "black" : "white"), new CarromMan(Vector2D.random(150, 450), Math.random() < 0.5 ? "black" : "white"), new CarromMan(Vector2D.random(150, 450), Math.random() < 0.5 ? "black" : "white"), new CarromMan(Vector2D.random(150, 450), Math.random() < 0.5 ? "black" : "white"));
        var holeRadius = 20 * 1.75;
        this.holes.push(new Disc(new Vector2D(holeRadius, holeRadius), holeRadius), new Disc(new Vector2D(width - holeRadius, holeRadius), holeRadius), new Disc(new Vector2D(width - holeRadius, height - holeRadius), holeRadius), new Disc(new Vector2D(holeRadius, height - holeRadius), holeRadius));
    }
    CarromBoard.prototype.draw = function () {
        var baseLine = {
            left: new Vector2D(100, 500),
            right: new Vector2D(500, 500),
        };
        for (var _i = 0, _a = this.holes; _i < _a.length; _i++) {
            var hole = _a[_i];
            hole.draw(color(155));
        }
        for (var _b = 0, _c = this.allCarromMen; _b < _c.length; _b++) {
            var man = _c[_b];
            man.draw();
        }
        stroke(255);
        strokeWeight(1);
        fill(255);
        line(baseLine.left.x, baseLine.left.y, baseLine.right.x, baseLine.right.y);
        bot(this.allCarromMen, CarromMan.RADIUS * 1.25, baseLine, this.holes, "white");
    };
    return CarromBoard;
}());
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Disc = (function () {
    function Disc(position, radius) {
        this.position = new Vector2D(position.x, position.y);
        this.radius = radius;
        this.id = Disc.SERIAL_ID++;
    }
    Disc.canHitDirectly = function (allDiscs, target, striker, destination) {
        var actualTarget = target;
        if (destination) {
            var hitDirectionVec = Vector2D.sub(destination.position, target.position);
            var collisionVec_target = Vector2D.scale(Vector2D.reverse(hitDirectionVec), target.radius + striker.radius);
            var actualTargetPosition = Vector2D.add(target.position, collisionVec_target);
            actualTarget = new Disc(actualTargetPosition, striker.radius);
        }
        var acutalTarget_striker = Vector2D.sub(actualTarget.position, striker.position);
        var acutalTarget_striker_normal = Vector2D.scale(Vector2D.normal(acutalTarget_striker), striker.radius);
        var rectTopLeft = Vector2D.sub(actualTarget.position, acutalTarget_striker_normal);
        var rectDims = new Vector2D(striker.radius * 2, acutalTarget_striker.mag());
        var rectRotationAngle = atan2(acutalTarget_striker_normal.y, acutalTarget_striker_normal.x);
        for (var i = 0; i < allDiscs.length; i++) {
            var otherDisc = allDiscs[i];
            if (otherDisc.id === striker.id || otherDisc.id === target.id) {
                continue;
            }
            if (checkRectCircleCollision(rectTopLeft, rectDims, rectRotationAngle, otherDisc)) {
                return null;
            }
        }
        return actualTarget.position;
    };
    Disc.prototype.draw = function (colour) {
        if (colour === void 0) { colour = color(255); }
        fill(colour);
        stroke(255);
        strokeWeight(1);
        circle(this.position.x, this.position.y, this.radius * 2);
    };
    Disc.SERIAL_ID = 0;
    return Disc;
}());
var CarromMan = (function (_super) {
    __extends(CarromMan, _super);
    function CarromMan(position, color) {
        var _this = _super.call(this, position, CarromMan.RADIUS) || this;
        _this.color = color;
        return _this;
    }
    CarromMan.prototype.draw = function () {
        _super.prototype.draw.call(this, this.color === "black" ? color(0) : color(255));
    };
    CarromMan.RADIUS = 20;
    return CarromMan;
}(Disc));
var Vector2D = (function () {
    function Vector2D(x, y) {
        this.x = x;
        this.y = y;
    }
    Vector2D.prototype.magSq = function () {
        return Math.pow(this.x, 2) + Math.pow(this.y, 2);
    };
    Vector2D.prototype.mag = function () {
        return Math.sqrt(this.magSq());
    };
    Vector2D.prototype.toString = function () {
        return JSON.stringify(this);
    };
    Vector2D.prototype.draw = function (origin, col, scale) {
        strokeWeight(4);
        stroke(col);
        if (!scale) {
            scale = this.mag();
        }
        var scaled = Vector2D.scale(this, scale);
        var lineVec = Vector2D.add(scaled, origin);
        line(origin.x, origin.y, lineVec.x, lineVec.y);
    };
    Vector2D.zero = function () {
        return new Vector2D(0, 0);
    };
    Vector2D.reverse = function (vec) {
        return new Vector2D(-vec.x, -vec.y);
    };
    Vector2D.abs = function (vec) {
        return new Vector2D(Math.abs(vec.x), Math.abs(vec.y));
    };
    Vector2D.normal = function (vec) {
        return new Vector2D(-vec.y, vec.x);
    };
    Vector2D.add = function (vec1, vec2) {
        return new Vector2D(vec1.x + vec2.x, vec1.y + vec2.y);
    };
    Vector2D.sub = function (vec1, vec2) {
        return Vector2D.add(vec1, Vector2D.reverse(vec2));
    };
    Vector2D.dot = function (vec1, vec2) {
        return new Vector2D(vec1.x * vec2.x, vec1.y * vec2.y);
    };
    Vector2D.scalarMult = function (vec1, factor) {
        return new Vector2D(vec1.x * factor, vec1.y * factor);
    };
    Vector2D.unit = function (vec) {
        var mag = vec.mag();
        if (mag === 0) {
            return Vector2D.zero();
        }
        return new Vector2D(vec.x / mag, vec.y / mag);
    };
    Vector2D.scale = function (vec, factor) {
        var unitVec = Vector2D.unit(vec);
        return new Vector2D(unitVec.x * factor, unitVec.y * factor);
    };
    Vector2D.clamp = function (vec, mag) {
        if (vec.mag() >= mag) {
            return Vector2D.scale(vec, mag);
        }
        return vec;
    };
    Vector2D.random = function (min, max) {
        return new Vector2D(randomInRange(min, max), randomInRange(min, max));
    };
    return Vector2D;
}());
function bot(allCarromMen, strikerRadius, baseLinePosition, holes, myMenColor) {
    var striker = new Disc(Vector2D.add(baseLinePosition.left, new Vector2D(strikerRadius, 0)), strikerRadius);
    while (striker.position.x < baseLinePosition.right.x - strikerRadius) {
        var res = _bot(allCarromMen, striker, holes, myMenColor);
        if (res) {
            Vector2D.sub(res, striker.position).draw(striker.position, color(255, 255, 0));
            fill(255, 0, 0);
            stroke(255);
            strokeWeight(4);
            striker.draw(color(255, 0, 0));
            circle(res.x, res.y, striker.radius * 2);
            return res;
        }
        striker.position.x += 5;
    }
    strokeWeight(4);
    stroke(0);
    line(0, 0, width, height);
    line(width, 0, 0, height);
    striker.draw(color(0, 0, 0, 0));
    return Vector2D.zero();
}
function _bot(allCarromMen, striker, holes, myMenColor) {
    for (var i = 0; i < allCarromMen.length; i++) {
        var thisCarromMan = allCarromMen[i];
        if (thisCarromMan.color !== myMenColor) {
            continue;
        }
        var pocketableHoles = [];
        for (var holeIndex = 0; holeIndex < holes.length; holeIndex++) {
            var thisHole = holes[holeIndex];
            if (isInBetween(thisCarromMan.position.x, thisHole.position.x, striker.position.x) &&
                isInBetween(thisCarromMan.position.y, thisHole.position.y, striker.position.y) &&
                Disc.canHitDirectly(allCarromMen, thisHole, thisCarromMan)) {
                pocketableHoles.push(holes[holeIndex]);
            }
        }
        for (var holeIndex = 0; holeIndex < pocketableHoles.length; holeIndex++) {
            var hole = pocketableHoles[holeIndex];
            var target = Disc.canHitDirectly(allCarromMen, thisCarromMan, striker, hole);
            if (target) {
                return target;
            }
        }
    }
}
var carromBoard;
function setup() {
    createCanvas(600, 600);
    frameRate(3);
    carromBoard = new CarromBoard();
}
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
function draw() {
    background(144, 200, 255);
    carromBoard.draw();
}
function checkRectCircleCollision(rectTopLeft, rectDims, rotationAngle, circle) {
    var rotateDimsW = Vector2D.scale(new Vector2D(cos(rotationAngle), sin(rotationAngle)), rectDims.x);
    var rotateDimsH = Vector2D.scale(Vector2D.normal(rotateDimsW), rectDims.y);
    var rectCenter = Vector2D.add(rectTopLeft, Vector2D.add(Vector2D.scalarMult(rotateDimsW, 0.5), Vector2D.scalarMult(rotateDimsH, 0.5)));
    var rectCenter_circle = Vector2D.sub(rectCenter, circle.position);
    var rectCenterAngle = Math.atan2(rectCenter_circle.y, rectCenter_circle.x);
    var distAlongRectX = rectCenter_circle.mag() * Math.cos(rectCenterAngle - rotationAngle);
    var distAlongRectY = rectCenter_circle.mag() * Math.sin(rectCenterAngle - rotationAngle);
    return (Math.abs(distAlongRectX) <= rotateDimsW.mag() / 2 + circle.radius &&
        Math.abs(distAlongRectY) <= rotateDimsH.mag() / 2 + circle.radius);
}
function isCircleInsideRect(rectTopLeft, rectDims, circle) {
    var rectBottomRight = Vector2D.add(rectTopLeft, rectDims);
    if (rectTopLeft.x < circle.position.x - circle.radius &&
        rectTopLeft.y < circle.position.y - circle.radius &&
        rectBottomRight.x > circle.position.x + circle.radius &&
        rectBottomRight.y > circle.position.y + circle.radius) {
        return true;
    }
    return false;
}
function radiansToDegree(radians) {
    return (180 * radians) / Math.PI;
}
function degreeToRadians(degree) {
    return (Math.PI * degree) / 180;
}
function isInBetween(val, thres1, thres2) {
    return (thres1 < val && val < thres2) || (thres2 < val && val < thres1);
}
function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
}
//# sourceMappingURL=build.js.map