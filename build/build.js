var CarromBoard = (function () {
    function CarromBoard() {
        this.blacks = [
            new Vector2D(300, 300),
            new Vector2D(400, 300),
        ];
        this.whites = [
            new Vector2D(300, 400),
        ];
        this.carromMenR = 20;
        this.holesR = this.carromMenR * 1.5;
        this.holes = [
            new Vector2D(this.holesR, this.holesR),
            new Vector2D(width - this.holesR, this.holesR),
            new Vector2D(width - this.holesR, height - this.holesR),
            new Vector2D(this.holesR, height - this.holesR),
        ];
        this.strikerR = this.carromMenR * 1.2;
    }
    CarromBoard.prototype.draw = function () {
        var baseLine = {
            left: new Vector2D(100, 500),
            right: new Vector2D(500, 500),
        };
        bot(this.whites, this.blacks, this.carromMenR, this.strikerR, baseLine, this.holes, this.holesR, "black");
        stroke(255);
        strokeWeight(1);
        fill(255);
        line(baseLine.left.x, baseLine.left.y, baseLine.right.x, baseLine.right.y);
        fill(0);
        for (var _i = 0, _a = this.blacks; _i < _a.length; _i++) {
            var black = _a[_i];
            circle(black.x, black.y, this.carromMenR * 2);
        }
        fill(255);
        for (var _b = 0, _c = this.whites; _b < _c.length; _b++) {
            var white = _c[_b];
            circle(white.x, white.y, this.carromMenR * 2);
        }
        fill(144);
        for (var _d = 0, _e = this.holes; _d < _e.length; _d++) {
            var hole = _e[_d];
            circle(hole.x, hole.y, this.holesR * 2);
        }
    };
    return CarromBoard;
}());
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
        return new Vector2D(vec.x * -1, vec.y * -1);
    };
    Vector2D.add = function (vec1, vec2) {
        return new Vector2D(vec1.x + vec2.x, vec1.y + vec2.y);
    };
    Vector2D.sub = function (vec1, vec2) {
        return Vector2D.add(vec1, Vector2D.reverse(vec2));
    };
    Vector2D.mult = function (vec1, vec2) {
        return new Vector2D(vec1.x * vec2.x, vec1.y * vec2.y);
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
    return Vector2D;
}());
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
function bot(whites, blacks, carromMenR, strikerR, baseLinePosition, holesPosition, holesR, myMenColor) {
    var strikerPosition = Vector2D.add(baseLinePosition.left, new Vector2D(strikerR, 0));
    while (strikerPosition.x < baseLinePosition.right.x - strikerR) {
        var res = _bot(whites, blacks, carromMenR, strikerPosition, strikerR, baseLinePosition, holesPosition, holesR, myMenColor);
        if (res) {
            res.vec.draw(strikerPosition, color(255, 255, 0));
            fill(255, 0, 0);
            stroke(255);
            circle(strikerPosition.x, strikerPosition.y, strikerR * 2);
            return res.vec;
        }
        strikerPosition.x += 5;
    }
    stroke(255);
    fill(255, 0, 0);
    var randomVec = Vector2D.scale(new Vector2D(random(-1, 1), random(-1, 1)), random(10, 30));
    randomVec.draw(Vector2D.zero(), color(0, 0, 0), 200000);
    return randomVec;
}
function _bot(whites, blacks, carromMenR, strikerPosition, strikerR, baseLinePosition, holesPosition, holesR, myMenColor) {
    var leftMostPossible = baseLinePosition.left.x + strikerR;
    var rightMostPossible = baseLinePosition.right.x - strikerR;
    var myMen = myMenColor === "white" ? whites : blacks;
    var otherMen = myMenColor === "white" ? blacks : whites;
    var allMen = __spreadArray(__spreadArray([], myMen, true), otherMen, true);
    var directlyPocketables = [];
    for (var manIndex = 0; manIndex < myMen.length; manIndex++) {
        var man = myMen[manIndex];
        var pottableHoles = [];
        for (var holeIndex = 0; holeIndex < holesPosition.length; holeIndex++) {
            var hole = holesPosition[holeIndex];
            var directLine = new Vector2D(hole.x - man.x, hole.y - man.y);
            var isPottable = true;
            for (var otherManIndex = 0; otherManIndex < allMen.length; otherManIndex++) {
                if (otherManIndex === manIndex) {
                    continue;
                }
                var otherMan = allMen[otherManIndex];
                var betweenCheck = isInBetween(otherMan, carromMenR, hole, man);
                var check1 = doesCircleIntersectLine(Vector2D.sub(otherMan, man), carromMenR * 2, directLine, carromMenR);
                var check2 = doesCircleIntersectLine(Vector2D.sub(otherMan, man), carromMenR * 2, directLine, -carromMenR);
                if (betweenCheck && (check1 || check2)) {
                    isPottable = false;
                }
            }
            if (isPottable) {
                pottableHoles.push(holeIndex);
            }
        }
        if (pottableHoles.length > 0) {
            var closestHoleIndex = -1;
            var closestDist = Infinity;
            for (var pottableHoleIndex = 0; pottableHoleIndex < pottableHoles.length; pottableHoleIndex++) {
                if (!isInBetween(man, carromMenR, strikerPosition, holesPosition[pottableHoles[pottableHoleIndex]])) {
                    continue;
                }
                var holeIndex = pottableHoles[pottableHoleIndex];
                var distVec = Vector2D.sub(holesPosition[holeIndex], man);
                var thisDist = distVec.magSq();
                if (thisDist < closestDist) {
                    closestDist = distVec.magSq();
                    closestHoleIndex = holeIndex;
                }
            }
            if (closestHoleIndex === -1) {
                continue;
            }
            Vector2D.sub(holesPosition[closestHoleIndex], man).draw(man, color(0, random(200, 255), random(0, 100)), 20000);
            directlyPocketables.push({
                hole: holesPosition[closestHoleIndex],
                man: man,
            });
        }
    }
    var directlyStrikablePoints = [];
    for (var pocketableIndex = 0; pocketableIndex < directlyPocketables.length; pocketableIndex++) {
        var pocketable = directlyPocketables[pocketableIndex];
        var toBeStruckPoint = Vector2D.scale(Vector2D.reverse(Vector2D.unit(new Vector2D(pocketable.hole.x - pocketable.man.x, pocketable.hole.y - pocketable.man.y))), strikerR + carromMenR);
        var relativeToStriker = Vector2D.add(new Vector2D(pocketable.man.x - strikerPosition.x, pocketable.man.y - strikerPosition.y), toBeStruckPoint);
        var isStrikable = true;
        for (var otherManIndex = 0; otherManIndex < allMen.length; otherManIndex++) {
            var otherMan = allMen[otherManIndex];
            if (otherMan.x === pocketable.man.x && otherMan.y === pocketable.man.y) {
                continue;
            }
            var check1 = doesCircleIntersectLine(Vector2D.sub(otherMan, strikerPosition), strikerR * 2, relativeToStriker, strikerR);
            var check2 = doesCircleIntersectLine(Vector2D.sub(otherMan, strikerPosition), strikerR * 2, relativeToStriker, -strikerR);
            var check3 = doesCircleIntersectLine(Vector2D.sub(otherMan, strikerPosition), strikerR * 2, relativeToStriker, 0);
            if (check1 || check2 || check3) {
                isStrikable = false;
            }
        }
        if (isStrikable) {
            directlyStrikablePoints.push(relativeToStriker);
        }
    }
    if (directlyStrikablePoints.length > 0) {
        return {
            vec: directlyStrikablePoints[0],
        };
    }
    return null;
}
var board;
function setup() {
    createCanvas(600, 600);
    frameRate(5);
    board = new CarromBoard();
}
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
function draw() {
    background(144, 200, 255);
    board.draw();
}
function isInBetween(vec, vecR, boundingVec1, boundingVec2) {
    if (vec.x - vecR > boundingVec1.x && vec.x - vecR > boundingVec2.x) {
        return false;
    }
    if (vec.y - vecR > boundingVec1.y && vec.y - vecR > boundingVec2.y) {
        return false;
    }
    if (vec.x + vecR < boundingVec1.x && vec.x + vecR < boundingVec2.x) {
        return false;
    }
    if (vec.y + vecR < boundingVec1.y && vec.y + vecR < boundingVec2.y) {
        return false;
    }
    return true;
}
function doesCircleIntersectLine(circlePos, circleR, line, yIntercept) {
    if (line.x === 0) {
        line.x = 0.0001;
    }
    var slope = line.y / line.x;
    var a = -slope;
    var b = 1;
    var c = -yIntercept;
    var perpDist = Math.pow((a * circlePos.x + b * circlePos.y + c), 2) / (Math.pow(a, 2) + Math.pow(b, 2));
    if (perpDist < Math.pow(circleR, 2)) {
        return true;
    }
    return false;
}
//# sourceMappingURL=build.js.map