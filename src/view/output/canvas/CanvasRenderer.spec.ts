import { Context2DMock  } from '../../../../tests/mocks';
import { CanvasRenderer } from './CanvasRenderer';
import { Rectangle      } from '../../viewees/shapes';
import { Rect           } from '../../geometry';

function createCanvasRenderer(): CanvasRenderer {
    return new CanvasRenderer( new Context2DMock() );
}

fdescribe( 'CanvasRenderer', () => {

    beforeEach( () => {
        this.renderer = createCanvasRenderer();
        this.context = this.renderer.context;
    });

    it( 'should render a rect', () => {
        let iRectangle: Rectangle = new Rectangle( new Rect( 10, 11, 12, 13 ) );

        this.renderer.render( iRectangle );

        expect( this.context ).toHaveRenderedRect( 10, 11, 12, 13 );
    });

    it( 'should render children in relative coordinates', () => {
        let iGrandparent: Rectangle = new Rectangle( new Rect( 10, 10, 100, 100 ) ),
            iParent:      Rectangle = new Rectangle( new Rect( 10, 10, 80,  80  ) ),
            iChild:       Rectangle = new Rectangle( new Rect( 10, 10, 60,  60  ) );

        iGrandparent.addChild( iParent );
        iParent.addChild( iChild );

        this.renderer.render( iGrandparent );

        expect( this.context ).toHaveRenderedRect( 10, 10, 100, 100 );
        expect( this.context ).toHaveRenderedRect( 20, 20, 80,  80  );
        expect( this.context ).toHaveRenderedRect( 30, 30, 60,  60  );
    });

    // Without state restoration (for transforms), this wouldn't work.
    it( 'should render siblings in relative coordinates', () => {
        let iFace:   Rectangle = new Rectangle( new Rect( 10, 10, 100, 100 ) ),
            iEyeL:   Rectangle = new Rectangle( new Rect( 10, 10, 10,  10  ) ),
            iPupilL: Rectangle = new Rectangle( new Rect( 2,  2,  6,   6   ) ),
            iEyeR:   Rectangle = new Rectangle( new Rect( 80, 10, 10,  10  ) ),
            iPupilR: Rectangle = new Rectangle( new Rect( 2,  2,  6,   6   ) );

        iEyeL.addChild( iPupilL );
        iEyeR.addChild( iPupilR );
        iFace.addChildren( iEyeL, iEyeR );

        this.renderer.render( iFace );

        expect( this.context ).toHaveRenderedRect( 10, 10, 100, 100 );
        expect( this.context ).toHaveRenderedRect( 20, 20, 10,  10  );
        expect( this.context ).toHaveRenderedRect( 22, 22, 6,   6   );
        expect( this.context ).toHaveRenderedRect( 90, 20, 10,  10  );
        expect( this.context ).toHaveRenderedRect( 92, 22, 6,   6   );
    });

    it( 'should clip children if the viewee is clipping its children', () => {
        let iGrandparent: Rectangle = new Rectangle( new Rect( 10, 10, 80, 80 ) ),
            iParent:      Rectangle = new Rectangle( new Rect( 10, 10, 80, 60 ) ),
            iChild:       Rectangle = new Rectangle( new Rect( 10, 10, 80, 80 ) );

        iGrandparent.addChild( iParent );
        iParent.addChild( iChild );

        this.renderer.render( iGrandparent );

        expect( this.context ).toHaveRenderedRect( 10, 10, 80, 80 );
        expect( this.context ).toHaveRenderedRect( 20, 20, 70, 60  );
        expect( this.context ).toHaveRenderedRect( 30, 30, 60, 50  );
    });

    it( 'should not clip children if the viewee is not clipping its children', () => {
        let iGrandparent: Rectangle = new Rectangle( new Rect( 10, 10, 80, 80 ) ),
            iParent:      Rectangle = new Rectangle( new Rect( 10, 10, 80, 60 ) ),
            iChild:       Rectangle = new Rectangle( new Rect( 10, 10, 80, 80 ) );

        iGrandparent.isClipping = false;
        iParent.isClipping      = false;

        iGrandparent.addChild( iParent );
        iParent.addChild( iChild );

        this.renderer.render( iGrandparent );

        expect( this.context ).toHaveRenderedRect( 10, 10, 80, 80 );
        expect( this.context ).toHaveRenderedRect( 20, 20, 80, 60  );
        expect( this.context ).toHaveRenderedRect( 30, 30, 80, 80  );
    });

});
