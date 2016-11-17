import { Control }   from './Control';
import { Rectangle } from './viewees/visibles/shapes';
import { Rect }      from './geometry';
import { inject }    from '../di';

export
function createControl(): Control {

    var iViewElement = document.getElementById( 'view' );

    iViewElement.setAttribute( 'style', 'width:500px; height:400px;' );
    iViewElement.innerHTML = '';

    var iControl = new Control( iViewElement );

    return iControl;
}

describe( 'Control', () => {

    beforeEach( () => {
        this.control = createControl();
        this.canvas  = this.control.container.firstElementChild;
    });


    describe( 'constructor()', () => {

        it( 'should create a canvas and add it to the container', () => {
            expect( this.canvas.tagName ).toBe( 'CANVAS' );
        });

        it( 'should size the canvas to the dimensions of its container', () => {
            expect( this.canvas.width  ).toBe( 500 );
            expect( this.canvas.height ).toBe( 400 );
        });

    });


    describe( 'setContents()', () => {

        beforeEach( () => {
            this.rectangle    = new Rectangle( new Rect( 10, 10, 20, 20 ) );
            this.waitForFrame = inject( 'waitForFrame' );
        });

        it( 'should remove the previous contents from the root', () => {
            this.control.setContents( this.rectangle );
            this.control.setContents( this.rectangle );

            expect( this.control.root.children.length ).toBe( 1 );
            expect( this.control.root.children[ 0 ] ).toBe( this.rectangle );
        });

        it( 'should add the viewee provided as a child of the root viewee', () => {
            this.control.setContents( this.rectangle );

            expect( this.control.root.children.length ).toBe( 1 );
            expect( this.control.root.children[ 0 ] ).toBe( this.rectangle );
        });

    });


    describe( 'getBoundingRect()', () => {

        it( 'should return a rect at 0,0 with the dimensions of the control' , () => {
            expect( this.control.getBoundingRect() ).toEqualRect( 0, 0, 500, 400 );
        });

    });


    describe( 'queueRefresh()', () => {
        beforeEach( () => {
            this.root         = this.control.root,
            this.renderer     = this.control.renderer;
            this.waitForFrame = inject( 'waitForFrame' );
            spyOn( this.renderer, 'render' );
        });

        it( 'should ask the root viewee to refresh before the next render' , () => {
            this.control.queueRefresh();
            this.waitForFrame.flush();

            expect( this.renderer.render ).toHaveBeenCalledWith( this.root );
        });

        it( 'should not queue any new refresh requests until the previous one has been processed', () => {

            this.control.queueRefresh();
            this.control.queueRefresh();
            this.control.queueRefresh();
            this.waitForFrame.flush();

            this.control.queueRefresh();
            this.control.queueRefresh();
            this.waitForFrame.flush();

            expect( this.renderer.render.calls.count() ).toBe( 2 );

        });

    });

});
