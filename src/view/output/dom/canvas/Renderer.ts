import { Contextual    } from './';
import { Point,
         Rect          } from '../../../geometry';
import { getClassName,
         emptyArray    } from '../../../../core/Utils';
import { Viewee        } from '../../../viewees';
import { Visible       } from '../../../viewees/visibles/Visible';

import { cumulateTransformationsOf } from '../../../viewees/multimethods';

import {
    fill,
    stroke
} from './multimethods';

import {
    pipe,
    prop
} from '../../../../core/FP';

import { LazyTree   } from '../../../../core/LazyTree'
import { DualMatrix } from '../../../geometry/DualMatrix'
import {
    RenderContext,
    getNonClippingCompositionBoundsOf,
    getRendereredBoundingRectOf
} from './Updater'

export
class Renderer extends Contextual {
    private cumulateTransformationsOf: ( aViewee: Viewee ) => void;
    private fill:                      ( aViewee: Viewee ) => void;
    stroke:                            ( what:    any    ) => void;

    constructor( aContext: CanvasRenderingContext2D ) {
        super( aContext );
        this.cumulateTransformationsOf = cumulateTransformationsOf.curry( this );
        this.fill                      = fill.curry( this );
        this.stroke                    = stroke.curry( this );
    }

    refresh( aViewee: Viewee, aDamagedRect: Rect ): void {
        // When the clip area involves non-integers antialiasing is applied
        // resulting in artifacts (see http://codepen.io/Izhaki/pen/YNyOQx).
        // So we quantise the damaged rect to ensure whole-pixel clipping.
        let iDamagedRect = aDamagedRect.quantise();

        this.erase( iDamagedRect );
        this.pushState();
        this.setclipArea( iDamagedRect );

        this.renderFP( aViewee, iDamagedRect );
        this.render( aViewee );

        this.popState();
    }

    renderFP( aViewee: Viewee, clipArea: Rect ): void {
        const hidden = ( viewee: Viewee ): boolean => !viewee.rendered

        const outsideClipArea = pipe( prop('bounds'), Rect.isNull )
        const isClipping = pipe( prop('viewee'), Viewee.isClipping )

        const vieweeToRender = ( ctx: RenderContext, viewee: Viewee ): [ Function, any ] => {

            const bounds = getRendereredBoundingRectOf( viewee, ctx.matrix, ctx.clipArea )
            const subCtxFn = () => RenderContext.getSub( viewee, bounds, ctx )

            const map = {
                viewee,
                ctx,
                bounds
            }

            return [ subCtxFn, map ]
        }

        const context = RenderContext.from( clipArea )

        const agg = ( acc, node ) => {
            acc.push( node.bounds )
            return acc
        }

        const X = LazyTree.of( aViewee )
            .dropSubTreeIf( hidden )
            .mapReduce( vieweeToRender, context )
            .dropNodeIf( outsideClipArea )
            .dropChildrenIf( outsideClipArea ).and( isClipping )
//            .toArray()
            .reduceXl( [ agg ], [] )

        //console.log( X.map( acc => acc.bounds ) )
        console.log( X )
    }

    render( aViewee: Viewee ): void {
        if ( this.needsRendering( aViewee ) ) {
            this.fill( aViewee );
            this.renderChildren( aViewee );
            this.stroke( aViewee );
        }

        // Note the algorithm is wrong: Instead of getting the non clipping composition we can just:
        // Not render the current one if it is oneside the clip area, but keep iterating to children
        // if it isn't clipping. So:
        // needsRendering only looks at current bounds, not all composition.
        // add to the above:
        // } else {
        //     if ( !isClipping ) renderChildren
        //}

    }

    private needsRendering( aViewee: Viewee ): boolean {
        if ( aViewee.rendered ) {
            if ( aViewee instanceof Visible ) {
                return this.isWithinClipArea( aViewee );
            } else {
                return true;
            }
        } else {
            return false;
        }
    }

    private renderChildren( aViewee: Viewee ): void {
        if ( aViewee.isChildless() ) return;

        this.pushState();

        if ( aViewee.isClipping ) {
            this.intersectClipAreaWith( aViewee );
        }

        this.cumulateTransformationsOf( aViewee );

        aViewee.forEachChild( ( aChild ) => {
            this.render( aChild );
        });

        this.popState();
    }

}
