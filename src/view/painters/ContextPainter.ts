import { Painter } from './Painter';
import { Rect } from '../geometry/Rect';

export
class ContextPainter extends Painter {
    protected context:  CanvasRenderingContext2D;

    constructor( aContext: CanvasRenderingContext2D ) {
        super();
        this.context = aContext;
    }

    drawRectangle( aRect: Rect ): void {
        var context = this.context;
        context.beginPath();
        context.rect( aRect.x, aRect.y, aRect.w, aRect.h );
        context.fill();
        context.stroke();
        context.closePath();
    }

    translate( x, y ): void {
        super.translate( x, y );
        this.context.translate( x, y );
    }

    intersectClipAreaWith( aRect: Rect ): void {
        super.intersectClipAreaWith( aRect );

        // We add some extra margins to account for antialiasing
        var iRect = aRect.clone();
        iRect.expand( 1 );

        this.context.beginPath();

        this.context.rect(
            iRect.x,
            iRect.y,
            iRect.w,
            iRect.h
        );

        this.context.clip();
    }

    // TODO - needs to push to stack
    pushState(): void {
        super.pushState();
        this.context.save();
    }

    popState(): void {
        super.popState();
        this.context.restore();
    }

}