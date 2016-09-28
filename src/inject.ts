import { ReflectiveInjector, Provider } from '@angular/core';
import * as Rx                          from 'rxjs';

const animationFrame = Rx.Scheduler.animationFrame;

// Defualt providers for production
var injector = ReflectiveInjector.resolveAndCreate([{
    provide: 'waitForFrame', useValue: animationFrame
}]);

// A way to override the default providers.
// Will be used for tests.
export
function overrideProviders( providers: Provider[] ) {
    var overrides = injector.resolveAndCreateChild( providers );
    injector = overrides;
}

export
function inject( token: any ): any {
    return injector.get( token );
}
