import { Scene } from 'phaser';

export class Preloader extends Scene
{
    constructor ()
    {
        super('Preloader');
    }

    init ()
    {
        //  A simple progress bar. This is the outline of the bar.
        this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        const bar = this.add.rectangle(512-230, 384, 4, 28, 0xffffff);

        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on('progress', (progress) => {
            //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
            bar.width = 4 + (460 * progress);
        });
    }

    preload ()
    {
        //  Load the assets for the game
        this.load.setPath('');

        this.load.image('background', 'assets/background.png');
        this.load.image('map-foret', 'assets/maps/map-foret.png');
        this.load.image('map-two', 'assets/maps/map-two.png');
        this.load.image('cat', 'assets/skins/cat.png');
        this.load.image('mage', 'assets/skins/mage.png');
        this.load.image('shop-icon', 'assets/icons/shop.png');
        this.load.image('redo', 'assets/icons/redo.png');
        this.load.image('accounts', 'assets/icons/accounts.png');
        this.load.image('friends', 'assets/icons/friends.png');
        this.load.image('bag', 'assets/icons/bag.png');
        this.load.image('settings', 'assets/icons/settings.png');
        this.load.image('gold', 'assets/icons/gold.png');
    }

    create ()
    {
        // Start the Game scene with the username 'root'
        this.scene.start('Game', { username: 'root' });
    }
}
