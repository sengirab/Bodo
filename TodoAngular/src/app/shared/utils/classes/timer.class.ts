export class Timer {
    private timerId;
    private start;
    private remaining;

    constructor(public callback, public delay) {
        this.timerId = this.delay;
        this.start = this.delay;
        this.remaining = this.delay;

        this.resume();
    }

    public pause() {
        window.clearTimeout(this.timerId);
        this.remaining -= <any>new Date() - this.start;
    };

    public resume() {
        this.start = new Date();
        window.clearTimeout(this.timerId);
        this.timerId = window.setTimeout(this.callback, this.remaining);
    };
}
