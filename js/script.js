/* global monogatari */

// Define the layout of main screen
monogatari.component("main-screen").template(() => {
    return `
        <h1>温室 Demo</h1>
        <main-menu></main-menu>
    `;
});

// Define the messages used in the game.
monogatari.action("message").messages({
    Help: {
        title: "Help",
        subtitle: "Some useful Links",
        body: `
			<p><a href='https://developers.monogatari.io/documentation/'>Documentation</a> - Everything you need to know.</p>
			<p><a href='https://monogatari.io/demo/'>Demo</a> - A simple Demo.</p>
		`,
    },
});

// Define the notifications used in the game
monogatari.action("notification").notifications({
    Welcome: {
        title: "Welcome",
        body: "This is the Monogatari VN Engine",
        icon: "",
    },
});

// Define the Particles JS Configurations used in the game
monogatari.action("particles").particles({});

// Define the canvas objects used in the game
monogatari.action("canvas").objects({});

// Credits of the people involved in the creation of this awesome game
monogatari.configuration("credits", {});

// Define the images that will be available on your game's image gallery
monogatari.assets("gallery", {});

// Define the music used in the game.
monogatari.assets("music", {});

// Define the voice files used in the game.
monogatari.assets("voices", {});

// Define the sounds used in the game.
monogatari.assets("sounds", {});

// Define the videos used in the game.
monogatari.assets("videos", {
    NeverGonnaGiveYouUp: "NeverGonnaGiveYouUp.mp4",
});

// Define the images used in the game.
monogatari.assets("images", {});

// Define the backgrounds for each scene.
monogatari.assets("scenes", {});

// Define the Characters
monogatari.characters({
    p: {
        name: "你",
        color: "#5bcaff",
    },
});

class WaitUntilVideosFinished extends Monogatari.Action {
    static matchString([waituntil, videos]) {
        return waituntil === "waituntil" && type === "videos";
    }

    constructor([waituntil, videos, interval]) {
        super();
        this.interval = interval;
    }

    apply() {
        return new Promise((resolve) => {
            if (typeof this.interval === "number") {
                // Block the game so the player can't advance
                this.engine.global("block", true);
                // Set the timeout for the specified time
                let intervalId = setInterval(() => {
                    // Unlock the game when the timeout ends.
                    monogatari.debug.log("WaitUntilVideosFinished");
                    let hasUnendedVideo = false;
                    $_("[data-video]").each((element) => {
                        if (element.ended !== true) {
                            hasUnendedVideo = true;
                        }
                    });
                    monogatari.debug.log(
                        "WaitUntilVideosFinished",
                        !hasUnendedVideo
                    );
                    if (!hasUnendedVideo) {
                        clearInterval(intervalId);
                        this.engine.global("block", false);
                        resolve();
                    }
                }, this.interval);
            } else {
                resolve();
            }
        });
    }

    didApply() {
        return Promise.resolve({ advance: true });
    }
}
WaitUntilVideosFinished.id = "WaitUntilVideosFinished";

monogatari.registerAction(WaitUntilVideosFinished);

monogatari.script({
    // The game starts here.
    Start: [
        "show scene #000000 with fadeIn",
        "show notification Welcome",
        "p ……",
        "p 这里是哪里……",
        "p 好黑……",
        "p 好暗……",
        "p 我得出去才行……",
        "突然，前方出现了一道微弱的光亮",
        "p 诶？前面好像有个亮光？",
        {
            Choice: {
                Dialog: "p 该怎么办呢",
                Yes: {
                    Text: "前去一探究竟",
                    Do: "jump Yes",
                },
                No: {
                    Text: "还是算了，留在这里吧",
                    Do: "jump No",
                },
            },
        },
    ],

    Yes: [
        "p 果然还是要去一探究竟！",
        "你前往亮光所在之处，浮现在在你眼前的是……",
        "p 这……这是？！",
        "show video NeverGonnaGiveYouUp background",
        "你 被 骗 了",
        "[GOOD END?]",
        "waituntil videos 1000",
        "end",
    ],

    No: [
        "p 不行，太诡异了，我还是留在这里比较好",
        "于是你留在了原地，过了一阵子后饿死了。",
        "[BAD END]",
        "end",
    ],
});
