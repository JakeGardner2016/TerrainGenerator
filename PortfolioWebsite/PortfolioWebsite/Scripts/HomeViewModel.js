var Window = $(window);

function HomeViewModel() {
    var self = this;

    self.MountainRanges = ko.observable([]);
    self.MountainBorder = ko.observable([]);

    self.SunPath = ko.observable([]);
    self.PercentThroughDay = ko.observable(0);

    self.Cycling = false;

    self.InitialiseScene = function () {
        MountainRanges([]);
        DrawSky();
        DrawMountains('MountainsBG', 130, FindColour('#E57D2D', '#2ca1d2'), 80, 'Default');
        DrawMountains('MountainsBG2', 130, FindColour('#C97328', '#35a6d5'), 100, 'Default');
        DrawMountains('Mountains1', 110, FindColour('#660000', '#2caf53'), 20, 'Default');
        DrawMountains('Mountains2', 130, FindColour('#7c3749', '#248f44'), 60, 'Default');
        DrawMountains('Mountains3', 210, FindColour('#673148', '#1f7a3a'), 120, 'Default');
        //DrawTrees('TreeCanvas1', 20, '#673148', 0);
        DrawMountainBorder();
        DrawSun();
        DrawReflections();
    }

    self.DrawMountains = function (MountainCanvasID, StartingVerticalPoint, StartingColour, TopPeak, OldMountainProperties) {

        if (OldMountainProperties != 'Default')
        {
            var MountainPoints = OldMountainProperties.Mountainpoints();
        }
        else {
            var MountainPoints = [];
        }

        var sceneContainerWidth = $('#Scene').width() + 100;
        var canvas = document.getElementById(MountainCanvasID);
        canvas.width = sceneContainerWidth;
        canvas.height = $('#Scene').height();
        var mountainbottom = ((canvas.height / 100) * 40);
        var ctx = canvas.getContext("2d");
        var RX, RY, PX, PY;

        StartingVerticalPoint = StartingVerticalPoint + mountainbottom;
        TopPeak = TopPeak + mountainbottom;
        PX = 0;
        PY = StartingVerticalPoint;

        ctx.beginPath();
        ctx.moveTo(0, PY);
        ctx.lineTo(PX, PY);

        BoundaryCheck = function () {
            if (RX > sceneContainerWidth) {
                RX = sceneContainerWidth;
            }
            else if (RX < 0) {
                RX = 0;
            }
            if (RY >= (180 + mountainbottom)) {
                RY = 180 + mountainbottom;
            }
            else if (RY < TopPeak) {
                RY = Math.floor(Math.random() * ((TopPeak + 20) - (TopPeak) + 1)) + (TopPeak);
            }
        }

        if (MountainPoints.length == 0) {
            while (PX < sceneContainerWidth) {
                RX = Math.floor(Math.random() * ((PX + 1) - PX + 1)) + PX;
                RY = Math.floor(Math.random() * ((PY + 20) - (PY - 20) + 1)) + (PY - 20);

                BoundaryCheck();

                ctx.lineTo(RX, RY);
                PX = RX + 10;
                PY = RY;

                MountainPoints.push({
                    x: ko.observable(RX),
                    y: ko.observable(RY)
                });
            }

            MountainRanges().push({
                MountainID: ko.observable(MountainCanvasID),
                MountainColour: ko.observable(StartingColour),
                Mountainpoints: ko.observable(MountainPoints)
            });
        }
        else {
            for (var i = 0; i < MountainPoints.length; i++) {
                ctx.lineTo(MountainPoints[i].x(), MountainPoints[i].y());
            }
            OldMountainProperties.MountainColour(StartingColour);
        }

        ctx.lineTo(sceneContainerWidth, PY);
        ctx.lineTo(sceneContainerWidth, 200 + mountainbottom);
        ctx.lineTo(0, 200 + mountainbottom);

        ctx.fillStyle = StartingColour;
        ctx.fill();
    }

    self.DrawTrees = function (TreeCanvasID, StartingVerticalPoint, StartingColour, TopPeak) {
        var sceneContainerWidth = $('#Scene').width() + 100;
        var canvas = document.getElementById(TreeCanvasID);
        canvas.width = sceneContainerWidth;
        canvas.height = 80;
        var ctx = canvas.getContext("2d");
        var RX, RY, PX, PY;

        PX = 0;
        PY = StartingVerticalPoint;

        ctx.beginPath();
        ctx.moveTo(0, 200);
        ctx.lineTo(PX, PY);

        BoundaryCheck = function () {
            if (RX > sceneContainerWidth) {
                RX = sceneContainerWidth;
            }
            else if (RX < 0) {
                RX = 0;
            }

            if (RY >= 20) {
                RY = Math.floor(Math.random() * ((20) - (0) + 1)) + (0);
            }
            else if (RY < TopPeak) {
                RY = Math.floor(Math.random() * ((TopPeak + 20) - (TopPeak) + 1)) + (TopPeak);
            }
        }

        while (PX < sceneContainerWidth) {
            RX = Math.floor(Math.random() * ((PX + 1) - PX + 1)) + PX;
            RY = Math.floor(Math.random() * ((PY + 20) - (PY - 20) + 1)) + (PY - 20);

            BoundaryCheck();

            ctx.lineTo(RX, RY);
            PX = RX + 3;
            PY = RY;
        }

        ctx.lineTo(sceneContainerWidth, PY);
        ctx.lineTo(sceneContainerWidth, 200);
        ctx.lineTo(0, 200);

        ctx.fillStyle = StartingColour;
        ctx.fill();
    }

    self.DrawReflections = function () {
        var sceneContainerWidth = $('#Scene').width() + 100;
        var canvas = document.getElementById('ReflectionCanvas');
        canvas.width = sceneContainerWidth;
        canvas.height = $('#Scene').height();
        var ctx = canvas.getContext("2d");
        var mountainbottom = ((canvas.height / 100) * 40);

        for (var i = 0; i < MountainRanges().length; i++) {
            ctx.beginPath();
            ctx.moveTo(0, mountainbottom + 200);

            for (var j = 0; j < MountainRanges()[i].Mountainpoints().length; j++) {
                ctx.lineTo(MountainRanges()[i].Mountainpoints()[j].x(), mountainbottom + 200 + ((mountainbottom + 200) - MountainRanges()[i].Mountainpoints()[j].y()));
            }

            ctx.lineTo(sceneContainerWidth, MountainRanges()[i].Mountainpoints()[MountainRanges()[i].Mountainpoints().length - 1].y());
            ctx.lineTo(sceneContainerWidth, 0);
            ctx.lineTo(0, 0);

            ctx.fillStyle = MountainRanges()[i].MountainColour();
            ctx.fill();
        }
    }

    self.DrawSun = function () {
        var canvas = document.getElementById('SunCanvas');
        canvas.height = $('#Scene').height() + 30;
        canvas.width = $('#Scene').width() + 30;
        var context = canvas.getContext('2d');
        var SunCentrePoint_x;
        var SunCentrePoint_y;
        var radius = 15;

        $('.SunCon').height(((canvas.height / 100) * 40) + 180);

        CurvePathPlot(
            0, (canvas.height / 3) * 2,
            0, 0,
            canvas.width, 0,
            canvas.width, (canvas.height / 3) * 2,
            canvas.width,
            (canvas.height / 3) * 2,
            SunPath
        );

        SunCentrePoint_x = SunPath()[PercentThroughDay].x;
        SunCentrePoint_y = SunPath()[PercentThroughDay].y;
        context.beginPath();
        context.arc(SunCentrePoint_x, SunCentrePoint_y, radius, 0, 2 * Math.PI, false);
        context.fillStyle = 'white';
        context.globalAlpha = 0.9;
        context.fill();

        for (var i = 1; i <= 7; i++) {
            context.beginPath();
            context.arc(SunCentrePoint_x, SunCentrePoint_y, radius * i, 0, 2 * Math.PI, false);
            context.fillStyle = 'white';
            context.globalAlpha = 0.04;
            context.fill();
        }
    }

    self.DrawMountainBorder = function () {
        var c = document.getElementById("MountainBorder");
        var ctx = c.getContext("2d");
        var sx, sy, rx, ry, curvesize;

        var sceneContainerWidth = $('#Scene').width() + 100;
        c.width = sceneContainerWidth;
        c.height = $('#Scene').height();
        var mountainbottom = ((c.height / 100) * 40);

        sx = 0;
        sy = 15 + mountainbottom + 200;
        curvesize = 3;
        var XBuffer = 50;
        ctx.beginPath();

        while (sx < sceneContainerWidth) {
            rx = Math.floor(Math.random() * (((curvesize * 5) + XBuffer) - 1 + XBuffer)) + XBuffer;
            ry = Math.floor(Math.random() * ((curvesize + 1) - 1 + 3)) + 3;


            ctx.moveTo(sx, sy);

            ctx.bezierCurveTo(
                sx, sy + ry,
                sx + rx, sy + ry,
                sx + rx, sy
            );

            sx = sx + rx;

            rx = Math.floor(Math.random() * (((curvesize * 5) + XBuffer) - 1 + XBuffer)) + XBuffer;
            ry = Math.floor(Math.random() * ((curvesize + 1) - 1 + 3)) + 3;

            ctx.bezierCurveTo(
                sx, sy - ry,
                sx + rx, sy - ry,
                sx + rx, sy
            );

            sx = sx + rx;
        }
        ctx.lineTo(sx, mountainbottom + 195);
        ctx.lineTo(0, mountainbottom + 195);
        ctx.lineTo(0, 15 + mountainbottom + 200);
        ctx.fillStyle = MountainRanges()[MountainRanges().length - 1].MountainColour();
        ctx.fill();
    }

    self.CurvePathPlot = function (p0x, p0y, cp0x, cp0y, cp1x, cp1y, p1x, p1y, width, height, Points) {
        var c = document.getElementById("Curveplot");
        var ctx = c.getContext("2d");
        c.width = width;
        c.height = height;

        ctx.beginPath();
        ctx.moveTo(p0x, p0y);

        ctx.bezierCurveTo(
            cp0x, cp0y,
            cp1x, cp1y,
            p1x, p1y,
        );

        var t = 0;

        while (t < 100) {
            var Ax = ((1 - t) * p0x) + (t * cp0x);
            var Ay = ((1 - t) * p0y) + (t * cp0y);
            var Bx = ((1 - t) * cp0x) + (t * cp1x);
            var By = ((1 - t) * cp0y) + (t * cp1y);
            var Cx = ((1 - t) * cp1x) + (t * p1x);
            var Cy = ((1 - t) * cp1y) + (t * p1y);
            var Dx = ((1 - t) * Ax) + (t * Bx);
            var Dy = ((1 - t) * Ay) + (t * By);
            var Ex = ((1 - t) * Bx) + (t * Cx);
            var Ey = ((1 - t) * By) + (t * Cy);

            var Px = ((1 - t) * Dx) + (t * Ex);
            var Py = ((1 - t) * Dy) + (t * Ey);

            if (Px <= width || Py <= height) {
                Points().push(
                    {
                        x: Px,
                        y: Py
                    }
                );
            }

            t = t + 0.01;
        }
    }

    self.FindColour = function (Colour1, Colour2) {
        var colourOne, colourTwo, resultingColour, pointInDay, R, G, B;

        pointInDay = PercentThroughDay / 100;
        colourOne = {
            r: parseInt(Colour1.substring(1, 3), 16),
            g: parseInt(Colour1.substring(3, 5), 16),
            b: parseInt(Colour1.substring(5, 7), 16),
        }

        colourTwo = {
            r: parseInt(Colour2.substring(1, 3), 16),
            g: parseInt(Colour2.substring(3, 5), 16),
            b: parseInt(Colour2.substring(5, 7), 16),
        }

        if (pointInDay <= 0.5) {
            R = (Math.round((colourOne.r * (1 - (pointInDay * 2))) + (colourTwo.r * (pointInDay * 2))));
            G = (Math.round((colourOne.g * (1 - (pointInDay * 2))) + (colourTwo.g * (pointInDay * 2))));
            B = (Math.round((colourOne.b * (1 - (pointInDay * 2))) + (colourTwo.b * (pointInDay * 2))));

            resultingColour = {
                r: (R.toString(16).length < 2) ? R.toString() : R.toString(16),
                g: (G.toString(16).length < 2) ? G.toString() : G.toString(16),
                b: (B.toString(16).length < 2) ? B.toString() : B.toString(16),
            }
        }
        else if (pointInDay > 0.5) {
            R = (Math.round((colourTwo.r * (1 - ((pointInDay - 0.5) * 2))) + (colourOne.r * ((pointInDay - 0.5) * 2))));
            G = (Math.round((colourTwo.g * (1 - ((pointInDay - 0.5) * 2))) + (colourOne.g * ((pointInDay - 0.5) * 2))));
            B = (Math.round((colourTwo.b * (1 - ((pointInDay - 0.5) * 2))) + (colourOne.b * ((pointInDay - 0.5) * 2))));

            resultingColour = {
                r: (R.toString(16).length < 2) ? R.toString() : R.toString(16),
                g: (G.toString(16).length < 2) ? G.toString() : G.toString(16),
                b: (B.toString(16).length < 2) ? B.toString() : B.toString(16),
            }
        }

        resultingColour.r = (resultingColour.r < 10) ? '0' + resultingColour.r : resultingColour.r;
        resultingColour.g = (resultingColour.g < 10) ? '0' + resultingColour.g : resultingColour.g;
        resultingColour.b = (resultingColour.b < 10) ? '0' + resultingColour.b : resultingColour.b;

        resultingColour = resultingColour.r.toString() + resultingColour.g.toString() + resultingColour.b.toString();

        return '#' + resultingColour;
    }

    self.FindPercentThroughDay = function () {
        var now, sunrise, sunset, MinsBetweenRiseAndSet, MinsBetweenRiseAndNow;

        now = moment(new Date());
        sunrise = moment(new Date());
        sunset = moment(new Date());

        sunset.set({ date: sunset.date(), hour: 22, minute: 0, second: 0 });
        sunrise.set({ date: sunrise.date(), hour: 4, minute: 0, second: 0 });

        MinsBetweenRiseAndNow = moment.duration(moment(now).diff(sunrise));
        MinsBetweenRiseAndNow = Math.round(MinsBetweenRiseAndNow.asMinutes());

        MinsBetweenRiseAndSet = moment.duration(moment(sunset).diff(sunrise));
        MinsBetweenRiseAndSet = Math.round(MinsBetweenRiseAndSet.asMinutes());

        PercentThroughDay = Math.round((MinsBetweenRiseAndNow / MinsBetweenRiseAndSet) * 100);

        if (PercentThroughDay > 99) {
            PercentThroughDay = 99;
        }
        if (PercentThroughDay < 0) {
            PercentThroughDay = 0;
        }
    }

    self.DrawSky = function () {
        $('.SceneContainer').css('background-color', FindColour('#072633', '#3bb2e4'));

        if (PercentThroughDay >= 60 && PercentThroughDay <= 85) {
            $('.SunsetUnderlay').css('opacity', ((PercentThroughDay - 60) / 2.5) / 10);
        }
        else if (PercentThroughDay > 85 && PercentThroughDay <= 90) {
            $('.SunsetUnderlay').css('opacity', 1);
        }
        else if (PercentThroughDay > 90) {
            $('.SunsetUnderlay').css('opacity', (100 - PercentThroughDay) / 10);
        }
        else if (PercentThroughDay < 75) {
            $('.SunsetUnderlay').css('opacity', 0);
        }

        if (PercentThroughDay >= 0 && PercentThroughDay <= 10) {
            $('.SunsetUnderlay').css('opacity', (PercentThroughDay) / 10);
        }
        else if (PercentThroughDay > 10 && PercentThroughDay <= 15) {
            $('.SunsetUnderlay').css('opacity', 1);
        }
        else if (PercentThroughDay > 15 && PercentThroughDay <= 40) {
            $('.SunsetUnderlay').css('opacity', ((40 - PercentThroughDay) / 2.5) / 10);
        }
        else if (PercentThroughDay < 75 && PercentThroughDay > 25) {
            $('.SunsetUnderlay').css('opacity', 0);
        }
    }

    self.Regenerate = function () {
        DrawSky();
        DrawMountains('MountainsBG', 130, FindColour('#E57D2D', '#2ca1d2'), 80, MountainRanges()[0]);
        DrawMountains('MountainsBG2', 130, FindColour('#C97328', '#35a6d5'), 100, MountainRanges()[1]);
        DrawMountains('Mountains1', 110, FindColour('#660000', '#2caf53'), 20, MountainRanges()[2]);
        DrawMountains('Mountains2', 130, FindColour('#7c3749', '#248f44'), 60, MountainRanges()[3]);
        DrawMountains('Mountains3', 210, FindColour('#673148', '#1f7a3a'), 120, MountainRanges()[4]);
        DrawMountainBorder();
        DrawSun();
        DrawReflections();
    }

    self.FullRefresh = function () {
        InitialiseScene();
        InitialiseToolbar();
    }

    self.FullCycle = function () {
        var cycleSpeed;

        cycleSpeed = 40; 

        if (!Cycling)
        {
            Cycling = true;
            var CycleTimer = 0;
            var i = PercentThroughDay;
            var OldPercentThroughDay = i;

            CycleTimer = setInterval(function () {
                i += 1;

                if (i > 100) {
                    i = 0;
                }
                PercentThroughDay = i;
                Regenerate();

                if (i == OldPercentThroughDay) {
                    PercentThroughDay = OldPercentThroughDay;
                    Cycling = false;
                    clearInterval(CycleTimer);
                }
            }, cycleSpeed);
        }
    }

    self.InitialiseToolbar = function () {
        for (var i = 0; i < $('.IconStyle').length; i++)
        {
            $('.IconStyle').eq(i).css('fontSize', $('.SceneToolbar').eq(0).height() - 5 + 'px');
            $('.IconStyle').eq(i).css('paddingTop', '5px');
        }
    }
}

$(function () {
    ko.applyBindings(HomeViewModel);

    FindPercentThroughDay();
    InitialiseScene();
    InitialiseToolbar();
});

Window.resize(
    function () {
        FullRefresh();
    }
);