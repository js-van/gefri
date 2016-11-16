import { setup          } from './CanvasHelpers.spec';
import { Rectangle      } from '../../viewees/shapes';
import { Rect           } from '../../geometry';

describe( 'The canvas should', () => {

    setup.call( this );

    it( 'render a rect', () => {
        let { iRectangle } = this.createViewees(`
            | iRectangle | Rectangle | 10, 11, 12, 13 |
        `);

        this.control.setContents( iRectangle );

        expect( this.context ).toHaveRendered(`
            | Rectangle | 10, 11, 12, 13 |
        `);
    });

    it( 'render children in relative coordinates', () => {
        let { iGrandparent } = this.createViewees(`
            | iGrandparent | Rectangle | 10, 10, 100, 100 |
            |   iParent    | Rectangle | 10, 10, 80,  80  |
            |     iChild   | Rectangle | 10, 10, 60,  60  |
        `);

        this.control.setContents( iGrandparent );

        expect( this.context ).toHaveRendered(`
            | Rectangle | 10, 10, 100, 100 |
            | Rectangle | 20, 20, 80,  80  |
            | Rectangle | 30, 30, 60,  60  |
        `);
    });

    // Without state restoration (for transforms), this wouldn't work.
    it( 'render siblings in relative coordinates', () => {
        let { iFace } = this.createViewees(`
            | iFace       | Rectangle | 10, 10, 100, 100 |
            |   iEyeL     | Rectangle | 10, 10, 10,  10  |
            |     iPupilL | Rectangle | 2,  2,  6,   6   |
            |   iEyeR     | Rectangle | 80, 10, 10,  10  |
            |     iPupilR | Rectangle | 2,  2,  6,   6   |
        `);

        this.control.setContents( iFace );

        expect( this.context ).toHaveRendered(`
            | Rectangle | 10, 10, 100, 100 |
            | Rectangle | 20, 20, 10,  10  |
            | Rectangle | 22, 22, 6,   6   |
            | Rectangle | 90, 20, 10,  10  |
            | Rectangle | 92, 22, 6,   6   |
        `);
    });

    it( 'clip children if the viewee is clipping its children', () => {
        let { iGrandparent } = this.createViewees(`
            | iGrandparent | Rectangle | 10, 10, 80, 80 |
            |   iParent    | Rectangle | 10, 10, 80, 60 |
            |     iChild   | Rectangle | 10, 10, 80, 80 |
        `);

        this.control.setContents( iGrandparent );

        expect( this.context ).toHaveRendered(`
            | Rectangle | 10, 10, 80, 80 |
            | Rectangle | 20, 20, 70, 60 |
            | Rectangle | 30, 30, 60, 50 |
        `);
    });

    it( 'not clip children if the viewee is not clipping its children', () => {
        let { iGrandparent, iParent } = this.createViewees(`
            | iGrandparent | Rectangle | 10, 10, 80, 80 |
            |   iParent    | Rectangle | 10, 10, 80, 60 |
            |     iChild   | Rectangle | 10, 10, 80, 80 |
        `);

        iGrandparent.isClipping = false;
        iParent.isClipping      = false;

        this.control.setContents( iGrandparent );

        expect( this.context ).toHaveRendered(`
            | Rectangle | 10, 10, 80, 80 |
            | Rectangle | 20, 20, 80, 60 |
            | Rectangle | 30, 30, 80, 80 |
        `);
    });

    it( 'transform and scale child viewees', () => {
        let { iTransformer } = this.createViewees(`
            | iTransformer | Transformer |                   |
            |   iSquare    | Rectangle   | 100, 100, 10, 10  |
        `);

        iTransformer.setTranslate( -50, -50 );
        iTransformer.setScale( 0.5, 0.5 );

        this.control.setContents( iTransformer );

        expect( this.context ).toHaveRendered(`
            | Rectangle | 25, 25, 5, 5 |
        `);
    });

});
