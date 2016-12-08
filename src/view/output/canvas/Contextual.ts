import { Clipped      } from './../';
import { Point,
         Rect,
         Translation,
         Scale        } from '../../geometry';

export
const cAntialiasingExtraMargins = 1

export
class Contextual extends Clipped {
    protected context:  CanvasRenderingContext2D;

    constructor( aContext: CanvasRenderingContext2D ) {
        super();
        this.context = aContext;
    }

    protected fillRect( aRect: Rect ): void {
        let context = this.context;
        context.beginPath();
        context.rect( aRect.x, aRect.y, aRect.w, aRect.h );
        context.fill();
        context.closePath();
    }

    protected strokeRect( aRect: Rect ): void {
        let context = this.context;
        context.beginPath();
        context.rect( aRect.x, aRect.y, aRect.w, aRect.h );
        context.stroke();
        context.closePath();
    }

    protected startPath( aPoint: Point ): void {
        this.context.beginPath();
        this.context.moveTo( aPoint.x, aPoint.y )
    }

    protected endPath(): void {
        this.context.stroke();
    }

    protected lineTo( aPoint: Point ): void {
        this.context.lineTo( aPoint.x, aPoint.y )
    }

    protected quadTo( aControl: Point, aPoint: Point ): void {
        this.context.quadraticCurveTo( aControl.x, aControl.y, aPoint.x, aPoint.y )
    }

    protected cubicTo( aControl1: Point, aControl2: Point, aPoint: Point ): void {
        this.context.bezierCurveTo( aControl1.x, aControl1.y, aControl2.x, aControl2.y, aPoint.x, aPoint.y )
    }

    protected erase( aRect: Rect ): void {
        let iExpandedRect = aRect.clone();
        iExpandedRect.expand( cAntialiasingExtraMargins );

        this.context.clearRect( iExpandedRect.x, iExpandedRect.y, iExpandedRect.w, iExpandedRect.h );
    };

    protected intersectClipAreaWith( aRect: Rect ): void {
        super.intersectClipAreaWith( aRect );

        this.context.beginPath();

        this.context.rect(
            aRect.x,
            aRect.y,
            aRect.w,
            aRect.h
        );

        this.context.clip();
    }

    protected pushState(): void {
        super.pushState();
        this.context.save();
    }

    protected restoreState( aState: any ) {
        super.restoreState( aState );
        this.context.restore();
    }

}
