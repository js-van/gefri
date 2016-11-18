import { Context2DMock  } from '../../../../tests/mocks';
import { setup          } from './CanvasHelpers.spec';
import { Rectangle      } from '../../viewees/visibles/shapes';
import { Rect           } from '../../geometry';

import { inject         } from '../../../di';

let waitForFrame = inject( 'waitForFrame' );

describe( 'The canvas should refresh when', () => {

    setup.call( this );

    beforeEach( () => {
        this.clearRenderedLog = () => {
            waitForFrame.flush();
            this.context.reset();
        }
    });

    describe( 'a transformer', () => {

        beforeEach( () => {
            let { iTransformer } = this.createViewees(`
                | iTransformer | Transformer |                   |
                |   iSquare    | Rectangle   | 100, 100, 10, 10  |
            `);
            this.transformer = iTransformer;

            this.control.setContents( this.transformer );
            this.clearRenderedLog();
        });

        it( 'scale changes', () => {
            this.transformer.setScale( 0.5, 0.5 );

            expect( this.context ).toHaveRendered(`
                | Erase     | 0,  0,  500, 400 |
                | Rectangle | 50, 50, 5,   5   |
            `);
        });

        it( 'translate changes', () => {
            this.transformer.setTranslate( 100, 100 );

            expect( this.context ).toHaveRendered(`
                | Erase     | 0,   0,   500, 400 |
                | Rectangle | 200, 200, 10,  10  |
            `);
        });

    });

    describe( 'a viewee', () => {

        beforeEach( () => {
            let { iRectangle } = this.createViewees(`
                | iRectangle | Rectangle   | 100, 100, 10, 10  |
            `);
            this.rectangle = iRectangle;

            this.control.setContents( this.rectangle );
            this.clearRenderedLog();
        });

        it( 'is added to a parent', () => {
            this.child = new Rectangle( new Rect( 2, 2, 6, 6 ) );
            this.rectangle.addChild( this.child );

            expect( this.context ).toHaveRendered(`
                | Erase     | 102,  102, 6,  6  |
                | Rectangle | 100,  100, 10, 10 |
                | Rectangle | 102,  102, 6,  6  |
            `);
        });

        it( 'is removed from its parent', () => {
            this.child = new Rectangle( new Rect( 2, 2, 6, 6 ) );
            this.rectangle.addChild( this.child );

            this.clearRenderedLog();

            this.rectangle.removeChild( this.child );

            expect( this.context ).toHaveRendered(`
                | Erase     | 102,  102, 6,  6  |
                | Rectangle | 100,  100, 10, 10 |
            `);
        });


        it( 'is hidden', () => {
            this.rectangle.hide();

            expect( this.context ).toHaveRendered(`
                | Erase | 100,  100, 10, 10 |
            `);
        });

        it( 'is shown', () => {
            this.rectangle.show();

            expect( this.context ).toHaveRendered(`
                | Erase     | 100,  100, 10, 10 |
                | Rectangle | 100,  100, 10, 10 |
            `);
        });

    });

});
